import * as web3 from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

async function sendPingTransaction() {
  const transaction = new web3.Transaction();
  const programId = new web3.PublicKey(
    "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
  );
  const pingProgramDataId = new web3.PublicKey(
    "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
  );

  const apiURL = web3.clusterApiUrl("devnet");
  alert(`clusterApiUrl: ${apiURL}`);

  transaction.add(
    new web3.TransactionInstruction({
      keys: [{ pubkey: pingProgramDataId, isSigner: false, isWritable: true }],
      programId,
    })
  );

  const payer = getKeypairFromEnvironment("SECRET_KEY");

  const connection = new web3.Connection(apiURL, "confirmed");

  try {
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [payer]
    );
    console.log(`✅ Transaction completed! Signature is ${signature}`);
  } catch (error) {
    console.error("❌ Failed to send transaction:", error);
  }
}

sendPingTransaction().catch(console.error);
