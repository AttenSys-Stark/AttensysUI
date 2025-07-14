import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authenticateWithCustomToken } from "@/lib/firebase/client";
import { createUserProfile } from "@/lib/userutils";
import { useAtom } from "jotai";
import { accountloadstate } from "@/state/connectedWalletStarknetkitNext";

export const AuthHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, setAccountloadProgress] = useAtom(accountloadstate);

  useEffect(() => {
    const handleCustomTokenAuth = async () => {
      const customToken = searchParams.get("customToken");
      const authType = searchParams.get("authType");
      const error = searchParams.get("error");

      if (error) {
        console.error("Authentication error:", error);
        // Reset loading state on error
        setAccountloadProgress(false);
        // Redirect to login with error using current origin
        const currentOrigin = window.location.origin;
        router.replace(`${currentOrigin}/?error=${error}`);
        return;
      }

      if (customToken && authType === "google") {
        try {
          // Authenticate with the custom token
          const user = await authenticateWithCustomToken(customToken);

          // Create/update user profile
          await createUserProfile(
            {
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName || "",
              photoURL: user.photoURL || null,
              emailVerified: user.emailVerified,
            },
            undefined,
          );

          // Send login notification
          try {
            const response = await fetch(
              "https://attensys-1a184d8bebe7.herokuapp.com/api/login-notification",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Origin: window.location.origin,
                },
                credentials: "include",
                mode: "cors",
                body: JSON.stringify({
                  email: user.email,
                  username: user.displayName || user.email,
                }),
              },
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.warn("Login notification could not be sent:", errorText);
            }
          } catch (notificationError) {
            console.warn(
              "Error sending login notification:",
              notificationError,
            );
          }

          // Clean up URL parameters and redirect
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);

          // Redirect to home
          router.replace("/Home");
        } catch (error) {
          console.error("Custom token authentication failed:", error);
          // Reset loading state on error
          setAccountloadProgress(false);
          const currentOrigin = window.location.origin;
          router.replace(`${currentOrigin}/?error=auth_failed`);
        }
      }
    };

    handleCustomTokenAuth();
  }, [searchParams, router, setAccountloadProgress]);

  return null; // This component doesn't render anything
};
