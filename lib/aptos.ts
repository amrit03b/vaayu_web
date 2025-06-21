import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey } from "@aptos-labs/ts-sdk"

// Aptos wallet and blockchain utilities
export interface AptosWallet {
  address: string
  privateKey: string
  publicKey: string
}

export interface HealthProfile {
  name: string
  age: number
  gender: string
  chronicCondition: string[]
  preferredWalkTime: string
  pollutionSensitivity: string
  location: string
}

// Initialize Aptos client
const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

// Contract configuration (will be updated after deployment)
let CONTRACT_ADDRESS = "0x70beae59414f2e9115a4eaace4edd0409643069b056c8996def20d6e8d322f1a";
let MODULE_NAME = "onboarding"

// Set contract address after deployment
export function setContractAddress(address: string) {
  CONTRACT_ADDRESS = address
}

// Generate a new Aptos wallet (real implementation)
export function createWallet(): AptosWallet {
  const account = Account.generate();
  return {
    address: account.accountAddress.toString(),
    privateKey: account.privateKey.toString(),
    publicKey: account.publicKey.toString(),
  };
}

// Store wallet in local storage with user-specific key
export function storeWallet(wallet: AptosWallet, userId?: string): void {
  if (typeof window !== "undefined") {
    const key = userId ? `aptos_wallet_${userId}` : "aptos_wallet"
    localStorage.setItem(key, JSON.stringify(wallet))
    console.log(`Wallet stored for user ${userId}:`, wallet.address)
  }
}

// Retrieve wallet from local storage with user-specific key
export function getStoredWallet(userId?: string): AptosWallet | null {
  if (typeof window !== "undefined") {
    const key = userId ? `aptos_wallet_${userId}` : "aptos_wallet"
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const wallet = JSON.parse(stored)
        
        // Validate wallet structure
        if (!wallet || typeof wallet !== 'object' || !wallet.address || !wallet.privateKey || !wallet.publicKey) {
          console.error("Invalid wallet structure in localStorage:", wallet)
          // Clear the corrupted wallet
          localStorage.removeItem(key)
          return null
        }
        
        console.log(`Wallet retrieved for user ${userId}:`, wallet.address)
        return wallet
      } catch (parseError) {
        console.error("Failed to parse stored wallet:", parseError)
        // Clear the corrupted wallet data
        localStorage.removeItem(key)
        return null
      }
    } else {
      console.log(`No wallet found for user ${userId}`)
      return null
    }
  }
  return null
}

// Clear wallet from local storage with user-specific key
export function clearWallet(userId?: string): void {
  if (typeof window !== "undefined") {
    const key = userId ? `aptos_wallet_${userId}` : "aptos_wallet"
    localStorage.removeItem(key)
    console.log(`Wallet cleared for user ${userId}`)
  }
}

// Clear corrupted wallet data and return true if corruption was found
export function clearCorruptedWallet(userId?: string): boolean {
  if (typeof window !== "undefined") {
    const key = userId ? `aptos_wallet_${userId}` : "aptos_wallet"
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const wallet = JSON.parse(stored)
        if (!wallet || typeof wallet !== 'object' || !wallet.address || !wallet.privateKey || !wallet.publicKey) {
          console.log(`Clearing corrupted wallet for user ${userId}`)
          localStorage.removeItem(key)
          return true
        }
      } catch (parseError) {
        console.log(`Clearing corrupted wallet data for user ${userId}`)
        localStorage.removeItem(key)
        return true
      }
    }
  }
  return false
}

// Check if user has a wallet with user-specific key
export function hasWallet(userId?: string): boolean {
  return getStoredWallet(userId) !== null
}

// Submit health profile to Aptos blockchain (real implementation)
export async function submitProfileTransaction(
  wallet: AptosWallet,
  profileData: HealthProfile,
): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
  try {
    // Create Aptos account from stored wallet
    const privateKey = new Ed25519PrivateKey(wallet.privateKey);
    const account = Account.fromPrivateKey({ privateKey });

    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::set_profile`,
        functionArguments: [
          profileData.name,
          profileData.age,
          profileData.gender,
          profileData.chronicCondition,
          profileData.preferredWalkTime,
          profileData.pollutionSensitivity,
          profileData.location,
        ],
      },
    });

    const senderAuthenticator = aptos.transaction.sign({ signer: account, transaction });
    const committedTxn = await aptos.transaction.submit.simple({ transaction, senderAuthenticator });

    console.log("Submitting profile to Aptos blockchain:", {
      wallet: wallet.address,
      profile: profileData,
      contractAddress: CONTRACT_ADDRESS,
    });

    const executedTransaction = await aptos.waitForTransaction({
      transactionHash: committedTxn.hash,
    });

    console.log("Profile submitted successfully:", executedTransaction.hash);

    return {
      success: true,
      transactionHash: executedTransaction.hash,
    };
  } catch (error) {
    console.error("Failed to submit profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper function to safely parse blockchain responses
function safeParseBlockchainResponse(result: any): any {
  try {
    // If result is already an array, return it
    if (Array.isArray(result)) {
      return result;
    }
    
    // If result is a string, try to parse it as JSON
    if (typeof result === 'string') {
      // Check if it starts with common error prefixes
      if (result.startsWith('Per anonym') || result.startsWith('Permission') || result.startsWith('Error')) {
        throw new Error(result);
      }
      
      // Try to parse as JSON
      try {
        return JSON.parse(result);
      } catch (parseError) {
        console.warn("Failed to parse string as JSON:", result);
        return result;
      }
    }
    
    // If result is an object, return it
    if (typeof result === 'object' && result !== null) {
      return result;
    }
    
    // If result is a primitive, wrap it in an array
    return [result];
  } catch (error) {
    console.error("Error parsing blockchain response:", error);
    throw error;
  }
}

// For development: clear all wallets from local storage
export function clearAllWallets(): void {
  if (typeof window !== "undefined") {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("aptos_wallet")) {
        localStorage.removeItem(key)
      }
    })
    console.log("All Aptos wallets cleared from local storage.")
  }
}

// Get user profile from blockchain
export async function getUserProfile(
  wallet: AptosWallet
): Promise<{ success: boolean; profile?: HealthProfile; error?: string }> {
  try {
    const privateKey = new Ed25519PrivateKey(wallet.privateKey)
    const account = Account.fromPrivateKey({ privateKey })

    const payload = {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::view_profile` as `${string}::${string}::${string}`,
      functionArguments: [account.accountAddress.toString()],
    }

    const result = await aptos.view({ payload })

    if (!Array.isArray(result) || result.length < 7) {
      console.error("Invalid data structure from view_profile:", result)
      return {
        success: false,
        error: "Invalid data structure returned from blockchain",
      }
    }

    const [
      name,
      age,
      gender,
      chronicConditions,
      preferredWalkTime,
      pollutionSensitivity,
      location,
    ] = result

    const profile: HealthProfile = {
      name: String(name || ""),
      age: Number(age || 0),
      gender: String(gender || ""),
      chronicCondition: Array.isArray(chronicConditions) ? chronicConditions.map(String) : [],
      preferredWalkTime: String(preferredWalkTime || ""),
      pollutionSensitivity: String(pollutionSensitivity || ""),
      location: String(location || ""),
    }

    return { success: true, profile }
  } catch (error) {
    console.warn("Caught error in getUserProfile:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (
      errorMessage.includes("Failed to parse") ||
      errorMessage.includes("Per anonym") ||
      errorMessage.includes("profile not found")
    ) {
      return { success: false, error: "Profile not found or access denied." }
    }

    return {
      success: false,
      error: "An unexpected error occurred while fetching the profile.",
    }
  }
}

// Check if user has a profile
export async function hasUserProfile(
  wallet: AptosWallet
): Promise<{ success: boolean; hasProfile?: boolean; error?: string }> {
  try {
    const privateKey = new Ed25519PrivateKey(wallet.privateKey)
    const account = Account.fromPrivateKey({ privateKey })

    const payload = {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::has_profile` as `${string}::${string}::${string}`,
      functionArguments: [account.accountAddress.toString()],
    }

    const result = await aptos.view({ payload })

    if (!Array.isArray(result) || typeof result[0] !== "boolean") {
      console.error("Invalid data from has_profile:", result)
      return {
        success: false,
        error: "Invalid data type returned from has_profile",
      }
    }

    return { success: true, hasProfile: result[0] }
  } catch (error) {
    console.warn("Caught error in hasUserProfile:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (
      errorMessage.includes("Failed to parse") ||
      errorMessage.includes("Per anonym") ||
      errorMessage.includes("profile not found")
    ) {
      return { success: true, hasProfile: false }
    }

    return {
      success: false,
      error: "An unexpected error occurred while checking the profile.",
    }
  }
}
