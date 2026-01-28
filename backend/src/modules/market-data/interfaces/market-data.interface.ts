export interface OHLCV {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Ticker {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  volume24h: number;
  change24h: number;
  changePercent24h: number;
  timestamp: Date;
}

export interface AssetInfo {
  symbol: string;
  name: string;
  assetClass: 'FOREX' | 'CRYPTO' | 'ETF';
  exchange: string;
  tradeable: boolean;
}

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';

export type AssetClass = 'FOREX' | 'CRYPTO' | 'ETF';

export interface ProviderHealth {
  name: string;
  assetClass: AssetClass;
  healthy: boolean;
}

export interface MarketDataProvider {
  readonly name: string;
  readonly assetClass: 'FOREX' | 'CRYPTO' | 'ETF';

  // REST methods
  getOHLCV(
    symbol: string,
    timeframe: Timeframe,
    limit?: number,
  ): Promise<OHLCV[]>;
  getTicker(symbol: string): Promise<Ticker>;
  getAvailableSymbols(): Promise<AssetInfo[]>;

  // Health check
  isHealthy(): Promise<boolean>;
}
