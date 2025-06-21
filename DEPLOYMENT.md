# Aptos Contract Deployment Guide

## Step 1: Compile the Contract

```bash
# Make sure you're in the project root
cd /path/to/vaayu

# Compile the Move contract
aptos move compile
```

## Step 2: Deploy to Devnet

### Option A: Using Aptos CLI (Recommended)

```bash
# Initialize Aptos CLI (if not already done)
aptos init --profile default --network devnet

# Deploy the contract
aptos move publish --named-addresses onboarding=default --profile default
```

### Option B: Using Remix

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Install the Aptos plugin
3. Upload your `sources/onboarding.move` file
4. Compile and deploy to Aptos devnet

### Option C: Using the Deployment Script

```bash
# Install dependencies if needed
npm install

# Run the deployment script
node scripts/deploy.js
```

## Step 3: Update Contract Address

After deployment, you'll get a contract address. Update it in your app:

```javascript
// In your app initialization (e.g., _app.tsx or a config file)
import { setContractAddress } from '@/lib/aptos'

// Replace with your actual deployed contract address
setContractAddress('0xYOUR_DEPLOYED_CONTRACT_ADDRESS')
```

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Log in with Civic
3. Navigate to onboarding
4. Fill out the form and submit
5. Check the browser console for transaction details

## Step 5: Verify on Aptos Explorer

1. Go to [Aptos Explorer](https://explorer.aptoslabs.com/)
2. Search for your transaction hash
3. Verify the profile data was stored correctly

## Troubleshooting

### Common Issues:

1. **"Module not found" error**: Make sure the contract is compiled and deployed
2. **"Insufficient gas" error**: Fund your wallet with more APT
3. **"Invalid address" error**: Check that the contract address is correct

### Testing Commands:

```bash
# Check if contract is deployed
aptos move view --function-id '0xYOUR_ADDRESS::onboarding::has_profile' --args '0xUSER_ADDRESS'

# Get user profile
aptos move view --function-id '0xYOUR_ADDRESS::onboarding::get_profile' --args '0xUSER_ADDRESS'
```

## Production Deployment

For production, deploy to mainnet:

```bash
aptos init --profile mainnet --network mainnet
aptos move publish --named-addresses onboarding=mainnet --profile mainnet
```

Remember to update the node URL in `lib/aptos.ts` to mainnet:
```javascript
const APTOS_NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1"
``` 