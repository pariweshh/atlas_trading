"use client"

import {
  Brain,
  AlertTriangle,
  Target,
  Shield,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { formatNumber } from "@/lib/utils"
import type { TradeRecommendation } from "@/types"

interface AIRecommendationProps {
  recommendation: TradeRecommendation | null
  isLoading?: boolean
}

export function AIRecommendation({
  recommendation,
  isLoading,
}: AIRecommendationProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-500" />
            AI Trade Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner size="lg" />
            <p className="text-zinc-400 mt-4">Analyzing market data...</p>
            <p className="text-zinc-500 text-sm mt-1">
              This may take a few seconds
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!recommendation) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-500" />
            AI Trade Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-zinc-500">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No analysis yet</p>
            <p className="text-sm mt-1">
              Click &quot;Analyze&quot; to get AI-powered trade recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isLong = recommendation.direction === "LONG"
  const isShort = recommendation.direction === "SHORT"
  const isNoTrade = recommendation.direction === "NO_TRADE"

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-500" />
            AI Trade Recommendation
          </CardTitle>
          <span className="text-xs text-zinc-500">
            {recommendation.recommendationId}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Direction & Confidence */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isLong
                ? "bg-green-500/10 border border-green-500/20"
                : isShort
                  ? "bg-red-500/10 border border-red-500/20"
                  : "bg-zinc-500/10 border border-zinc-500/20"
            }`}
          >
            {isLong && <TrendingUp className="h-5 w-5 text-green-500" />}
            {isShort && <TrendingDown className="h-5 w-5 text-red-500" />}
            {isNoTrade && <AlertTriangle className="h-5 w-5 text-zinc-400" />}
            <span
              className={`text-lg font-bold ${
                isLong
                  ? "text-green-500"
                  : isShort
                    ? "text-red-500"
                    : "text-zinc-400"
              }`}
            >
              {recommendation.direction}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-zinc-400">Confidence</span>
              <span className="text-sm font-medium text-zinc-100">
                {recommendation.confidence.score}/10
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  recommendation.confidence.score >= 7
                    ? "bg-green-500"
                    : recommendation.confidence.score >= 5
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${recommendation.confidence.score * 10}%` }}
              />
            </div>
          </div>
        </div>

        {/* Entry, Stop Loss, Take Profit */}
        {!isNoTrade && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Entry</span>
              </div>
              <p className="text-xl font-bold text-zinc-100 tabular-nums">
                ${formatNumber(recommendation.entry.price, 2)}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {recommendation.entry.type}
              </p>
            </div>

            <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">Stop Loss</span>
              </div>
              <p className="text-xl font-bold text-red-500 tabular-nums">
                ${formatNumber(recommendation.stopLoss.price, 2)}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                -{recommendation.stopLoss.distancePercent.toFixed(2)}%
              </p>
            </div>

            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">Take Profit</span>
              </div>
              <p className="text-xl font-bold text-green-500 tabular-nums">
                $
                {formatNumber(
                  recommendation.takeProfit.targets[0]?.price || 0,
                  2,
                )}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                R:R {recommendation.riskReward.toTp1}
              </p>
            </div>
          </div>
        )}

        {/* Take Profit Targets */}
        {!isNoTrade && recommendation.takeProfit.targets.length > 1 && (
          <div>
            <p className="text-sm text-zinc-400 mb-2">Take Profit Targets</p>
            <div className="space-y-2">
              {recommendation.takeProfit.targets.map((target) => (
                <div
                  key={target.level}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-zinc-400">TP{target.level}</span>
                  <span className="text-zinc-300 tabular-nums">
                    ${formatNumber(target.price, 2)}
                  </span>
                  <span className="text-zinc-500">{target.sizePercent}%</span>
                  <Badge variant="outline" className="text-xs">
                    {target.rMultiple}R
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Factors */}
        <div>
          <p className="text-sm text-zinc-400 mb-2">Key Factors</p>
          <ul className="space-y-1.5">
            {recommendation.confidence.factors.slice(0, 4).map((factor, i) => (
              <li
                key={i}
                className="text-sm text-zinc-300 flex items-start gap-2"
              >
                <span className="text-green-500 mt-0.5">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rationale */}
        <div>
          <p className="text-sm text-zinc-400 mb-2">Analysis</p>
          <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">
            {recommendation.rationale}
          </p>
        </div>

        {/* Risks */}
        {recommendation.risks.length > 0 && (
          <div>
            <p className="text-sm text-zinc-400 mb-2 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Risks
            </p>
            <ul className="space-y-1">
              {recommendation.risks.slice(0, 3).map((risk, i) => (
                <li
                  key={i}
                  className="text-sm text-amber-400/80 flex items-start gap-2"
                >
                  <span className="mt-0.5">⚠</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-zinc-800/30 rounded-lg p-3 text-xs text-zinc-500 leading-relaxed">
          {recommendation.disclaimer}
        </div>
      </CardContent>
    </Card>
  )
}
