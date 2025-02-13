import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { ARGENT_WEBWALLET_URL, CHAIN_ID } from "@/constants";

export const availableConnectors = [
  new InjectedConnector({ options: { id: "argentX" } }),
  new InjectedConnector({ options: { id: "braavos" } }),
  new ArgentMobileConnector({
    dappName: "Example dapp",
    chainId: CHAIN_ID,
  }),
  new WebWalletConnector({ url: ARGENT_WEBWALLET_URL }),
];
