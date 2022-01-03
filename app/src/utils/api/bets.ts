import { ProgramAccount } from '@project-serum/anchor';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { useEffect } from 'react';
import { useState } from 'react';

import { WheelOfFortuneBetData } from '../../components/bet-preview';
import { useWorkspace } from '../workspace';

const DISCRIMINATOR_LENGTH = 8;
// const TIMESTAMP_LENGTH = 8;
const PUBLIC_KEY_LENGTH = 32;
// const TIMESTAMP_LENGTH: usize = 8;
// const WHEEL_VALUE_LENGTH: usize = 1;
// pub author: Pubkey,
// pub game: Pubkey, // Which game is being bet on
// pub timestamp: i64,
// pub value: i8

export const useBets = (game_id?: string): ProgramAccount<WheelOfFortuneBetData>[] | undefined | null => {
  const [bets, setBets] = useState<ProgramAccount<WheelOfFortuneBetData>[] | null | undefined>(null);
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
      if (!workspace || !game_id || !active) {
        return;
      }
      const res = await workspace!.program.account.wheelOfFortuneBet.all([{
        memcmp: {
          offset: DISCRIMINATOR_LENGTH + PUBLIC_KEY_LENGTH,
          bytes: game_id
        }
      }]);
      setBets(res);
      timeout = setTimeout(() => load(), 5000);
    }
  }, [workspace]);

  return bets;
};
