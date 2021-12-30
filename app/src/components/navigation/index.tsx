// TODO: If possible avoid the react-ui BC… i don't like it
import "@solana/wallet-adapter-react-ui/styles.css";

import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import React, { useMemo } from "react";
import { Link, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { Dropdown } from "../dropdown";
import {
  useAnchorWallet,
  useConnection,
  useWallet
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Network, NETWORK_TITLES, useNetwork } from "../../utils/network";

export const Navigation = () => {
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();
  const connection = useConnection();
  const location = useLocation();
  const [network, setNetwork] = useNetwork();

  return (
    <nav className="flex flex-row w-full fixed top-0 left-0 h-16 border-b">
      <Link
        className="hover:opacity-50 flex items-center px-4 justify-center"
        to="/"
      >
        <img src={require("./assets/GAMBL.png")} className="w-8" />
      </Link>
      <Link
        className="hover:opacity-50 border-l flex items-center px-4 justify-center"
        to="/how-it-works"
      >
        HOW?
      </Link>
      <Link
        className="hover:opacity-50 border-l flex items-center px-4 justify-center"
        to="/history"
      >
        PAST GAMES
      </Link>
      <Link
        className="hover:opacity-50 border-x flex opacity-50 pointer-events-none items-center px-4 justify-center"
        to="/"
      >
        COINS
      </Link>
      <Dropdown
        className="uppercase mx-auto flex justify-center items-center flex-row"
        content={
          <ul className="whitespace-nowrap">
            {Object.keys(NETWORK_TITLES).map((v) => (
              <li
                className={`border-b flex flex-row justify-start cursor-pointer hover:border-pink items-center ${
                  network !== v ? "border-dashed" : "border-pink"
                }`}
                key={v}
                onClick={() => setNetwork(v as Network)}
              >
                {NETWORK_TITLES[v as Network]}
                {network === v && <div className="bg-pink w-2 h-2 ml-2" />}
              </li>
            ))}
          </ul>
        }
      >
        {network}
        <div className="bg-pink w-2 h-2 ml-2" />
      </Dropdown>
      <Dropdown
        className={`${wallet.connected ? "bg-pink text-white" : ""} ${
          wallet.connecting || wallet.disconnecting
            ? "opacity-50 pointer-events-none"
            : ""
        } border-l px-4 flex cursor-pointer justify-center items-center ml-auto`}
        horizontal="right"
        contentWrapperClassName="flex-row whitespace-nowrap"
        content={
          <WalletModalProvider>
            <WalletMultiButton />
            <div className="w-4" />
            <WalletDisconnectButton />
          </WalletModalProvider>
        }
      >
        <p
          className={
            wallet.connected
              ? undefined
              : " animate-pulse group-hover:animate-none"
          }
        >
          {wallet.connected ? "CONNECTED" : "CONNECT YOUR WALLET"}
        </p>
      </Dropdown>
    </nav>
  );
};
