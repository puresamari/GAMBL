import { BN, ProgramAccount, web3 } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

import { WheelOfFortuneBetData } from '../gambl';
import { findAssociatedTokenAddress } from '../spl';
import { Workspace } from '../workspace';
import { GetStaticTokenInfoValue } from './../spl';

export const MakeBet = async (
  workspace: Workspace,
  game: PublicKey,
  amount: BN
): Promise<ProgramAccount<WheelOfFortuneBetData> | undefined> => {
  // const game = web3.Keypair.generate();
  if (!workspace) { return; }

  const tokenInfo = GetStaticTokenInfoValue();

  const tokenAddress = await findAssociatedTokenAddress(workspace.program.provider.wallet.publicKey, tokenInfo);

  const bet = web3.Keypair.generate();

  await workspace.program.rpc.makeBet(game, 10, amount, {
    accounts: {
      bet: bet.publicKey,
      author: workspace.program.provider.wallet.publicKey,
      authorToken: tokenAddress,
      receiverToken: tokenInfo.token_account,

      // sender: program.provider.wallet.publicKey,
      mint: tokenInfo.mint_address,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [bet]
  });

  return {
    publicKey: bet.publicKey,
    account: await workspace.program.account.wheelOfFortuneBet.fetch(
      bet.publicKey
    )
  };
};