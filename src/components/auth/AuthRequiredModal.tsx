import React, { useState } from "react";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { LoginForm } from "../login-form";
import { SignupForm } from "../signup-form";
import { useAuth } from "@/context/AuthContext";

interface AuthRequiredModalProps {
  open: boolean;
  coursePath: string;
}

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  open,
  coursePath,
}) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { user } = useAuth();

  // After login/signup, redirect to the course page
  // The LoginForm and SignupForm should handle redirecting to coursePath after success

  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" />
      {/* Modal content above background */}
      <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center p-1 sm:p-2 md:p-4">
        <DialogPanel className="relative w-full sm:max-w-xl md:max-w-2xl mx-auto my-1 sm:my-2 md:my-4 lg:my-8 border border-gray-200 rounded-2xl sm:rounded-3xl shadow-3xl px-0 py-0 flex flex-col items-center gap-0 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(155, 81, 224, 0.1) 0%, rgba(88, 1, 169, 0.15) 50%, rgba(74, 144, 226, 0.1) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              }}
            />
          </div>
          {/* Modal content above background */}
          <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-10 py-3 sm:py-4 md:py-6 lg:py-8 flex flex-col items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 text-white">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-center mb-0 tracking-tight text-white drop-shadow-lg">
              Sign in to continue
            </h2>
            <p className="text-center mb-1 sm:mb-2 md:mb-3 lg:mb-4 text-xs sm:text-sm md:text-base text-gray-200">
              You must be signed in to view this course.
            </p>
            <div className="w-[80%] sm:w-[60%] md:w-[50%] flex justify-center mb-2 sm:mb-3 md:mb-4 lg:mb-6 bg-white bg-opacity-10 rounded-full p-0.5 sm:p-1 gap-1 sm:gap-2">
              <button
                className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-semibold border transition-colors text-xs sm:text-sm md:text-base ${mode === "login" ? "bg-[#9B51E0] text-white shadow" : "bg-transparent text-white border-white"}`}
                onClick={() => setMode("login")}
                disabled={mode === "login"}
              >
                Login
              </button>
              <button
                className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-semibold border transition-colors text-xs sm:text-sm md:text-base ${mode === "signup" ? "bg-[#9B51E0] text-white shadow" : "bg-transparent text-white border-white"}`}
                onClick={() => setMode("signup")}
                disabled={mode === "signup"}
              >
                Signup
              </button>
            </div>
            <div className="w-full flex justify-center">
              {mode === "login" ? (
                <LoginForm
                  onSignupClick={() => setMode("signup")}
                  redirectPath={coursePath}
                  className="w-full"
                />
              ) : (
                <SignupForm
                  onLoginClick={() => setMode("login")}
                  redirectPath={coursePath}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AuthRequiredModal;
