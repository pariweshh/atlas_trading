"use client"

import { useEffect, useRef } from "react"
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  CandlestickData,
  Time,
} from "lightweight-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CandlestickChart } from "lucide-react"
import type { OHLCV } from "@/types"

interface PriceChartProps {
  data: OHLCV[] | undefined
  symbol: string
  isLoading?: boolean
}

export function PriceChart({ data, symbol, isLoading }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current || isLoading) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#a1a1aa",
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#22c55e",
          width: 1,
          style: 2,
          labelBackgroundColor: "#22c55e",
        },
        horzLine: {
          color: "#22c55e",
          width: 1,
          style: 2,
          labelBackgroundColor: "#22c55e",
        },
      },
      rightPriceScale: {
        borderColor: "#27272a",
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: "#27272a",
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    })

    // Create candlestick series using v5 API
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      wickUpColor: "#22c55e",
    })

    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
    }
  }, [isLoading])

  // Update data when it changes
  useEffect(() => {
    if (!candlestickSeriesRef.current || !data || data.length === 0) return

    const chartData: CandlestickData<Time>[] = data.map((candle) => ({
      time: (new Date(candle.timestamp).getTime() / 1000) as Time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }))

    candlestickSeriesRef.current.setData(chartData)
    chartRef.current?.timeScale().fitContent()
  }, [data])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CandlestickChart className="h-5 w-5 text-green-500" />
            {symbol} Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-100" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CandlestickChart className="h-5 w-5 text-green-500" />
          {symbol} Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} className="w-full" />
      </CardContent>
    </Card>
  )
}
