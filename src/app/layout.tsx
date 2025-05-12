"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Suspense, useEffect, useState, ReactNode } from "react";
import Loading from "@/components/Loader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AutoConnect } from "@/components/connect/AutoConnect";
import { Provider as JotaiProvider } from "jotai";
import {
  StarknetConfig,
  argent,
  braavos,
  publicProvider,
  useInjectedConnectors,
  jsonRpcProvider,
  voyager,
} from "@starknet-react/core";
import { devnet, sepolia, mainnet, Chain } from "@starknet-react/chains";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ControllerConnector from "@cartridge/connector/controller";
import { SessionPolicies } from "@cartridge/presets";
import { attensysCourseAddress } from "@/deployments/contracts";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Attensys",
//   description:
//     "AttenSys is a platform designed to revolutionize the management of educational certifications for participating in bootcamps, attendance tracking for events & online classes, and online courses certifications.",
// };

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

// const COURSE_ADDRESS =
//   "0x2d876f20d2ed89f91ca59e559e954dc78a4e81abd6bf7831ef238a2adfbef24";
const STRK_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

// Define session policies
const policies: SessionPolicies = {
  contracts: {
    [attensysCourseAddress]: {
      methods: [
        {
          name: "get certified",
          entrypoint: "finish_course_claim_certification",
          description: "get certified",
        },
        {
          name: "create course",
          entrypoint: "create_course",
          description: "create_a_course",
        },
        {
          name: "remove course",
          entrypoint: "remove_course",
          description: "remove a course",
        },
        {
          name: "creator withdraw",
          entrypoint: "creator_withdraw",
          description: "claim Earnings",
        },
        {
          name: "edit content",
          entrypoint: "add_replace_course_content",
          description: "update course",
        },
        {
          name: "review",
          entrypoint: "review",
          description: "review course",
        },
        {
          name: "purchase course",
          entrypoint: "acquire_a_course",
          description: "purchase a course",
        },
      ],
    },
    // [STRK_ADDRESS]: {
    //   methods: [
    //     {
    //       name: "approve",
    //       entrypoint: "approve",
    //       description: "approve STRK",
    //     },
    //   ],
    // },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const [connector, setConnector] = useState<ControllerConnector | null>(null);
  useEffect(() => {
    // Initialize connector only on client side
    const newConnector = new ControllerConnector({
      policies,
      defaultChainId: "0x534e5f5345504f4c4941",
      chains: [{ rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" }],
    });
    setConnector(newConnector);
  }, []);
  // Configure RPC provider
  const provider = jsonRpcProvider({
    rpc: (chain: Chain) => {
      switch (chain) {
        case mainnet:
          return { nodeUrl: "https://api.cartridge.gg/x/starknet/mainnet" };
        case sepolia:
        default:
          return { nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia" };
      }
    },
  });

  return (
    <html lang="en">
      <Suspense fallback={<Loading />}>
        <body className={inter.className}>
          {connector && (
            <StarknetConfig
              autoConnect
              chains={[mainnet, sepolia]}
              provider={provider}
              connectors={[connector]}
              explorer={voyager}
            >
              <JotaiProvider>
                <QueryClientProvider client={queryClient}>
                  {/* <Header /> */}
                  {children}
                  {/* <Footer /> */}
                </QueryClientProvider>
              </JotaiProvider>
            </StarknetConfig>
          )}
        </body>
      </Suspense>
    </html>
  );
}
