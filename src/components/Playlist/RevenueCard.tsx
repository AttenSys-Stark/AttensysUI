import React from "react";
import { Eye, BookOpen } from "lucide-react";
import { Course } from "@/types/Course";

interface RevenueCardProps {
  course: Course;
}

const RevenueCard: React.FC<RevenueCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow min-w-0">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-40 object-cover"
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

      <div className="p-4 pt-3">
        <div className="flex items-start mb-4">
          <img
            src={course.providerLogo}
            alt={course.provider}
            className="w-8 h-8 rounded-full mr-3 object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base text-gray-900 leading-tight mb-2 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{course.provider}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-purple-600 font-semibold">
                Certified Courses
              </span>
              <span className="text-blue-600 flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {course.classes} classes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
