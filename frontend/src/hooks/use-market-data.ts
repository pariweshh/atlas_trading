import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { useMarketStore } from "@/stores/market-store"
import type {
  Ticker,
  OHLCV,
  TechnicalAnalysis,
  TradeRecommendation,
  Timeframe,
  TradingStyle,
} from "@/types"

export function useTicker(symbol: string) {
  return useQuery({
    queryKey: ["ticker", symbol],
    queryFn: async () => {
      const response = await api.get<Ticker>("/market-data/ticker", {
        params: { symbol },
      })
      return response.data
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    enabled: !!symbol,
  })
}

export function useOHLCV(
  symbol: string,
  timeframe: Timeframe,
  limit: number = 100,
) {
  return useQuery({
    queryKey: ["ohlcv", symbol, timeframe, limit],
    queryFn: async () => {
      const response = await api.get<OHLCV[]>("/market-data/ohlcv", {
        params: { symbol, timeframe, limit },
      })
      return response.data
    },
    enabled: !!symbol,
  })
}

export function useTechnicalAnalysis(symbol: string, timeframe: Timeframe) {
  const setTechnicalAnalysis = useMarketStore(
    (state) => state.setTechnicalAnalysis,
  )

  return useQuery({
    queryKey: ["technical-analysis", symbol, timeframe],
    queryFn: async () => {
      const response = await api.get<TechnicalAnalysis>("/analysis/technical", {
        params: { symbol, timeframe, limit: 200 },
      })
      setTechnicalAnalysis(response.data)
      return response.data
    },
    enabled: !!symbol,
  })
}

interface AIAnalysisParams {
  symbol: string
  timeframe: Timeframe
  tradingStyle?: TradingStyle
  accountSize?: number
  riskPercent?: number
  specificQuestion?: string
}

export function useAIAnalysis() {
  const setTradeRecommendation = useMarketStore(
    (state) => state.setTradeRecommendation,
  )
  const setIsLoading = useMarketStore((state) => state.setIsLoading)

  return useMutation({
    mutationFn: async (params: AIAnalysisParams) => {
      setIsLoading(true)
      const response = await api.post<TradeRecommendation>(
        "/analysis/ai",
        params,
      )
      return response.data
    },
    onSuccess: (data) => {
      setTradeRecommendation(data)
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    },
  })
}
