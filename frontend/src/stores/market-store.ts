import { create } from "zustand"
import type {
  Ticker,
  TechnicalAnalysis,
  TradeRecommendation,
  Timeframe,
} from "@/types"

interface MarketState {
  selectedSymbol: string
  selectedTimeframe: Timeframe
  currentTicker: Ticker | null
  technicalAnalysis: TechnicalAnalysis | null
  tradeRecommendation: TradeRecommendation | null
  isLoading: boolean
  setSelectedSymbol: (symbol: string) => void
  setSelectedTimeframe: (timeframe: Timeframe) => void
  setCurrentTicker: (ticker: Ticker | null) => void
  setTechnicalAnalysis: (analysis: TechnicalAnalysis | null) => void
  setTradeRecommendation: (recommendation: TradeRecommendation | null) => void
  setIsLoading: (loading: boolean) => void
}

export const useMarketStore = create<MarketState>((set) => ({
  selectedSymbol: "BTC/USDT",
  selectedTimeframe: "1h",
  currentTicker: null,
  technicalAnalysis: null,
  tradeRecommendation: null,
  isLoading: false,

  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  setCurrentTicker: (ticker) => set({ currentTicker: ticker }),
  setTechnicalAnalysis: (analysis) => set({ technicalAnalysis: analysis }),
  setTradeRecommendation: (recommendation) =>
    set({ tradeRecommendation: recommendation }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
