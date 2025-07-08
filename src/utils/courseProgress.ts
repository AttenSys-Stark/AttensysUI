/**
 * Utility functions for tracking course progress across components
 */

/**
 * Generates a consistent course ID for localStorage keys
 * @param courseData - Course data object
 * @returns Consistent course ID string
 */
export const generateCourseId = (courseData: any): string => {
  console.log("[courseProgress] generateCourseId input:", courseData);

  // Priority: course_identifier > courseName > fallback
  if (courseData?.course_identifier) {
    const id = courseData.course_identifier.toString();
    console.log("[courseProgress] Using course_identifier:", id);
    return id;
  }
  if (courseData?.data?.courseName) {
    const name = courseData.data.courseName;
    console.log("[courseProgress] Using data.courseName:", name);
    return name;
  }
  if (courseData?.courseName) {
    const name = courseData.courseName;
    console.log("[courseProgress] Using courseName:", name);
    return name;
  }
  console.log("[courseProgress] Using fallback: unknown_course");
  return "unknown_course";
};

/**
 * Gets watched lectures for a course from localStorage
 * @param courseData - Course data object
 * @returns Array of watched lecture names
 */
export const getWatchedLectures = (courseData: any): string[] => {
  if (typeof window === "undefined") return [];
  const courseId = generateCourseId(courseData);
  const watched = localStorage.getItem(`watched_lectures_${courseId}`);
  console.log(
    `[courseProgress] Getting watched lectures for course ${courseId}:`,
    watched ? JSON.parse(watched) : [],
  );
  return watched ? JSON.parse(watched) : [];
};

/**
 * Marks a lecture as watched in localStorage
 * @param courseData - Course data object
 * @param lectureName - Name of the lecture to mark as watched
 */
export const markLectureAsWatched = (
  courseData: any,
  lectureName: string,
): void => {
  if (typeof window === "undefined") return;
  const courseId = generateCourseId(courseData);
  const watched = getWatchedLectures(courseData);

  if (!watched.includes(lectureName)) {
    watched.push(lectureName);
    localStorage.setItem(
      `watched_lectures_${courseId}`,
      JSON.stringify(watched),
    );
    console.log(
      `[courseProgress] Marked lecture "${lectureName}" as watched for course ${courseId}. Total watched:`,
      watched,
    );
  } else {
    console.log(
      `[courseProgress] Lecture "${lectureName}" already marked as watched for course ${courseId}`,
    );
  }
};

/**
 * Calculates course completion statistics
 * @param courseData - Course data object
 * @param watchedLectures - Array of watched lecture names
 * @returns Completion statistics object
 */
export const calculateCourseStats = (
  courseData: any,
  watchedLectures: string[],
) => {
  const curriculum =
    courseData?.data?.courseCurriculum || courseData?.courseCurriculum || [];
  const totalLectures = curriculum.length;
  const completedLectures = watchedLectures.length;

  console.log(
    `[courseProgress] calculateCourseStats - Course data:`,
    courseData,
  );
  console.log(
    `[courseProgress] calculateCourseStats - Curriculum:`,
    curriculum,
  );
  console.log(
    `[courseProgress] calculateCourseStats - Watched lectures:`,
    watchedLectures,
  );

  // Calculate total watched time
  const totalWatchedTime = curriculum
    .filter((lecture: any) => watchedLectures.includes(lecture.name))
    .reduce(
      (sum: number, lecture: any) =>
        sum + estimateVideoDuration(lecture.fileSize || 0),
      0,
    );

  // Calculate total course time
  const totalCourseTime = curriculum.reduce(
    (sum: number, lecture: any) =>
      sum + estimateVideoDuration(lecture.fileSize || 0),
    0,
  );

  const progressPercentage =
    totalLectures > 0
      ? Math.round((completedLectures / totalLectures) * 100)
      : 0;

  console.log(
    `[courseProgress] Course stats - Total: ${totalLectures}, Completed: ${completedLectures}, Progress: ${progressPercentage}%`,
  );

  return {
    totalLectures,
    completedLectures,
    progressPercentage,
    totalWatchedTime,
    totalCourseTime,
  };
};

/**
 * Helper function to estimate video duration from file size
 * @param fileSize - File size in bytes
 * @returns Estimated duration in seconds
 */
function estimateVideoDuration(fileSize: number): number {
  // Estimate based on average video bitrate (assuming 1 Mbps for compressed video)
  const estimatedBitrate = 1000000; // 1 Mbps in bits per second
  const fileSizeInBits = fileSize * 8; // Convert bytes to bits
  return Math.floor(fileSizeInBits / estimatedBitrate);
}

/**
 * Debug function to inspect localStorage for course progress
 * Can be called from browser console: window.debugCourseProgress()
 */
export const debugCourseProgress = () => {
  if (typeof window === "undefined") return;

  console.log("=== Course Progress Debug ===");
  const keys = Object.keys(localStorage);
  const courseKeys = keys.filter((key) => key.startsWith("watched_lectures_"));

  console.log("All localStorage keys:", keys);
  console.log("Course progress keys:", courseKeys);

  courseKeys.forEach((key) => {
    const value = localStorage.getItem(key);
    console.log(`${key}:`, value ? JSON.parse(value) : null);
  });

  console.log("=== End Debug ===");
};

// Make it available globally for debugging
if (typeof window !== "undefined") {
  (window as any).debugCourseProgress = debugCourseProgress;
}
