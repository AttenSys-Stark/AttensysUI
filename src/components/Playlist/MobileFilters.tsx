// src/components/playlist/MobileFilters.tsx
import React, { useState } from "react";
import { X } from "lucide-react";

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ isOpen, onClose }) => {
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
    <div
      className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Filtros y Categorías
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Categorías</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    activeCategory === category
                      ? "bg-blue-50 text-blue-600 border border-blue-200 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
