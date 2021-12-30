import { useEffect } from 'react';
import { useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { useObservable } from "rxjs-hooks";

export type Network = WalletAdapterNetwork | 'local';

const NetworkBehav = new BehaviorSubject<Network>('local');
export const $network = NetworkBehav.pipe(
  distinctUntilChanged((a, b) => a === b)
);

export const NETWORK_TITLES: { [network in Network]: string } = {
  "mainnet-beta": 'Mainnet (Beta)',
  devnet: 'Devnet',
  testnet: 'Testnet',
  local: 'Local ledger'
};

export const useNetwork = (): [Network, (network: Network) => void] => {
  const [network, setNetwork] = useState<Network>(NetworkBehav.getValue());

  useEffect(() => $network.subscribe(v => setNetwork(v)).unsubscribe, []);

  return [network, network => NetworkBehav.next(network)];
};