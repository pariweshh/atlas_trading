"use client"

import { useState } from "react"
import {
  Bell,
  Plus,
  Trash2,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  useAlerts,
  useCreateAlert,
  useDeleteAlert,
  useCancelAlert,
} from "@/hooks/use-alerts"
import { useMarketStore } from "@/stores/market-store"
import { formatNumber } from "@/lib/utils"
import { AlertType, AlertStatus } from "@/types"
import type { Alert, CreateAlertInput } from "@/types"

const ALERT_TYPE_OPTIONS = [
  { value: AlertType.PRICE_ABOVE, label: "Price Above" },
  { value: AlertType.PRICE_BELOW, label: "Price Below" },
  { value: AlertType.RSI_OVERBOUGHT, label: "RSI Overbought" },
  { value: AlertType.RSI_OVERSOLD, label: "RSI Oversold" },
  { value: AlertType.MACD_BULLISH, label: "MACD Bullish" },
  { value: AlertType.MACD_BEARISH, label: "MACD Bearish" },
  { value: AlertType.AI_OPPORTUNITY, label: "AI Opportunity" },
]

const TIMEFRAME_OPTIONS = [
  { value: "15m", label: "15 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
]

export default function AlertsPage() {
  const { selectedSymbol } = useMarketStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<"active" | "all">("active")

  const { data: alerts, isLoading } = useAlerts(filter)
  const { mutate: deleteAlert } = useDeleteAlert()
  const { mutate: cancelAlert } = useCancelAlert()

  const activeAlerts =
    alerts?.filter((a) => a.status === AlertStatus.ACTIVE) || []
  const triggeredAlerts =
    alerts?.filter((a) => a.status === AlertStatus.TRIGGERED) || []

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.PRICE_ABOVE:
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case AlertType.PRICE_BELOW:
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case AlertType.RSI_OVERBOUGHT:
      case AlertType.RSI_OVERSOLD:
        return <Activity className="h-4 w-4 text-yellow-500" />
      case AlertType.MACD_BULLISH:
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case AlertType.MACD_BEARISH:
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case AlertType.AI_OPPORTUNITY:
        return <Brain className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-zinc-400" />
    }
  }

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.ACTIVE:
        return <Badge variant="bullish">Active</Badge>
      case AlertStatus.TRIGGERED:
        return <Badge variant="neutral">Triggered</Badge>
      case AlertStatus.CANCELLED:
        return <Badge variant="bearish">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatAlertCondition = (alert: Alert) => {
    switch (alert.type) {
      case AlertType.PRICE_ABOVE:
        return `Price ≥ $${formatNumber(alert.targetPrice || 0, 2)}`
      case AlertType.PRICE_BELOW:
        return `Price ≤ $${formatNumber(alert.targetPrice || 0, 2)}`
      case AlertType.RSI_OVERBOUGHT:
        return `RSI ≥ ${alert.rsiThreshold}`
      case AlertType.RSI_OVERSOLD:
        return `RSI ≤ ${alert.rsiThreshold}`
      case AlertType.MACD_BULLISH:
        return "MACD Bullish Crossover"
      case AlertType.MACD_BEARISH:
        return "MACD Bearish Crossover"
      case AlertType.AI_OPPORTUNITY:
        return `Signal Strength ≥ ${alert.minSignalStrength}/10`
      default:
        return alert.type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Alerts</h1>
          <p className="text-zinc-400 mt-1">
            Get notified when conditions are met
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === "active"
                  ? "bg-green-600 text-white"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === "all"
                  ? "bg-green-600 text-white"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              All
            </button>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Bell className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Active Alerts</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {activeAlerts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Triggered Today</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {triggeredAlerts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Alerts</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {alerts?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-500" />
            {filter === "active" ? "Active Alerts" : "All Alerts"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : alerts && alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-zinc-100">
                          {alert.symbol}
                        </p>
                        {getStatusBadge(alert.status)}
                      </div>
                      <p className="text-sm text-zinc-400">
                        {formatAlertCondition(alert)}
                      </p>
                      {alert.note && (
                        <p className="text-xs text-zinc-500 mt-1">
                          {alert.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {alert.status === AlertStatus.TRIGGERED &&
                      alert.triggeredPrice && (
                        <div className="text-right">
                          <p className="text-sm text-zinc-400">Triggered at</p>
                          <p className="text-zinc-100">
                            ${formatNumber(alert.triggeredPrice, 2)}
                          </p>
                        </div>
                      )}

                    <div className="flex items-center gap-2">
                      {alert.status === AlertStatus.ACTIVE && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelAlert(alert.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No alerts yet</p>
              <p className="text-sm mt-1">Create an alert to get notified</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <CreateAlertModal
          symbol={selectedSymbol}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

interface CreateAlertModalProps {
  symbol: string
  onClose: () => void
}

function CreateAlertModal({ symbol, onClose }: CreateAlertModalProps) {
  const { mutate: createAlert, isPending } = useCreateAlert()
  const [formData, setFormData] = useState<CreateAlertInput>({
    symbol,
    type: AlertType.PRICE_ABOVE,
    repeatAlert: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createAlert(formData, {
      onSuccess: () => onClose(),
    })
  }

  const showPriceInput = [
    AlertType.PRICE_ABOVE,
    AlertType.PRICE_BELOW,
  ].includes(formData.type)
  const showRsiInput = [
    AlertType.RSI_OVERBOUGHT,
    AlertType.RSI_OVERSOLD,
  ].includes(formData.type)
  const showSignalInput = formData.type === AlertType.AI_OPPORTUNITY
  const showTimeframeInput = [
    AlertType.RSI_OVERBOUGHT,
    AlertType.RSI_OVERSOLD,
    AlertType.MACD_BULLISH,
    AlertType.MACD_BEARISH,
    AlertType.AI_OPPORTUNITY,
  ].includes(formData.type)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-zinc-100">Create Alert</h3>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded">
            <X className="h-5 w-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Symbol"
            value={formData.symbol}
            onChange={(e) =>
              setFormData({ ...formData, symbol: e.target.value })
            }
            placeholder="BTC/USDT"
          />

          <Select
            label="Alert Type"
            options={ALERT_TYPE_OPTIONS}
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as AlertType })
            }
          />

          {showPriceInput && (
            <Input
              label="Target Price"
              type="number"
              value={formData.targetPrice || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetPrice: parseFloat(e.target.value),
                })
              }
              placeholder="100000"
            />
          )}

          {showRsiInput && (
            <Input
              label="RSI Threshold"
              type="number"
              value={formData.rsiThreshold || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rsiThreshold: parseFloat(e.target.value),
                })
              }
              placeholder={
                formData.type === AlertType.RSI_OVERBOUGHT ? "70" : "30"
              }
            />
          )}

          {showSignalInput && (
            <Input
              label="Minimum Signal Strength (1-10)"
              type="number"
              value={formData.minSignalStrength || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minSignalStrength: parseInt(e.target.value),
                })
              }
              placeholder="7"
            />
          )}

          {showTimeframeInput && (
            <Select
              label="Timeframe"
              options={TIMEFRAME_OPTIONS}
              value={formData.timeframe || "1h"}
              onChange={(e) =>
                setFormData({ ...formData, timeframe: e.target.value })
              }
            />
          )}

          <Input
            label="Note (optional)"
            value={formData.note || ""}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Alert description..."
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="repeatAlert"
              checked={formData.repeatAlert}
              onChange={(e) =>
                setFormData({ ...formData, repeatAlert: e.target.checked })
              }
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
            />
            <label htmlFor="repeatAlert" className="text-sm text-zinc-400">
              Repeat alert after triggered
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isPending}>
              Create Alert
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
