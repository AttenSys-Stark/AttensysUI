/**
 * Utility functions for tracking course progress across components
 */

/**
 * Generates a consistent course ID for localStorage keys
 * @param courseData - Course data object
 * @returns Consistent course ID string
 */
export const generateCourseId = (courseData: any): string => {
  // Priority: course_identifier > courseName > fallback
  if (courseData?.course_identifier) {
    const id = courseData.course_identifier.toString();
    return id;
  }
  if (courseData?.data?.courseName) {
    const name = courseData.data.courseName;
    return name;
  }
  if (courseData?.courseName) {
    const name = courseData.courseName;
    return name;
  }
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
