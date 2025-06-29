// components/CourseCard.tsx
import React from "react";
import { Eye, BookOpen } from "lucide-react";
import { Course } from "@/types/Course";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-32 object-cover"
        />
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

        <div className="flex justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {course.views} views
          </span>
          <span className="flex items-center">
            <BookOpen className="w-3 h-3 mr-1" />
            {course.classes} classes
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
