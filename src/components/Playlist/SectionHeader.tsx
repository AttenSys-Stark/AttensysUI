// components/SectionHeader.tsx
import React from "react";

interface SectionHeaderProps {
  title: string;
  logoColor?: string;
  showLogo?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  logoColor = "bg-black",
  showLogo = false,
}) => {
  return (
    <div className="flex items-center mb-6">
      {showLogo && (
        <div className={`w-8 h-8 ${logoColor} rounded-full mr-3`}></div>
      )}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
  );
};

export default SectionHeader;
