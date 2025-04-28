import { ARGENT_SESSION_SERVICE_BASE_URL } from "@/constants";
import { 
  attensysCourseAddress, 
  attensysEventAddress, 
  attensysOrgAddress, 
  attensysSponsorAddress 
} from "@/deployments/contracts";
import { constants } from "starknet";


export interface BigDecimal {
  value: bigint
  decimals: number
}


export const parseUnits = (value: string, decimals: number): BigDecimal => {
    let [integer, fraction = ""] = value.split(".")
  
    const negative = integer.startsWith("-")
    if (negative) {
      integer = integer.slice(1)
    }
  
    // If the fraction is longer than allowed, round it off
    if (fraction.length > decimals) {
      const unitIndex = decimals
      const unit = Number(fraction[unitIndex])
  
      if (unit >= 5) {
        const fractionBigInt = BigInt(fraction.slice(0, decimals)) + BigInt(1)
        fraction = fractionBigInt.toString().padStart(decimals, "0")
      } else {
        fraction = fraction.slice(0, decimals)
      }
    } else {
      fraction = fraction.padEnd(decimals, "0")
    }
  
    const parsedValue = BigInt(`${negative ? "-" : ""}${integer}${fraction}`)
  
    return {
      value: parsedValue,
      decimals,
    }
  }

// Default contract address for Attensys
export const ATTENSYS_CONTRACT_ADDRESS = attensysCourseAddress || "0x27da6130567c2cc618a7a6d3e2dc463ecdac1ee6f77a1a07310510e76459093";

// ETH and STRK token addresses
export const ETH_TOKEN_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

// All contract methods allowed for the session
export const allowedMethods = [
  // Course contract methods
  {
    "contract": attensysCourseAddress,
    selector: "acquire_a_course",
  },
  {
    "contract": attensysCourseAddress,
    selector: "finish_course_claim_certification",
  },
  {
    "contract": attensysCourseAddress,
    selector: "check_course_completion_status_n_certification",
  },
  

  // Event contract methods
  {
    "contract": attensysEventAddress,
    selector: "register_to_event",
  },
  {
    "contract": attensysEventAddress,
    selector: "attend_event",
  },
  {
    "contract": attensysEventAddress,
    selector: "claim_event_certificate",
  },
  {
    "contract": attensysEventAddress,
    selector: "get_user_events",
  },

  // Organization contract methods
  {
    "contract": attensysOrgAddress,
    selector: "join_bootcamp",
  },
  {
    "contract": attensysOrgAddress,
    selector: "complete_bootcamp",
  },

  // Sponsor contract methods
  {
    "contract": attensysSponsorAddress,
    selector: "sponsor_course",
  },
  {
    "contract": attensysSponsorAddress,
    selector: "cancel_sponsorship",
  },
];

// Metadata including project information and transaction fee limits
export const metaData = {
  projectID: "attensys-app",
  txFees: [
    {
      tokenAddress: ETH_TOKEN_ADDRESS,
      maxAmount: parseUnits("0.1", 18).value.toString(),
    },
    {
      tokenAddress: STRK_TOKEN_ADDRESS,
      maxAmount: parseUnits("20", 18).value.toString(),
    },
  ],
};


// Convert chain ID to hex format based on Starknet chain IDs
export function toHexChainId(chainId?: string): string | undefined {
  if (!chainId) return undefined;
  
  switch (chainId) {
    case "SN_MAIN":
    case "0x534e5f4d41494e":
      return constants.StarknetChainId.SN_MAIN;
    case "SN_SEPOLIA":
    case "0x534e5f5345504f4c4941":
      return constants.StarknetChainId.SN_SEPOLIA;
    default:
      return chainId;
  }
}

// Get the Argent session service URL
export const getArgentSessionServiceUrl = (): string => {
  return ARGENT_SESSION_SERVICE_BASE_URL;
}; 