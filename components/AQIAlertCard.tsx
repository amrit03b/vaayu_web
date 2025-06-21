"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Wind, MapPin } from "lucide-react"

interface AQIData {
  location: string
  aqi: number
  level:
    | "Good"
    | "Moderate"
    | "Unhealthy for Sensitive Groups"
    | "Unhealthy"
    | "Very Unhealthy"
    | "Hazardous"
  recommendation: string
}

export function AQIAlertCard({ className }: { className?: string }) {
  const [aqiData, setAqiData] = useState<AQIData | null>(null)

  const classifyAQI = (aqi: number): AQIData["level"] => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    if (aqi <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  const getRecommendation = (level: AQIData["level"]) => {
    switch (level) {
      case "Good":
        return "Enjoy outdoor activities."
      case "Moderate":
        return "Sensitive individuals should consider reducing outdoor exertion."
      case "Unhealthy for Sensitive Groups":
        return "Limit prolonged outdoor exertion if you have respiratory issues."
      case "Unhealthy":
        return "Everyone should reduce prolonged or heavy exertion outdoors."
      case "Very Unhealthy":
        return "Avoid outdoor activities. Stay indoors."
      case "Hazardous":
        return "Health warnings. Stay indoors and use air purifiers."
    }
  }

  const getAQIColor = (level: string) => {
    switch (level) {
      case "Good": return "bg-green-500"
      case "Moderate": return "bg-yellow-500"
      case "Unhealthy for Sensitive Groups": return "bg-orange-500"
      case "Unhealthy": return "bg-red-500"
      case "Very Unhealthy": return "bg-purple-500"
      case "Hazardous": return "bg-red-800"
      default: return "bg-gray-500"
    }
  }

  const fetchAQIData = async (lat: number, lon: number) => {
    const token = process.env.NEXT_PUBLIC_AQICN_TOKEN // Place your AQICN token in .env
    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`

    try {
      const res = await fetch(url)
      const json = await res.json()

      if (json.status === "ok") {
        const aqi = json.data.aqi
        const level = classifyAQI(aqi)
        setAqiData({
          location: json.data.city.name,
          aqi,
          level,
          recommendation: getRecommendation(level),
        })
      }
    } catch (error) {
      console.error("Failed to fetch AQI data", error)
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        fetchAQIData(latitude, longitude)
      },
      () => {
        // fallback to Delhi
        fetchAQIData(28.6139, 77.209)
      }
    )
  }, [])

  const shouldShowAlert = aqiData?.aqi && aqiData.aqi > 50

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 🌍 Map Preview Box */}
      <a
        href="https://aqi-index-tracker.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Card className="overflow-hidden">
          <img
            src="https://tiles.aqicn.org/tiles/usepa-aqi/4/8/5.png?token=demo"
            alt="Air Quality Map Preview"
            className="w-full h-40 object-cover"
          />
        </Card>
      </a>

      {/* 🌬️ AQI Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5" />
              Air Quality Index
            </CardTitle>
            {shouldShowAlert && <AlertTriangle className="w-5 h-5 text-orange-500" />}
          </div>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {aqiData?.location || "Detecting..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {aqiData ? (
            <>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">{aqiData.aqi}</div>
                <Badge
                  variant="secondary"
                  className={`${getAQIColor(aqiData.level)} text-white`}
                >
                  {aqiData.level}
                </Badge>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Recommendation:</strong> {aqiData.recommendation}
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Loading AQI data...</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
