// components/RevenueCard.tsx
import React from "react";
import { BookOpen } from "lucide-react";
import { Course } from "@/types/Course";

interface RevenueCardProps {
  course: Course;
}

const RevenueCard: React.FC<RevenueCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
          {course.views}
        </div>
        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
          {course.estimatedRevenue}
        </div>
        <div className="absolute bottom-2 right-2">
          <div className="bg-blue-500 rounded p-1">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-2">
          <img
            src={course.providerLogo}
            alt={course.provider}
            className="w-6 h-6 rounded-full mr-2 object-cover"
          />
          <div>
            <h3 className="font-semibold text-sm text-gray-800">
              {course.title}
            </h3>
            <p className="text-xs text-gray-600">{course.provider}</p>
          </div>
        </div>

        <div className="text-xs">
          <span className="text-purple-600 font-semibold">
            Certified Courses
          </span>
          <span className="text-gray-500 ml-1">• {course.classes} classes</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
