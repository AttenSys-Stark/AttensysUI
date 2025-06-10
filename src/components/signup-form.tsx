"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

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
import { signUp } from "@/server/users";
import { loginorsignup } from "@/state/connectedWalletStarknetkitNext";
import { useSetAtom } from "jotai";
import { signIn } from "@/server/users";
import {
  authStateListener,
  getCurrentUser,
  signInUser,
} from "@/lib/services/authService";
import {
  checkEmailVerification,
  createUserProfile,
  signUpUserWithEmail,
} from "@/lib/userutils";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { toast, ToastContainer } from "react-toastify";

export function SignupForm({ onLoginClick }: { onLoginClick?: () => void }) {
  const [signUpResult, formAction, isLoading] = useActionState(signUp, null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [status, setStatus] = useState<"form" | "waiting" | "verified">("form");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);

  const router = useRouter();
  const setLoginorsignup = useSetAtom(loginorsignup);

  if (signUpResult?.redirect) {
    router.push(signUpResult.redirect);
  }

  const handleSignupWithGoogle = async () => {
    try {
      const user = await signInUser();
      if (user) {
        router.push("/Home");
        console.log("Signed in user:", user);
        // Redirect or update UI
      } else {
        console.log("error in Signed in user:", user);
        // Redirect or update UI
      }
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRepeatPassword(e.target.value);
  };
  const handlesignupclick = async () => {
    if (password !== repeatPassword) {
      console.log("Passwords do not match");
      return;
    }
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

      checkEmailVerification(user?.user)
        .then(() => {
          setStatus("verified");
          router.push("/Home");
        })
        .catch((error) => {
          setStatus("form");
          console.error("Verification error:", error);
        });
    } catch (error: any) {
      if (error?.code === "auth/email-already-in-use") {
        setStatus("form");
        setAccountStatus("Email already in use");
        toast.error("Email already in use");
        console.log("Email already in use");
      }
    }
  };

  // Add listener for auth state changes
  useEffect(() => {
    if (status === "waiting" && currentUser) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && user.uid === currentUser.uid) {
          const isVerified = await checkEmailVerification(user);
          if (isVerified) {
            setStatus("verified");
            router.push("/Home");
          }
        }
      });
      return () => unsubscribe();
    }
  }, [status, currentUser]);

  return (
    <Card className="w-[100%] lg:w-[40%]">
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
          <form action={formAction}>
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
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <div className="flex items-center">
                    <Label htmlFor="password">Repeat Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    value={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                  />
                  <div className="text-center h-6">
                    {signUpResult?.errors && (
                      <p className="text-destructive">
                        {signUpResult.errors.message}
                      </p>
                    )}

                    {signUpResult?.values && <p>{signUpResult.values.text}</p>}
                  </div>
                </div>
                <Button
                  disabled={isLoading}
                  onClick={handlesignupclick}
                  className="w-full bg-[#9B51E0]"
                >
                  {isLoading ? (
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
