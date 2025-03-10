import React, { FC, useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import robotImg from "../../assets/robot.svg";
import Image from "next/image";
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar";
import {
  getAllCoursesInfo,
  handleCourse,
  handleCoursehome,
} from "@/utils/helpers";
import { useRouter } from "next/navigation";
import StarRating from "../bootcamp/StarRating";
import { attensysCourseAddress } from "@/deployments/contracts";
import { attensysCourseAbi } from "@/deployments/abi";
import { Contract } from "starknet";
import { provider } from "@/constants";
import { pinata } from "../../../utils/config";
import "react-multi-carousel/lib/styles.css";
import { GetCIDResponse } from "pinata";
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

  const getAllCourses = async () => {
    const res: CourseType[] = await getAllCoursesInfo();
    setCourses(res);
  };

  const getPubIpfs = async (CID: string) => {
    try {
      //@ts-ignore
      const data = await pinata.gateways.get(CID);

      // const courseImage: GetCIDResponse = await pinata.gateways.get(
      //   //@ts-ignore
      //   data?.data?.courseImage,
      // );

      return data;
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
    }
  };

  const getCourse = async () => {
    const resolvedCourses = await Promise.all(
      courses.map(async (course: CourseType) => {
        if (!course.course_ipfs_uri) {
          console.warn(`Skipping invalid IPFS URL: ${course.course_ipfs_uri}`);
          return null; // Skip invalid URLs
        }

        try {
          return await getPubIpfs(course.course_ipfs_uri);
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
    <div className=" w-full h-full mx-auto lg:flex flex-col justify-center items-center ">
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
