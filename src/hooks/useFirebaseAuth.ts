import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/userutils";
import { decryptPrivateKeyAsync } from "@/helpers/encrypt";
import { Account } from "starknet";
import { provider } from "@/constants";

export const useFirebaseAuth = () => {
  const [account, setAccount] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const profile = await getUserProfile(currentUser.uid);
          const isEmailVerified =
            currentUser.emailVerified || profile?.emailVerified;

          if (profile && profile.starknetAddress && isEmailVerified) {
            try {
              const decryptedPrivateKey = await decryptPrivateKeyAsync(
                profile.starknetPrivateKey,
              );

              if (decryptedPrivateKey) {
                const userAccount = new Account(
                  provider,
                  profile.starknetAddress,
                  decryptedPrivateKey,
                );
                setAccount(userAccount);
                setAddress(profile.starknetAddress);
                setIsAuthenticated(true);
              }
            } catch (decryptError) {
              console.error("Error decrypting private key:", decryptError);
            }
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check
    checkAuthState();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await checkAuthState();
      } else {
        setAccount(undefined);
        setAddress("");
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { account, address, isLoading, isAuthenticated };
};
