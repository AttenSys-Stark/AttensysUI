import { connect } from "starknetkit";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";

export const connectWallet = async (alwaysAsk = false) => {
  try {
    const { wallet } = await connect({
      provider,
      modalMode: alwaysAsk ? "alwaysAsk" : "neverAsk",
      webWalletUrl: ARGENT_WEBWALLET_URL,
      argentMobileOptions: {
        dappName: "Attensys",
        url: window.location.hostname,
        chainId: CHAIN_ID,
        icons: [],
      },
    });
    return wallet;
  } catch (e) {
    console.error(e);
    alert((e as any).message ?? "An error occurred");
    return null;
  }
};

/* export const reConnectWallet = async () => {
  try {
    const { wallet } = await connect({
      provider,
      modalMode: "alwaysAsk",
      webWalletUrl: ARGENT_WEBWALLET_URL,
      argentMobileOptions: {
        dappName: "Attensys",
        url: window.location.hostname,
        chainId: CHAIN_ID,
        icons: [],
      },
    })
    return wallet
  } catch (e) {
    console.error(e)
    alert((e as any).message ?? "An error occurred")
    return null
  }
}
 */
