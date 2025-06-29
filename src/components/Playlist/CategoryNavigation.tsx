// components/CategoryNavigation.tsx
import React from "react";

const CategoryNavigation = () => {
  const categories = [
    "Design",
    "Development",
    "Marketing",
    "Health & Fitness",
    "Business",
    "IT & Software",
    "Crypto",
    "Artificial Intelligence",
  ];

  return (
    <div className="bg-blue-500 px-6 py-3">
      <div className="flex space-x-6 overflow-x-auto">
        {categories.map((category, index) => (
          <button
            key={index}
            className="text-white whitespace-nowrap hover:text-blue-200 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;
