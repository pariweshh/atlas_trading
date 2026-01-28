"use client"

import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { TechnicalAnalysis } from "@/types"

interface QuickStatsProps {
  analysis: TechnicalAnalysis | null | undefined
}

export function QuickStats({ analysis }: QuickStatsProps) {
  const stats = [
    {
      label: "Trend",
      value: analysis?.overallTrend?.toUpperCase() || "—",
      icon: analysis?.overallTrend === "bullish" ? TrendingUp : TrendingDown,
      color:
        analysis?.overallTrend === "bullish"
          ? "text-green-500"
          : analysis?.overallTrend === "bearish"
            ? "text-red-500"
            : "text-zinc-400",
    },
    {
      label: "Signal",
      value: analysis ? `${analysis.signalStrength}/10` : "—",
      icon: Zap,
      color:
        analysis && analysis.signalStrength >= 7
          ? "text-green-500"
          : analysis && analysis.signalStrength >= 5
            ? "text-yellow-500"
            : "text-zinc-400",
    },
    {
      label: "RSI",
      value: analysis?.rsi?.value?.toFixed(1) || "—",
      icon: Activity,
      color:
        analysis?.rsi?.signal === "bullish"
          ? "text-green-500"
          : analysis?.rsi?.signal === "bearish"
            ? "text-red-500"
            : "text-zinc-400",
    },
    {
      label: "Volatility",
      value: analysis?.atr?.value
        ? `${((analysis.atr.value / analysis.currentPrice) * 100).toFixed(2)}%`
        : "—",
      icon: Activity,
      color: "text-zinc-400",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color} opacity-50`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
