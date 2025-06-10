import React, { useEffect, useState, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { provider } from "@/constants";
import { useFetchCID } from "@/hooks/useFetchCID";
import { getAllCoursesInfo } from "@/utils/helpers";
import { CardWithLink } from "./Cards";

interface ChildComponentProps {
  wallet: any;
  averagereviewrating: any;
}

interface CourseType {
  data: any;
  owner: string;
  course_identifier: number;
  accessment: boolean;
  uri: Uri;
  course_ipfs_uri: string;
  is_suspended: boolean;
  is_approved: boolean;
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
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const CarouselComp: React.FC<ChildComponentProps> = ({
  wallet,
  averagereviewrating,
}) => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseData, setCourseData] = useState<CourseType[]>([]);
  const [randomIndices, setRandomIndices] = useState<number[]>([]);
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();
  const carouselRef = useRef<Carousel>(null);

  // Function to generate random indices with no consecutive duplicates
  const generateRandomIndices = (arrayLength: number, count: number) => {
    if (arrayLength <= 1) return [0]; // Handle edge case

    const indices: number[] = [];
    let lastIndex = -1;

    while (indices.length < Math.min(count, arrayLength)) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * arrayLength);
      } while (randomIndex === lastIndex);

      indices.push(randomIndex);
      lastIndex = randomIndex;
    }

    return indices;
  };

  // Update random indices when courseData changes
  useEffect(() => {
    if (courseData.length > 0) {
      setRandomIndices(generateRandomIndices(courseData.length, 15)); // Show 5 random courses
    }
  }, [courseData]);

  const getAllCourses = async () => {
    const res: CourseType[] = await getAllCoursesInfo();
    setCourses(res);
  };

  const getCourse = async () => {
    const resolvedCourses = await Promise.all(
      courses.map(async (course: CourseType) => {
        if (!course.course_ipfs_uri) {
          console.warn(`Skipping invalid IPFS URL: ${course.course_ipfs_uri}`);
          return null;
        }
        if (course.is_approved) {
          const content = await fetchCIDContent(course.course_ipfs_uri);
          if (content) {
            return {
              ...content,
              course_identifier: course.course_identifier,
              owner: course.owner,
              course_ipfs_uri: course.course_ipfs_uri,
              is_suspended: course.is_suspended,
            };
          }
          return null;
        }
      }),
    );

    // Filter out null values
    const validCourses = resolvedCourses.filter(
      (course): course is CourseType => course !== null && course !== undefined,
    );

    // Remove duplicates before updating state
    setCourseData((prevCourses) => {
      const uniqueCourses = [
        ...prevCourses,
        ...validCourses.filter(
          (newCourse) =>
            !prevCourses.some(
              (prev) => prev?.data?.courseName === newCourse?.data?.courseName,
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
        className="course-carousel hidden sm:block"
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
        {randomIndices.map((index) => (
          <div key={index}>
            {courseData[index] !== undefined && (
              <CardWithLink
                data={courseData[index]}
                wallet={wallet}
                rating={averagereviewrating}
              />
            )}
          </div>
        ))}
      </Carousel>

      <Carousel
        className="block sm:hidden"
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={[]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        arrows={true}
        draggable
        focusOnSelect={false}
        minimumTouchDrag={80}
      >
        {randomIndices.map((index) => (
          // console.log("coursell data",courseData[index]),
          <div key={index}>
            {courseData[index] !== undefined && (
              <CardWithLink
                data={courseData[index]}
                wallet={wallet}
                rating={averagereviewrating}
              />
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComp;
