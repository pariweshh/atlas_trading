"use client"

import { createContext, useContext, useEffect, ReactNode } from "react"
import { useWebSocket } from "@/hooks/use-websocket"
import { useRealtimeStore } from "@/stores/realtime-store"
import type { Ticker } from "@/types"

interface WebSocketContextType {
  isConnected: boolean
  subscribe: (symbols: string[]) => void
  unsubscribe: (symbols: string[]) => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { isConnected, subscribe, unsubscribe, onTicker, offTicker } =
    useWebSocket()
  const { updateTicker, setConnected } = useRealtimeStore()

  useEffect(() => {
    setConnected(isConnected)
  }, [isConnected, setConnected])

  useEffect(() => {
    onTicker((data: Ticker & { symbol: string }) => {
      updateTicker(data.symbol, data)
    })

    return () => {
      offTicker()
    }
  }, [onTicker, offTicker, updateTicker])

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, unsubscribe }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocketContext must be used within WebSocketProvider")
  }
  return context
}
