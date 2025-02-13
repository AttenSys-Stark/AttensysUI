import {
  lastTxErrorAtom,
  lastTxHashAtom,
  lastTxStatusAtom,
} from "@/state/transactionState";
import {
  starknetReactVersionAtom,
  starknetkitVersionAtom,
} from "@/state/versionState";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "@headlessui/react";

interface DisconnectButtonProps {
  disconnectFn: () => void;
  resetFn?: () => void;
}

const DisconnectButton: FC<DisconnectButtonProps> = ({
  disconnectFn,
  resetFn,
}) => {
  const navigate = useRouter();
  const setLastTxHash = useSetAtom(lastTxHashAtom);
  const setLastTxStatus = useSetAtom(lastTxStatusAtom);
  const setLastTxError = useSetAtom(lastTxErrorAtom);
  const setStarknetkitVersion = useSetAtom(starknetkitVersionAtom);
  const setStarknetReactVersion = useSetAtom(starknetReactVersionAtom);

  return (
    <div>
      <Button
        onClick={() => {
          disconnectFn();
          resetFn?.();
          setLastTxHash(RESET);
          setLastTxStatus(RESET);
          setLastTxError(RESET);
          setStarknetkitVersion(RESET);
          setStarknetReactVersion(RESET);
          navigate.push("/");
        }}
        className="hidden lg:flex rounded-lg bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] py-2 px-4 lg:h-[41px] lg:w-[173px] text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
      >
        <div className="flex space-x-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <h1>Disconnect</h1>
        </div>
      </Button>
    </div>
  );
};

export { DisconnectButton };
