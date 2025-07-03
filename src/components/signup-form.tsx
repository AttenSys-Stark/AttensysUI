"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginorsignup } from "@/state/connectedWalletStarknetkitNext";
import { useSetAtom } from "jotai";
import {
  authStateListener,
  getCurrentUser,
  signInUser,
} from "@/lib/services/authService";
import {
  checkEmailVerification,
  createUserProfile,
  signUpUserWithEmail,
  getUserProfile,
} from "@/lib/userutils";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { toast, ToastContainer } from "react-toastify";
import { setAuthTokenCookie } from "@/lib/firebase/client";

export function SignupForm({
  onLoginClick,
  redirectPath,
  className = "",
}: {
  onLoginClick?: () => void;
  redirectPath?: string;
  className?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [status, setStatus] = useState<"form" | "waiting" | "verified">("form");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [hasReloaded, setHasReloaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const router = useRouter();
  const setLoginorsignup = useSetAtom(loginorsignup);

  const handleSignupWithGoogle = async () => {
    try {
      const user = await signInUser();
      if (user) {
        // Don't route immediately - let the account creation process complete
        setAccountStatus("Creating user profile...");
        // The auth state listener will handle routing after account setup
      } else {
        setAccountStatus("error in Signed in user:");
        // Redirect or update UI
      }
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) setNameError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  const handleRepeatPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRepeatPassword(e.target.value);
    if (repeatPasswordError) setRepeatPasswordError("");
  };

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePassword(password: string) {
    // Min 8 chars, 1 upper, 1 lower, 1 number, 1 special
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      password,
    );
  }

  const handlesignupclick = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setRepeatPasswordError("");
    if (!name.trim()) {
      setNameError("Name is required.");
      valid = false;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters, include upper and lower case letters, a number, and a special character.",
      );
      valid = false;
    }
    if (password !== repeatPassword) {
      setRepeatPasswordError("Passwords do not match.");
      valid = false;
    }
    if (!valid) return;
    try {
      setStatus("waiting");
      setAccountStatus("Creating user profile...");
      const user = await signUpUserWithEmail(
        email,
        password,
        name,
        setAccountStatus,
      );
      setVerificationMessage(user.message);
      setCurrentUser(user?.user);

      // Set status to waiting and let the auth state listener handle email verification
      setStatus("waiting");
      setVerificationMessage(
        "Please check your email to verify your account before continuing.",
      );
    } catch (error: any) {
      if (error?.code === "auth/email-already-in-use") {
        setStatus("form");
        setAccountStatus("Email already in use");
        toast.error("Email already in use");
      }
    }
  };

  // Add listener for auth state changes
  useEffect(() => {
    if (status === "waiting" && currentUser) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && user.uid === currentUser.uid) {
          // Reload user to get latest verification status
          try {
            await user.reload();
          } catch (error) {
            console.error("Error reloading user:", error);
          }

          // Check if email is verified
          const isVerified = user.emailVerified;
          // console.log("Email verification status after reload:", isVerified);

          if (isVerified) {
            // Email is verified, now check for Starknet address
            try {
              const userProfile = await getUserProfile(user.uid);
              if (userProfile && userProfile.starknetAddress) {
                setStatus("verified");
                // Set auth token cookie only after complete account creation
                await setAuthTokenCookie(user);
                // Reload the redirectPath if it exists and we haven't reloaded yet
                if (redirectPath && !hasReloaded) {
                  setHasReloaded(true);
                  window.location.href = redirectPath;
                  return true;
                }
                router.push(redirectPath || "/Home");
              } else {
                // Email verified but no Starknet address yet
                setStatus("verified");
                setVerificationMessage(
                  "Email verified! Setting up your wallet...",
                );
                // Start polling for Starknet address creation
                const checkStarknetAddress = async () => {
                  try {
                    const profile = await getUserProfile(user.uid);
                    if (profile && profile.starknetAddress) {
                      // Set auth token cookie only after complete account creation
                      await setAuthTokenCookie(user);
                      router.push(redirectPath || "/Home");
                      return true;
                    }
                    return false;
                  } catch (error) {
                    console.error(
                      "Error checking for Starknet address:",
                      error,
                    );
                    return false;
                  }
                };

                // Poll every 2 seconds for up to 30 seconds
                const pollInterval = setInterval(async () => {
                  const hasAddress = await checkStarknetAddress();
                  if (hasAddress) {
                    clearInterval(pollInterval);
                  }
                }, 2000);

                // Stop polling after 30 seconds
                setTimeout(() => {
                  clearInterval(pollInterval);
                }, 30000);
              }
            } catch (error) {
              console.error("Error checking user profile:", error);
              setStatus("verified");
              setVerificationMessage(
                "Email verified! Setting up your wallet...",
              );
            }
          } else {
            // Email not verified yet, keep waiting
            setStatus("waiting");
            setVerificationMessage(
              "Please check your email to verify your account before continuing.",
            );
          }
        }
      });

      // Also add periodic check for email verification in case auth state doesn't change
      const checkInterval = setInterval(async () => {
        try {
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.uid === currentUser.uid) {
            await currentUser.reload();
            // console.log(
            //   "Periodic check - Email verified:",
            //   currentUser.emailVerified,
            // );

            if (currentUser.emailVerified) {
              clearInterval(checkInterval);
              // Email is verified, now check for Starknet address and route
              try {
                const userProfile = await getUserProfile(currentUser.uid);
                if (userProfile && userProfile.starknetAddress) {
                  setStatus("verified");
                  // Set auth token cookie only after complete account creation
                  await setAuthTokenCookie(currentUser);
                  // Reload the redirectPath if it exists and we haven't reloaded yet
                  if (redirectPath && !hasReloaded) {
                    setHasReloaded(true);
                    window.location.href = redirectPath;
                    return;
                  }
                  router.push(redirectPath || "/Home");
                } else {
                  // Email verified but no Starknet address yet
                  setStatus("verified");
                  setVerificationMessage(
                    "Email verified! Setting up your wallet...",
                  );
                  // Start polling for Starknet address creation
                  const checkStarknetAddress = async () => {
                    try {
                      const profile = await getUserProfile(currentUser.uid);
                      if (profile && profile.starknetAddress) {
                        // Set auth token cookie only after complete account creation
                        await setAuthTokenCookie(currentUser);
                        // Reload the redirectPath if it exists and we haven't reloaded yet
                        if (redirectPath && !hasReloaded) {
                          setHasReloaded(true);
                          window.location.href = redirectPath;
                          return true;
                        }
                        router.push(redirectPath || "/Home");
                        return true;
                      }
                      return false;
                    } catch (error) {
                      console.error(
                        "Error checking for Starknet address:",
                        error,
                      );
                      return false;
                    }
                  };

                  // Poll every 2 seconds for up to 30 seconds
                  const pollInterval = setInterval(async () => {
                    const hasAddress = await checkStarknetAddress();
                    if (hasAddress) {
                      clearInterval(pollInterval);
                    }
                  }, 2000);

                  // Stop polling after 30 seconds
                  setTimeout(() => {
                    clearInterval(pollInterval);
                  }, 30000);
                }
              } catch (error) {
                console.error("Error checking user profile:", error);
                setStatus("verified");
                setVerificationMessage(
                  "Email verified! Setting up your wallet...",
                );
              }
            }
          }
        } catch (error) {
          console.error("Error in periodic email verification check:", error);
        }
      }, 3000); // Check every 3 seconds

      // Cleanup interval on unmount
      return () => {
        clearInterval(checkInterval);
        unsubscribe();
      };
    }
  }, [status, currentUser, router, redirectPath]);

  const isWaiting = status === "waiting";

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <ToastContainer />
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create an account</CardTitle>
        {/* <CardDescription>
          {status === "waiting"
            ? "Verify your email to continue"
            : "Sign up with your Google account"}
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        {status === "form" ? (
          <form>
            <div className="grid gap-6">
              {/* <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 bg-[#9B51E0]"
                  onClick={handleSignupWithGoogle}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-4"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </div> */}
              {/* <div className="relative text-center text-sm"> */}
              {/* <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span> */}
              {/* <div className="absolute left-0 right-0 bottom-0 h-px bg-border" /> */}
              {/* </div> */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={handleNameChange}
                  required
                  aria-invalid={!!nameError}
                />
                {nameError && (
                  <span className="text-red-500 text-xs">{nameError}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  aria-invalid={!!emailError}
                />
                {emailError && (
                  <span className="text-red-500 text-xs">{emailError}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    aria-invalid={!!passwordError}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {passwordError && (
                  <span className="text-red-500 text-xs">{passwordError}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeatPassword">Repeat Password</Label>
                <div className="relative">
                  <Input
                    id="repeatPassword"
                    type={showRepeatPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                    required
                    aria-invalid={!!repeatPasswordError}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  >
                    {showRepeatPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {repeatPasswordError && (
                  <span className="text-red-500 text-xs">
                    {repeatPasswordError}
                  </span>
                )}
              </div>
              <div className="text-center h-6">
                {accountStatus && (
                  <p className="text-destructive">{accountStatus}</p>
                )}
              </div>
              <Button
                disabled={
                  isWaiting || !name || !email || !password || !repeatPassword
                }
                onClick={handlesignupclick}
                className="w-full bg-[#9B51E0]"
              >
                {isWaiting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Sign up"
                )}
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  if (onLoginClick) onLoginClick();
                  else setLoginorsignup(false);
                }}
                className="underline underline-offset-4"
              >
                Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Loader2 className="size-8 animate-spin" />
            <p className="text-center">
              {verificationMessage ||
                "Initializing account, this will only take a moment..."}
            </p>
            <p className="text-sm text-muted-foreground">
              You&apos;ll be automatically redirected once verified.
            </p>
            <p className="text-sm text-muted-foreground">{accountStatus}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
