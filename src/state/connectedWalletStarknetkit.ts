import { atomWithReset } from "jotai/utils";
import type { Connector, StarknetWindowObject } from "starknetkit";

export const walletStarknetkit = atomWithReset<
  StarknetWindowObject | null | undefined
>(undefined);

export const connectorStarknetKit = atomWithReset<Connector | null>(null);
