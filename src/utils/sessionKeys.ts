import { bytesToHexString, SessionKey } from "@argent/x-sessions";
import { ec, constants } from "starknet";
import { ARGENT_SESSION_SERVICE_BASE_URL } from "@/constants";
import { 
  attensysCourseAddress, 
  attensysEventAddress, 
  attensysOrgAddress, 
  attensysSponsorAddress 
} from "@/deployments/contracts";


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
export const ATTENSYS_CONTRACT_ADDRESS = attensysCourseAddress;

// ETH and STRK token addresses
export const ETH_TOKEN_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

// All contract methods allowed for the session
export const allowedMethods = [
  // Course contract methods
  {
    "Contract Address": attensysCourseAddress,
    selector: "acquire_a_course",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "finish_course_claim_certification",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "check_course_completion_status_n_certification",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "get_course_infos",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "is_user_taking_course",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "is_user_certified_for_course",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "get_all_taken_courses",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "get_user_completed_courses",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "get_all_courses_info",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "get_all_creator_courses",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "get_creator_info",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "get_course_nft_contract",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "get_total_course_completions",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "get_suspension_status",
  },

  // Event contract methods
  {
    "Contract Address": attensysEventAddress,
    selector: "register_to_event",
  },
  {
    "Contract Address": attensysEventAddress,
    selector: "attend_event",
  },
  {
    "Contract Address": attensysEventAddress,
    selector: "claim_event_certificate",
  },
  {
    "Contract Address": attensysEventAddress,
    selector: "get_user_events",
  },

  // Organization contract methods
  {
    "Contract Address": attensysOrgAddress,
    selector: "join_bootcamp",
  },
  {
    "Contract Address": attensysOrgAddress,
    selector: "complete_bootcamp",
  },
  {
    "Contract Address": attensysOrgAddress,
    selector: "get_user_bootcamps",
  },

  // Sponsor contract methods
  {
    "Contract Address": attensysSponsorAddress,
    selector: "sponsor_course",
  },
  {
    "Contract Address": attensysSponsorAddress,
    selector: "cancel_sponsorship",
  },
  {
    "Contract Address": attensysSponsorAddress,
    selector: "get_user_sponsorships",
  }
];

// Default expiry time (24 hours from now)
export const getExpiry = () => {
  return Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000) as any;
};

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

// Generate a new session key
export const generateSessionKey = (): SessionKey => {
  const privateKey = ec.starkCurve.utils.randomPrivateKey();
  return {
    privateKey: bytesToHexString(privateKey),
    publicKey: ec.starkCurve.getStarkKey(privateKey),
  };
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