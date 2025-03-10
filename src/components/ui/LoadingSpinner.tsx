"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  text?: string;
  thickness?: "thin" | "normal" | "thick";
  speed?: "slow" | "normal" | "fast";
  variant?: "button" | "fullscreen" | "inline";
  colorVariant?: "primary" | "secondary" | "white" | "black";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  showText = false,
  text = "Loading...",
  thickness = "normal",
  speed = "normal",
  variant = "inline",
  colorVariant = "primary",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const thicknessClasses = {
    thin: "border-2",
    normal: "border-3",
    thick: "border-4",
  };

  const speedClasses = {
    slow: "animate-spin-slow",
    normal: "animate-spin",
    fast: "animate-spin-fast",
  };

  const variantClasses = {
    button: "mr-2",
    fullscreen:
      "fixed inset-0 bg-black/20 z-50 flex items-center justify-center",
    inline: "flex items-center justify-center",
  };

  const colorClasses = {
    primary: "border-t-[#9A51DF] border-r-[#9A51DF]",
    secondary: "border-t-blue-500 border-r-blue-500",
    white: "border-t-white border-r-white",
    black: "border-t-black border-r-black",
  };

  const SpinnerElement = (
    <div
      role="status"
      aria-label={text}
      className={cn("relative", variantClasses[variant], className)}
    >
      <div
        className={cn(
          "rounded-full border-solid",
          colorClasses[colorVariant],
          "border-b-transparent border-l-transparent",
          sizeClasses[size],
          thicknessClasses[thickness],
          speedClasses[speed],
        )}
      />
      {showText && <span className="ml-2 text-sm font-medium">{text}</span>}
      <span className="sr-only">{text}</span>
    </div>
  );

  if (variant === "fullscreen") {
    return (
      <div className={variantClasses.fullscreen}>
        <div className="flex items-center gap-2 rounded-lg bg-white p-4 shadow-lg">
          {SpinnerElement}
        </div>
      </div>
    );
  }

  return SpinnerElement;
};

export default LoadingSpinner;
