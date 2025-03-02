import type { FC } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useAtomValue } from "jotai";
import { sessionKeyModeAtom } from "@/state/argentSessionState";

export const SessionKeysButton: FC = () => {
  const { createSessionKeys, clearSessionkeys } = useWallet();
  const sessionKeyMode = useAtomValue(sessionKeyModeAtom);

  return (
    <div>
      {!sessionKeyMode ? (
        <button
          type="button"
          onClick={createSessionKeys}
          className="mt-4 text-white bg-black border-8 border-black"
        >
          Create Seesion Keys
        </button>
      ) : (
        <button
          type="button"
          onClick={clearSessionkeys}
          className="mt-4 text-white bg-black border-8 border-black"
        >
          Remove Seesion Keys
        </button>
      )}
    </div>
  );
};
