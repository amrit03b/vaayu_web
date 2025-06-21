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
      const wallet = JSON.parse(stored)
      console.log(`Wallet retrieved for user ${userId}:`, wallet.address)
      return wallet
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
  }
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

// Get user profile from blockchain
export async function getUserProfile(
  wallet: AptosWallet
): Promise<{ success: boolean; profile?: HealthProfile; error?: string }> {
  try {
    const privateKey = new Ed25519PrivateKey(wallet.privateKey);
    const account = Account.fromPrivateKey({ privateKey });
    
    // Call the view_profile function to get profile data
    const payload = {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::view_profile` as `${string}::${string}::${string}`,
      functionArguments: [account.accountAddress.toString()],
    };

    const result = await aptos.view({payload});
    
    // The view_profile function returns a tuple, which the SDK returns as a flat array of values.
    const [name, age, gender, chronicConditions, preferredWalkTime, pollutionSensitivity, location] = result as [string, number, string, string[], string, string, string];
    
    const profile: HealthProfile = {
      name,
      age,
      gender,
      chronicCondition: chronicConditions,
      preferredWalkTime,
      pollutionSensitivity,
      location,
    };
    
    return {
      success: true,
      profile,
    };
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Check if user has a profile
export async function hasUserProfile(
  wallet: AptosWallet
): Promise<{ success: boolean; hasProfile?: boolean; error?: string }> {
  try {
    const privateKey = new Ed25519PrivateKey(wallet.privateKey);
    const account = Account.fromPrivateKey({ privateKey });
    
    const payload = {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::has_profile` as `${string}::${string}::${string}`,
      functionArguments: [account.accountAddress.toString()],
    };

    const result = await aptos.view({payload});

    return {
      success: true,
      hasProfile: result[0] as boolean,
    };
  } catch (error) {
    console.error("Failed to check user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// For development: clear all wallets from local storage
export function clearAllWallets(): void {
  if (typeof window !== "undefined") {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("aptos_wallet")) {
        localStorage.removeItem(key);
      }
    });
    console.log("All Aptos wallets cleared from local storage.");
  }
}
