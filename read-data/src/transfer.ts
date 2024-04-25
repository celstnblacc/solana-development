import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { checkBalance } from "./check-balance";

const LAMPORTS_PER_SOL = 1000000000;
const LAMPORTS_TO_SEND = 50000;

// Get the arguments
// recipient D9hAUozg9ZA3bWQwnMdJi5sLEh53LqJqByet6rtzYSzC devnet
const recipientPublicKey = process.argv[2] || null;
const networkType = process.argv[3] || "devnet";

if (!recipientPublicKey) {
  console.error("Error: Please provide a recipient public key.");
  process.exit(1);
}

console.log(`✅ Recipient PublicKey: ${recipientPublicKey}`);

// Get the sender's keypair
const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

if (!senderKeypair) {
  console.error("Error: SECRET_KEY environment variable is not set.");
  process.exit(1);
}

const senderPublicKey = senderKeypair.publicKey.toBase58();
console.log(`✅ Sender public key: ${senderPublicKey}`);

// Create a connection
const rpcUrl = `https://api.${networkType}.solana.com`;
const connection = new Connection(rpcUrl, "confirmed");
console.log(`✅ Connected to ${rpcUrl}`);

const minimumSOL = LAMPORTS_TO_SEND / LAMPORTS_PER_SOL;

// Check the balance of the recipient to ensure they have enough SOL
checkBalance(senderPublicKey, networkType, minimumSOL)
  .then(([balance, _, isValid]) => {
    console.log(`Balance: ${balance} SOL`);

    if (isValid) {
      console.log("✅ Balance is sufficient for the transaction.");

      // Create a transaction to send SOL
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: new PublicKey(recipientPublicKey),
          lamports: LAMPORTS_TO_SEND,
        })
      );

      // Attempt to send the transaction
      return sendAndConfirmTransaction(connection, transaction, [
        senderKeypair,
      ]);
    } else {
      throw new Error("Insufficient funds for the transaction.");
    }
  })
  .then((transactionSignature) => {
    console.log(
      `✅ Transaction successful with signature: ${transactionSignature}`
    );
  })
  .catch((error) => {
    console.error("Failed to send SOL:", error);
  });
