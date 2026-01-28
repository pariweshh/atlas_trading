import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MarketDataProvider,
  OHLCV,
  Ticker,
  AssetInfo,
  Timeframe,
} from '../interfaces/market-data.interface.js';

interface PolygonBar {
  t: number; // Timestamp (Unix ms)
  o: number; // Open
  h: number; // High
  l: number; // Low
  c: number; // Close
  v: number; // Volume
}

interface PolygonBarsResponse {
  results: PolygonBar[];
  status: string;
  resultsCount: number;
}

interface PolygonTickerSnapshot {
  ticker: string;
  day: {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
  };
  prevDay: {
    c: number;
  };
  lastTrade: {
    p: number;
  };
  lastQuote: {
    P: number; // Ask price
    p: number; // Bid price
  };
}

interface PolygonSnapshotResponse {
  ticker: PolygonTickerSnapshot;
  status: string;
}

interface PolygonTickersResponse {
  results: Array<{
    ticker: string;
    name: string;
    market: string;
    type: string;
    active: boolean;
  }>;
  status: string;
  count: number;
}

@Injectable()
export class PolygonProvider implements MarketDataProvider {
  private readonly logger = new Logger(PolygonProvider.name);
  private readonly baseUrl = 'https://api.polygon.io';
  private readonly apiKey: string;

  public readonly name: string = 'Polygon';
  public readonly assetClass: 'FOREX' | 'CRYPTO' | 'ETF' = 'ETF';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('polygon.apiKey', '');
  }

  private mapTimeframe(timeframe: Timeframe): {
    multiplier: number;
    timespan: string;
  } {
    const mapping: Record<Timeframe, { multiplier: number; timespan: string }> =
      {
        '1m': { multiplier: 1, timespan: 'minute' },
        '5m': { multiplier: 5, timespan: 'minute' },
        '15m': { multiplier: 15, timespan: 'minute' },
        '30m': { multiplier: 30, timespan: 'minute' },
        '1h': { multiplier: 1, timespan: 'hour' },
        '4h': { multiplier: 4, timespan: 'hour' },
        '1d': { multiplier: 1, timespan: 'day' },
        '1w': { multiplier: 1, timespan: 'week' },
      };
    return mapping[timeframe];
  }

  private formatSymbol(symbol: string): string {
    // ETF symbols are typically already in correct format (e.g., "SPY", "QQQ")
    return symbol.toUpperCase();
  }

  private getDateRange(
    limit: number,
    timeframe: Timeframe,
  ): { from: string; to: string } {
    const to = new Date();
    const from = new Date();

    // Calculate approximate date range based on timeframe and limit
    const timeframeMinutes: Record<Timeframe, number> = {
      '1m': 1,
      '5m': 5,
      '15m': 15,
      '30m': 30,
      '1h': 60,
      '4h': 240,
      '1d': 1440,
      '1w': 10080,
    };

    const totalMinutes = timeframeMinutes[timeframe] * limit;
    from.setMinutes(from.getMinutes() - totalMinutes);

    return {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0],
    };
  }

  async getOHLCV(
    symbol: string,
    timeframe: Timeframe,
    limit: number = 100,
  ): Promise<OHLCV[]> {
    if (!this.apiKey) {
      throw new Error('Polygon API key not configured');
    }

    const formattedSymbol = this.formatSymbol(symbol);
    const { multiplier, timespan } = this.mapTimeframe(timeframe);
    const { from, to } = this.getDateRange(limit, timeframe);

    const url = `${this.baseUrl}/v2/aggs/ticker/${formattedSymbol}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=${limit}&apiKey=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Failed to fetch OHLCV for ${symbol}: ${errorText}`);
      throw new Error(`Polygon API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as PolygonBarsResponse;

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((bar) => ({
      timestamp: new Date(bar.t),
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
    }));
  }

  async getTicker(symbol: string): Promise<Ticker> {
    if (!this.apiKey) {
      throw new Error('Polygon API key not configured');
    }

    const formattedSymbol = this.formatSymbol(symbol);

    const url = `${this.baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${formattedSymbol}?apiKey=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Failed to fetch ticker for ${symbol}: ${errorText}`);
      throw new Error(`Polygon API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as PolygonSnapshotResponse;
    const ticker = data.ticker;

    if (!ticker) {
      throw new Error(`No ticker data available for ${symbol}`);
    }

    const prevClose = ticker.prevDay?.c || ticker.day?.o || 0;
    const currentPrice = ticker.lastTrade?.p || ticker.day?.c || 0;
    const change24h = currentPrice - prevClose;
    const changePercent24h = prevClose > 0 ? (change24h / prevClose) * 100 : 0;

    return {
      symbol,
      bid: ticker.lastQuote?.p || currentPrice,
      ask: ticker.lastQuote?.P || currentPrice,
      last: currentPrice,
      volume24h: ticker.day?.v || 0,
      change24h,
      changePercent24h,
      timestamp: new Date(),
    };
  }

  async getAvailableSymbols(): Promise<AssetInfo[]> {
    if (!this.apiKey) {
      throw new Error('Polygon API key not configured');
    }

    // Fetch popular ETFs - Polygon has a large list, so we filter for ETFs
    const url = `${this.baseUrl}/v3/reference/tickers?type=ETF&market=stocks&active=true&limit=100&apiKey=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Failed to fetch available symbols: ${errorText}`);
      throw new Error(`Polygon API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as PolygonTickersResponse;

    if (!data.results) {
      return [];
    }

    return data.results.map((ticker) => ({
      symbol: ticker.ticker,
      name: ticker.name,
      assetClass: 'ETF' as const,
      exchange: 'US',
      tradeable: ticker.active,
    }));
  }

  async isHealthy(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const url = `${this.baseUrl}/v1/marketstatus/now?apiKey=${this.apiKey}`;
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }
}
