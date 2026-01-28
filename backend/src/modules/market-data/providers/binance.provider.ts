import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MarketDataProvider,
  OHLCV,
  Ticker,
  AssetInfo,
  Timeframe,
} from '../interfaces/market-data.interface.js';

interface BinanceKline {
  0: number; // Open time
  1: string; // Open
  2: string; // High
  3: string; // Low
  4: string; // Close
  5: string; // Volume
  6: number; // Close time
  7: string; // Quote asset volume
  8: number; // Number of trades
  9: string; // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
  11: string; // Ignore
}

interface BinanceTicker24h {
  symbol: string;
  bidPrice: string;
  askPrice: string;
  lastPrice: string;
  volume: string;
  priceChange: string;
  priceChangePercent: string;
}

interface BinanceExchangeInfo {
  symbols: Array<{
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
    status: string;
  }>;
}

@Injectable()
export class BinanceProvider implements MarketDataProvider {
  private readonly logger = new Logger(BinanceProvider.name);
  private readonly baseUrl = 'https://api.binance.com/api/v3';
  readonly name = 'Binance';
  readonly assetClass = 'CRYPTO' as const;

  constructor(private readonly configService: ConfigService) {}

  private mapTimeframe(timeframe: Timeframe): string {
    const mapping: Record<Timeframe, string> = {
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '30m': '30m',
      '1h': '1h',
      '4h': '4h',
      '1d': '1d',
      '1w': '1w',
    };
    return mapping[timeframe];
  }

  private formatSymbol(symbol: string): string {
    // Convert "BTC/USDT" to "BTCUSDT"
    return symbol.replace('/', '').toUpperCase();
  }

  private parseSymbol(binanceSymbol: string): string {
    // Common quote assets
    const quoteAssets = ['USDT', 'BUSD', 'BTC', 'ETH', 'BNB'];

    for (const quote of quoteAssets) {
      if (binanceSymbol.endsWith(quote)) {
        const base = binanceSymbol.slice(0, -quote.length);
        return `${base}/${quote}`;
      }
    }

    return binanceSymbol;
  }

  async getOHLCV(
    symbol: string,
    timeframe: Timeframe,
    limit: number = 100,
  ): Promise<OHLCV[]> {
    try {
      const formattedSymbol = this.formatSymbol(symbol);
      const interval = this.mapTimeframe(timeframe);

      const url = `${this.baseUrl}/klines?symbol=${formattedSymbol}&interval=${interval}&limit=${limit}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Binance API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as BinanceKline[];

      return data.map((kline) => ({
        timestamp: new Date(kline[0]),
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5]),
      }));
    } catch (error) {
      this.logger.error(`Failed to fetch OHLCV for ${symbol}: ${error}`);
      throw error;
    }
  }

  async getTicker(symbol: string): Promise<Ticker> {
    try {
      const formattedSymbol = this.formatSymbol(symbol);

      const url = `${this.baseUrl}/ticker/24hr?symbol=${formattedSymbol}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Binance API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as BinanceTicker24h;

      return {
        symbol,
        bid: parseFloat(data.bidPrice),
        ask: parseFloat(data.askPrice),
        last: parseFloat(data.lastPrice),
        volume24h: parseFloat(data.volume),
        change24h: parseFloat(data.priceChange),
        changePercent24h: parseFloat(data.priceChangePercent),
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to fetch ticker for ${symbol}: ${error}`);
      throw error;
    }
  }

  async getAvailableSymbols(): Promise<AssetInfo[]> {
    try {
      const url = `${this.baseUrl}/exchangeInfo`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Binance API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as BinanceExchangeInfo;

      // Filter for USDT pairs that are actively trading
      return data.symbols
        .filter((s) => s.status === 'TRADING' && s.quoteAsset === 'USDT')
        .map((s) => ({
          symbol: this.parseSymbol(s.symbol),
          name: `${s.baseAsset}/${s.quoteAsset}`,
          assetClass: 'CRYPTO' as const,
          exchange: 'Binance',
          tradeable: true,
        }));
    } catch (error) {
      this.logger.error(`Failed to fetch available symbols: ${error}`);
      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/ping`;
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }
}
