// TODO: If possible avoid the react-ui BC… i don't like it
import "@solana/wallet-adapter-react-ui/styles.css";

import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import React, { FC, ReactNode, useMemo } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useRoutes
} from "react-router-dom";
import { Dropdown } from "../dropdown";
import {
  useAnchorWallet,
  useConnection,
  useWallet
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Network, NETWORK_TITLES, useNetwork } from "../../utils/network";

const HeaderLinnk: FC<{
  url: string;
  children: ReactNode;
  disabled?: boolean;
}> = ({ url, children, disabled }) => (
  <NavLink
    className={({ isActive }) =>
      `${
        isActive ? "text-pink italic underline" : "hover:text-black"
      } hover:bg-green border-x flex items-center px-4 justify-center ${
        !disabled ? "" : "opacity-50 pointer-events-none"
      }`
    }
    to={url}
  >
    {children}
  </NavLink>
);

export const Navigation = () => {
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();
  const connection = useConnection();
  const location = useLocation();
  const [network, setNetwork] = useNetwork();

  return (
    <nav className="flex flex-row w-full fixed top-0 z-40 left-0 h-16 border-b bg-black">
      <Link
        className="hover:bg-green flex items-center px-1 justify-center"
        to="/"
      >
        <img src={require("./assets/GAMBL.png")} className="w-14" />
      </Link>
      <HeaderLinnk url="/how-it-works">HOW?</HeaderLinnk>
      <HeaderLinnk url="/games">PAST GAMES</HeaderLinnk>
      <HeaderLinnk url="/coins" disabled>
        COINS
      </HeaderLinnk>
      <Dropdown
        className="uppercase mx-auto flex justify-center items-center flex-row"
        content={
          <ul className="whitespace-nowrap ">
            {Object.keys(NETWORK_TITLES).map((v) => (
              <li
                className={`${
                  !NETWORK_TITLES[v as Network]?.implemented
                    ? "bg-gray opacity-50 px-2 pointer-events-none"
                    : "cursor-pointer hover:bg-pink "
                } border-b flex flex-row justify-start items-center ${
                  network !== v ? "border-dashed" : "border-pink"
                }`}
                key={v}
                onClick={() =>
                  NETWORK_TITLES[v as Network]?.implemented &&
                  setNetwork(v as Network)
                }
              >
                {NETWORK_TITLES[v as Network]?.title}
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
