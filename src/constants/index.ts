import { RpcProvider, constants } from "starknet";

export const ERC20_ABI = [
  {
    members: [
      { name: "low", offset: 0, type: "felt" },
      { name: "high", offset: 1, type: "felt" },
    ],
    name: "Uint256",
    size: 2,
    type: "struct",
  },
  {
    inputs: [{ name: "account", type: "felt" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "Uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "decimals", type: "felt" }],
    stateMutability: "view",
    type: "function",
  },
];

export const CHAIN_ID =
  process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? constants.NetworkName.SN_MAIN
    : constants.NetworkName.SN_SEPOLIA;

const NODE_URL =
  process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? "https://starknet-mainnet.public.blastapi.io"
    : "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";

const STARKNET_CHAIN_ID =
  process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? constants.StarknetChainId.SN_MAIN
    : constants.StarknetChainId.SN_SEPOLIA;

export const provider = new RpcProvider({
  nodeUrl: NODE_URL,
  chainId: STARKNET_CHAIN_ID,
});

export const ARGENT_SESSION_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_ARGENT_SESSION_SERVICE_BASE_URL ||
  "https://cloud.argent-api.com/v1";

export const ARGENT_WEBWALLET_URL =
  process.env.NEXT_PUBLIC_ARGENT_WEBWALLET_URL || "https://web.argent.xyz";
