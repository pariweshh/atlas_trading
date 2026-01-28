// Auth Types
export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

// Market Data Types
export interface Ticker {
  symbol: string
  bid: number
  ask: number
  last: number
  volume24h: number
  change24h: number
  changePercent24h: number
  timestamp: string
}

export interface OHLCV {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Technical Analysis Types
export interface IndicatorValue {
  value: number
  signal: "bullish" | "bearish" | "neutral"
  interpretation?: string
}

export interface MovingAverages {
  sma20: number
  sma50: number
  sma200: number
  ema9: number
  ema21: number
  signal: "bullish" | "bearish" | "neutral"
  interpretation: string
}

export interface MACD {
  macdLine: number
  signalLine: number
  histogram: number
  signal: "bullish" | "bearish" | "neutral"
  interpretation: string
}

export interface BollingerBands {
  upper: number
  middle: number
  lower: number
  percentB: number
  bandwidth: number
  signal: "bullish" | "bearish" | "neutral"
  interpretation: string
}

export interface SupportResistance {
  supportLevels: number[]
  resistanceLevels: number[]
  nearestSupport: number
  nearestResistance: number
}

export interface TechnicalAnalysis {
  symbol: string
  timeframe: string
  currentPrice: number
  overallTrend: "bullish" | "bearish" | "neutral"
  signalStrength: number
  rsi: IndicatorValue
  macd: MACD
  movingAverages: MovingAverages
  bollingerBands: BollingerBands
  stochastic: IndicatorValue
  atr: IndicatorValue
  supportResistance: SupportResistance
  timestamp: string
}

// Trade Recommendation Types
export interface Confidence {
  score: number
  level: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"
  factors: string[]
}

export interface Entry {
  type: "MARKET" | "LIMIT" | "STOP"
  price: number
  trigger: string
}

export interface StopLoss {
  price: number
  distancePercent: number
  atrMultiple: number
  placementLogic: string
}

export interface TakeProfitTarget {
  level: number
  price: number
  sizePercent: number
  rMultiple: number
}

export interface TakeProfit {
  targets: TakeProfitTarget[]
}

export interface RiskReward {
  toTp1: string
  toTp2: string
  toTp3: string
  weightedAverage: string
}

export interface PositionSizing {
  recommendedRiskPercent: number
  positionSize: number
  calculation: string
}

export interface TradeManagement {
  breakevenRule: string
  trailingStop: string
  invalidation: string
}

export interface TradeRecommendation {
  recommendationId: string
  timestamp: string
  symbol: string
  assetClass: string
  direction: "LONG" | "SHORT" | "NO_TRADE"
  confidence: Confidence
  tradingStyle: string
  entry: Entry
  stopLoss: StopLoss
  takeProfit: TakeProfit
  riskReward: RiskReward
  positionSizing: PositionSizing
  tradeManagement: TradeManagement
  rationale: string
  risks: string[]
  disclaimer: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
}

export type Timeframe = "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d" | "1w"
export type TradingStyle = "SCALPING" | "DAY_TRADING" | "SWING" | "POSITION"
export type AssetClass = "FOREX" | "CRYPTO" | "ETF"
