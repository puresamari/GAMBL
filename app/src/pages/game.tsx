import { web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { AccountLink } from "../components/account-link";
import { useGame } from "../utils/api/game";
import { useBets } from "../utils/api/bets";
import { useWorkspace } from "../utils/workspace";
import { BetPreview } from "../components/bet-preview";

export const Game: FC = () => {
  const { game_id } = useParams();
  const game = useGame(game_id);
  const bets = useBets(game_id);

  const wallet = useWallet();

  const [transactionError, setTransactionError] = useState<
    unknown | undefined
  >();

  const workspace = useWorkspace();

  return (
    <>
      <div className="flex flex-row items-start  sticky top-0">
        <Link
          className="-mt-4 -ml-4 bg-black px-4 border-x border-b mr-auto"
          to="/games"
        >
          {"<"} Back
        </Link>
      </div>
      {transactionError && (
        <p className="text-red-500">{transactionError + ""}</p>
      )}
      {game && (
        <>
          <AccountLink publicKey={game.publicKey} />
          <br />
          {wallet.publicKey && workspace && (
            <button
              onClick={async () => {
                try {
                  // const game = web3.Keypair.generate();

                  const bet = web3.Keypair.generate();

                  await workspace.program.rpc.makeBet(game.publicKey, 10, {
                    accounts: {
                      bet: bet.publicKey,
                      author: workspace.provider.wallet.publicKey,
                      systemProgram: web3.SystemProgram.programId
                    },
                    signers: [bet]
                  });

                  // Fetch the account details of the created tweet.
                  const betAccount = await workspace.program.account.wheelOfFortuneBet.fetch(
                    bet.publicKey
                  );
                  console.log(betAccount);
                } catch (err) {
                  console.error("Transaction error: ", err);
                  setTransactionError(err);
                }
              }}
            >
              Bet on this game
            </button>
          )}
          <hr className="my-4" />
          <h1>This game's bets</h1>
          {bets &&
            bets.map((v) => <BetPreview key={v.publicKey.toBase58()} {...v} />)}
        </>
      )}
    </>
  );
  // const workspace = useWorkspace();
  // const [games, setGames] = useState<
  //   { publicKey: PublicKey; account: WheelOfFortuneData }[]
  // >();

  // useEffect(() => {
  //   if (!workspace) {
  //     return;
  //   }
  //   let active = true;
  //   load();
  //   return () => {
  //     active = false;
  //   };

  //   async function load() {
  //     setGames(undefined); // this is optional
  //     const res = await workspace?.program.account.wheelOfFortune.all([]);
  //     // program.account.wheelOfFortune
  //     //   .subscribe()
  //     //   .on("change", (v) => console.log(v));
  //     console.log(res);
  //     if (!active) {
  //       return;
  //     }
  //     setGames(res as any);
  //   }
  // }, [workspace]);

  // return (
  //   <>
  //     <p>History</p>
  //     {games === undefined
  //       ? "Loading…"
  //       : games.map(({ publicKey, account }) => (
  //           <GamePreview
  //             key={publicKey.toBase58()}
  //             {...account}
  //             publicKey={publicKey}
  //           />
  //         ))}
  //   </>
  // );
};
