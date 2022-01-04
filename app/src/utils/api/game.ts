import { ProgramAccount } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { useEffect } from 'react';
import { useState } from 'react';

import { WheelOfFortuneData } from '../gambl';
import { useWorkspace } from '../workspace';

const DISCRIMINATOR_LENGTH = 8;
const TIMESTAMP_LENGTH = 8;

export const useGame = (game_id?: string): ProgramAccount<WheelOfFortuneData> | undefined | null => {
  const [game, setGame] = useState<ProgramAccount<WheelOfFortuneData> | null | undefined>(null);
  const workspace = useWorkspace();

  useEffect(() => {
    if (!workspace || !game_id) {
      return;
    }
    let active = true;
    let timeout: NodeJS.Timeout;
    load();
    return () => {
      active = false;
      clearTimeout(timeout);
    };

    async function load() {
      if (!workspace || !game_id) {
        return;
      }
      const game = await workspace.program.account.wheelOfFortune.fetch(game_id);
      setGame(({
        publicKey: new PublicKey(game_id),
        account: game
      }));
      timeout = setTimeout(() => load(), 5000);
    }
  }, [workspace]);

  return game;
};
