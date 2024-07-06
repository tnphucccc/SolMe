import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

// Function to create a wallet and return the public key and wallet address
export function createWallet() {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = Buffer.from(keypair.secretKey).toString("hex");

  return { publicKey, secretKey };
}

// Function to show the transaction history of a wallet
export async function getTransactionHistory(walletAddress: string) {
  const connection = new Connection(clusterApiUrl("testnet"));
  const publicKey = new PublicKey(walletAddress);
  const transactionSignatures = await connection.getSignaturesForAddress(
    publicKey
  );

  console.log(`Transaction history for ${walletAddress}:`);
  for (const signatureInfo of transactionSignatures) {
    const transaction = await connection.getTransaction(
      signatureInfo.signature
    );
    console.log(`Signature: ${signatureInfo.signature}`);
    console.log(`Slot: ${transaction?.slot}`);
    console.log(`Result: ${transaction?.meta?.err ? "Error" : "Success"}`);
    console.log(`Fee: ${transaction?.meta?.fee}`);
    console.log("--------------------------------------");
  }
}

// Function to make a transaction
export async function makeTransaction(
  fromSecretKey: Uint8Array,
  toWalletAddress: string,
  amount: number
) {
  const connection = new Connection(clusterApiUrl("testnet"));
  const fromKeypair = Keypair.fromSecretKey(fromSecretKey);
  const toPublicKey = new PublicKey(toWalletAddress);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPublicKey,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    fromKeypair,
  ]);
  console.log(`Transaction confirmed with signature: ${signature}`);
  return signature;
}

export async function displayBalance(walletAddress: string) {
  // Connect to the Solana testnet
  const connection = new Connection(clusterApiUrl("testnet"));

  try {
    // Convert the wallet address to a PublicKey
    const publicKey = new PublicKey(walletAddress);

    // Fetch the balance
    const balance = await connection.getBalance(publicKey);

    // Convert the balance from lamports to SOL
    const balanceInSol = balance / LAMPORTS_PER_SOL;

    // Display the balance
    console.log(`Balance for wallet ${walletAddress}: ${balanceInSol} SOL`);
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

// Example usage
async function main() {
  // Create a new wallet
  const { publicKey, secretKey } = createWallet();
  console.log("Public Key:", publicKey);
  console.log("Secret Key:", secretKey);

  // Display transaction history (replace with a valid wallet address)
  await getTransactionHistory(publicKey);

  // Make a transaction (replace with valid secret key and destination wallet address)
  // const fromSecretKey = Uint8Array.from(
  //   JSON.parse(readFileSync("wallet.json", "utf-8"))
  // );
  // const toWalletAddress = "DestinationWalletAddressHere";
  // await makeTransaction(fromSecretKey, toWalletAddress, 1); // 1 SOL
}

if (require.main === module) {
  main();
}
