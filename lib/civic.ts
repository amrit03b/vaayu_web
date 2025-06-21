// Civic authentication utilities (mock implementation)
export interface CivicUser {
  userId: string
  token: string
  verified: boolean
}

// Mock Civic login function
export async function civicLogin(): Promise<{ success: boolean; user?: CivicUser; error?: string }> {
  try {
    // Simulate Civic authentication flow
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock successful authentication
    const mockUser: CivicUser = {
      userId: `civic_${Date.now()}`,
      token: `civic_token_${generateRandomString(32)}`,
      verified: true,
    }

    console.log("Civic authentication successful:", mockUser)

    return {
      success: true,
      user: mockUser,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    }
  }
}

// Store Civic user data
export function storeCivicUser(user: CivicUser): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("civic_user", JSON.stringify(user))
  }
}

// Get stored Civic user
export function getStoredCivicUser(): CivicUser | null {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("civic_user")
    return stored ? JSON.parse(stored) : null
  }
  return null
}

// Clear Civic user data
export function clearCivicUser(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("civic_user")
  }
}

// Check if user is authenticated with Civic
export function isCivicAuthenticated(): boolean {
  const user = getStoredCivicUser()
  return user !== null && user.verified
}

// Helper function to generate random strings
function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// Check if user has a wallet
export function hasWallet(): boolean {
  return getStoredCivicUser() !== null
}
