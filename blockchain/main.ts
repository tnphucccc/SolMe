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
import { writeFileSync, readFileSync } from "fs";

// Function to create a wallet and return the public key and wallet address
export function createWallet() {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = Buffer.from(keypair.secretKey).toString("hex");

  // Save the secret key to a file (optional)
  writeFileSync("wallet.json", JSON.stringify(Array.from(keypair.secretKey)));

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
    const transaction = await connection.getTransactions(
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

// Example usage
(async () => {
  // Create a new wallet
  const { publicKey, secretKey } = createWallet();
  console.log("Public Key:", publicKey);
  console.log("Secret Key:", secretKey);

  // Display transaction history (replace with a valid wallet address)
  await getTransactionHistory(publicKey);

  // Make a transaction (replace with valid secret key and destination wallet address)
  const fromSecretKey = Uint8Array.from(
    JSON.parse(readFileSync("wallet.json", "utf-8"))
  );
  const toWalletAddress = "DestinationWalletAddressHere";
  await makeTransaction(fromSecretKey, toWalletAddress, 1); // 1 SOL
})();