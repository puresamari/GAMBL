import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import * as assert from "assert";

import { Gambl } from '../target/types/gambl';

// TODO: Test error cases

describe('Play', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Gambl as Program<Gambl>;

  it('Can play on wheel of fortune game ', async () => {

    const game = anchor.web3.Keypair.generate();
    await program.rpc.startGame({
      accounts: {
        game: game.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [game],
    });

    // Fetch the account details of the created tweet.
    const gameAccountBefore = await program.account.wheelOfFortune.fetch(game.publicKey);

    // const bet = anchor.web3.Keypair.generate();
    // await program.rpc.makeBet(game.publicKey, 10, {
    //   accounts: {
    //     bet: bet.publicKey,
    //     author: program.provider.wallet.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //   },
    //   signers: [bet],
    // });

    // // Fetch the account details of the created tweet.
    // const betAccount = await program.account.wheelOfFortuneBet.fetch(bet.publicKey);

    await program.rpc.play({
      accounts: {
        game: game.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [],
    });
    const gameAccountAfter = await program.account.wheelOfFortune.fetch(game.publicKey);

    // Ensure it has the right data.
    assert.notEqual(gameAccountAfter.value, 0);
  });

});
