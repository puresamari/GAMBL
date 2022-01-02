import { BN } from "@project-serum/anchor";
import { TypeDef } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import { PublicKey } from "@solana/web3.js";
import React, { FC } from "react";
import { useNetwork } from "../../utils/network";
import { Gambl } from "../../utils/gambl";
import { Link } from "react-router-dom";

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
  const network = useNetwork();
  return (
    <figure
      className={`font-mono with-caption ${isActive ? "border-pink" : ""}`}
    >
      {isActive && <figcaption className="bg-pink">is active</figcaption>}
      {publicKey && (
        <Link
          className={`absolute right-0 top-0 border px-4 font-body text-sm ${
            isActive
              ? "border-pink hover:bg-pink"
              : "hover:bg-white hover:text-black"
          } `}
          to={`/games/${publicKey.toBase58()}`}
        >
          Open
        </Link>
      )}
      Active game{" "}
      {network && publicKey && (
        <a
          href={`https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=${
            network[0]
          }`}
          target="_blank"
          rel="noreferrer"
          className="text-pink underline hover:no-underline"
        >
          {publicKey.toBase58()}
        </a>
      )}
      <br />
      timestamp: {new Date(timestamp.toNumber() * 1e3).toISOString()}
      <br />
      value: {value}
    </figure>
  );
};
