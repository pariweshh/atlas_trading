"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber, formatPercent } from "@/lib/utils"
import type { Ticker } from "@/types"

interface PriceTickerProps {
  ticker: Ticker | undefined
  symbol: string
  isLoading?: boolean
}

export function PriceTicker({ ticker, symbol, isLoading }: PriceTickerProps) {
  if (isLoading || !ticker) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="grid grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto mb-2" />
                  <Skeleton className="h-6 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isPositive = ticker.changePercent24h >= 0
  const decimals = ticker.last > 100 ? 2 : ticker.last > 1 ? 4 : 6

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 font-medium">{symbol}</p>
            <p className="text-4xl font-bold text-zinc-100 mt-1 tabular-nums">
              ${formatNumber(ticker.last, decimals)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {formatPercent(ticker.changePercent24h)}
              </span>
              <span className="text-zinc-500 text-sm">24h</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-sm text-zinc-500">Bid</p>
              <p className="text-lg font-medium text-zinc-100 tabular-nums">
                ${formatNumber(ticker.bid, decimals)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-500">Ask</p>
              <p className="text-lg font-medium text-zinc-100 tabular-nums">
                ${formatNumber(ticker.ask, decimals)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-500">24h Volume</p>
              <p className="text-lg font-medium text-zinc-100 tabular-nums">
                {formatNumber(ticker.volume24h, 0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
