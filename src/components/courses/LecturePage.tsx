import podcast from "@/assets/Podcast.svg";
import rich from "@/assets/Richin2024.svg";
import attensys_logo from "@/assets/attensys_logo.svg";
import graduate from "@/assets/grad.svg";
import profile_pic from "@/assets/profile_pic.png";
import youtube from "@/assets/youtube.svg";
import { provider } from "@/constants";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { getAllCoursesInfo } from "@/utils/helpers";
import { GrDiamond } from "@react-icons/all-files/gr/GrDiamond";
import { HiBadgeCheck } from "@react-icons/all-files/hi/HiBadgeCheck";
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LuBadgeCheck } from "react-icons/lu";
import ReactPlayer from "react-player/lazy";
import { Contract } from "starknet";
import StarRating from "../bootcamp/StarRating";
import LoadingSpinner from "../ui/LoadingSpinner";
import { CardWithLink } from "./Cards";

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

const LecturePage = (props: any) => {
  const lectures = [
    {
      img: rich,
      title: "What is Web Development?",
      desc: "An introduction to the world of web development, covering the basics of how websites...",
      timing: 8,
    },
    {
      img: youtube,
      title: "What is Web Development?",
      desc: "An introduction to the world of web development, covering the basics of how websites...",
      timing: 8,
    },
    {
      img: podcast,
      title: "What is Web Development?",
      desc: "An introduction to the world of web development, covering the basics of how websites...",
      timing: 8,
    },
    {
      img: podcast,
      title: "What is Web Development?",
      desc: "An introduction to the world of web development, covering the basics of how websites...",
      timing: 8,
    },
    {
      img: podcast,
      title: "What is Web Development?",
      desc: "An introduction to the world of web development, covering the basics of how websites...",
      timing: 8,
    },
  ];
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseData, setCourseData] = useState<CourseType[]>([]);
  const [durations, setDurations] = useState<{ [key: number]: number }>({});
  const [courseId, setCourseId] = useState<number>();
  const [taken, setTaken] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCertified, setIsCertified] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();

  // console.log("uploading:", isUploading);
  // console.log("taken:", taken);
  // console.log("Certified:", isCertified);

  const handleDuration = (id: number, duration: number) => {
    // Set the duration for the specific video ID
    setDurations((prevDurations) => ({
      ...prevDurations,
      [id]: duration,
    }));
  };

  // Get all courses with CourseType from contract
  const getAllCourses = async () => {
    const res: CourseType[] = await getAllCoursesInfo();
    setCourses(res);
  };

  // Extract courses and informmation
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

  // handle take a course after the course identifier is known
  const handleTakeCourse = async () => {
    setIsUploading(true);

    const courseContract = new Contract(
      attensysCourseAbi,
      attensysCourseAddress,
      props?.wallet?.account,
    );
    const take_course_calldata = await courseContract.populate(
      "acquire_a_course",
      [Number(courseId)],
    );

    const callCourseContract = await props.wallet?.account.execute([
      {
        contractAddress: attensysCourseAddress,
        entrypoint: "acquire_a_course",
        calldata: take_course_calldata.calldata,
      },
    ]);

    await props.wallet?.account?.provider
      .waitForTransaction(callCourseContract.transaction_hash)
      .then(() => {})
      .catch((e: any) => {
        console.error("Error: ", e);
      })
      .finally(() => {
        setTaken(true);
        setIsUploading(false);
      });
  };

  const handleFinishCourseClaimCertfificate = async () => {
    setIsUploading(true);

    const courseContract = new Contract(
      attensysCourseAbi,
      attensysCourseAddress,
      props?.wallet?.account,
    );
    const course_certificate_calldata = await courseContract.populate(
      "finish_course_claim_certification",
      [Number(courseId)],
    );

    const callCourseContract = await props.wallet?.account.execute([
      {
        contractAddress: attensysCourseAddress,
        entrypoint: "finish_course_claim_certification",
        calldata: course_certificate_calldata.calldata,
      },
    ]);

    await props.wallet?.account?.provider
      .waitForTransaction(callCourseContract.transaction_hash)
      .then(() => {})
      .catch((e: any) => {
        console.error("Error: ", e);
      })
      .finally(() => {
        setIsCertified(true);
        setIsUploading(false);
      });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < props?.data.courseCurriculum.length - 1 ? prevIndex + 1 : 0,
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : props?.data.courseCurriculum.length - 1,
    );
  };

  const handleVideoClick = (item: any) => {
    setSelectedVideo(`https://${item.video}`);
  };

  // Find and set the course taken, in order to certify
  const find = async () => {
    try {
      const courseContract = new Contract(
        attensysCourseAbi,
        attensysCourseAddress,
        provider,
      );

      const taken_courses = await courseContract?.is_user_taking_course(
        props.wallet?.selectedAddress,
        Number(courseId),
      );
      console.log("taken_courses result:", taken_courses);

      if (taken_courses) {
        setTaken(true);
      }

      const certfified_courses =
        await courseContract?.is_user_certified_for_course(
          props.wallet?.selectedAddress,
          Number(courseId),
        );

      console.log("certfified_courses result:", certfified_courses);

      if (certfified_courses) {
        setIsCertified(true);
      }
    } catch (err) {
      console.error("Error in find:", err);
    }
  };

  useEffect(() => {
    if (!provider) return;

    getAllCourses();
  }, [provider]);
  useEffect(() => {
    if (courses.length === 0) return;

    getCourse();
  }, [courses]);
  useEffect(() => {
    console.log("here as props", props?.data);
    if (!props?.data?.courseImage) return;

    const foundCourse = courses.find((course, index) => {
      return props?.data?.courseImage === courseData[index]?.data?.courseImage;
    });

    if (foundCourse && foundCourse.course_identifier !== courseId) {
      setCourseId(foundCourse.course_identifier);
    }
  }, [courses, courseData, props?.data?.courseImage, courseId]);
  useEffect(() => {
    if (!Number.isNaN(courseId) && courseId !== undefined) {
      find();
    }
  }, [courseId]);

  // ⛳ Set the first video on page load
  useEffect(() => {
    if (props?.data.courseCurriculum?.length > 0) {
      setSelectedVideo(`https://${props?.data.courseCurriculum[0].video}`);
    }
  }, [props.data]);

  return (
    <div className="pt-6  pb-36 w-full">
      {/* Video and Title */}
      <div className="flex flex-none w-full text-sm space-x-3 items-center px-12">
        <div className="flex flex-none space-x-2 items-center">
          <Image
            src={graduate}
            className="h-[25px] w-[25px]"
            alt="stream_video"
          />
          <p className="text-[16px] text-[#2D3A4B] font-semibold">My Courses</p>
        </div>
        <span className="text-[#9B51E0]">|</span>{" "}
        <p className="w-full truncate text-[16px] text-[#2D3A4B] font-semibold">
          {props?.data?.courseName}
        </p>
      </div>

      {/* ReactPlayer & lecture*/}
      <div className="w-[100%] mx-auto flex justify-between items-center px-12 mt-5">
        <div className="w-full xl:w-[67%] xl:h-[543px] h-auto aspect-video sm:aspect-[16/9] md:aspect-[16/8] lg:aspect-[16/7] rounded-xl overflow-hidden">
          {selectedVideo && (
            <ReactPlayer
              url={selectedVideo}
              width="100%"
              height="100%"
              className="rounded-xl"
              controls
              playing
            />
          )}
        </div>

        {/* Next & Previous Buttons */}
        {/* <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Next
          </button>
        </div> */}

        <div className="hidden xl:block w-[30%] h-[543px] space-y-4">
          <div className="flex space-x-2  justify-center bg-gradient-to-r from-[#5801a9] to-[#4a90e2] text-white items-center text-sm py-3 px-7 rounded-xl">
            <HiBadgeCheck color="#fff" />
            <p>Attensys Certified Course</p>
          </div>
          <h1 className="text-[16px] text-[#2D3A4B] leading-[22px] font-semibold">
            Lecture ({props?.data?.courseCurriculum.length})
          </h1>

          <div className="h-[440px] w-[100%] bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl overflow-scroll scrollbar-hide">
            {props?.data?.courseCurriculum.map((item: any, i: any) => {
              return (
                <div
                  key={i}
                  className="flex w-full space-y-1 items-center p-3 space-x-8 justify-center"
                  onClick={() => handleVideoClick(item)}
                >
                  <p className="font-bold text-[#5801a9]">{i + 1}</p>
                  <div className="w-[150px] h-[120px] rounded-xl border-4 border ">
                    <ReactPlayer
                      light={true}
                      url={`https://${item.video}`}
                      controls
                      playing={false}
                      width="100%"
                      height="100px"
                      onDuration={(duration) => handleDuration(i, duration)}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[14px] font-semibold leading-[30px] text-[#333333]">
                      {item.name}
                    </p>
                    <h1 className="text-[8px] text-[#333333] leading-[14px] font-medium">
                      Creator address
                    </h1>
                    <div className="rounded-lg bg-[#9B51E052] w-[60%] flex items-center justify-center">
                      <p className="text-xs px-7 py-1">
                        {durations[i]?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-[100%] mx-auto flex justify-between items-center px-12 mt-5">
        <div
          className="w-full 
        xl:w-[67%] space-y-3"
        >
          <div className="flex space-x-14 justify-between">
            <h1 className="font-bold text-[24px] text-[#2D3A4B] leading-[31px]">
              {props?.data?.courseName}
            </h1>
            <div className="hidden xl:flex sm:ml-5 space-x-2 items-center">
              <GrDiamond color="#2D3A4B" className="h-[20px] w-[20px]" />
              <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                Difficulty level: {props?.data?.difficultyLevel}
              </p>
            </div>

            <div className="hidden xl:flex space-x-2 items-center">
              <div>
                {isCertified ? (
                  <div className="hidden xl:flex space-x-2 items-center">
                    <div>
                      <LuBadgeCheck className="h-[20px] w-[20px] text-[#5801A9]" />
                    </div>
                    <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                      Certificate of Completion
                    </p>
                  </div>
                ) : (
                  <button
                    className={`hidden sm:block bg-[#9b51e0] px-7 py-2 rounded text-[#fff] font-bold`}
                    onClick={
                      taken
                        ? handleFinishCourseClaimCertfificate
                        : handleTakeCourse
                    }
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" colorVariant="white" />
                        {taken ? "Claiming Certificate..." : "Taking Course..."}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {taken ? "Get Certificate" : "Take Course"}
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="text-[14px] text-[#2D3A4B] leading-[18px] font-medium">
              Created by{" "}
              <span className="underline text-[#5801A9]">
                {props?.data?.courseCreator}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-[url('/hero_asset.png')] text-white p-10 rounded-xl w-[30%] hidden xl:flex items-center justify-center h-[85px]">
          <Image src={attensys_logo} alt="logo" />
        </div>
      </div>

      <div className="w-[100%] mx-auto flex justify-between px-6 xl:px-12 mt-5">
        <div className="w-full xl:w-[67%] h-auto space-y-12">
          <div className="h-auto w-full rounded-xl xl:bg-[#FFFFFF] xl:border-[1px] xl:border-[#D9D9D9] xl:p-10">
            <div className="pb-4">
              <p className="font-bold py-2 text-[14px] text-[#333333] leading-[22px]">
                About this course
              </p>
              <p className="text-[14px] text-[#333333] leading-[22px] font-light">
                {props?.data?.courseDescription}
              </p>
            </div>
            <div className="py-4">
              <p className="font-bold py-2 text-[14px] text-[#333333] leading-[22px]">
                {" "}
                Student Requirements
              </p>
              <ul className="text-[14px] text-[#333333] leading-[22px] font-light list-disc">
                {/* <li>A computer with internet access</li>
                <li>Basic computer skills</li>
                <li>Willingness to learn and experiment</li> */}
                {props?.data?.studentRequirements}
              </ul>
            </div>
            <div className="py-6">
              <p className="font-bold py-2 text-[14px] text-[#333333] leading-[22px]">
                {" "}
                Target Audience
              </p>

              <div>
                <p>{props?.data?.targetAudience}</p>

                <p>{props?.data?.targetAudienceDesc}</p>
              </div>
            </div>
          </div>

          {/* Lectures */}
          <div className="flex xl:hidden flex-col">
            <p className="mt-8 font-semibold">Lectures(4)</p>
            <div className=" w-[100%] bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl overflow-scroll scrollbar-hide">
              {lectures.map((item, i) => (
                <div
                  key={i}
                  className="flex w-full space-y-1 items-center p-3 space-x-6 justify-center"
                >
                  <p className="font-bold text-[#5801a9]">{i + 1}</p>
                  <div className="w-[131px] h-[84px] rounded-xl">
                    <Image
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[14px] font-semibold leading-[30px] text-[#333333]">
                      {item.title}
                    </p>
                    <h1 className="text-[8px] text-[#333333] leading-[14px] font-medium">
                      Creator address
                    </h1>
                    <div className="rounded-lg bg-[#9B51E052] w-[40%] flex items-center justify-center">
                      <p className="text-xs px-4 py-1">{item.timing}: 01</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4 hidden xl:flex flex-col">
            <h1 className="text-[16px] font-bold text-[#2D3A4B] leading-[22px]">
              Leave a review
            </h1>
            <div className="h-[610px] pb-10 w-full rounded-xl bg-[#FFFFFF] border-[1px] border-[#D9D9D9]">
              <div className="flex justify-between items-center h-[100px] w-full border-b-[1px] border-b-[#EBECEE] px-10">
                <div className="h-full w-[30%] flex items-center justify-center border-r-[1px] border-r-[#EBECEE]">
                  <div className="flex items-center w-full space-x-3">
                    <Image src={profile_pic} alt="pic" width={60} />
                    <div className="space-y-1">
                      <h4 className="text-[16px] text-[#333333] leading-[22px] font-semibold">
                        0xRavenclaw
                      </h4>
                      <p className="text-[#9b51e0] text-[12px] font-medium leading-[14px]">
                        0x5c956e61...de5232dc11
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-full w-[30%] space-x-3 flex items-center border-r-[1px] border-r-[#EBECEE]">
                  <h1 className="text-[14px] text-[#333333] leading-[16px] font-medium">
                    Tap to rate:
                  </h1>
                  <StarRating totalStars={5} starnumber={0} />
                </div>
                <div className="h-full w-[30%] flex items-center space-x-3">
                  <StarRating totalStars={5} starnumber={4} />
                  <h1 className="text-[14px] text-[#333333] leading-[16px] font-medium">
                    <span className="text-[#A01B9B]">1,245</span> students
                  </h1>
                </div>
              </div>
              <div className="px-10 mt-8 flex items-center space-x-4">
                {/* input and button */}
                <input
                  type="text"
                  placeholder="What do you think about this course?"
                  className="w-[75%] h-[45px] border shadow-dm p-6 rounded-xl text-[14px] font-medium leading-[16px]"
                />

                <button className="hidden sm:block bg-[#9b51e0] px-7 py-2 rounded text-[#fff] font-bold">
                  Send review
                </button>
              </div>

              <div className="px-10 mt-10 space-y-10 h-[380px] overflow-y-scroll pb-10 ">
                <div className="space-y-6">
                  <div className="flex space-x-3 items-center">
                    <div className="h-[64px] w-[64px] bg-[#9B51E01A] text-[20px] text-[#101928] leading-[24px] rounded-full flex items-center justify-center">
                      OM
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-[14px] text-[#333333] font-semibold leading-[22px]">
                        Olivia
                      </h1>
                      <StarRating totalStars={5} starnumber={4} />
                    </div>
                  </div>
                  <p className="w-[730px] text-[14px] text-[#333333] font-medium leading-[22px]">
                    Halfway through the course and lots of information given in
                    every chapter. Concise and easy to understand, very useful
                    to apply to any Web design journey!
                  </p>
                </div>

                <div className="space-y-6 w-full">
                  <div className="flex space-x-3 items-center">
                    <div className="h-[64px] w-[64px] bg-[#9B51E01A] text-[20px] text-[#101928] leading-[24px] rounded-full flex items-center justify-center">
                      OM
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-[14px] text-[#333333] font-semibold leading-[22px]">
                        Olivia
                      </h1>
                      <StarRating totalStars={5} starnumber={4} />
                    </div>
                  </div>
                  <p className="w-[730px] text-[14px] text-[#333333] font-medium leading-[22px]">
                    Halfway through the course and lots of information given in
                    every chapter. Concise and easy to understand, very useful
                    to apply to any Web design journey!
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex space-x-3 items-center">
                    <div className="h-[64px] w-[64px] bg-[#9B51E01A] text-[20px] text-[#101928] leading-[24px] rounded-full flex items-center justify-center">
                      OM
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-[14px] text-[#333333] font-semibold leading-[22px]">
                        Olivia
                      </h1>
                      <StarRating totalStars={5} starnumber={4} />
                    </div>
                  </div>
                  <p className="w-[730px] text-[14px] text-[#333333] font-medium leading-[22px]">
                    Halfway through the course and lots of information given in
                    every chapter. Concise and easy to understand, very useful
                    to apply to any Web design journey!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="block xl:hidden">
            <div className="border-b-[1px] border-b-[#949494] justify-center xl:mx-48 flex space-x-2 items-center h-[50px]">
              <IoIosStar color="#F6A61C" className="h-[20px] w-[20px]" />
              <p className="text-[20px] text-[#333333] font-semibold leading-[22px]">
                4.9 Rating | (281 reviews)
              </p>
            </div>

            {/* comments */}
            <div className="block xl:hidden py-12 mx-12 sm:mx-48 items-center content-center justify-around text-sm">
              <div className="w-[100%] xl:w-[30%]">
                <div className="flex items-center">
                  <p className="p-5 bg-[#9b51e01a] font-bold rounded-full">
                    OM
                  </p>
                  <div className="ml-6 space-y-2">
                    <p>Olivia. M</p>
                    <StarRating totalStars={5} starnumber={4} />
                  </div>
                </div>

                <p className="mt-6 text-[14px] font-medium text-[#333333] leading-[22px]">
                  Halfway through the course and lots of information given in
                  every chapter. Concise and easy to understand, very useful to
                  apply to any Web design journey!
                </p>
              </div>

              <div className="border-[1px] border-[#B8B9BA] h-28 hidden xl:block"></div>

              <div className="w-[100%] xl:w-[30%] mt-8 xl:mt-0">
                <div className="flex items-center">
                  <p className="p-5 bg-[#9b51e01a] font-bold rounded-full">
                    OM
                  </p>
                  <div className="ml-6 space-y-2">
                    <p>Olivia. M</p>
                    <StarRating totalStars={5} starnumber={4} />
                  </div>
                </div>

                <p className="mt-6 text-[14px] font-medium text-[#333333] leading-[22px]">
                  Halfway through the course and lots of information given in
                  every chapter. Concise and easy to understand, very useful to
                  apply to any Web design journey!
                </p>
              </div>
            </div>

            <div className="flex xl:hidden flex-col">
              <p className="mt-8 font-semibold">Leave a review</p>
              <div className=" w-[100%] gap-6 bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl overflow-scroll scrollbar-hide p-4 flex flex-col ">
                <div className="flex items-center w-full space-x-3">
                  <Image src={profile_pic} alt="pic" width={48} />
                  <div className="space-y-1">
                    <h4 className="text-[16px] text-[#333333] leading-[22px] font-semibold">
                      0xRavenclaw
                    </h4>
                    <p className="text-[#9b51e0] text-[12px] font-medium leading-[14px]">
                      0x5c956e61...de5232dc11
                    </p>
                  </div>
                </div>
                <div className="h-full w-full space-x-3 flex items-center">
                  <h1 className="text-[14px] text-[#333333] leading-[16px] font-medium">
                    Tap to rate:
                  </h1>
                  <StarRating totalStars={5} starnumber={0} />
                </div>
                <div className="h-full w-full flex items-center space-x-3">
                  <StarRating totalStars={5} starnumber={4} />
                  <h1 className="text-[14px] text-[#333333] leading-[16px] font-medium">
                    <span className="text-[#A01B9B]">1,245</span> students
                  </h1>
                </div>
                <div className="flex flex-col gap-5">
                  {/* input and button */}
                  <input
                    type="text"
                    placeholder="What do you think about this course?"
                    className="w-full h-[45px] border shadow-dm p-6 rounded-xl text-[14px] font-medium leading-[16px]"
                  />
                  <button className="hidden sm:block bg-[#9b51e0] px-7 py-2 rounded text-[#fff] font-bold">
                    Send review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden xl:block w-[30%] h-[1020px]">
          <h1>Courses you might like</h1>
          <div className="space-y-10 overflow-x-auto max-h-[1020px] overflow-y-auto">
            {courseData.map((item: any, id: any) => (
              <div key={id}>
                <CardWithLink wallet={props.wallet} data={item} />
              </div>
            ))}
            {/* <CardWithLink /> */}
            {/* <CardWithLink />
            <CardWithLink /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePage;
