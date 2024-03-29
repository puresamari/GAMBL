import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { clusterApiUrl, Connection, Keypair, Transaction, SystemProgram } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, MintLayout, AccountLayout } from "@solana/spl-token";

import * as assert from "assert";

import { Gambl } from '../target/types/gambl';

// TODO: Test error cases

describe('Bet', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Gambl as Program<Gambl>;

  let mint;
  let sender_token;

  it('setup mints and token accounts', async () => {
    mint = Keypair.generate();

    let create_mint_tx = new Transaction().add(
      // create mint account
      SystemProgram.createAccount({
        fromPubkey: program.provider.wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MintLayout.span,
        lamports: await Token.getMinBalanceRentForExemptMint(program.provider.connection),
        programId: TOKEN_PROGRAM_ID,
      }),
      // init mint account
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        mint.publicKey, // mint pubkey
        6, // decimals
        program.provider.wallet.publicKey, // mint authority
        program.provider.wallet.publicKey // freeze authority (if you don't need it, you can set `null`)
      )
    );

    await program.provider.send(create_mint_tx, [mint]);
    // Add your test here.
    // const tx = await program.rpc.initialize({});
    // console.log("Your transaction signature", tx);
    // console.log(await program.provider.connection.getParsedAccountInfo(mint));
    sender_token = Keypair.generate();
    let create_sender_token_tx = new Transaction().add(
      // create token account
      SystemProgram.createAccount({
        fromPubkey: program.provider.wallet.publicKey,
        newAccountPubkey: sender_token.publicKey,
        space: AccountLayout.span,
        lamports: await Token.getMinBalanceRentForExemptAccount(program.provider.connection),
        programId: TOKEN_PROGRAM_ID,
      }),
      // init mint account
      Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        mint.publicKey, // mint
        sender_token.publicKey, // token account
        program.provider.wallet.publicKey // owner of token account
      )
    );

    await program.provider.send(create_sender_token_tx, [sender_token]);

    let mint_tokens_tx = new Transaction().add(
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        mint.publicKey, // mint
        sender_token.publicKey, // receiver (sholud be a token account)
        program.provider.wallet.publicKey, // mint authority
        [], // only multisig account will use. leave it empty now.
        2e6 // amount. if your decimals is 8, you mint 10^8 for 1 token.
      )
    );

    await program.provider.send(mint_tokens_tx);

    // console.log("token balance: ", await program.provider.connection.getTokenAccountBalance(sender_token.publicKey));
  });

  it('Can bet on wheel of fortune game ', async () => {

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

    const bet = anchor.web3.Keypair.generate();
    const receiver = bet;
    const receiver_token = Keypair.generate();

    let create_receiver_token_tx = new Transaction().add(
      // create token account
      SystemProgram.createAccount({
        fromPubkey: program.provider.wallet.publicKey,
        newAccountPubkey: receiver_token.publicKey,
        space: AccountLayout.span,
        lamports: await Token.getMinBalanceRentForExemptAccount(program.provider.connection),
        programId: TOKEN_PROGRAM_ID,
      }),
      // init mint account
      Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        mint.publicKey, // mint
        receiver_token.publicKey, // token account
        receiver.publicKey // owner of token account
      )
    );

    await program.provider.send(create_receiver_token_tx, [receiver_token]);

    // console.log({
    //   bet: bet.publicKey,
    //   author: program.provider.wallet.publicKey,
    //   authorToken: sender_token.publicKey,
    //   receiverToken: receiver_token.publicKey,

    //   // sender: program.provider.wallet.publicKey,
    //   mint: mint.publicKey,
    //   tokenProgram: TOKEN_PROGRAM_ID,
    //   systemProgram: anchor.web3.SystemProgram.programId,
    // })

    assert.equal(await (await program.provider.connection.getTokenAccountBalance(sender_token.publicKey)).value.uiAmount, 2);
    assert.equal(await (await program.provider.connection.getTokenAccountBalance(receiver_token.publicKey)).value.uiAmount, 0);

    await program.rpc.makeBet(game.publicKey, 10, new anchor.BN(1e6), {
      accounts: {
        bet: bet.publicKey,
        author: program.provider.wallet.publicKey,
        authorToken: sender_token.publicKey,
        receiverToken: receiver_token.publicKey,

        // sender: program.provider.wallet.publicKey,
        mint: mint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [bet],
    });

    assert.equal(await (await program.provider.connection.getTokenAccountBalance(sender_token.publicKey)).value.uiAmount, 1);
    assert.equal(await (await program.provider.connection.getTokenAccountBalance(receiver_token.publicKey)).value.uiAmount, 1);

    // Fetch the account details of the created tweet.
    const betAccount = await program.account.wheelOfFortuneBet.fetch(bet.publicKey);

    // Ensure it has the right data.
    assert.equal(betAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(betAccount.game.toBase58(), game.publicKey.toBase58());
    assert.equal(betAccount.bet.toNumber(), new anchor.BN(1e6).toNumber());
    assert.equal(betAccount.value, 10);
    assert.ok(betAccount.timestamp);
  });

});
