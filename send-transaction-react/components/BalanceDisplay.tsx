import {LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from "react";

export const BalanceDisplay: FC = ({}) => {
    const [balance, setBalance] = useState(0);
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [isValid, setIsValid] = useState(false);

    const validatePublicKey = (value) => {
      const publicKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{43}$/; // Regex for Solana public key
      setIsValid(publicKeyRegex.test(value));
    };

  useEffect(() => {
    if (!connection) {
      alert("ERROR: connection - invalid");
      return;
    }

    validatePublicKey(publicKey);
    if (!publicKey) {
      console.error("ERROR: public key invalid");
      return;
    }

    connection.getBalance(publicKey).then((balanceInLamports) => {
        const balanceInSOL =  parseFloat((balanceInLamports/LAMPORTS_PER_SOL).toFixed(4));
        console.log(`===== getBalance: ${balanceInSOL}`);
        setBalance(balanceInSOL);
      });

    // OR 
    
    // If to retrieves the complete account information, including the balance, owner, data, and more.
    // connection.getAccountInfo(publicKey).then((info) => {
    //   setBalance(info.lamports/ LAMPORTS_PER_SOL);
    // });
  }, [connection, publicKey]);

  return (
    <div>
      <p>{publicKey ? `Balance: ${balance} SOL` : ""}</p>
    </div>
  );
};
