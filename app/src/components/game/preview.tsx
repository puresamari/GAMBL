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
> = ({ timestamp, value, publicKey }) => (
  <p className="border p-2">
    Active game{" "}
    {publicKey && <span className="text-pink">{publicKey.toBase58()}</span>}:
    <br />
    timestamp: {new Date(timestamp.toNumber() * 1e3).toISOString()}
    <br />
    value: {value}
  </p>
);
