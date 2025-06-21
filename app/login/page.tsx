"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserButton } from "@civic/auth-web3/react"
import { Leaf, Shield, Wallet, Heart } from "lucide-react"
import Link from "next/link"
import ContinueToDashboardButton from "./ContinueToDashboardButton"

export default function LoginPage() {
  const [error, setError] = useState<string>("")

  const handleLoginSuccess = () => {
    // This will be handled by the ContinueToDashboardButton component
  }

  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* App Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-green-500 rounded-full">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Vaayu</h1>
          </div>
          <p className="text-gray-600">Your personalized environmental health companion</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome to Vaayu</CardTitle>
            <CardDescription>Secure login with Civic to access your personalized health dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features Preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure identity verification with Civic</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Wallet className="w-4 h-4 text-blue-500" />
                <span>Personal Aptos wallet for data privacy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Personalized health recommendations</span>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Button */}
            <UserButton className="w-full" />

            {/* Continue to Dashboard Link (client component) */}
            <ContinueToDashboardButton />

            <div className="text-xs text-center text-gray-500">
              By logging in, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">Powered by Civic Identity & Aptos Blockchain</div>
      </div>
    </div>
  )
}
