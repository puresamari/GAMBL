import { ProgramAccount } from '@project-serum/anchor';
import { useEffect } from 'react';
import { useState } from 'react';

import { WheelOfFortuneBetData } from '../gambl';
import { useWorkspace } from '../workspace';

const DISCRIMINATOR_LENGTH = 8;
const PUBLIC_KEY_LENGTH = 32;

export const useBets = (game_id?: string): ProgramAccount<WheelOfFortuneBetData>[] | undefined | null => {
  const [bets, setBets] = useState<ProgramAccount<WheelOfFortuneBetData>[] | null | undefined>(null);
  const workspace = useWorkspace();

  useEffect(() => {
    if (!workspace || !game_id) {
      return;
    }
    let active = true;
    let timeout: NodeJS.Timeout;
    let before: ProgramAccount<WheelOfFortuneBetData>[] = [];
    load();
    return () => {
      active = false;
      clearTimeout(timeout);
    };

    async function load() {
      if (!workspace || !game_id || !active) {
        return;
      }
      const res = await workspace!.program.account.wheelOfFortuneBet.all([{
        memcmp: {
          offset: DISCRIMINATOR_LENGTH + PUBLIC_KEY_LENGTH,
          bytes: game_id
        }
      }]);
      if (before.length !== res.length) {
        setBets(res);
        before = res;
      }
      timeout = setTimeout(() => load(), 5000);
    }
  }, [workspace]);

  return bets;
};
