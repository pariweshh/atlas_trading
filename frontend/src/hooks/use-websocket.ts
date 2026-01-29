"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { io, Socket } from "socket.io-client"
import type { Ticker } from "@/types"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000"

interface UseWebSocketOptions {
  autoConnect?: boolean
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { autoConnect = true } = options
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const subscribedSymbolsRef = useRef<Set<string>>(new Set())
  const tickerCallbackRef = useRef<
    ((data: Ticker & { symbol: string }) => void) | null
  >(null)

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    const socket = io(`${WS_URL}/market`, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on("connect", () => {
      console.log("WebSocket connected")
      setIsConnected(true)

      // Resubscribe to symbols after reconnection
      if (subscribedSymbolsRef.current.size > 0) {
        socket.emit("subscribe", {
          symbols: Array.from(subscribedSymbolsRef.current),
        })
      }
    })

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
    })

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message)
    })

    socket.on("ticker", (data: Ticker & { symbol: string }) => {
      setLastUpdate(new Date())
      if (tickerCallbackRef.current) {
        tickerCallbackRef.current(data)
      }
    })

    socketRef.current = socket
  }, [])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [])

  const subscribe = useCallback((symbols: string[]) => {
    symbols.forEach((s) => subscribedSymbolsRef.current.add(s))

    if (socketRef.current?.connected) {
      socketRef.current.emit("subscribe", { symbols })
    }
  }, [])

  const unsubscribe = useCallback((symbols: string[]) => {
    symbols.forEach((s) => subscribedSymbolsRef.current.delete(s))

    if (socketRef.current?.connected) {
      socketRef.current.emit("unsubscribe", { symbols })
    }
  }, [])

  const onTicker = useCallback(
    (callback: (data: Ticker & { symbol: string }) => void) => {
      tickerCallbackRef.current = callback
    },
    [],
  )

  const offTicker = useCallback(() => {
    tickerCallbackRef.current = null
  }, [])

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return {
    isConnected,
    lastUpdate,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    onTicker,
    offTicker,
  }
}
