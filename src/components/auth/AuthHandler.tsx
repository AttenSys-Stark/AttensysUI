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
      const redirectPath = searchParams.get("redirectPath");
      const error = searchParams.get("error");

      if (error) {
        // Reset loading state on error
        setAccountloadProgress(false);

        // Provide specific error messages based on error type
        let errorMessage = error;
        switch (error) {
          case "redirect_uri_mismatch":
            errorMessage = "redirect_uri_mismatch";
            break;
          case "config_error":
            errorMessage = "config_error";
            break;
          case "token_exchange_failed":
            errorMessage = "token_exchange_failed";
            break;
          case "user_info_failed":
            errorMessage = "user_info_failed";
            break;
          case "callback_failed":
            errorMessage = "callback_failed";
            break;
          default:
            errorMessage = error;
        }

        // Redirect to login with error using current origin
        const currentOrigin = window.location.origin;
        router.replace(`${currentOrigin}/?error=${errorMessage}`);
        return;
      }

      if (customToken && authType === "google") {
        try {
          // Add a small delay to ensure auth state is properly set
          await new Promise((resolve) => setTimeout(resolve, 100));

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
            }
          } catch (notificationError) {
            console.error(
              "Error sending login notification:",
              notificationError,
            );
          }

          // Clean up URL parameters and redirect
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);

          // Redirect to the original path or default to /Home
          const finalRedirectPath = redirectPath || "/Home";
          router.replace(finalRedirectPath);
        } catch (error) {
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
