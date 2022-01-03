import { ProgramAccount, web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useEffect, useState } from "react";

import { GamePreview, WheelOfFortuneData } from "../components/game/preview";
import { useWorkspace } from "../utils/workspace";
import { useActiveGame } from "../utils/api/active-game";

export const Landing: FC = () => {
  const wallet = useWallet();

  const [game, setGame] = useState<
    ProgramAccount<WheelOfFortuneData> | undefined
  >();
  const [transactionError, setTransactionError] = useState<
    unknown | undefined
  >();

  const workspace = useWorkspace();
  const activeGame = useActiveGame(workspace);

  useEffect(() => setGame(activeGame || undefined), [activeGame]);

  return (
    <>
      {!wallet?.publicKey && (
        <p className="flex flex-row justify-end mb-4 text-4xl">
          connect your wallet!
          <span className="animate-bounce ml-8">☝️</span>
        </p>
      )}
      {transactionError && (
        <p className="text-red-500">{transactionError + ""}</p>
      )}
      {game && <GamePreview {...game?.account} publicKey={game?.publicKey} />}
      {wallet?.publicKey && workspace && (
        <button
          onClick={async () => {
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
              const account = await workspace.program.account.wheelOfFortune.fetch(
                game.publicKey
              );

              console.log("game account: ", account);
              setGame({ account, publicKey: game.publicKey });
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
