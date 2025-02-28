import type { AllowedMethod, SessionKey } from "@argent/x-sessions"
import { ec } from "starknet"
import {
  attensysCourseAddress,
  attensysEventAddress,
  attensysOrgAddress,
} from "@/deployments/contracts"
import { parseUnits } from "@/helpers/token"

export const privateKey = ec.starkCurve.utils.randomPrivateKey()
export const dappKey: SessionKey = {
  privateKey: privateKey,
  publicKey: ec.starkCurve.getStarkKey(privateKey),
}

const ETHFees = [
  {
    tokenAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    maxAmount: parseUnits("0.1", 18).value.toString(),
  },
]

const STRKFees = [
  {
    tokenAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    maxAmount: "10000000000000000",
  },
  {
    tokenAddress:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    maxAmount: "200000000000000000000",
  },
]

export const metaData = (isStarkFeeToken: boolean) => ({
  projectID: "attensys",
  txFees: isStarkFeeToken ? STRKFees : ETHFees,
})

export const expiry = Math.floor(
  (Date.now() + 1000 * 60 * 60 * 24) / 1000,
) as any

export const allowedMethods: AllowedMethod[] = [
  {
    "Contract Address": attensysCourseAddress,
    selector: "create_course",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "add_replace_course_content",
  },
  {
    "Contract Address": attensysCourseAddress,
    selector: "finish_course_claim_certification",
  },
  {
    "Contract Address": attensysEventAddress,
    selector: "create_event",
  },
  {
    "Contract Address": attensysEventAddress,
    selector: "end_event",
  },
  {
    "Contract Address": attensysEventAddress,
    selector: "batch_certify_attendees",
  },
  {
    "Contract Address": attensysEventAddress,
    selector: "mark_attendance",
  },
  {
    "Contract Address": attensysEventAddress,
    selector: "register_for_event",
  },
  {
    "Contract Address": attensysEventAddress,
    selector: "start_end_reg",
  },
  {
    "Contract Address": attensysOrgAddress,
    selector: "create_org_profile",
  },
  {
    "Contract Address": attensysOrgAddress,
    selector: "add_instructor_to_org",
  },
  {
    "Contract Address": attensysOrgAddress,
    selector: "create_a_class",
  },
  {
    "Contract Address": attensysOrgAddress,
    selector: "register_for_class",
  },
  {
    "Contract Address": attensysOrgAddress,
    selector: "mark_attendance_for_a_class",
  },
  {
    "Contract Address": attensysOrgAddress,
    selector: "batch_certify_students",
  },
]
