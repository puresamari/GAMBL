import { web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useState } from "react";

import { GamePreview, IGamePreviewData } from "../components/game/preview";
import { useWorkspace } from "../utils/workspace";

export const Landing: FC = () => {
  const wallet = useWallet();

  if (!wallet) {
    return <p>connect your wallet dude!</p>;
  }

  const [game, setGame] = useState<IGamePreviewData | undefined>();
  const [transactionError, setTransactionError] = useState<
    unknown | undefined
  >();

  const workspace = useWorkspace();

  return (
    <>
      {transactionError && (
        <p className="text-red-500">{transactionError + ""}</p>
      )}
      {game && <GamePreview {...game} />}
      {workspace && (
        <button
          onClick={async () => {
            console.log(wallet);
            if (!wallet.publicKey) {
              setTransactionError(
                "Somehow your wallet doesn't have a public key lol"
              );
              return;
            }
            try {
              const game = web3.Keypair.generate();

              await workspace.program.rpc.startGame({
                accounts: {
                  game: game.publicKey,
                  author: wallet.publicKey,
                  systemProgram: web3.SystemProgram.programId
                },
                signers: [game]
              });

              // Fetch the account details of the created tweet.
              const gameAccount = await workspace.program.account.wheelOfFortune.fetch(
                game.publicKey
              );

              console.log("game account: ", gameAccount);
              setGame(gameAccount);
            } catch (err) {
              console.error("Transaction error: ", err);
              setTransactionError(err);
            }
          }}
        >
          Start game
        </button>
      )}
    </>
  );
};
