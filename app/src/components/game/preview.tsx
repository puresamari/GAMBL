import { TypeDef } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import { PublicKey } from "@solana/web3.js";
import React, { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Gambl } from "../../utils/gambl";
import { useNetwork } from "../../utils/network";
import { AccountLink } from "../account-link";
import { CursorShadow } from "../cursor-shadow";

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
  const navigate = useNavigate();
  return (
    <CursorShadow>
      <figure
        onClick={() => publicKey && navigate(`/games/${publicKey.toBase58()}`)}
        className={`${
          publicKey ? "cursor-pointer" : ""
        } font-mono with-caption ${isActive ? "border-pink" : ""}`}
      >
        {isActive && <figcaption className="bg-pink">is active</figcaption>}
        Active game: {publicKey && <AccountLink publicKey={publicKey} />}
        <br />
        timestamp: {new Date(timestamp.toNumber() * 1e3).toISOString()}
        <br />
        value: {value}
      </figure>
    </CursorShadow>
  );
};
