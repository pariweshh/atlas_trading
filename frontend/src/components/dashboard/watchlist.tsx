"use client"

import { useState, useMemo } from "react"
import { Star, TrendingUp, TrendingDown, Search, X, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTicker } from "@/hooks/use-market-data"
import { useMarketStore } from "@/stores/market-store"
import { formatNumber, formatPercent } from "@/lib/utils"
import {
  SYMBOLS,
  SYMBOL_CATEGORIES,
  searchSymbols,
  type SymbolCategory,
  type SymbolInfo,
} from "@/lib/symbols"

interface WatchlistItemProps {
  symbol: string
  name: string
  category: string
  isSelected: boolean
  onSelect: (symbol: string) => void
  onRemove: (symbol: string) => void
}

function WatchlistItem({
  symbol,
  name,
  isSelected,
  onSelect,
  onRemove,
}: WatchlistItemProps) {
  const { data: ticker, isLoading } = useTicker(symbol)

  if (isLoading || !ticker) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 bg-zinc-700 rounded" />
          <div className="h-4 w-20 bg-zinc-700 rounded" />
        </div>
        <div className="h-4 w-16 bg-zinc-700 rounded" />
      </div>
    )
  }

  const isPositive = ticker.changePercent24h >= 0

  return (
    <button
      onClick={() => onSelect(symbol)}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group ${
        isSelected
          ? "bg-green-500/10 border border-green-500/20"
          : "bg-zinc-800/30 hover:bg-zinc-800/50 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Star
          className={`h-4 w-4 shrink-0 ${
            isSelected ? "text-green-500 fill-green-500" : "text-zinc-500"
          }`}
        />
        <div className="text-left min-w-0">
          <p className="font-medium text-zinc-100 truncate">{symbol}</p>
          <p className="text-xs text-zinc-500 truncate">{name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-100 tabular-nums">
            $
            {formatNumber(
              ticker.last,
              ticker.last > 100 ? 2 : ticker.last > 1 ? 4 : 6,
            )}
          </p>
          <div className="flex items-center justify-end gap-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span
              className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {formatPercent(ticker.changePercent24h)}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(symbol)
          }}
          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-zinc-700 rounded transition-all"
        >
          <X className="h-3 w-3 text-zinc-400" />
        </button>
      </div>
    </button>
  )
}

interface SymbolSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (symbol: SymbolInfo) => void
  watchlist: string[]
}

function SymbolSearchModal({
  isOpen,
  onClose,
  onAdd,
  watchlist,
}: SymbolSearchModalProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<SymbolCategory>("ALL")

  const filteredSymbols = useMemo(() => {
    return searchSymbols(search, category).filter(
      (s) => !watchlist.includes(s.symbol),
    )
  }, [search, category, watchlist])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Add Symbol</h3>
            <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded">
              <X className="h-5 w-5 text-zinc-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symbols..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {SYMBOL_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  category === cat.value
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Symbol List */}
        <div className="p-4 overflow-y-auto max-h-100 space-y-1">
          {filteredSymbols.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">No symbols found</p>
          ) : (
            filteredSymbols.slice(0, 50).map((symbolInfo) => (
              <button
                key={symbolInfo.symbol}
                onClick={() => {
                  onAdd(symbolInfo)
                  onClose()
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium text-zinc-100">
                    {symbolInfo.symbol}
                  </p>
                  <p className="text-xs text-zinc-500">{symbolInfo.name}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {symbolInfo.category}
                </Badge>
              </button>
            ))
          )}
          {filteredSymbols.length > 50 && (
            <p className="text-center text-zinc-500 text-sm py-2">
              Showing 50 of {filteredSymbols.length} results
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const DEFAULT_WATCHLIST = [
  "BTC/USDT",
  "ETH/USDT",
  "EUR/USD",
  "GBP/USD",
  "SPY",
  "GLD",
]

export function Watchlist() {
  const { selectedSymbol, setSelectedSymbol } = useMarketStore()
  const [watchlist, setWatchlist] = useState<string[]>(DEFAULT_WATCHLIST)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddSymbol = (symbolInfo: SymbolInfo) => {
    if (!watchlist.includes(symbolInfo.symbol)) {
      setWatchlist([...watchlist, symbolInfo.symbol])
    }
  }

  const handleRemoveSymbol = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol))
    if (selectedSymbol === symbol && watchlist.length > 1) {
      const newSymbol = watchlist.find((s) => s !== symbol)
      if (newSymbol) setSelectedSymbol(newSymbol)
    }
  }

  // Get symbol info for each watchlist item
  const watchlistWithInfo = watchlist.map((symbol) => {
    const info = SYMBOLS.find((s) => s.symbol === symbol)
    return {
      symbol,
      name: info?.name || symbol,
      category: info?.category || "UNKNOWN",
    }
  })

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="h-4 w-4 text-green-500" />
            Watchlist
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-1 max-h-100 overflow-y-auto">
          {watchlistWithInfo.map(({ symbol, name, category }) => (
            <WatchlistItem
              key={symbol}
              symbol={symbol}
              name={name}
              category={category}
              isSelected={selectedSymbol === symbol}
              onSelect={setSelectedSymbol}
              onRemove={handleRemoveSymbol}
            />
          ))}
        </CardContent>
      </Card>

      <SymbolSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSymbol}
        watchlist={watchlist}
      />
    </>
  )
}
