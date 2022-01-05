import { BN, web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { AccountLink } from "../components/account-link";
import { useGame } from "../utils/api/game";
import { useBets } from "../utils/api/bets";
import { MakeBet } from "../utils/api/make-bet";
import { useWorkspace } from "../utils/workspace";
import { BetPreview } from "../components/bet-preview";
import { LabelInput } from "../components/input/label-input";

export const Game: FC = () => {
  const { game_id } = useParams();
  const game = useGame(game_id);
  const bets = useBets(game_id);

  const wallet = useWallet();

  const [transactionError, setTransactionError] = useState<
    unknown | undefined
  >();

  const workspace = useWorkspace();
  const [bettingValue, setBettingValue] = useState(1);
  const [bettingCoins, setBettingCoins] = useState(0);

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
            <form
              className="border flex flex-col p-1 justify-start items-start"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const bet = await MakeBet(
                    workspace,
                    game.publicKey,
                    bettingValue,
                    new BN(bettingCoins * 1e9)
                  );
                } catch (err) {
                  console.error("Transaction error: ", err);
                  setTransactionError(err);
                }
              }}
            >
              <LabelInput
                className="mb-2"
                type="number"
                min={1}
                step={1}
                max={255}
                value={bettingValue}
                onChange={(e) => setBettingValue(parseInt(e.target.value))}
              >
                Value (on wheel)
              </LabelInput>
              <LabelInput
                className="mb-2"
                type="number"
                step={0.000000001}
                value={bettingCoins}
                onChange={(e) => setBettingCoins(parseFloat(e.target.value))}
              >
                Bet (GAMBL Coins):
              </LabelInput>
              <input className="flex" type="submit" value="Place bet" />
            </form>
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
