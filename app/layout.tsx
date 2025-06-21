import { CivicAuthProvider } from "@civic/auth/nextjs";
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vaayu - Environmental Health Companion",
  description: "Your personalized environmental health companion for chronic conditions",
  keywords: ["health", "environment", "air quality", "chronic conditions", "blockchain"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}><CivicAuthProvider>
      {children}
    </CivicAuthProvider></body>
    </html>
  )
}
