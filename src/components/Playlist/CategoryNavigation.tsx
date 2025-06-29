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
    <div className="bg-blue-500 py-4">
      <div className="flex justify-center items-center">
        <nav className="flex flex-wrap gap-6 px-4">
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className="text-white hover:text-blue-100 transition-colors duration-200 whitespace-nowrap"
            >
              {category}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CategoryNavigation;
