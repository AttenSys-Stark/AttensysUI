// src/config.ts
import { constants } from "starknet";

export const DEFAULT_NETWORK = "SN_SEPOLIA" as const;
export const SUPPORTED_NETWORKS = ["SN_SEPOLIA", "SN_MAIN"] as const;

export const NETWORK_CONFIG = {
  sepolia: {
    name: "Sepolia Testnet",
    chainId: constants.StarknetChainId.SN_SEPOLIA,
    explorerUrl: "https://sepolia.starkscan.co",
  },
  "mainnet-alpha": {
    name: "Mainnet",
    chainId: constants.StarknetChainId.SN_MAIN,
    explorerUrl: "https://starkscan.co",
  },
} as const;
