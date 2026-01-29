"use client"

import { useEffect, useRef } from "react"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ConnectionStatus } from "@/components/ui/connection-status"
import { useWebSocketContext } from "@/components/providers/websocket-provider"
import { useRealtimeStore } from "@/stores/realtime-store"
import { useTicker } from "@/hooks/use-market-data"
import { formatNumber, formatPercent, cn } from "@/lib/utils"

interface RealtimeTickerProps {
  symbol: string
}

export function RealtimeTicker({ symbol }: RealtimeTickerProps) {
  const { subscribe, unsubscribe, isConnected } = useWebSocketContext()
  const realtimeTicker = useRealtimeStore((state) => state.getTicker(symbol))
  const { data: restTicker, isLoading } = useTicker(symbol)
  const prevPriceRef = useRef<number | null>(null)
  const flashRef = useRef<HTMLDivElement>(null)

  // Subscribe to symbol on mount
  useEffect(() => {
    subscribe([symbol])
    return () => unsubscribe([symbol])
  }, [symbol, subscribe, unsubscribe])

  // Use realtime data if available, otherwise fall back to REST
  const ticker = realtimeTicker || restTicker

  // Flash effect on price change
  useEffect(() => {
    if (!ticker || !flashRef.current) return

    const currentPrice = ticker.last
    if (
      prevPriceRef.current !== null &&
      prevPriceRef.current !== currentPrice
    ) {
      const direction = currentPrice > prevPriceRef.current ? "up" : "down"
      flashRef.current.classList.remove("flash-up", "flash-down")
      void flashRef.current.offsetWidth // Trigger reflow
      flashRef.current.classList.add(`flash-${direction}`)
    }
    prevPriceRef.current = currentPrice
  }, [ticker?.last])

  if (isLoading && !ticker) {
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

  if (!ticker) return null

  const isPositive = ticker.changePercent24h >= 0
  const decimals = ticker.last > 100 ? 2 : ticker.last > 1 ? 4 : 6

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity
              className={cn(
                "h-4 w-4",
                isConnected ? "text-green-500 animate-pulse" : "text-zinc-500",
              )}
            />
            <span className="text-sm font-medium text-zinc-400">{symbol}</span>
          </div>
          <ConnectionStatus />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div
              ref={flashRef}
              className="text-4xl font-bold text-zinc-100 tabular-nums transition-colors"
            >
              ${formatNumber(ticker.last, decimals)}
            </div>
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
