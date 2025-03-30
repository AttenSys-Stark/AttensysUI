import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { provider } from "@/constants";
import { useFetchCID } from "@/hooks/useFetchCID";
import { getAllCoursesInfo } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import "react-multi-carousel/lib/styles.css";
import { CardWithLink } from "./Cards";

interface ChildComponentProps {
  wallet: any;
}

interface CourseType {
  data: any;
  owner: string;
  course_identifier: number;
  accessment: boolean;
  uri: Uri;
  course_ipfs_uri: string;
  is_suspended: boolean;
}

interface Uri {
  first: string;
  second: string;
}

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 820 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 820, min: 0 },
    items: 1,
  },
};

const CarouselComp: React.FC<ChildComponentProps> = ({ wallet }) => {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseData, setCourseData] = useState<CourseType[]>([]);
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();
  const getAllCourses = async () => {
    const res: CourseType[] = await getAllCoursesInfo();
    setCourses(res);
  };

  const getCourse = async () => {
    const resolvedCourses = await Promise.all(
      courses.map(async (course: CourseType) => {
        if (!course.course_ipfs_uri) {
          console.warn(`Skipping invalid IPFS URL: ${course.course_ipfs_uri}`);
          return null; // Skip invalid URLs
        }

        try {
          return await fetchCIDContent(course.course_ipfs_uri);
        } catch (error) {
          console.error("Error fetching from IPFS:", error);
          return null; // Skip on failure
        }
      }),
    );

    // Filter out null values before updating state
    const validCourses = resolvedCourses.filter(
      (course): course is any => course !== null,
    );

    // Remove duplicates before updating state
    setCourseData((prevCourses) => {
      const uniqueCourses = [
        ...prevCourses,
        ...validCourses.filter(
          (newCourse) =>
            !prevCourses.some(
              (prev) => prev.data.courseName === newCourse.data.courseName,
            ),
        ),
      ];
      return uniqueCourses;
    });
  };

  useEffect(() => {
    getAllCourses();
  }, [provider]);

  useEffect(() => {
    getCourse();
  }, [courses]);
  return (
    <div className="w-full h-full mx-auto lg:flex flex-col justify-center items-center">
      <Carousel
        className="course-carousel"
        responsive={responsive}
        centerMode={true}
        containerClass="container"
        additionalTransfrom={0}
        arrows
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass="carousel-item-custom"
        keyBoardControl
        minimumTouchDrag={80}
        autoPlay={true}
        autoPlaySpeed={3000}
      >
        {courseData.map((courseSent, index) => (
          <div key={index}>
            <CardWithLink data={courseSent} wallet={wallet} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComp;
