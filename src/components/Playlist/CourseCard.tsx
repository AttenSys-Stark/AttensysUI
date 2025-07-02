import React from "react";
import { Eye, BookOpen } from "lucide-react";
import { Course } from "@/types/Course";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {course.estimatedRevenue && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            {course.estimatedRevenue}
          </div>
        )}
        <div className="absolute bottom-3 right-3">
          <div className="bg-blue-600 rounded-lg p-2 shadow-lg">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start space-x-3">
          <img
            src={course.providerLogo}
            alt={course.provider}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{course.provider}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center text-gray-500">
                <Eye className="w-4 h-4 mr-1" />
                {course.views} views
              </span>
              <span className="flex items-center text-blue-600 font-medium">
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

export default CourseCard;
