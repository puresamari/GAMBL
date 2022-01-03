import { TypeDef } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { FC } from "react";

import { Gambl } from "../utils/gambl";
import { AccountLink } from "./account-link";

export type WheelOfFortuneBetData = TypeDef<
  {
    name: "wheelOfFortuneBet";
    type: {
      kind: "struct";
      fields: [
        {
          name: "author";
          type: "publicKey";
        },
        {
          name: "game";
          type: "publicKey";
        },
        {
          name: "timestamp";
          type: "i64";
        },
        {
          name: "value";
          type: "i8";
        }
      ];
    };
  },
  Gambl
>;

export const BetPreview: FC<{
  account: WheelOfFortuneBetData;
  publicKey?: PublicKey;
}> = ({ account, publicKey }) => {
  const wallet = useWallet();
  const yours =
    account?.author &&
    account?.author?.toBase58() === wallet?.publicKey?.toBase58();
  return (
    <figure className={`font-mono with-caption ${yours ? "border-pink" : ""}`}>
      {yours && <figcaption className="bg-pink">Your bet</figcaption>}
      Bet address:{" "}
      {publicKey && (
        <>
          <AccountLink publicKey={publicKey} />
          <br />
        </>
      )}
      {account?.author && (
        <>
          author: <AccountLink publicKey={account.author} />
          <br />
        </>
      )}
      <br />
      timestamp: {new Date(account.timestamp.toNumber() * 1e3).toISOString()}
      <br />
      value: {1} GAMBL
    </figure>
  );
};
