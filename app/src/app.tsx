import { web3 } from "@project-serum/anchor";
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";
import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getTorusWallet
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import React, { FC, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Layout } from "./layout";
import { Games } from "./pages/games";
import { Game } from "./pages/game";
import { Landing } from "./pages/landing";
import { useNetwork } from "./utils/network";
import { useEndpoint } from "./utils/endpoint";

export const App: FC = () => {
  const [network] = useNetwork();
  const endpoint = useEndpoint();

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getTorusWallet(),
      getLedgerWallet()
      // getSolletWallet({ network }),
      // getSolletExtensionWallet({ network })
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <Router>
          <Layout>
            <Routes>
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:game_id" element={<Game />} />
              <Route path="/" element={<Landing />} />
            </Routes>
          </Layout>
        </Router>
      </WalletProvider>
    </ConnectionProvider>
  );
};

function HowItWorks() {
  return <h2>IDK LOL…</h2>;
}
