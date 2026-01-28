"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Alerts</h1>
        <p className="text-zinc-400 mt-1">Trading alerts and notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-500" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-zinc-500">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Proactive trading alerts</p>
            <p className="text-sm mt-1">This feature is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
