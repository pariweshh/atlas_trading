"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  TrendingUp,
  LayoutDashboard,
  LineChart,
  Bell,
  History,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/use-auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analysis", href: "/analysis", icon: LineChart },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { mutate: logout } = useLogout()

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-green-600 rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">ATLAS</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-zinc-400 hover:text-zinc-100"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/80"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed top-14 right-0 bottom-0 w-64 bg-zinc-900 border-l border-zinc-800 z-50 transform transition-transform duration-200",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
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

          <hr className="my-4 border-zinc-800" />

          <button
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  )
}
