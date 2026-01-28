"use client"

import { Settings, DollarSign, Percent, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

interface TradeSettingsProps {
  accountSize: number
  riskPercent: number
  tradingStyle: string
  onAccountSizeChange: (value: number) => void
  onRiskPercentChange: (value: number) => void
  onTradingStyleChange: (value: string) => void
}

const TRADING_STYLES = [
  { value: "SCALPING", label: "Scalping" },
  { value: "DAY_TRADING", label: "Day Trading" },
  { value: "SWING", label: "Swing Trading" },
  { value: "POSITION", label: "Position Trading" },
]

const RISK_OPTIONS = [
  { value: "0.5", label: "0.5%" },
  { value: "1", label: "1%" },
  { value: "1.5", label: "1.5%" },
  { value: "2", label: "2%" },
  { value: "3", label: "3%" },
]

export function TradeSettings({
  accountSize,
  riskPercent,
  tradingStyle,
  onAccountSizeChange,
  onRiskPercentChange,
  onTradingStyleChange,
}: TradeSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings className="h-4 w-4 text-green-500" />
          Trade Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 mb-1.5">
            <DollarSign className="h-3.5 w-3.5" />
            Account Size
          </label>
          <Input
            type="number"
            value={accountSize}
            onChange={(e) => onAccountSizeChange(Number(e.target.value))}
            placeholder="10000"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 mb-1.5">
            <Percent className="h-3.5 w-3.5" />
            Risk Per Trade
          </label>
          <Select
            options={RISK_OPTIONS}
            value={riskPercent.toString()}
            onChange={(e) => onRiskPercentChange(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 mb-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            Trading Style
          </label>
          <Select
            options={TRADING_STYLES}
            value={tradingStyle}
            onChange={(e) => onTradingStyleChange(e.target.value)}
          />
        </div>

        <div className="pt-2 border-t border-zinc-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Max Risk Amount</span>
            <span className="text-zinc-100 font-medium">
              ${((accountSize * riskPercent) / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
