"use client"

import { useState, useMemo } from "react"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useTechnicalAnalysis } from "@/hooks/use-market-data"
import { useMarketStore } from "@/stores/market-store"
import { formatNumber } from "@/lib/utils"
import { SYMBOLS, SYMBOL_CATEGORIES, type SymbolCategory } from "@/lib/symbols"
import type { Timeframe } from "@/types"

interface SymbolScanResultProps {
  symbol: string
  name: string
  category: string
  timeframe: Timeframe
  onSelect: (symbol: string) => void
}

function SymbolScanResult({
  symbol,
  name,
  category,
  timeframe,
  onSelect,
}: SymbolScanResultProps) {
  const {
    data: analysis,
    isLoading,
    isError,
  } = useTechnicalAnalysis(symbol, timeframe)

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
        <div className="flex items-center gap-3">
          <Spinner size="sm" />
          <span className="text-zinc-400">{symbol}</span>
        </div>
      </div>
    )
  }

  if (isError || !analysis) {
    return (
      <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg opacity-50">
        <span className="text-zinc-500">{symbol}</span>
        <span className="text-xs text-zinc-600">Unavailable</span>
      </div>
    )
  }

  const TrendIcon =
    analysis.overallTrend === "bullish"
      ? TrendingUp
      : analysis.overallTrend === "bearish"
        ? TrendingDown
        : Minus

  const trendColor =
    analysis.overallTrend === "bullish"
      ? "text-green-500"
      : analysis.overallTrend === "bearish"
        ? "text-red-500"
        : "text-zinc-400"

  return (
    <button
      onClick={() => onSelect(symbol)}
      className="w-full flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-800/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
        <div className="text-left">
          <span className="font-medium text-zinc-100">{symbol}</span>
          <p className="text-xs text-zinc-500">{name}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-zinc-100 tabular-nums">
            $
            {formatNumber(
              analysis.currentPrice,
              analysis.currentPrice > 100 ? 2 : 4,
            )}
          </p>
        </div>

        <Badge
          variant={
            analysis.signalStrength >= 7
              ? "bullish"
              : analysis.signalStrength >= 5
                ? "neutral"
                : "bearish"
          }
          className="min-w-12.5 justify-center"
        >
          {analysis.signalStrength}/10
        </Badge>

        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>

        <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
      </div>
    </button>
  )
}

export function MultiAnalysis() {
  const { selectedTimeframe, setSelectedSymbol } = useMarketStore()
  const [isScanning, setIsScanning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedCategory, setSelectedCategory] =
    useState<SymbolCategory>("CRYPTO")
  const [scanLimit, setScanLimit] = useState(10)

  const symbolsToScan = useMemo(() => {
    const filtered =
      selectedCategory === "ALL"
        ? SYMBOLS
        : SYMBOLS.filter((s) => s.category === selectedCategory)
    return filtered.slice(0, scanLimit)
  }, [selectedCategory, scanLimit])

  const handleScan = () => {
    setIsScanning(true)
    setShowResults(true)
    setTimeout(() => setIsScanning(false), 500)
  }

  const handleSelectSymbol = (symbol: string) => {
    setSelectedSymbol(symbol)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-green-500" />
          Market Scanner
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {SYMBOL_CATEGORIES.filter((c) => c.value !== "INDEX").map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value)
                  setShowResults(false)
                }}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <Button onClick={handleScan} isLoading={isScanning} size="sm">
            Scan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showResults ? (
          <div className="space-y-2 max-h-125 overflow-y-auto">
            {symbolsToScan.map((symbolInfo) => (
              <SymbolScanResult
                key={symbolInfo.symbol}
                symbol={symbolInfo.symbol}
                name={symbolInfo.name}
                category={symbolInfo.category}
                timeframe={selectedTimeframe}
                onSelect={handleSelectSymbol}
              />
            ))}
            {symbolsToScan.length <
              SYMBOLS.filter(
                (s) =>
                  selectedCategory === "ALL" || s.category === selectedCategory,
              ).length && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setScanLimit((prev) => prev + 10)}
              >
                Load More
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>
              Select a category and click &quot;Scan&quot; to find opportunities
            </p>
            <p className="text-xs mt-1 text-zinc-600">
              {
                SYMBOLS.filter(
                  (s) =>
                    selectedCategory === "ALL" ||
                    s.category === selectedCategory,
                ).length
              }{" "}
              symbols available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
