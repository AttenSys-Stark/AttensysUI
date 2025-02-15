import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { StarknetWindowObject } from "starknetkit";

export const walletStarknetkit = atomWithReset<
  StarknetWindowObject | null | undefined
>(undefined);
