"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorBoundary from "@/components/ErrorBoundary";

interface CourseSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function CourseSlugPageContent({ params }: CourseSlugPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const courseId = searchParams.get("id");

  // Handle async params with better error handling
  useEffect(() => {
    const getParams = async () => {
      try {
        setIsLoading(true);
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error("Error resolving params:", error);
        setError("Failed to load course parameters");
      } finally {
        setIsLoading(false);
      }
    };

    getParams();
  }, [params]);

  useEffect(() => {
    // Only proceed if we're not loading and have no errors
    if (isLoading || error) return;

    try {
      // If we have a course ID, redirect to the full course page
      if (courseId) {
        const fullUrl = `/coursepage/View%20Course?id=${courseId}`;
        router.replace(fullUrl);
      } else {
        // If no course ID, try to extract it from the slug
        // This would require a lookup table or database query
        // For now, redirect to home if no ID is found
        console.warn("No course ID found in URL parameters");
        router.replace("/Home");
      }
    } catch (redirectError) {
      console.error("Error during redirect:", redirectError);
      setError("Failed to redirect to course page");
    }
  }, [slug, courseId, router, isLoading, error]);

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2D3A4B] mb-4">
            Course Not Available
          </h2>
          <p className="text-[#2D3A4B] mb-6">
            {error}. Please try accessing the course from the main page.
          </p>
          <button
            onClick={() => (window.location.href = "/Home")}
            className="bg-[#9b51e0] px-7 py-2 rounded text-[#fff] font-bold hover:bg-[#8a4ad0] transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B51E0] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading course...</p>
      </div>
    </div>
  );
}

export default function CourseSlugPage(props: CourseSlugPageProps) {
  return (
    <ErrorBoundary>
      <CourseSlugPageContent {...props} />
    </ErrorBoundary>
  );
}
