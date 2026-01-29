import { create } from "zustand"
import type { Ticker } from "@/types"

interface RealtimeState {
  tickers: Map<string, Ticker>
  isConnected: boolean
  lastUpdate: Date | null
  updateTicker: (symbol: string, ticker: Ticker) => void
  setConnected: (connected: boolean) => void
  setLastUpdate: (date: Date) => void
  getTicker: (symbol: string) => Ticker | undefined
}

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  tickers: new Map(),
  isConnected: false,
  lastUpdate: null,

  updateTicker: (symbol, ticker) =>
    set((state) => {
      const newTickers = new Map(state.tickers)
      newTickers.set(symbol, ticker)
      return { tickers: newTickers, lastUpdate: new Date() }
    }),

  setConnected: (connected) => set({ isConnected: connected }),

  setLastUpdate: (date) => set({ lastUpdate: date }),

  getTicker: (symbol) => get().tickers.get(symbol),
}))
