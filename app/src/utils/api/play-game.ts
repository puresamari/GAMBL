import { BN, ProgramAccount, web3 } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

import { WheelOfFortuneBetData, WheelOfFortuneData } from '../gambl';
import { findAssociatedTokenAddress } from '../spl';
import { Workspace } from '../workspace';
import { GetStaticTokenInfoValue } from '../spl';

export const PlayGame = async (
  workspace: Workspace,
  game: PublicKey
): Promise<ProgramAccount<WheelOfFortuneData> | undefined> => {
  // const game = web3.Keypair.generate();
  if (!workspace) { return; }

  // const tokenInfo = GetStaticTokenInfoValue();

  // const tokenAddress = await findAssociatedTokenAddress(workspace.program.provider.wallet.publicKey, tokenInfo);

  await workspace.program.rpc.play({
    accounts: {
      game: game,
      systemProgram: web3.SystemProgram.programId,
      // bet: bet.publicKey,
      // author: workspace.program.provider.wallet.publicKey,
      // authorToken: tokenAddress,
      // receiverToken: tokenInfo.token_account,

      // // sender: program.provider.wallet.publicKey,
      // mint: tokenInfo.mint_address,
      // tokenProgram: TOKEN_PROGRAM_ID,
      // systemProgram: web3.SystemProgram.programId,
    },
    signers: []
  });

  return {
    publicKey: game,
    account: await workspace.program.account.wheelOfFortune.fetch(
      game
    )
  };
};