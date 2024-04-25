import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  TransactionSignature,
  // TransactionInstruction,
} from "@solana/web3.js";
import { FC, useCallback, useState } from "react";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
// import '../styles/globals.css'

export const SendTransaction: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [amountToSend, setAmountToSend] = useState("");
  const [addressToSend, setAddressToSend] = useState("");

  const LAMPORTS_PER_SOL = 1000000000; // This is a constant, consider moving it outside of the component

  const handleAmountToSendChange = (event) => {
    setAmountToSend(event.target.value);
  };

  const handleAddressToSendChange = (event) => {
    setAddressToSend(event.target.value);
  };

  const onClick = useCallback(async () => {
    if (!amountToSend.trim() || !addressToSend.trim()) {
      alert(
        `Please fill in both fields \namountToSend: ${amountToSend} \naddressToSend: ${addressToSend}`
      );
      return;
    }

    if (!connection) {
      console.error("Connection not available");
      return;
    }

    if (!publicKey) {
      console.error("Wallet not connected!");
      return;
    }

    let signature: TransactionSignature = "";
    try {
      const toPubkey = new PublicKey(addressToSend);
      const lamportsToSend = Number(amountToSend) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey,
          lamports: lamportsToSend,
        })
      );

      signature = await sendTransaction(transaction, connection);
      console.info("info", "Transaction sent:", signature);

      await connection.confirmTransaction(signature, "processed");
      alert(`Transaction successful\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (error: any) {
      console.error(
        "error",
        `Transaction failed! ${error?.message}`,
        signature
      );
      return;
    }
  }, [amountToSend, addressToSend, publicKey, , sendTransaction]);

  return (
    <div>
      <div>
        {/* Input text field for amount */}
        <input
          type="text"
          value={amountToSend}
          onChange={handleAmountToSendChange}
          placeholder="Enter amount in SOL here"
          style={{ marginBottom: '20px', width: '300px', height: '40px' }}
        />
      </div>
      <span></span>
      <div>
        {/* Input text field for address */}
        <input
          type="text"
          value={addressToSend}
          onChange={handleAddressToSendChange}
          placeholder="Enter the recipient's address here"
          style={{ marginBottom: '20px', width: '300px', height: '40px' }}
        />
      </div>
      <span></span>
      <div style={{ textAlign: 'center', height: '100px' }}>
        {/* Button to send data */}
        <button onClick={onClick} disabled={!publicKey} style={{ width: '300px', height: '40px' }}>
          Send
        </button>
      </div>
    </div>
  );
};
