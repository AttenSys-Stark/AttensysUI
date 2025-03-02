import type { Session } from "@argent/x-sessions";
import { atomWithReset } from "jotai/utils";
import type { Account, AccountInterface } from "starknet";

export const sessionAccountAtom = atomWithReset<
  Account | AccountInterface | undefined | null
>(undefined);
export const sessionAtom = atomWithReset<Session | undefined | null>(undefined);
export const sessionKeyModeAtom = atomWithReset<boolean>(false);
