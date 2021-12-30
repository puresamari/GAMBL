import { clusterApiUrl } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { useNetwork } from "./network";

export const useEndpoint = (): string => {
  const [network] = useNetwork();
  const [state, setState] = useState<string>(network === "local" ? "http://127.0.0.1:8899" : clusterApiUrl(network));

  useEffect(() => setState(network === "local" ? "http://127.0.0.1:8899" : clusterApiUrl(network)), [network]);

  return state;
};