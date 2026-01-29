"use client"

import { useState } from "react"
import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RealtimeTicker } from "@/components/dashboard/realtime-ticker"
import { TechnicalPanel } from "@/components/dashboard/technical-panel"
import { AIRecommendation } from "@/components/dashboard/ai-recommendation"
import { Watchlist } from "@/components/dashboard/watchlist"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { MultiAnalysis } from "@/components/dashboard/multi-analysis"
import { TradeSettings } from "@/components/dashboard/trade-settings"
import { PriceChart } from "@/components/charts/price-chart"
import {
  useTechnicalAnalysis,
  useAIAnalysis,
  useOHLCV,
} from "@/hooks/use-market-data"
import { useMarketStore } from "@/stores/market-store"
import type { Timeframe, TradingStyle } from "@/types"

const TIMEFRAMES = [
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "1d", label: "1D" },
]

export default function DashboardPage() {
  const {
    selectedSymbol,
    selectedTimeframe,
    setSelectedTimeframe,
    tradeRecommendation,
    isLoading,
  } = useMarketStore()

  const [tradingStyle, setTradingStyle] = useState<TradingStyle>("SWING")
  const [accountSize, setAccountSize] = useState(10000)
  const [riskPercent, setRiskPercent] = useState(1)

  const { data: ohlcv, isLoading: isOHLCVLoading } = useOHLCV(
    selectedSymbol,
    selectedTimeframe,
    100,
  )
  const { data: technicalAnalysis, isLoading: isTALoading } =
    useTechnicalAnalysis(selectedSymbol, selectedTimeframe)
  const { mutate: getAIAnalysis } = useAIAnalysis()

  const handleAnalyze = () => {
    getAIAnalysis({
      symbol: selectedSymbol,
      timeframe: selectedTimeframe,
      tradingStyle,
      accountSize,
      riskPercent,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            Trading Dashboard
          </h1>
          <p className="text-zinc-400 mt-1">
            AI-powered market analysis for {selectedSymbol}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-800 rounded-lg p-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedTimeframe(tf.value as Timeframe)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeframe === tf.value
                    ? "bg-green-600 text-white"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <Button onClick={handleAnalyze} isLoading={isLoading}>
            <Brain className="h-4 w-4 mr-2" />
            Analyze
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats analysis={technicalAnalysis} />

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-3 space-y-6">
          <Watchlist />
          <TradeSettings
            accountSize={accountSize}
            riskPercent={riskPercent}
            tradingStyle={tradingStyle}
            onAccountSizeChange={setAccountSize}
            onRiskPercentChange={setRiskPercent}
            onTradingStyleChange={(v) => setTradingStyle(v as TradingStyle)}
          />
        </div>

        {/* Center Column */}
        <div className="col-span-6 space-y-6">
          <RealtimeTicker symbol={selectedSymbol} />
          <PriceChart
            data={ohlcv}
            symbol={selectedSymbol}
            isLoading={isOHLCVLoading}
          />
        </div>

        {/* Right Column */}
        <div className="col-span-3">
          <TechnicalPanel
            analysis={technicalAnalysis}
            isLoading={isTALoading}
          />
        </div>
      </div>

      {/* AI Recommendation */}
      <AIRecommendation
        recommendation={tradeRecommendation}
        isLoading={isLoading}
      />

      {/* Market Scanner */}
      <MultiAnalysis />
    </div>
  )
}
