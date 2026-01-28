import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MarketDataProvider,
  OHLCV,
  Ticker,
  AssetInfo,
  Timeframe,
} from '../interfaces/market-data.interface.js';

interface OandaCandle {
  time: string;
  mid: {
    o: string;
    h: string;
    l: string;
    c: string;
  };
  volume: number;
  complete: boolean;
}

interface OandaCandlesResponse {
  candles: OandaCandle[];
}

interface OandaPriceResponse {
  prices: Array<{
    instrument: string;
    bids: Array<{ price: string }>;
    asks: Array<{ price: string }>;
    closeoutBid: string;
    closeoutAsk: string;
    tradeable: boolean;
  }>;
}

interface OandaInstrumentsResponse {
  instruments: Array<{
    name: string;
    displayName: string;
    type: string;
  }>;
}

@Injectable()
export class OandaProvider implements MarketDataProvider {
  private readonly logger = new Logger(OandaProvider.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly accountId: string;

  public readonly name: string = 'OANDA';
  public readonly assetClass: 'FOREX' | 'CRYPTO' | 'ETF' = 'FOREX';

  constructor(private readonly configService: ConfigService) {
    const environment = this.configService.get<string>(
      'oanda.environment',
      'practice',
    );
    this.baseUrl =
      environment === 'practice'
        ? 'https://api-fxpractice.oanda.com'
        : 'https://api-fxtrade.oanda.com';

    this.apiKey = this.configService.get<string>('oanda.apiKey', '');
    this.accountId = this.configService.get<string>('oanda.accountId', '');
  }

  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private mapTimeframe(timeframe: Timeframe): string {
    const mapping: Record<Timeframe, string> = {
      '1m': 'M1',
      '5m': 'M5',
      '15m': 'M15',
      '30m': 'M30',
      '1h': 'H1',
      '4h': 'H4',
      '1d': 'D',
      '1w': 'W',
    };
    return mapping[timeframe];
  }

  private formatSymbol(symbol: string): string {
    return symbol.replace('/', '_').toUpperCase();
  }

  private parseSymbol(oandaSymbol: string): string {
    return oandaSymbol.replace('_', '/');
  }

  async getOHLCV(
    symbol: string,
    timeframe: Timeframe,
    limit: number = 100,
  ): Promise<OHLCV[]> {
    if (!this.apiKey) {
      throw new Error('OANDA API key not configured');
    }

    const formattedSymbol = this.formatSymbol(symbol);
    const granularity = this.mapTimeframe(timeframe);

    const url = `${this.baseUrl}/v3/instruments/${formattedSymbol}/candles?granularity=${granularity}&count=${limit}`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Failed to fetch OHLCV for ${symbol}: ${errorText}`);
      throw new Error(`OANDA API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as OandaCandlesResponse;

    return data.candles
      .filter((candle) => candle.complete)
      .map((candle) => ({
        timestamp: new Date(candle.time),
        open: parseFloat(candle.mid.o),
        high: parseFloat(candle.mid.h),
        low: parseFloat(candle.mid.l),
        close: parseFloat(candle.mid.c),
        volume: candle.volume,
      }));
  }

  async getTicker(symbol: string): Promise<Ticker> {
    if (!this.apiKey) {
      throw new Error('OANDA API key not configured');
    }

    const formattedSymbol = this.formatSymbol(symbol);

    const url = `${this.baseUrl}/v3/accounts/${this.accountId}/pricing?instruments=${formattedSymbol}`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Failed to fetch ticker for ${symbol}: ${errorText}`);
      throw new Error(`OANDA API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as OandaPriceResponse;
    const price = data.prices[0];

    if (!price) {
      throw new Error(`No price data available for ${symbol}`);
    }

    const bid = parseFloat(price.bids[0]?.price || price.closeoutBid);
    const ask = parseFloat(price.asks[0]?.price || price.closeoutAsk);
    const last = (bid + ask) / 2;

    return {
      symbol,
      bid,
      ask,
      last,
      volume24h: 0,
      change24h: 0,
      changePercent24h: 0,
      timestamp: new Date(),
    };
  }

  async getAvailableSymbols(): Promise<AssetInfo[]> {
    if (!this.apiKey) {
      throw new Error('OANDA API key not configured');
    }

    const url = `${this.baseUrl}/v3/accounts/${this.accountId}/instruments`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Failed to fetch available symbols: ${errorText}`);
      throw new Error(`OANDA API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as OandaInstrumentsResponse;

    return data.instruments
      .filter((i) => i.type === 'CURRENCY')
      .map((i) => ({
        symbol: this.parseSymbol(i.name),
        name: i.displayName,
        assetClass: 'FOREX' as const,
        exchange: 'OANDA',
        tradeable: true,
      }));
  }

  async isHealthy(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const url = `${this.baseUrl}/v3/accounts/${this.accountId}`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}
