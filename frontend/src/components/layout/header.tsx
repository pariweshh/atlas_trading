"use client"

import { Bell, Search } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { ConnectionStatus } from "@/components/ui/connection-status"

export function Header() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search symbols, markets..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <ConnectionStatus />

        {/* Notifications */}
        <button className="relative p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-medium text-sm">
            {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-zinc-100">
              {user?.firstName
                ? `${user.firstName} ${user.lastName || ""}`.trim()
                : user?.email}
            </p>
            <p className="text-xs text-zinc-500">Trader</p>
          </div>
        </div>
      </div>
    </header>
  )
}
