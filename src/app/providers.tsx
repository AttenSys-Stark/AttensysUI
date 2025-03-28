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
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}
let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  // solving white loading flash on dark mode when serving the page
  // https://brianlovin.com/writing/adding-dark-mode-with-next-js
  const [mounted, setMounted] = useState(false);
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });
  const queryClient = getQueryClient();

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
        <JotaiProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </JotaiProvider>
      </StarknetConfig>
    </>
  );

  return body;
}
