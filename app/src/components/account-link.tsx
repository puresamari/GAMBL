import React, { FC } from "react";
import { PublicKey } from "@solana/web3.js";
import { useNetwork } from "../utils/network";

export const AccountLink: FC<{ publicKey: PublicKey }> = ({ publicKey }) => {
  const [network] = useNetwork();
  if (network === "local") {
    return <p className="inline font-mono text-pink">{publicKey.toBase58()}</p>;
  }
  return (
    <a
      href={`https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=${network}`}
      target="_blank"
      rel="noreferrer"
      className="text-pink underline hover:no-underline"
    >
      {publicKey.toBase58()}
    </a>
  );
};
