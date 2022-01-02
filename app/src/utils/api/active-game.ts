import { ProgramAccount } from '@project-serum/anchor';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { useEffect } from 'react';
import { useState } from 'react';

import { WheelOfFortuneData } from './../../components/game/preview';
import { Workspace } from './../workspace';

const DISCRIMINATOR_LENGTH = 8;
const TIMESTAMP_LENGTH = 8;

export const useActiveGame = (workspace: Workspace | undefined): ProgramAccount<WheelOfFortuneData> | undefined | null => {
  const [game, setGame] = useState<ProgramAccount<WheelOfFortuneData> | null | undefined>(null);

  useEffect(() => {
    if (!workspace) {
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
      const res = await workspace!.program.account.wheelOfFortune.all([{
        memcmp: {
          offset: DISCRIMINATOR_LENGTH + TIMESTAMP_LENGTH,
          bytes: bs58.encode([0])
        }
      }]);
      const nGame = Array.isArray(res) ? res[0] as any : undefined;
      if (!active || !nGame) { return; }
      setGame(nGame);
      timeout = setTimeout(() => load(), 5000);
    }
  }, [workspace]);

  return game;
};
