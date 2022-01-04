import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { GetStaticNetworkValue, Network, useNetwork } from './network';

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

export type TokenInfo = {
  mint_address: PublicKey,
  token_account: PublicKey,
  // tokenMintAddress: PublicKey
};

const SPL_TOKEN_ADDRESSES: {
  [key in Network]: TokenInfo
} = {
  'devnet': {
    mint_address: new PublicKey('AcMsaHv3A9h3F7xZd8xWeha7YKpLNfWhMLAM1hUDnMGf'),
    token_account: new PublicKey('CLKjPL7octfarx5kf4RZ7dRgqDJ2CEJXR1VwbskHjWUg')
  },
  "mainnet-beta": {
    mint_address: new PublicKey('5strq6dAS5LGURu2LWtwzzao2QVMtmzNKZwsDZfGYv6T'),
    token_account: new PublicKey('BR1gidGgZ1MiT71NARXv6Rh1dxZDxty7c8cZYPYX2Hn3')
  },

  // TODO: Doesn't exist yet
  'testnet': {
    mint_address: new PublicKey('BR1gidGgZ1MiT71NARXv6Rh1dxZDxty7c8cZYPYX2Hn3'),
    token_account: new PublicKey('BR1gidGgZ1MiT71NARXv6Rh1dxZDxty7c8cZYPYX2Hn3')
  },
  // TODO: This is always going to change no?
  'local': {
    mint_address: new PublicKey('BR1gidGgZ1MiT71NARXv6Rh1dxZDxty7c8cZYPYX2Hn3'),
    token_account: new PublicKey('BR1gidGgZ1MiT71NARXv6Rh1dxZDxty7c8cZYPYX2Hn3')
  }
};

export const useToken = () => {
  const [game, setGame] = useState<TokenInfo | undefined>(undefined);
  const [network] = useNetwork();

  useEffect(() => {
    setGame(SPL_TOKEN_ADDRESSES[network]);
  }, [network]);

  return game;
};

export const GetStaticTokenInfoValue = (network: Network = GetStaticNetworkValue()) => SPL_TOKEN_ADDRESSES[network];

export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  info: TokenInfo
): Promise<PublicKey> {
  return (await PublicKey.findProgramAddress(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      info.mint_address.toBuffer(),
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  ))[0];
}

// async function findAssociatedTokenAddress(
//   walletAddress: PublicKey,
//   tokenMintAddress: PublicKey
// ): Promise<PublicKey> {
//   return (await PublicKey.findProgramAddress(
//     [
//       walletAddress.toBuffer(),
//       TOKEN_PROGRAM_ID.toBuffer(),
//       tokenMintAddress.toBuffer(),
//     ],
//     SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
//   ))[0];
// }