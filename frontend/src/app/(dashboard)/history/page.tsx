"use client"

import { History, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"

// Mock data for trade history
const MOCK_TRADES = [
  {
    id: "1",
    symbol: "BTC/USDT",
    direction: "LONG",
    entry: 88500,
    exit: 91200,
    pnl: 2700,
    pnlPercent: 3.05,
    date: "2026-01-27",
    status: "WIN",
  },
  {
    id: "2",
    symbol: "ETH/USDT",
    direction: "SHORT",
    entry: 3250,
    exit: 3150,
    pnl: 100,
    pnlPercent: 3.07,
    date: "2026-01-26",
    status: "WIN",
  },
  {
    id: "3",
    symbol: "SOL/USDT",
    direction: "LONG",
    entry: 185,
    exit: 178,
    pnl: -70,
    pnlPercent: -3.78,
    date: "2026-01-25",
    status: "LOSS",
  },
  {
    id: "4",
    symbol: "BNB/USDT",
    direction: "LONG",
    entry: 680,
    exit: 695,
    pnl: 150,
    pnlPercent: 2.2,
    date: "2026-01-24",
    status: "WIN",
  },
]

export default function HistoryPage() {
  const totalPnl = MOCK_TRADES.reduce((acc, trade) => acc + trade.pnl, 0)
  const winRate =
    (MOCK_TRADES.filter((t) => t.status === "WIN").length /
      MOCK_TRADES.length) *
    100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Trade History</h1>
        <p className="text-zinc-400 mt-1">
          Review your past trades and performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-zinc-500">Total Trades</p>
            <p className="text-2xl font-bold text-zinc-100">
              {MOCK_TRADES.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-zinc-500">Win Rate</p>
            <p className="text-2xl font-bold text-green-500">
              {winRate.toFixed(0)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-zinc-500">Total P&L</p>
            <p
              className={`text-2xl font-bold ${totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              ${formatNumber(totalPnl, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-zinc-500">Avg Trade</p>
            <p
              className={`text-2xl font-bold ${totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              ${formatNumber(totalPnl / MOCK_TRADES.length, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trade List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-green-500" />
            Recent Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_TRADES.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      trade.direction === "LONG"
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    {trade.direction === "LONG" ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-100">{trade.symbol}</p>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Calendar className="h-3 w-3" />
                      {trade.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-zinc-500">Entry</p>
                    <p className="text-zinc-100 tabular-nums">
                      ${formatNumber(trade.entry, 2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-500">Exit</p>
                    <p className="text-zinc-100 tabular-nums">
                      ${formatNumber(trade.exit, 2)}
                    </p>
                  </div>
                  <div className="text-right min-w-25">
                    <p
                      className={`font-medium tabular-nums ${
                        trade.pnl >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {trade.pnl >= 0 ? "+" : ""}${formatNumber(trade.pnl, 0)}
                    </p>
                    <p
                      className={`text-sm tabular-nums ${
                        trade.pnl >= 0 ? "text-green-500/70" : "text-red-500/70"
                      }`}
                    >
                      {trade.pnl >= 0 ? "+" : ""}
                      {trade.pnlPercent.toFixed(2)}%
                    </p>
                  </div>
                  <Badge
                    variant={trade.status === "WIN" ? "bullish" : "bearish"}
                  >
                    {trade.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
