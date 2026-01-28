"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  TrendingUp,
  LayoutDashboard,
  LineChart,
  Bell,
  History,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/use-auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analysis", href: "/analysis", icon: LineChart },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "History", href: "/history", icon: History },
]

const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { mutate: logout } = useLogout()

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-800">
        <div className="p-1.5 bg-green-600 rounded-lg">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">ATLAS</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-green-600/10 text-green-500"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 space-y-1">
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-green-600/10 text-green-500"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
