
import IDLOrig from './gambl.json';
import { Gambl as Orig } from './gambl';
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';

export type Gambl = Orig & { metadata: { address: string } };
export const IDL: Gambl = IDLOrig as any;

// I wonder if there is a way to directly get this from the json
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

export type WheelOfFortuneBetData = TypeDef<
  {
    "name": "wheelOfFortuneBet",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "author",
          "type": "publicKey"
        },
        {
          "name": "game",
          "type": "publicKey"
        },
        {
          "name": "timestamp",
          "type": "i64"
        },
        {
          "name": "value",
          "type": "i8"
        },
        {
          "name": "bet",
          "type": "u64"
        }
      ]
    }
  },
  Gambl
>;