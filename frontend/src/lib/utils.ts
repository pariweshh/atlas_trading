import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value)
}

export function getSignalColor(
  signal: "bullish" | "bearish" | "neutral",
): string {
  switch (signal) {
    case "bullish":
      return "text-green-500"
    case "bearish":
      return "text-red-500"
    default:
      return "text-zinc-400"
  }
}

export function getSignalBgColor(
  signal: "bullish" | "bearish" | "neutral",
): string {
  switch (signal) {
    case "bullish":
      return "bg-green-500/10 border-green-500/20"
    case "bearish":
      return "bg-red-500/10 border-red-500/20"
    default:
      return "bg-zinc-500/10 border-zinc-500/20"
  }
}

export function getPriceChangeColor(change: number): string {
  if (change > 0) return "text-green-500"
  if (change < 0) return "text-red-500"
  return "text-zinc-400"
}
