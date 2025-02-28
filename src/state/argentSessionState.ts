import type { Session } from "@argent/x-sessions"
import { atomWithReset } from "jotai/utils"
import type { Account, AccountInterface } from "starknet"

export const sessionAccountAtom = atomWithReset<
  Account | AccountInterface | undefined
>(undefined)
export const sessionAtom = atomWithReset<Session | undefined>(undefined)
export const sessionKeyModeAtom = atomWithReset<boolean>(false)
