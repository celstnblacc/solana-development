import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// Function to check the balance of a given public key on Solana's blockchain
export async function checkBalance(suppliedPublicKey: string, networkType: string, minimumSOL: number): Promise<[number, number, boolean]> {

    if (!suppliedPublicKey) {
      throw new Error("Provide a public key to check the balance of!");
    }
    console.log(`✅ Supplied public key: ${suppliedPublicKey}`);

    
    try {
        // Adjust the URL
        const rpcUrl = `https://api.${networkType}.solana.com`;
        const connection = new Connection(rpcUrl, "confirmed");
        console.log(`✅ Connected to ${rpcUrl}`);

        // Fetch recent blockhash to calculate fee
        // https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getLatestBlockhash
        //v

        // Get the fee the network will charge for a particular Message
        // -https://solana.com/docs/rpc/http/getfeeformessage
        const { blockhash, lastValidBlockHeight, feeCalculator  } = await connection.getLatestBlockhash();
        const lamportsFeeForTransaction = feeCalculator.lamportsPerSignature;

        // Get balance in SOL of supplied public key
        const publicKey = new PublicKey(suppliedPublicKey);
        const balanceInLamports = await connection.getBalance(publicKey);
        const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

        console.log(`✅ Finished! The balance for the wallet at address ${publicKey.toBase58()} is ${balanceInSOL} SOL.`);

        const minimumLamportsNeededPlusFee = (minimumSOL * LAMPORTS_PER_SOL) + lamportsFeeForTransaction
        console.log(`minimum lamports needed: ${minimumSOL * LAMPORTS_PER_SOL}`);
        console.log(`minimumLamportsNeededPlusFee: ${minimumLamportsNeededPlusFee}`);

        const balanceRequired = minimumLamportsNeededPlusFee / LAMPORTS_PER_SOL;
        return [balanceInSOL, balanceRequired, balanceInLamports >= minimumLamportsNeededPlusFee];
        
    } catch (error) {
        console.error("Failed to get balance:", error);
        throw error;  // Rethrow error to be handled by the caller   
    }
}

if (require.main === module) {
    const suppliedPublicKey = process.argv[2];
    if (!suppliedPublicKey) {
        console.error("Error: No public key provided.");
        process.exit(1);
    }

    // mainnet-beta, devnet, testnet
    const networkType = process.argv[3] || "devnet";
    console.log(`✅ Checking balance for: ${suppliedPublicKey} on ${networkType}`);

    const minimumSOL = 1; 
    checkBalance(suppliedPublicKey, networkType, minimumSOL)
        .then(([balance, balanceRequired, _]) => {
          console.log(`✅ Balance in SOL required: ${balanceRequired} SOL`);
          console.log(`✅ Balance of ${suppliedPublicKey} in SOL: ${balance} SOL`);
          if (balance > balanceRequired) 
              console.log(`✅Balance is sufficient`);
            else 
              console.log(`❌Balance is insufficient`);
          
        })
        .catch(console.error);
}
