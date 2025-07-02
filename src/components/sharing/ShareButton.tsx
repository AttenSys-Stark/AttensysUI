import React from "react";
import Image from "next/image";
import share from "@/assets/share.svg";

interface ShareButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const ShareButton: React.FC<ShareButtonProps> = ({
  onClick,
  className = "",
  children,
  variant = "primary",
  size = "md",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#9B51E0] to-[#5801A9] hover:from-[#5801A9] hover:to-[#9B51E0] text-white shadow-lg hover:shadow-xl focus:ring-[#9B51E0]",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 focus:ring-gray-400",
    outline:
      "bg-transparent border-2 border-[#9B51E0] text-[#9B51E0] hover:bg-[#9B51E0] hover:text-white focus:ring-[#9B51E0]",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      <div className="relative">
        <Image
          src={share}
          alt="Share"
          className={`${iconSizes[size]} transition-transform duration-200 group-hover:scale-110`}
        />
      </div>
      {children && (
        <span className="font-semibold tracking-wide">{children}</span>
      )}
    </button>
  );
};

export default ShareButton;
