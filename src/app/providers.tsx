// app/providers.tsx
"use client";
import { Provider as JotaiProvider } from "jotai";
import { ReactNode, useEffect, useState } from "react";
import {
  StarknetConfig,
  argent,
  braavos,
  publicProvider,
  useInjectedConnectors,
  jsonRpcProvider,
  voyager,
} from "@starknet-react/core";
import { devnet, sepolia, mainnet } from "@starknet-react/chains";
export function Providers({ children }: { children: ReactNode }) {
  // solving white loading flash on dark mode when serving the page
  // https://brianlovin.com/writing/adding-dark-mode-with-next-js
  const [mounted, setMounted] = useState(false);
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{null}</div>;
  }

  const body = (
    <>
      <StarknetConfig
        chains={[mainnet, sepolia, devnet]}
        provider={publicProvider()}
        connectors={connectors}
        explorer={voyager}
      >
        <JotaiProvider>{children}</JotaiProvider>
      </StarknetConfig>
    </>
  );

  return body;
}
