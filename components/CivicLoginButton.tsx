"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Shield } from "lucide-react"
import { civicLogin, storeCivicUser } from "@/lib/civic"
import { createWallet, storeWallet } from "@/lib/aptos"

interface CivicLoginButtonProps {
  className?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function CivicLoginButton({ className, onSuccess, onError }: CivicLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)

    try {
      // Step 1: Authenticate with Civic
      const civicResult = await civicLogin()

      if (!civicResult.success || !civicResult.user) {
        throw new Error(civicResult.error || "Civic authentication failed")
      }

      // Step 2: Store Civic user data
      storeCivicUser(civicResult.user)

      // Step 3: Generate Aptos wallet
      const wallet = createWallet()
      storeWallet(wallet)

      console.log("Login successful:", {
        civicUser: civicResult.user.userId,
        aptosWallet: wallet.address,
      })

      // Step 4: Call success callback or redirect
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      console.error("Login error:", errorMessage)

      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogin} disabled={isLoading} className={className} size="lg">
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Authenticating...
        </>
      ) : (
        <>
          <Shield className="w-4 h-4 mr-2" />
          Login with Civic
        </>
      )}
    </Button>
  )
}
