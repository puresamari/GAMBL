import { BN } from "@project-serum/anchor";
import { TypeDef } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import { PublicKey } from "@solana/web3.js";
import React, { FC } from "react";
import { Gambl } from "../../utils/gambl";

export type WheelOfFortuneData = TypeDef<
  {
    name: "wheelOfFortune";
    type: {
      kind: "struct";
      fields: [
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

export const GamePreview: FC<
  WheelOfFortuneData & { publicKey?: PublicKey }
> = ({ timestamp, value, publicKey }) => {
  const isActive = value === 0;
  return (
    <figure
      className={`font-mono with-caption ${isActive ? "border-pink" : ""}`}
    >
      {isActive && <figcaption className="bg-pink">is active</figcaption>}
      Active game{" "}
      {publicKey && <span className="text-pink">{publicKey.toBase58()}</span>}:
      <br />
      timestamp: {new Date(timestamp.toNumber() * 1e3).toISOString()}
      <br />
      value: {value}
    </figure>
  );
};
