// pages/CoursePlatform.tsx
import React from "react";
import CategoryNavigation from "@/components/Playlist/CategoryNavigation";
import CourseCard from "@/components/Playlist/CourseCard";
import RevenueCard from "@/components/Playlist/RevenueCard";
import DecorativeBanner from "@/components/Playlist/DecorativeBanner";
import SectionHeader from "@/components/Playlist/SectionHeader";
import {
  mostViewedCourses,
  web3AfrikaCourses,
  moonshotCourses,
} from "@/Data/courseData";

const CoursePlatform: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación de categorías */}
      <CategoryNavigation />

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-8">
        {/* Sección Most Viewed */}
        <section className="mb-12">
          <SectionHeader title="Most Viewed" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostViewedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Banner decorativo */}
        <DecorativeBanner />

        {/* Sección Web3Afrika */}
        <section className="mb-12">
          <SectionHeader
            title="Web3Afrika"
            logoColor="bg-black"
            showLogo={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {web3AfrikaCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Sección Moonshot */}
        <section>
          <SectionHeader
            title="Moonshot"
            logoColor="bg-green-500"
            showLogo={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {moonshotCourses.map((course) => (
              <RevenueCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CoursePlatform;
