"use client"

import { useState, useEffect, useMemo } from "react"
import { Gift, User as UserIcon, Wallet, FileText, Copy, CheckCircle, ArrowRight, Settings, Heart, MapPin, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AQIAlertCard } from "@/components/AQIAlertCard"
import { getStoredWallet, getUserProfile, hasUserProfile, type HealthProfile, clearCorruptedWallet } from "@/lib/aptos"
import { useUser } from "@civic/auth/react"

export default function DashboardPage() {
  const [copied, setCopied] = useState(false)
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [walletError, setWalletError] = useState<string | null>(null)
  const { user, isLoading } = useUser()

  // Use a more stable identifier - prefer email if available, fallback to ID
  const stableUserId = user?.email || user?.id;
  
  // Check for corrupted wallet data and clear it if found
  useEffect(() => {
    if (stableUserId) {
      const wasCorrupted = clearCorruptedWallet(stableUserId)
      if (wasCorrupted) {
        setWalletError("Wallet data was corrupted and has been cleared. Please log in again to create a new wallet.")
      }
    }
  }, [stableUserId])
  
  const wallet = useMemo(
    () => (stableUserId ? getStoredWallet(stableUserId) : null),
    [stableUserId]
  )

  // Fetch health profile from blockchain
  useEffect(() => {
    const fetchHealthProfile = async () => {
      if (!wallet || !stableUserId) {
        setProfileLoading(false)
        return
      }

      setProfileLoading(true)
      setProfileError(null)
      try {
        console.log("Fetching health profile for wallet:", wallet.address)
        const profileResult = await getUserProfile(wallet)
        console.log("Profile result:", profileResult)

        if (profileResult.success && profileResult.profile) {
          setHealthProfile(profileResult.profile)
        } else {
          // This is not an error, it just means no profile exists.
          if (
            profileResult.error?.includes("Profile not found") ||
            profileResult.error?.includes("access denied")
          ) {
            setHealthProfile(null)
            console.log("No profile found for user.")
          } else {
            // This is a real error.
            setProfileError(profileResult.error || "Failed to load profile data")
          }
        }
      } catch (error) {
        console.error("Error fetching health profile:", error)
        setProfileError(
          "An unexpected error occurred while loading your profile"
        )
      } finally {
        setProfileLoading(false)
      }
    }

    fetchHealthProfile()
  }, [wallet, stableUserId])

  const handleCopyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-500 rounded-full">
                <div className="w-4 h-4 text-white">🍃</div>
              </div>
              <h1 className="text-xl font-bold">Vaayu Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://vaayu-voucher-hub.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Gift className="w-4 h-4" />
                  Rewards
                </Button>
              </a>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back{healthProfile ? `, ${healthProfile.name}` : ""}!
            </h2>
            <p className="text-gray-600">
              {healthProfile 
                ? "Monitor your environmental health and manage your wellness profile."
                : "Complete your health profile to get personalized environmental health recommendations."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wallet Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Your Aptos Wallet
                  </CardTitle>
                  <CardDescription>Your secure blockchain wallet for health data storage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {walletError ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="text-sm text-red-600 mb-3">{walletError}</p>
                      <Button 
                        onClick={() => window.location.reload()} 
                        variant="outline"
                        size="sm"
                      >
                        Reload Page
                      </Button>
                    </div>
                  ) : wallet ? (
                    <>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <code className="flex-1 text-sm font-mono break-all">{wallet.address}</code>
                        <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="shrink-0">
                          {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        This wallet is automatically generated and secured with your Civic identity
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Wallet className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">No wallet found</p>
                      <Button 
                        onClick={() => window.location.reload()} 
                        variant="outline"
                        size="sm"
                      >
                        Reload Page
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Health Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Health Profile
                  </CardTitle>
                  <CardDescription>
                    Your personalized health information stored securely on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profileLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : profileError ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Profile</h3>
                      <p className="text-gray-600 mb-4">{profileError}</p>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => window.location.reload()} 
                          variant="outline"
                          className="w-full"
                        >
                          Retry
                        </Button>
                        <Link href="/onboarding">
                          <Button className="w-full">
                            Create New Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : healthProfile ? (
                    <div className="space-y-4">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Name</span>
                          </div>
                          <p className="text-lg font-semibold">{healthProfile.name}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Age & Gender</span>
                          </div>
                          <p className="text-lg font-semibold">{healthProfile.age} years old, {healthProfile.gender}</p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Location</span>
                        </div>
                        <p className="text-lg font-semibold">{healthProfile.location}</p>
                      </div>

                      {/* Chronic Conditions */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Chronic Conditions</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {healthProfile.chronicCondition.map((condition, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Preferences */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Preferred Walk Time</span>
                          </div>
                          <p className="text-sm">{healthProfile.preferredWalkTime || "Not specified"}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Pollution Sensitivity</span>
                          </div>
                          <p className="text-sm">{healthProfile.pollutionSensitivity || "Not specified"}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <Link href="/onboarding">
                          <Button variant="outline" className="w-full">
                            <FileText className="w-4 h-4 mr-2" />
                            Update Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Health Profile Found</h3>
                      <p className="text-gray-600 mb-4">Create your health profile to receive personalized recommendations</p>
                      <Link href="/onboarding">
                        <Button>
                          Create Profile
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/onboarding">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        {healthProfile ? "Update Health Profile" : "Create Health Profile"}
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <UserIcon className="w-4 h-4 mr-2" />
                      View Health History
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Soon
                      </Badge>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - AQI and Alerts */}
            <div className="space-y-6">
              <AQIAlertCard />

              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Civic ID:</span>
                    <span className="font-mono text-xs">
                      {isLoading ? "Loading..." : user?.id}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Joined:</span>
                    <span className="text-xs">{new Date().toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
