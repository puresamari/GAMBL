import React, { FC, useEffect, useMemo, useState } from "react";

import { useWorkspace } from "../utils/workspace";
import { WheelOfFortuneData, GamePreview } from "../components/game/preview";
import { PublicKey } from "@solana/web3.js";

export const Games: FC = () => {
  const workspace = useWorkspace();
  const [games, setGames] = useState<
    { publicKey: PublicKey; account: WheelOfFortuneData }[]
  >();

  useEffect(() => {
    if (!workspace) {
      return;
    }
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      setGames(undefined); // this is optional
      const res = await workspace?.program.account.wheelOfFortune.all([]);
      // program.account.wheelOfFortune
      //   .subscribe()
      //   .on("change", (v) => console.log(v));
      console.log(res);
      if (!active) {
        return;
      }
      setGames(res as any);
    }
  }, [workspace]);

  return (
    <>
      <p>History</p>
      {games === undefined
        ? "Loading…"
        : games.map(({ publicKey, account }) => (
            <GamePreview
              key={publicKey.toBase58()}
              {...account}
              publicKey={publicKey}
            />
          ))}
    </>
  );
};