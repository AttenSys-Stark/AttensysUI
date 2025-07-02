import React, { useState } from "react";

const CategoryNavigation = () => {
  const categories = [
    "All Courses",
    "Design",
    "Development",
    "Marketing",
    "Health & Fitness",
    "Business",
    "IT & Software",
    "Crypto",
    "Artificial Intelligence",
  ];

  const [activeCategory, setActiveCategory] = useState("All Courses");

  return (
    <div className="hidden lg:block bg-gradient-to-r from-blue-600 to-purple-600 py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <nav className="flex justify-center">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap py-2 px-4 rounded-lg transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-white text-blue-600 font-semibold shadow-md"
                    : "text-white hover:text-blue-100 hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default CategoryNavigation;
