import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import React, { FC } from "react";

export interface IGamePreviewData {
  timestamp: BN;
  value: number;
}

export const GamePreview: FC<IGamePreviewData & { publicKey?: PublicKey }> = ({
  timestamp,
  value,
  publicKey
}) => (
  <p className="border p-2">
    Active game{" "}
    {publicKey && <span className="text-pink">{publicKey.toBase58()}</span>}:
    <br />
    timestamp: {new Date(timestamp.toNumber() * 1e3).toISOString()}
    <br />
    value: {value}
  </p>
);
