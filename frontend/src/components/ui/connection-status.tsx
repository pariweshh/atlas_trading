"use client"

import { Wifi, WifiOff } from "lucide-react"
import { useRealtimeStore } from "@/stores/realtime-store"
import { cn } from "@/lib/utils"

export function ConnectionStatus() {
  const { isConnected, lastUpdate } = useRealtimeStore()

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
          isConnected
            ? "bg-green-500/10 text-green-500"
            : "bg-red-500/10 text-red-500",
        )}
      >
        {isConnected ? (
          <>
            <Wifi className="h-3 w-3" />
            <span>Live</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            <span>Offline</span>
          </>
        )}
      </div>
      {lastUpdate && isConnected && (
        <span className="text-xs text-zinc-500">
          Updated {formatTimeAgo(lastUpdate)}
        </span>
      )}
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 5) return "just now"
  if (seconds < 60) return `${seconds}s ago`
  return `${Math.floor(seconds / 60)}m ago`
}
