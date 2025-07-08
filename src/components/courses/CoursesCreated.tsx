import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaUserGraduate } from "@react-icons/all-files/fa/FaUserGraduate";
import Switch from "react-switch";
import StarRating from "../bootcamp/StarRating";
import play from "@/assets/play.svg";
import replay from "@/assets/replay.svg";
import bdot from "@/assets/Bdot.svg";
import diamond from "@/assets/diamond.svg";
import certificationBadge from "@/assets/certification_badge.svg";
import tdesign_video from "../../assets/tdesign_video.svg";
import { useRouter } from "next/navigation";
import { handleCourse } from "@/utils/helpers";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { BsTrash } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import { Dialog, DialogBackdrop, DialogPanel, Button } from "@headlessui/react";
import { Account, Contract } from "starknet";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { provider } from "@/constants";
import { useAccount } from "@starknet-react/core";
import { FaSpinner } from "react-icons/fa";
import card from "@/assets/card.svg";
import EditCoursePanel from "./EditCoursePanel";
import { pinata } from "../../../utils/config";
import { getAverageRatingForVideo } from "@/lib/services/reviewService";
import { RatingDisplay } from "../RatingDisplay";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "@/lib/userutils";
import { auth } from "@/lib/firebase/client";
import { decryptPrivateKey } from "@/helpers/encrypt";
import { executeCalls } from "@avnu/gasless-sdk";
import { STRK_ADDRESS } from "@/deployments/erc20Contract";
import { useAuth } from "@/context/AuthContext";
import {
  getCoursesLastUpdated,
  formatLastUpdated,
  getLastUpdateDescription,
  getFallbackDate,
  CourseLastUpdated,
} from "@/utils/courseLastUpdated";

// Helper function to format duration
function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return (
    [h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null, s > 0 ? `${s}s` : null]
      .filter(Boolean)
      .join(" ") || "0s"
  );
}

// Helper function to estimate video duration from file size
function estimateVideoDuration(fileSize: number): number {
  // Estimate based on average video bitrate (assuming 1 Mbps for compressed video)
  // This is a rough estimate - actual duration may vary
  const estimatedBitrate = 1000000; // 1 Mbps in bits per second
  const fileSizeInBits = fileSize * 8; // Convert bytes to bits
  return Math.floor(fileSizeInBits / estimatedBitrate);
}

interface ItemProps {
  courses: Course[];
}

interface Course {
  accessment: boolean;
  course_identifier: number;
  course_ipfs_uri: string;
  is_approved: boolean;
  is_suspended: boolean;
  owner: string;
  price: number;
  uri: string;
}

interface CoursesCreatedProps {
  item: ItemProps;
  selected: string;
  courseData: any;
  refreshCourses: () => Promise<void>;
}

interface Uri {
  first: string;
  second: string;
}

const CoursesCreated: React.FC<CoursesCreatedProps> = ({
  item,
  selected,
  courseData,
  refreshCourses,
}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [localCourseData, setLocalCourseData] = useState(courseData);
  const [account, setAccount] = useState<any>();

  // console.log("courseData:", courseData);
  // console.log("item.courses:", item.courses);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(courseData.length / itemsPerPage);

  // Get current page items
  const currentItems = courseData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Store average ratings for each course by identifier
  const [averageRatings, setAverageRatings] = useState<{ [key: string]: any }>(
    {},
  );

  // Store last updated timestamps for each course
  const [coursesLastUpdated, setCoursesLastUpdated] = useState<{
    [key: number]: CourseLastUpdated;
  }>({});
  const [isLoadingLastUpdated, setIsLoadingLastUpdated] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.uid) {
        try {
          const profile = await getUserProfile(user.uid);
          const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
          if (profile) {
            const decryptedPrivateKey = decryptPrivateKey(
              profile.starknetPrivateKey,
              encryptionSecret,
            );
            if (!decryptedPrivateKey) {
              console.error("Failed to decrypt private key");
              setAccount(undefined);
              return;
            }
            const userAccount = new Account(
              provider,
              profile.starknetAddress,
              decryptedPrivateKey,
            );
            setAccount(userAccount);
          } else {
            console.log("No user profile found in Firestore.");
            setAccount(undefined);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setAccount(undefined);
        }
      } else {
        setAccount(undefined);
      }
    };
    fetchProfile();
  }, [user]);

  // Fetch last updated timestamps for courses
  useEffect(() => {
    const fetchLastUpdated = async () => {
      if (account?.address && courseData && courseData.length > 0) {
        try {
          setIsLoadingLastUpdated(true);
          const courseIdentifiers = courseData.map(
            (course: any) => course.course_identifier,
          );
          const lastUpdatedData = await getCoursesLastUpdated(
            courseIdentifiers,
            account.address,
          );

          // Convert array to object for easier lookup
          const lastUpdatedMap: { [key: number]: CourseLastUpdated } = {};
          lastUpdatedData.forEach((item) => {
            lastUpdatedMap[item.courseIdentifier] = item;
          });

          setCoursesLastUpdated(lastUpdatedMap);
        } catch (error) {
          console.error("Error fetching course last updated data:", error);
        } finally {
          setIsLoadingLastUpdated(false);
        }
      }
    };

    fetchLastUpdated();
  }, [account?.address, courseData]);

  useEffect(() => {
    // Fetch average ratings for all currentItems when courseData or currentPage changes
    const fetchAllRatings = async () => {
      const ratings: { [key: string]: any } = {};
      if (Array.isArray(courseData)) {
        await Promise.all(
          courseData.map(async (course: any) => {
            const identifier = course?.course_identifier;
            if (identifier && !(identifier in ratings)) {
              const avg = await getAverageRatingForVideo(
                (course?.data?.courseName?.toString() ?? "") + identifier,
              );
              ratings[identifier] = avg;
            }
          }),
        );
      }
      setAverageRatings(ratings);
    };
    fetchAllRatings();
  }, [courseData, currentPage]);

  const generatePageNumbers = () => {
    const pageNumbers = [];

    // Always show the first page
    if (currentPage > 2) pageNumbers.push(1);

    // Show ellipsis if there are pages between the first page and current page range
    if (currentPage > 3) pageNumbers.push("...");

    // Show the range of pages around the current page
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages);
      i++
    ) {
      pageNumbers.push(i);
    }

    // Show ellipsis if there are pages between the current range and the last page
    if (currentPage < totalPages - 2) pageNumbers.push("...");

    // Always show the last page
    if (currentPage < totalPages - 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  // Handle pagination controls
  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const goToPage = (page: any) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (course: any) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      // // Find the matching course from item.c
      const avnuApiKey = process.env.NEXT_PUBLIC_AVNU_API_KEY;
      if (!avnuApiKey) {
        throw new Error("Missing AVNU API key in environment variables");
      }

      const courseContract = new Contract(
        attensysCourseAbi,
        attensysCourseAddress,
        account,
      );

      const myCall = courseContract.populate("remove_course", [
        Number(courseToDelete),
      ]);

      const callCourseContract = await executeCalls(
        account,
        [
          {
            contractAddress: attensysCourseAddress,
            entrypoint: "remove_course",
            calldata: myCall.calldata,
          },
        ],
        {
          gasTokenAddress: STRK_ADDRESS,
        },
        {
          apiKey: avnuApiKey,
          baseUrl: "https://sepolia.api.avnu.fi",
        },
      );

      let tx = await provider.waitForTransaction(
        callCourseContract.transactionHash,
      );

      // const res = await courseContract.remove_course(myCall.calldata);
      // await provider.waitForTransaction(res.transaction_hash);
      if (
        ((tx as any)?.finality_status === "ACCEPTED_ON_L2" ||
          (tx as any)?.finality_status === "ACCEPTED_ON_L1") &&
        (tx as any)?.execution_status === "SUCCEEDED"
      ) {
        setDeleteSuccess(true);
        await refreshCourses();

        // Refresh last updated data after course deletion
        if (account?.address && courseData && courseData.length > 0) {
          try {
            const courseIdentifiers = courseData
              .filter(
                (course: any) => course.course_identifier !== courseToDelete,
              )
              .map((course: any) => course.course_identifier);

            if (courseIdentifiers.length > 0) {
              const lastUpdatedData = await getCoursesLastUpdated(
                courseIdentifiers,
                account.address,
              );

              const lastUpdatedMap: { [key: number]: CourseLastUpdated } = {};
              lastUpdatedData.forEach((item) => {
                lastUpdatedMap[item.courseIdentifier] = item;
              });

              setCoursesLastUpdated(lastUpdatedMap);
            }
          } catch (error) {
            console.error(
              "Error refreshing last updated data after deletion:",
              error,
            );
          }
        }

        // Close modal after 2 seconds
        setTimeout(() => {
          setIsDeleteModalOpen(false);
          setCourseToDelete(null);
          setDeleteSuccess(false);
          setIsDeleting(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      setIsDeleting(false);
    }
  };

  const handleEditClick = (course: any) => {
    console.log(course);
    setCourseToEdit(course);
    setIsEditPanelOpen(true);
  };

  const handleCloseEditPanel = () => {
    setIsEditPanelOpen(false);
    setCourseToEdit(null);
  };

  const handleSaveEdit = async (updatedCourse: any) => {
    try {
      setIsUpdating(true);
      setUpdateSuccess(false);

      // Find the matching course from item.courses based on IPFS URI
      const matchingCourse = item.courses.find(
        (c: any) =>
          c.course_ipfs_uri === updatedCourse.data.courseImage &&
          c.course_identifier !== 0n, // Exclude deleted courses
      );

      if (!matchingCourse) {
        throw new Error("Course not found or has been deleted");
      }

      // First, update the IPFS metadata
      const dataUpload = await pinata.upload.json({
        courseName: updatedCourse.data.courseName,
        courseDescription: updatedCourse.data.courseDescription,
        courseCategory: updatedCourse.data.courseCategory,
        difficultyLevel: updatedCourse.data.difficultyLevel,
        studentRequirements: updatedCourse.data.studentRequirements,
        learningObjectives: updatedCourse.data.learningObjectives,
        courseImage: updatedCourse.data.courseImage,
        courseCurriculum: updatedCourse.data.courseCurriculum,
      });

      const courseContract = new Contract(
        attensysCourseAbi,
        attensysCourseAddress,
        provider,
      );

      if (!account) {
        throw new Error("Wallet not connected");
      }

      courseContract.connect(account);

      const courseIdentifier = {
        low: BigInt(matchingCourse.course_identifier),
        high: BigInt(0),
      };

      // Update course data on the blockchain using add_replace_course_content
      const myCall = courseContract.populate("add_replace_course_content", [
        courseIdentifier,
        account.address,
        dataUpload.IpfsHash, // Use the new IPFS hash
      ]);
      const res = await courseContract.add_replace_course_content(
        myCall.calldata,
      );
      await provider.waitForTransaction(res.transaction_hash);

      setUpdateSuccess(true);

      // Force a refresh of the course data
      await refreshCourses();

      // Update the local course data immediately
      const updatedCourseData = localCourseData.map((course: any) => {
        if (course.course_identifier === matchingCourse.course_identifier) {
          return {
            ...course,
            data: {
              ...course.data,
              courseName: updatedCourse.data.courseName,
              courseDescription: updatedCourse.data.courseDescription,
              courseCategory: updatedCourse.data.courseCategory,
              difficultyLevel: updatedCourse.data.difficultyLevel,
              studentRequirements: updatedCourse.data.studentRequirements,
              learningObjectives: updatedCourse.data.learningObjectives,
              courseCurriculum: updatedCourse.data.courseCurriculum,
            },
          };
        }
        return course;
      });
      setLocalCourseData(updatedCourseData);

      // Refresh last updated data for the edited course
      if (account?.address) {
        try {
          const lastUpdatedData = await getCoursesLastUpdated(
            [matchingCourse.course_identifier],
            account.address,
          );
          if (lastUpdatedData.length > 0) {
            setCoursesLastUpdated((prev) => ({
              ...prev,
              [matchingCourse.course_identifier]: lastUpdatedData[0],
            }));
          }
        } catch (error) {
          console.error("Error refreshing last updated data:", error);
        }
      }

      // Close panel after 2 seconds
      setTimeout(() => {
        setIsEditPanelOpen(false);
        setCourseToEdit(null);
        setIsUpdating(false);
        setUpdateSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating course:", error);
      setIsUpdating(false);
    }
  };

  if (courseData?.length === 0 || !item?.courses?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Image src={card} alt="No courses" width={200} height={200} />
        <p className="mt-4 text-lg text-[#2D3A4B]">No courses created yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white  sm:my-12 rounded-xl border-[1px] border-[#BCBCBC] h-auto pb-8">
        {/* courses created */}
        <div>
          <div className="flex justify-between border-b-[1px] border-b-[#CACBCB] my-3 px-16">
            {/* activate */}
            <div className="flex items-center text-[#A01B9B]  my-5 space-x-3">
              <h4 className="font-bold text-lg text-[#A01B9B]">{selected}</h4>
              <FaUserGraduate color="#A01B9B" />
            </div>
          </div>

          <div>
            <div className="block justify-top">
              {currentItems
                ?.slice()
                .reverse()
                .map((item: any, index: any) => {
                  // Calculate total play time from curriculum
                  const totalPlayTime =
                    item.data.courseCurriculum?.reduce(
                      (sum: number, lecture: any) =>
                        sum + estimateVideoDuration(lecture.fileSize || 0),
                      0,
                    ) || 0;

                  return (
                    <div
                      key={index}
                      className="px-5 xl:px-12 flex border-top py-6 border-2 gap-6 xl:gap-0 flex-col w-full xl:flex-row xl:space-x-8 items-start"
                    >
                      {/* Course Image */}
                      <div className="xl:h-[164px] xl:w-[254px] w-full h-auto rounded-xl">
                        <Image
                          src={
                            item.data.courseImage
                              ? `https://ipfs.io/ipfs/${item.data.courseImage}`
                              : tdesign_video
                          }
                          width={200}
                          height={200}
                          alt={item.data.courseName}
                          className="object-cover h-full w-full rounded-xl"
                        />
                      </div>

                      {/* Course Details */}
                      <div className="flex-1 w-full lg:mx-6 sm:mx-0">
                        <div className="flex justify-between items-start cursor-pointer">
                          <div>
                            <div
                              onClick={(e) => {
                                localStorage.setItem(
                                  "courseData",
                                  JSON.stringify(item?.data),
                                );
                                handleCourse(
                                  e,
                                  e.currentTarget.textContent,
                                  router,
                                  item?.course_identifier,
                                );
                                console.log("item.is_approved", item);
                              }}
                              className="cursor-pointer"
                            >
                              <h4 className="text-[20px] font-medium leading-[22px] text-[#2D3A4B] hover:text-[#A01B9B] transition-colors">
                                {item.data.courseName}
                              </h4>
                            </div>

                            {/* First row of metadata */}
                            <div className="flex flex-wrap items-center gap-3 my-2">
                              <div className="flex items-center gap-x-2">
                                <Image
                                  src={play}
                                  alt=""
                                  height={12}
                                  width={12}
                                />
                                <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                                  Total play time:{" "}
                                  {formatDuration(totalPlayTime)}
                                </p>
                              </div>
                              <div className="flex items-center gap-x-2">
                                <p className="hidden sm:block text-gray-300">
                                  |
                                </p>
                                <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                                  Created by:{" "}
                                  <span className="text-[#A01B9B]">you</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-x-2">
                                <Image
                                  src={bdot}
                                  alt=""
                                  height={12}
                                  width={12}
                                />
                                <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                                  <span className="text-[#A01B9B]">
                                    {item.data.courseCurriculum.length}
                                  </span>{" "}
                                  Lectures
                                </p>
                              </div>
                            </div>

                            {/* Second row of metadata */}
                            <div className="flex flex-wrap items-center gap-3 my-2">
                              <div className="flex items-center gap-x-2">
                                <Image
                                  src={replay}
                                  alt="time"
                                  width={16}
                                  height={16}
                                />
                                <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                                  {(() => {
                                    if (isLoadingLastUpdated) {
                                      return "Loading...";
                                    }
                                    const lastUpdated =
                                      coursesLastUpdated[
                                        item?.course_identifier
                                      ];
                                    if (lastUpdated) {
                                      const formattedDate = formatLastUpdated(
                                        lastUpdated.lastUpdated,
                                      );
                                      const description =
                                        getLastUpdateDescription(
                                          lastUpdated.eventType,
                                        );
                                      return `${description} ${formattedDate}`;
                                    }
                                    return `Last updated ${getFallbackDate()}`; // Fallback
                                  })()}
                                </p>
                              </div>
                              <div className="flex items-center gap-x-2">
                                <p className="hidden sm:block text-gray-300">
                                  |
                                </p>
                                <Image
                                  src={diamond}
                                  alt=""
                                  height={18}
                                  width={18}
                                />
                                <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                                  Difficulty: {item.data.difficultyLevel}
                                </p>
                              </div>
                            </div>

                            {/* Third row of metadata */}
                            <div className="flex flex-wrap items-center gap-3 my-2">
                              <div className="flex items-center gap-x-2">
                                {/* <StarRating totalStars={5} starnumber={4} />
                              <p className="font-medium text-[13px] text-[#2D3A4B] leading-[16px]">
                                {item.stars} students
                              </p> */}
                                <RatingDisplay
                                  rating={
                                    averageRatings[item?.course_identifier]
                                  }
                                  size="xs"
                                />
                              </div>
                              {/* <div className="flex items-center gap-x-2">
                              <p className="hidden sm:block text-gray-300">|</p>
                              <Image
                                src={certificationBadge}
                                alt=""
                                height={18}
                                width={18}
                              />
                              <p className="font-medium text-[13px] text-[#2D3A4B] leading-[16px]">
                                Certificate:{" "}
                                <span className="text-[#A01B9B]">
                                  {item.certificate}
                                </span>
                              </p>
                            </div> */}
                            </div>
                          </div>

                          {/* Edit/Delete Icons - moved to top right */}
                          <div className="flex items-center gap-3 ml-4">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-1 text-[#4A90E2] hover:bg-[#4A90E2]/10 rounded-md transition-colors"
                              aria-label="Edit course"
                            >
                              <BsPencil size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(item?.course_identifier)
                              }
                              className="p-1 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                              aria-label="Delete course"
                            >
                              <BsTrash size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Course Description */}
                        <div
                          onClick={(e) => {
                            localStorage.setItem(
                              "courseData",
                              JSON.stringify(item?.data),
                            );
                            handleCourse(
                              e,
                              e.currentTarget.textContent,
                              router,
                              item?.course_identifier,
                            );
                            console.log(item.is_approved);
                          }}
                          className={`mt-3 ${item.is_approved ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                        >
                          <div
                            className="text-[14px] text-[#2D3A4B] font-medium leading-[21px] line-clamp-2 hover:text-[#A01B9B] transition-colors"
                            dangerouslySetInnerHTML={{
                              __html: item.data.courseDescription,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center space-x-2 pb-4 pt-10">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-1.5 border-[#D0D5DD] border-[1px] rounded disabled:opacity-50"
            >
              {"<"}
            </button>
            {generatePageNumbers().map((page, index) =>
              page == "..." ? (
                <span key={index} className="px-2 text-base mt-2">
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-1.5 rounded text-[14px] ${currentPage == page ? "bg-none text-[#000000] border-[#9B51E0] border-[1px]" : "bg-none text-[#000000]"}`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-1.5 border-[#D0D5DD] border-[1px] text-sm rounded disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setCourseToDelete(null);
            setDeleteSuccess(false);
          }
        }}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-[#0F0E0E82] transition-opacity"
        />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-semibold leading-6 text-[#2D3A4B]">
                      {deleteSuccess ? "Success!" : "Delete Course"}
                    </h3>
                    <div className="mt-2">
                      {isDeleting ? (
                        <div className="flex items-center justify-center gap-2">
                          <FaSpinner className="animate-spin text-[#2D3A4B]" />
                          <p className="text-sm text-[#2D3A4B]">
                            Processing...
                          </p>
                        </div>
                      ) : deleteSuccess ? (
                        <p className="text-sm text-[#2D3A4B]">
                          Course deleted successfully!
                        </p>
                      ) : (
                        <p className="text-sm text-[#2D3A4B]">
                          Are you sure you want to delete &quot;
                          {courseToDelete?.data?.courseName}&quot;? This action
                          cannot be undone.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {!deleteSuccess && !isDeleting && (
                  <>
                    <Button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleConfirmDelete}
                    >
                      Delete
                    </Button>
                    <Button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Edit Course Panel */}
      <EditCoursePanel
        isOpen={isEditPanelOpen}
        onClose={handleCloseEditPanel}
        course={courseToEdit}
        onSave={handleSaveEdit}
        isUpdating={isUpdating}
        updateSuccess={updateSuccess}
      />
    </>
  );
};

export default CoursesCreated;
