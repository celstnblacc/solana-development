import { checkBalance } from "./src/check-balance";
import { Connection, PublicKey } from '@solana/web3.js';
import * as configModule from './config';

// Mock the entire module

// beforeEach(() => {
//   jest.mock('@solana/web3.js', () => {
//       const originalModule = jest.requireActual('@solana/web3.js');
//       return {
//         ...originalModule,
//         Connection: jest.fn().mockImplementation(() => ({
//           getRecentBlockhash: jest.fn().mockResolvedValue({ feeCalculator: { lamportsPerSignature: 5000 } }),
//           getBalance: jest.fn().mockResolvedValue(10000000000) // 10 SOL
//         })),
//         PublicKey: jest.fn().mockImplementation((key) => ({ toBase58: () => key }))
//       };
//     });
// });

describe('checkBalance', () => {
    // const mockPublicKey = 'CnFk4RWKGnq8X7K4iYkpH7MTsiHAJd9kQQruCndF4KXS';
    const mockNetworkType = 'devnet';
    const minimumSOL = 1;

    test('throws an error if no public key is provided', async () => {
        await expect(checkBalance('', mockNetworkType, minimumSOL))
            .rejects
            .toThrow("Provide a public key to check the balance of!");
    });

    test('returns correct balance and sufficiency information', async () => {
        const publicKeyUsed = configModule.getPublicKeyFromArgs();
        const [balanceInSOL, balanceRequired, isSufficient] = await checkBalance(publicKeyUsed, mockNetworkType, minimumSOL);
        expect(balanceInSOL >= balanceRequired).toBe(true);
        expect(isSufficient).toBe(true);
    });
});

