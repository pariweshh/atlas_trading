"use client"

import { HelpCircle, Book, MessageCircle, Mail } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Help & Support</h1>
        <p className="text-zinc-400 mt-1">Get help with using ATLAS</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-green-500" />
              Documentation
            </CardTitle>
            <CardDescription>
              Learn how to use ATLAS effectively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-4">
              Explore our comprehensive guides and tutorials to master
              AI-powered trading analysis.
            </p>
            <Button variant="outline">View Docs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              FAQ
            </CardTitle>
            <CardDescription>Frequently asked questions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-4">
              Find answers to common questions about features, billing, and
              more.
            </p>
            <Button variant="outline">View FAQ</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-500" />
              Contact Support
            </CardTitle>
            <CardDescription>Get in touch with our team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-4">
              Having issues? Our support team is here to help you.
            </p>
            <Button variant="outline">Contact Us</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-green-500" />
              Video Tutorials
            </CardTitle>
            <CardDescription>Watch and learn</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-4">
              Step-by-step video guides to help you get started quickly.
            </p>
            <Button variant="outline">Watch Videos</Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">1.</span>
              <div>
                <p className="text-zinc-100 font-medium">
                  Select your trading style
                </p>
                <p className="text-sm text-zinc-400">
                  Choose between Scalping, Day Trading, Swing, or Position
                  trading to get tailored recommendations.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">2.</span>
              <div>
                <p className="text-zinc-100 font-medium">
                  Set your risk parameters
                </p>
                <p className="text-sm text-zinc-400">
                  Configure your account size and risk percentage in Settings
                  for accurate position sizing.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">3.</span>
              <div>
                <p className="text-zinc-100 font-medium">
                  Always check the confidence score
                </p>
                <p className="text-sm text-zinc-400">
                  Higher confidence scores (7+) indicate stronger trading setups
                  with better confluence.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">4.</span>
              <div>
                <p className="text-zinc-100 font-medium">
                  Review the risks section
                </p>
                <p className="text-sm text-zinc-400">
                  Every recommendation includes potential risks - always
                  consider them before trading.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
