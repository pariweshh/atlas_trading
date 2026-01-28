"use client"

import { BarChart3, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber, getSignalColor } from "@/lib/utils"
import type { TechnicalAnalysis } from "@/types"

interface TechnicalPanelProps {
  analysis: TechnicalAnalysis | undefined
  isLoading?: boolean
}

export function TechnicalPanel({ analysis, isLoading }: TechnicalPanelProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Technical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Technical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-zinc-500">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Select a symbol to analyze</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getBadgeVariant = (signal: string) => {
    if (signal === "bullish") return "bullish"
    if (signal === "bearish") return "bearish"
    return "neutral"
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-500" />
          Technical Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Trend */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Overall Trend</span>
          <Badge variant={getBadgeVariant(analysis.overallTrend)}>
            {analysis.overallTrend.toUpperCase()}
          </Badge>
        </div>

        {/* Signal Strength */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Signal Strength</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${analysis.signalStrength * 10}%` }}
              />
            </div>
            <span className="text-zinc-100 font-medium text-sm">
              {analysis.signalStrength}/10
            </span>
          </div>
        </div>

        <hr className="border-zinc-800" />

        {/* Indicators */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">RSI (14)</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${getSignalColor(analysis.rsi.signal)}`}
              >
                {analysis.rsi.value.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">MACD</span>
            <Badge
              variant={getBadgeVariant(analysis.macd.signal)}
              className="text-xs"
            >
              {analysis.macd.signal}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">Moving Averages</span>
            <Badge
              variant={getBadgeVariant(analysis.movingAverages.signal)}
              className="text-xs"
            >
              {analysis.movingAverages.signal}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">Bollinger Bands</span>
            <Badge
              variant={getBadgeVariant(analysis.bollingerBands.signal)}
              className="text-xs"
            >
              {analysis.bollingerBands.signal}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">Stochastic</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${getSignalColor(analysis.stochastic.signal)}`}
              >
                {analysis.stochastic.value.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">ATR</span>
            <span className="text-sm font-medium text-zinc-300">
              {analysis.atr.value.toFixed(2)}
            </span>
          </div>
        </div>

        <hr className="border-zinc-800" />

        {/* Support & Resistance */}
        <div className="space-y-3">
          <div>
            <p className="text-sm text-zinc-400 mb-2">Support Levels</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.supportResistance.supportLevels
                .slice(0, 3)
                .map((level, i) => (
                  <Badge key={i} variant="bullish" className="text-xs">
                    ${formatNumber(level, level > 1000 ? 0 : 2)}
                  </Badge>
                ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-zinc-400 mb-2">Resistance Levels</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.supportResistance.resistanceLevels
                .slice(0, 3)
                .map((level, i) => (
                  <Badge key={i} variant="bearish" className="text-xs">
                    ${formatNumber(level, level > 1000 ? 0 : 2)}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
