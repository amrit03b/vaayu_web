const { AptosClient, AptosAccount, TxnBuilderTypes, BCS } = require("@aptos-labs/ts-sdk");
const fs = require("fs");
const path = require("path");

async function deployContract() {
  // Initialize Aptos client for devnet
  const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");
  
  // Generate a new account for deployment
  const account = AptosAccount.generate();
  
  console.log("Generated account address:", account.accountAddress.toString());
  console.log("Private key:", account.privateKey.toString());
  
  // Fund the account (you'll need to do this manually or use a faucet)
  console.log("\nPlease fund this account with at least 0.2 APT from the devnet faucet:");
  console.log("https://aptoslabs.com/testnet-faucet");
  console.log("Account address:", account.accountAddress.toString());
  
  // Read the compiled module
  const modulePath = path.join(__dirname, "../build/onboarding_move/bytecode_modules/onboarding.mv");
  
  if (!fs.existsSync(modulePath)) {
    console.error("Module not found. Please compile the contract first:");
    console.error("aptos move compile");
    return;
  }
  
  const moduleData = fs.readFileSync(modulePath);
  
  // Create the transaction payload
  const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
    new TxnBuilderTypes.EntryFunction(
      new TxnBuilderTypes.ModuleId(
        new TxnBuilderTypes.AccountAddress(account.accountAddress.address),
        new TxnBuilderTypes.Identifier("code")
      ),
      new TxnBuilderTypes.Identifier("publish_module"),
      [],
      [moduleData]
    )
  );
  
  // Get the current sequence number
  const sequenceNumber = await client.getAccountSequenceNumber(account.accountAddress);
  
  // Create the transaction
  const transaction = new TxnBuilderTypes.TransactionUser(
    new TxnBuilderTypes.AccountAddress(account.accountAddress.address),
    BigInt(sequenceNumber),
    payload,
    BigInt(2000), // max gas amount
    BigInt(100), // gas unit price
    BigInt(Math.floor(Date.now() / 1000) + 10), // expiration timestamp
    new TxnBuilderTypes.ChainId(1) // devnet chain ID
  );
  
  // Sign and submit the transaction
  const signature = account.sign(transaction);
  const authenticator = new TxnBuilderTypes.TransactionAuthenticatorEd25519(
    new TxnBuilderTypes.Ed25519PublicKey(account.publicKey.toUint8Array()),
    new TxnBuilderTypes.Ed25519Signature(signature.toUint8Array())
  );
  
  const signedTransaction = new TxnBuilderTypes.SignedTransaction(transaction, authenticator);
  
  try {
    const result = await client.submitTransaction(signedTransaction);
    console.log("\nTransaction submitted successfully!");
    console.log("Transaction hash:", result.hash);
    console.log("Module address:", account.accountAddress.toString());
    
    // Wait for transaction to be committed
    await client.waitForTransaction(result.hash);
    console.log("Transaction committed!");
    
    // Save deployment info
    const deploymentInfo = {
      moduleAddress: account.accountAddress.toString(),
      privateKey: account.privateKey.toString(),
      transactionHash: result.hash,
      deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(__dirname, "../deployment.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("\nDeployment info saved to deployment.json");
    
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

deployContract().catch(console.error); 