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
import {
  authStateListener,
  getCurrentUser,
  signInUser,
} from "@/lib/services/authService";
import { loginorsignup } from "@/state/connectedWalletStarknetkitNext";
import { useSetAtom } from "jotai";
import { loginUserWithEmail, resetUserPassword } from "@/lib/userutils";
import { Bounce, toast, ToastContainer } from "react-toastify";

export function LoginForm({
  onSignupClick,
  redirectPath,
  className = "",
}: {
  onSignupClick?: () => void;
  redirectPath?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isloaderLoading, setIsloaderLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);
  const [accountloadProgress, setAccountloadProgress] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const setLoginorsignup = useSetAtom(loginorsignup);

  const handleLoginWithGoogle = async () => {
    setAccountloadProgress(true);
    setAccountStatus("Signing in with Google...");
    try {
      const user = await signInUser(setAccountStatus);
      if (user) {
        setAccountStatus("Sign in complete! Redirecting...");
        router.push(redirectPath || "/Home");
      } else {
        setAccountStatus("Error during sign in");
        setAccountloadProgress(false);
      }
    } catch (error) {
      toast.error("Sign in failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Sign in failed:", error);
    }
  };

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setEmailError("");
    setPasswordError("");
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password cannot be empty.");
      valid = false;
    }
    if (!valid) return;
    setIsloaderLoading(true);
    try {
      const user = await loginUserWithEmail(email, password);
      if (user) {
        // Force reload to propagate auth state globally
        window.location.reload();
        toast.success("Login successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error: any) {
      toast.error("Invalid email or password", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setTimeout(() => {
        setIsloaderLoading(false);
      }, 3000);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetUserPassword(resetEmail);
      setResetSent(true);
      // toast.success("Password reset email sent!");
    } catch (error: any) {
      // toast.error(error.message);
    }
  };

  if (showReset) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            {resetSent
              ? `Check ${resetEmail} for reset instructions`
              : "Enter your email to receive a reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!resetSent ? (
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={handleResetPassword}
                className="w-full bg-[#9B51E0]"
              >
                Send Reset Link
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowReset(false)}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-center">
                We&apos;ve sent password reset instructions to {resetEmail}
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowReset(false);
                  setResetSent(false);
                }}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        {accountStatus ? (
          <div className="mb-2 text-center text-sm font-medium">
            {accountStatus}
          </div>
        ) : (
          <CardDescription>Login with your Google account</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                type="button"
                className="w-full flex items-center gap-2 bg-[#9B51E0]"
                onClick={handleLoginWithGoogle}
              >
                {accountloadProgress ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
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
                    Continue with Google
                  </div>
                )}
              </Button>
            </div>
            <div className="relative text-center text-sm">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
              <div className="absolute left-0 right-0 bottom-0 h-px bg-border" />
            </div>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!emailError}
                />
                {emailError && (
                  <span className="text-red-500 text-xs">{emailError}</span>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    onClick={() => setShowReset(true)}
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <div className="text-center h-6">
                  {accountStatus && <p>{accountStatus}</p>}
                </div>
              </div>
              <Button
                type="submit"
                onClick={handleLogin}
                disabled={
                  isloaderLoading ||
                  !email ||
                  !password ||
                  !!emailError ||
                  !!passwordError
                }
                className="w-full bg-[#9B51E0]"
              >
                {isloaderLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  if (onSignupClick) onSignupClick();
                  else setLoginorsignup(true);
                }}
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
