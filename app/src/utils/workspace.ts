import { useEffect } from 'react';
import { useState } from 'react';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';

import { useEndpoint } from './endpoint';
import { Gambl, IDL } from './gambl';

export type GamblProgram = Program<Gambl>;
export type Workspace = {
  provider: Provider,
  program: Program<Gambl>
};

export const useWorkspace = () => {
  const network = useEndpoint();
  const wallet = useWallet();

  const [workspace, setWorkspace] = useState<Workspace>();

  useEffect(() => {

    if (!network || !wallet) {
      setWorkspace(undefined);
      return;
    }

    // const { SystemProgram, Keypair } = web3;
    /* create an account  */
    const opts: web3.ConfirmOptions = {
      preflightCommitment: "processed",
      commitment: 'processed'
    };
    // const opts = {
    //   preflightCommitment: "processed"
    // };
    const programID = new PublicKey(IDL.metadata.address);
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(
      connection, wallet as any, opts,
    );
    // return provider;
    setWorkspace({
      provider,
      program: new Program(IDL, programID, provider)
    });
  }, [network, wallet]);

  return workspace;

};