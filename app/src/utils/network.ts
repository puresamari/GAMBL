import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useEffect } from 'react';
import { useState } from 'react';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

export type Network = WalletAdapterNetwork | 'local';

export const NETWORK_TITLES: { [network in Network]: { title: string, implemented: boolean } } = {
  "mainnet-beta": { title: 'Mainnet (Beta)', implemented: false },
  devnet: { title: 'Devnet', implemented: true },
  testnet: { title: 'Testnet', implemented: false },
  local: { title: 'Local ledger', implemented: true }
};

const NetworkBehav = new BehaviorSubject<Network>(
  process.env.NODE_ENV === 'development' ? WalletAdapterNetwork.Devnet :
    (Object.keys(NETWORK_TITLES) as Network[]).find(v => NETWORK_TITLES[v as Network]?.implemented) || WalletAdapterNetwork.Devnet);

export const $network = NetworkBehav.pipe(
  distinctUntilChanged((a, b) => a === b)
);

export const useNetwork = (): [Network, (network: Network) => void] => {
  const [network, setNetwork] = useState<Network>(NetworkBehav.getValue());

  useEffect(() => $network.subscribe(v => setNetwork(v)).unsubscribe, []);

  return [network, network => NetworkBehav.next(network)];
};

export const GetStaticNetworkValue = () => NetworkBehav.getValue();