"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CourseSlugPageProps {
  params: {
    slug: string;
  };
}

export default function CourseSlugPage({ params }: CourseSlugPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = params;
  const courseId = searchParams.get("id");

  useEffect(() => {
    // If we have a course ID, redirect to the full course page
    if (courseId) {
      const fullUrl = `/coursepage/View%20Course?id=${courseId}`;
      router.replace(fullUrl);
    } else {
      // If no course ID, try to extract it from the slug
      // This would require a lookup table or database query
      // For now, redirect to home if no ID is found
      router.replace("/Home");
    }
  }, [slug, courseId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B51E0] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading course...</p>
      </div>
    </div>
  );
}
