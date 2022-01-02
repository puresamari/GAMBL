import React, { FC, useEffect, useMemo, useState } from "react";

import { useWorkspace } from "../utils/workspace";
import { WheelOfFortuneData, GamePreview } from "../components/game/preview";
import { PublicKey } from "@solana/web3.js";
import { Link, useParams } from "react-router-dom";

export const Game: FC = () => {
  const { game_id } = useParams();
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
      <p>{game_id}</p>
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
