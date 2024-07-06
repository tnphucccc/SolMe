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
export type TransactionHistory = {
  signature: string;
  slot: number | undefined;
  result: string;
  fee: number | undefined;
};

export async function getTransactionHistory(
  walletAddress: string
): Promise<TransactionHistory[]> {
  const connection = new Connection(clusterApiUrl("testnet"));
  const publicKey = new PublicKey(walletAddress);
  const transactionSignatures = await connection.getSignaturesForAddress(
    publicKey
  );

  const history: TransactionHistory[] = [];

  console.log(`Transaction history for ${walletAddress}:`);
  for (const signatureInfo of transactionSignatures) {
    const transaction = await connection.getTransaction(
      signatureInfo.signature
    );
    const transactionHistory: TransactionHistory = {
      signature: signatureInfo.signature,
      slot: transaction?.slot,
      result: transaction?.meta?.err ? "Error" : "Success",
      fee: transaction?.meta?.fee,
    };
    history.push(transactionHistory);
    console.log(`Signature: ${transactionHistory.signature}`);
    console.log(`Slot: ${transactionHistory.slot}`);
    console.log(`Result: ${transactionHistory.result}`);
    console.log(`Fee: ${transactionHistory.fee}`);
    console.log("--------------------------------------");
  }

  return history;
}

// Function to make a transaction
/**
 * Function to make a transaction
 * @param fromSecretKeyString - The secret key of the sender as a hex string
 * @param toWalletAddress - The public key (address) of the recipient
 * @param amount - The amount to send (in SOL)
 * @returns The transaction signature
 */
export async function makeTransaction(
  fromSecretKeyString: string,
  toWalletAddress: string,
  amount: number
) {
  const connection = new Connection(clusterApiUrl("testnet"));

  // Convert the secret key from a hex string to a Uint8Array
  const fromSecretKey = Uint8Array.from(
    Buffer.from(fromSecretKeyString, "hex")
  );
  const fromKeypair = Keypair.fromSecretKey(fromSecretKey);
  const toPublicKey = new PublicKey(toWalletAddress);

  // Create the transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPublicKey,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  // Send and confirm the transaction
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
    return balanceInSol;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return error;
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
