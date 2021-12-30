import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import * as assert from "assert";

import { Gambl } from '../target/types/gambl';

describe('Game', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Gambl as Program<Gambl>;

  it('Can create a wheel of fortune game', async () => {
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
    const gameAccount = await program.account.wheelOfFortune.fetch(game.publicKey);

    // Ensure it has the right data.
    assert.equal(gameAccount.value, 0);
    assert.ok(gameAccount.timestamp);
  });

  it('Can create a wheel of fortune game from a different author', async () => {
    // Generate another user and airdrop them some SOL.
    const otherUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);

    const game = anchor.web3.Keypair.generate();
    await program.rpc.startGame({
      accounts: {
        game: game.publicKey,
        author: otherUser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [game, otherUser],
    });

    // Fetch the account details of the created tweet.
    const gameAccount = await program.account.wheelOfFortune.fetch(game.publicKey);

    // Ensure it has the right data.
    assert.equal(gameAccount.value, 0);
    assert.ok(gameAccount.timestamp);
  });

});
