"use client";

import React, { useState } from "react";
import { Filter, Search, Grid, List } from "lucide-react";

/* Components */
import CourseCard from "@/components/Playlist/CourseCard";
import SectionHeader from "@/components/Playlist/SectionHeader";
import CategoryNavigation from "@/components/Playlist/CategoryNavigation";
import MobileFilters from "@/components/Playlist/MobileFilters";
import DecorativeBanner from "@/components/Playlist/DecorativeBanner";

/* Data & types */
import {
  mostViewedCourses,
  web3AfrikaCourses,
  moonshotCourses,
} from "@/Data/courseData";
import { Course } from "@/types/Course";

const PlaylistPage: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMostViewed = mostViewedCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop category navigation */}
      <CategoryNavigation />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Playlist</h1>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {viewMode === "grid" ? (
                  <List className="w-5 h-5" />
                ) : (
                  <Grid className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setIsFiltersOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Most-viewed section */}
        <section className="mb-12">
          <SectionHeader
            title="Most Viewed"
            count={filteredMostViewed.length}
          />
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredMostViewed.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Decorative banner */}
        <DecorativeBanner />

        {/* Web3Afrika */}
        <section className="mb-12">
          <SectionHeader title="Web3Afrika" count={web3AfrikaCourses.length} />
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {web3AfrikaCourses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Moonshot Africa */}
        <section className="mb-12">
          <SectionHeader
            title="Moonshot Africa"
            count={moonshotCourses.length}
          />
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {moonshotCourses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile filters */}
      <MobileFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </div>
  );
};

export default PlaylistPage;
