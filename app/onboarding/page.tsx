"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { getStoredWallet, createWallet, storeWallet, submitProfileTransaction, getUserProfile, hasUserProfile, type HealthProfile } from "@/lib/aptos"
import { useUser } from "@civic/auth/react"
import { ArrowLeft, Loader2, CheckCircle, User, Heart, MapPin, Clock, Sparkles, AlertTriangle, Shield } from "lucide-react"
import Link from "next/link"

const CHRONIC_CONDITIONS = ["Asthma", "Diabetes Type 1", "Diabetes Type 2", "COPD", "Heart Disease", "Allergies", "Hypertension", "Other"]
const WALK_TIMES = ["Early Morning (5-7 AM)", "Morning (7-10 AM)", "Late Morning (10 AM-12 PM)", "Afternoon (12-3 PM)", "Late Afternoon (3-6 PM)", "Evening (6-8 PM)", "Night (8-10 PM)"]
const SENSITIVITY_LEVELS = [
  "Low - I rarely notice air quality changes",
  "Moderate - I sometimes feel effects of poor air quality",
  "High - I often experience symptoms from air pollution",
  "Very High - I am very sensitive to air quality changes",
]

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [aiSuggestion, setAiSuggestion] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    chronicConditions: [] as string[],
    preferredWalkTime: "",
    pollutionSensitivity: "",
    location: "",
  })

  useEffect(() => {
    // Check authentication - use real Civic auth instead of mock
    if (userLoading) {
      return // Still loading, wait
    }
    
    if (!user?.id) {
      router.push("/login")
      return
    }
    
    const stableUserId = user.email || user.id

    const checkExistingProfile = async () => {
      setIsLoading(true)
      const existingWallet = getStoredWallet(stableUserId)

      if (!existingWallet) {
        setError("Wallet not found. Please log in again.")
        setIsLoading(false)
        return
      }

      console.log(
        "Checking for existing profile for onboarding:",
        existingWallet.address
      )
      const profileResult = await getUserProfile(existingWallet)

      if (profileResult.success && profileResult.profile) {
        // Profile exists, pre-fill form
        const profile = profileResult.profile
        setFormData({
          name: profile.name,
          age: profile.age.toString(),
          gender: profile.gender,
          chronicConditions: profile.chronicCondition || [],
          preferredWalkTime: profile.preferredWalkTime || "",
          pollutionSensitivity: profile.pollutionSensitivity || "",
          location: profile.location || "",
        })
        setIsEditing(true)
        console.log("Loaded existing profile for editing:", profile)
      } else {
        // No profile exists, or there was a non-fatal error
        console.log("No existing profile found. Starting new submission.")
        setIsEditing(false)
      }
      setIsLoading(false)
    }

    checkExistingProfile()
  }, [router, user, userLoading])

  useEffect(() => {
    const fields = [
      formData.name,
      formData.age,
      formData.gender,
      formData.chronicConditions.length > 0,
      formData.preferredWalkTime,
      formData.pollutionSensitivity,
      formData.location,
    ]
    const filled = fields.filter(Boolean).length
    setProgress((filled / fields.length) * 100)
  }, [formData])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      chronicConditions: checked
        ? [...prev.chronicConditions, condition]
        : prev.chronicConditions.filter((c) => c !== condition),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Use a more stable identifier - prefer email if available, fallback to ID
    const stableUserId = user?.email || user?.id;
    const currentWallet = getStoredWallet(stableUserId)
    if (!currentWallet) {
      setError("No wallet found. Please log in again.")
      return
    }

    if (!formData.name || !formData.age || !formData.gender || formData.chronicConditions.length === 0 || !formData.location) {
      setError("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const profileData: HealthProfile = {
        name: formData.name,
        age: Number.parseInt(formData.age),
        gender: formData.gender,
        chronicCondition: formData.chronicConditions,
        preferredWalkTime: formData.preferredWalkTime,
        pollutionSensitivity: formData.pollutionSensitivity,
        location: formData.location,
      }

      const result = await submitProfileTransaction(currentWallet, profileData)

      if (result.success) {
        setTransactionHash(result.transactionHash || "")

        // Fetch AQI data from environment variable
        let aqiData = {
          aqi: 112,
          aqiCategory: "Moderate",
          forecast: { "5 PM": 115 },
        }

        try {
          const aqiResponse = await fetch(process.env.NEXT_PUBLIC_AQI_API_URL || "https://api.example.com/aqi")
          if (aqiResponse.ok) {
            const aqiResult = await aqiResponse.json()
            aqiData = aqiResult
          }
        } catch (error) {
          console.error("Failed to fetch AQI data:", error)
          // Keep the default values (aqi: 112) if API fails
        }

        const response = await fetch("https://personalised-health-advisor.vercel.app/api/getAdvice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: profileData, aqiData }),
        })

        const data = await response.json()
        setAiSuggestion(data.advice)
        setSubmitted(true)
      } else {
        setError(result.error || "Failed to submit profile")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && error.includes("Wallet not found")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle>Wallet Not Found</CardTitle>
            <CardDescription>Please log in again to access your wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login">
              <Button className="w-full">Return to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              {isEditing ? "Profile Updated Successfully!" : "Profile Submitted Successfully!"}
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              {isEditing 
                ? "Your profile has been updated and securely stored on the blockchain."
                : "Your profile has been securely stored and analyzed."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {transactionHash && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2 font-medium">Transaction Hash:</p>
                <code className="text-xs font-mono break-all bg-gray-100 p-2 rounded block">{transactionHash}</code>
              </div>
            )}
            {aiSuggestion && (
              <div className="relative p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                <div className="absolute top-4 right-4">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Health Advice
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <div className="text-blue-800 leading-relaxed space-y-3">
                      {aiSuggestion.split('\n').map((line, index) => {
                        if (line.trim().startsWith('*')) {
                          // Format bullet points
                          const content = line.replace(/^\*\s*/, '').trim().replace(/\*\*/g, '')
                          return (
                            <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-blue-100">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-blue-800 font-medium">{content}</p>
                            </div>
                          )
                        } else if (line.trim()) {
                          // Format regular text
                          const cleanText = line.trim().replace(/\*\*/g, '')
                          return (
                            <p key={index} className="text-blue-700 leading-relaxed">
                              {cleanText}
                            </p>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="pt-4">
              <Link href="/dashboard">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 text-lg shadow-lg">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Progress Header */}
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {isEditing ? "Update Health Profile" : "Health Profile Setup"}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {isEditing 
                  ? "Update your health information to receive the most accurate personalized recommendations."
                  : "Help us personalize your environmental health recommendations with detailed information about your health profile."
                }
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700">Profile Completion</span>
                <span className="text-blue-600">{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-3 bg-gray-200" />
            </div>
          </div>

          {/* Form */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">This information will be securely stored and used to provide personalized health recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Enter your age"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Health Conditions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-red-600" />
                    </div>
                    <Label className="text-lg font-medium text-gray-900">Chronic Conditions *</Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">Select all conditions that apply to you</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                    {CHRONIC_CONDITIONS.map((condition) => (
                      <div key={condition} className="flex items-center space-x-3">
                        <Checkbox
                          id={condition}
                          checked={formData.chronicConditions.includes(condition)}
                          onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                          className="w-5 h-5"
                        />
                        <Label htmlFor={condition} className="text-sm font-medium text-gray-700 cursor-pointer">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <Label className="text-lg font-medium text-gray-900">Walking Preferences</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-11">
                    <div className="space-y-3">
                      <Label htmlFor="walkTime" className="text-sm font-medium text-gray-700">Preferred Walk Time</Label>
                      <Select
                        value={formData.preferredWalkTime}
                        onValueChange={(value) => handleInputChange("preferredWalkTime", value)}
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="When do you prefer to walk?" />
                        </SelectTrigger>
                        <SelectContent>
                          {WALK_TIMES.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="sensitivity" className="text-sm font-medium text-gray-700">Pollution Sensitivity</Label>
                      <Select
                        value={formData.pollutionSensitivity}
                        onValueChange={(value) => handleInputChange("pollutionSensitivity", value)}
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="How sensitive are you to air pollution?" />
                        </SelectTrigger>
                        <SelectContent>
                          {SENSITIVITY_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <Label htmlFor="location" className="text-lg font-medium text-gray-900">Location *</Label>
                  </div>
                  <div className="ml-11 space-y-2">
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Enter your city and state/country"
                      className="h-12 text-base"
                      required
                    />
                    <p className="text-xs text-gray-500">This helps us provide location-specific air quality data</p>
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Link href="/dashboard" className="flex-1">
                    <Button type="button" variant="outline" className="w-full h-12 text-base font-medium">
                      Save as Draft
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || progress < 100} 
                    className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting to Blockchain...
                      </>
                    ) : (
                      isEditing ? "Update Profile" : "Submit Profile"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
                  Your data will be encrypted and stored securely on the Aptos blockchain
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}