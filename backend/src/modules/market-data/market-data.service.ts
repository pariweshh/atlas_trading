import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { BinanceProvider } from './providers/binance.provider.js';
import { OandaProvider } from './providers/oanda.provider.js';
import { PolygonProvider } from './providers/polygon.provider.js';
import {
  OHLCV,
  Ticker,
  AssetInfo,
  Timeframe,
  AssetClass,
  ProviderHealth,
  MarketDataProvider,
} from './interfaces/market-data.interface.js';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);
  private readonly providers: Map<AssetClass, MarketDataProvider>;

  constructor(
    private readonly binanceProvider: BinanceProvider,
    private readonly oandaProvider: OandaProvider,
    private readonly polygonProvider: PolygonProvider,
  ) {
    this.providers = new Map<AssetClass, MarketDataProvider>([
      ['CRYPTO', this.binanceProvider],
      ['FOREX', this.oandaProvider],
      ['ETF', this.polygonProvider],
    ]);
  }

  private detectAssetClass(symbol: string): AssetClass {
    const upperSymbol = symbol.toUpperCase();

    // Crypto patterns: BTC/USDT, ETH/USDT, etc.
    if (
      upperSymbol.includes('USDT') ||
      upperSymbol.includes('BUSD') ||
      upperSymbol.includes('BTC') ||
      upperSymbol.includes('ETH')
    ) {
      // Check if it's a crypto pair, not just containing these strings
      if (upperSymbol.includes('/') && !this.isForexPair(upperSymbol)) {
        return 'CRYPTO';
      }
    }

    // Forex patterns: EUR/USD, GBP/JPY, etc.
    if (this.isForexPair(upperSymbol)) {
      return 'FOREX';
    }

    // Default to ETF for stock-like symbols (SPY, QQQ, AAPL)
    return 'ETF';
  }

  private isForexPair(symbol: string): boolean {
    const forexCurrencies = [
      'EUR',
      'USD',
      'GBP',
      'JPY',
      'AUD',
      'NZD',
      'CAD',
      'CHF',
      'SEK',
      'NOK',
      'DKK',
      'SGD',
      'HKD',
      'MXN',
      'ZAR',
      'TRY',
    ];

    const parts = symbol.split('/');
    if (parts.length !== 2) return false;

    return (
      forexCurrencies.includes(parts[0]) && forexCurrencies.includes(parts[1])
    );
  }

  private getProvider(assetClass: AssetClass): MarketDataProvider {
    const provider = this.providers.get(assetClass);
    if (!provider) {
      throw new BadRequestException(
        `No provider available for asset class: ${assetClass}`,
      );
    }
    return provider;
  }

  async getOHLCV(
    symbol: string,
    timeframe: Timeframe,
    limit: number = 100,
    assetClass?: AssetClass,
  ): Promise<OHLCV[]> {
    const detectedClass = assetClass || this.detectAssetClass(symbol);
    const provider = this.getProvider(detectedClass);

    this.logger.debug(
      `Fetching OHLCV for ${symbol} (${detectedClass}) from ${provider.name}`,
    );

    return provider.getOHLCV(symbol, timeframe, limit);
  }

  async getTicker(symbol: string, assetClass?: AssetClass): Promise<Ticker> {
    const detectedClass = assetClass || this.detectAssetClass(symbol);
    const provider = this.getProvider(detectedClass);

    this.logger.debug(
      `Fetching ticker for ${symbol} (${detectedClass}) from ${provider.name}`,
    );

    return provider.getTicker(symbol);
  }

  async getMultipleTickers(
    symbols: string[],
    assetClass?: AssetClass,
  ): Promise<Ticker[]> {
    const tickerPromises = symbols.map((symbol) =>
      this.getTicker(symbol, assetClass).catch((error) => {
        this.logger.warn(`Failed to fetch ticker for ${symbol}: ${error}`);
        return null;
      }),
    );

    const results = await Promise.all(tickerPromises);
    return results.filter((ticker): ticker is Ticker => ticker !== null);
  }

  async getAvailableSymbols(assetClass: AssetClass): Promise<AssetInfo[]> {
    const provider = this.getProvider(assetClass);
    return provider.getAvailableSymbols();
  }

  async getAllAvailableSymbols(): Promise<AssetInfo[]> {
    const results = await Promise.all([
      this.binanceProvider.getAvailableSymbols().catch(() => []),
      this.oandaProvider.getAvailableSymbols().catch(() => []),
      this.polygonProvider.getAvailableSymbols().catch(() => []),
    ]);

    return results.flat();
  }

  async checkProvidersHealth(): Promise<ProviderHealth[]> {
    const healthChecks = await Promise.all([
      this.binanceProvider.isHealthy().then((healthy) => ({
        name: this.binanceProvider.name,
        assetClass: this.binanceProvider.assetClass,
        healthy,
      })),
      this.oandaProvider.isHealthy().then((healthy) => ({
        name: this.oandaProvider.name,
        assetClass: this.oandaProvider.assetClass,
        healthy,
      })),
      this.polygonProvider.isHealthy().then((healthy) => ({
        name: this.polygonProvider.name,
        assetClass: this.polygonProvider.assetClass,
        healthy,
      })),
    ]);

    return healthChecks;
  }
}
