"use client";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { Button } from "@cartridge/ui-next";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useRouter } from "next/navigation";
import { signOutAll, signInWithGoogle } from "@/lib/firebase/client";
import { useAuth } from "@/context/AuthContext";

export function Userlogin({
  onUserChange,
}: { onUserChange?: (firstName: string | null) => void } = {}) {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const controller = connectors[0] as ControllerConnector;
  const [username, setUsername] = useState<string>();
  const [iswalletconnecting, setiswalletconnecting] = useState(false);
  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!address) return;
    controller?.username()?.then((n) => setUsername(n));
  }, [address, controller]);

  useEffect(() => {
    let name = null;
    if (user) {
      if (user.displayName) {
        name = user.displayName.split(" ")[0];
      } else if (user.email) {
        name = user.email.split("@")[0];
      }
    }
    setFirstName(name);
    if (onUserChange) onUserChange(name);
  }, [user, onUserChange]);

  const handleConnect = async () => {
    if (user) {
      // Logout all auths and disconnect wallet
      await signOutAll();
      disconnect();
      setFirstName(null);
      router.push("/");
    } else {
      // Show login UI (Google as example)
      setiswalletconnecting(true);
      try {
        await signInWithGoogle();
        setiswalletconnecting(false);
        router.push("/");
      } catch (err) {
        setiswalletconnecting(false);
        // handle error (toast, etc)
      }
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          handleConnect();
        }}
        // disabled={iswalletconnecting}
        className="flex rounded-md xl:rounded-lg bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] py-2 px-2 xl:px-3 data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
      >
        <div className="flex items-center space-x-2 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <div className="flex flex-row flex-none space-x-1 text-sm font-semibold md:text-md">
            <span className="flex">
              {iswalletconnecting ? (
                <LoadingSpinner
                  variant="button"
                  size="sm"
                  colorVariant="white"
                />
              ) : user ? (
                <div>Logout</div>
              ) : (
                <div>Login</div>
              )}
            </span>
          </div>
        </div>
      </Button>
    </div>
  );
}
