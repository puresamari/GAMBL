
import IDLOrig from './gambl.json';
import { Gambl as Orig } from './gambl';

export type Gambl = Orig & { metadata: { address: string } };
export const IDL: Gambl = IDLOrig as any;