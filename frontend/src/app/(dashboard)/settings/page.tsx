"use client"

import { useState } from "react"
import { Settings, User, Bell, Shield, Palette } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useAuthStore } from "@/stores/auth-store"
import { toast } from "sonner"

const TRADING_STYLES = [
  { value: "SCALPING", label: "Scalping" },
  { value: "DAY_TRADING", label: "Day Trading" },
  { value: "SWING", label: "Swing Trading" },
  { value: "POSITION", label: "Position Trading" },
]

const RISK_LEVELS = [
  { value: "0.5", label: "0.5% (Conservative)" },
  { value: "1", label: "1% (Moderate)" },
  { value: "2", label: "2% (Aggressive)" },
  { value: "3", label: "3% (Very Aggressive)" },
]

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const [accountSize, setAccountSize] = useState("10000")
  const [defaultRisk, setDefaultRisk] = useState("1")
  const [tradingStyle, setTradingStyle] = useState("SWING")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success("Settings saved successfully")
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
        <p className="text-zinc-400 mt-1">
          Manage your account and trading preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-500" />
            Profile
          </CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={user?.firstName || ""} disabled />
            <Input label="Last Name" value={user?.lastName || ""} disabled />
          </div>
          <Input
            label="Email"
            type="email"
            value={user?.email || ""}
            disabled
          />
          <p className="text-xs text-zinc-500">
            Contact support to update your profile information
          </p>
        </CardContent>
      </Card>

      {/* Trading Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-green-500" />
            Trading Preferences
          </CardTitle>
          <CardDescription>
            Configure your default trading parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Account Size (USD)"
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(e.target.value)}
            placeholder="10000"
          />
          <Select
            label="Default Risk Per Trade"
            options={RISK_LEVELS}
            value={defaultRisk}
            onChange={(e) => setDefaultRisk(e.target.value)}
          />
          <Select
            label="Preferred Trading Style"
            options={TRADING_STYLES}
            value={tradingStyle}
            onChange={(e) => setTradingStyle(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-500" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your alert preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Trade Opportunities
                </p>
                <p className="text-xs text-zinc-500">
                  Get notified when AI finds trading setups
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Price Alerts
                </p>
                <p className="text-xs text-zinc-500">
                  Notify when price hits your targets
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">Market News</p>
                <p className="text-xs text-zinc-500">
                  Important market updates and news
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change Password</Button>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-100">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-zinc-500">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-green-500" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-100">Dark Mode</p>
              <p className="text-xs text-zinc-500">Optimized for trading</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              disabled
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={isSaving} size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
