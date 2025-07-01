// src/components/playlist/SectionHeader.tsx
import React from "react";

interface SectionHeaderProps {
  title: string;
  count?: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, count }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
      {count && (
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {count} cursos
        </span>
      )}
    </div>
  );
};

export default SectionHeader;
