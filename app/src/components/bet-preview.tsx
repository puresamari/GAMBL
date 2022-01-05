import { BN } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { FC } from "react";

import { WheelOfFortuneBetData } from "../utils/gambl";
import { AccountLink } from "./account-link";

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
      bet on value: {account.value}
      <br />
      betted coins: {account.bet.div(new BN(1e9)).toString()} GAMBL
    </figure>
  );
};
