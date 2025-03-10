"use client";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import video from "@/assets/video.png";
import youtube from "@/assets/youtube.svg";
import podcast from "@/assets/Podcast.svg";
import rich from "@/assets/Richin2024.svg";
import Image from "next/image";
import Switch from "react-switch";
import Lectures from "../Lectures";
import CourseSideBar from "./SideBar";
import { MdOutlineDiamond } from "react-icons/md";
import { IoSearchOutline, IoMenuOutline } from "react-icons/io5";
import { pinata } from "../../../../utils/config";
import { FileObject } from "pinata";
import { courseInitState } from "@/state/connectedWalletStarknetkitNext";
import { lectures } from "@/constants/data";
import { attensysCourseAddress } from "@/deployments/contracts";
import { attensysCourseAbi } from "@/deployments/abi";
import { Contract } from "starknet";
import { useRouter } from "next/navigation";
import { handleCreateCourse } from "@/utils/helpers";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ChildComponentProps {
  courseData: any;
  setCourseData: any;
  wallet: any;
  handleCoursePublishWithCert: (
    event: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent, Event>,
  ) => void;
}

// file setup
const emptyData: FileObject = {
  name: "",
  type: "",
  size: 0,
  lastModified: 0,
  arrayBuffer: async () => {
    return new ArrayBuffer(0);
  },
};

interface Lecture {
  name: string;
  description: string;
  video: File | null;
}

const ResetCourseRegistrationData = {
  primaryGoal: "",
  targetAudience: "",
  courseArea: "",
  courseIdentifier: "",
  courseName: "",
  courseCreator: "",
  courseDescription: "",
  courseCategory: "",
  difficultyLevel: "",
  studentRequirements: "",
  learningObjectives: "",
  targetAudienceDesc: "",
  courseImage: emptyData,
  courseCurriculum: [] as Lecture[],
  coursePricing: "",
  promoAndDiscount: "",
  publishWithCertificate: false,
};

const MainFormView5: React.FC<ChildComponentProps> = ({
  courseData,
  setCourseData,
  wallet,
  handleCoursePublishWithCert,
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const handleSwitch = (
    event: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent, Event>,
  ) => {
    setIsActivated(!isActivated);
    handleCoursePublishWithCert(event);
  };

  const [receiptData, setReceiptData] = useState<any>(null);

  const handleCourseUpload = async (e: any) => {
    setIsUploading(true);
    setIsSaving(true);

    const courseImgupload = await pinata.upload.file(courseData.courseImage);

    const dataUpload = await pinata.upload.json({
      primaryGoal: courseData.primaryGoal,
      targetAudience: courseData.targetAudience,
      courseArea: courseData.courseArea,
      courseIdentifier: "",
      courseCreator: courseData.courseCreator,
      courseName: courseData.courseName,
      courseDescription: courseData.courseDescription,
      courseCategory: courseData.courseCategory,
      difficultyLevel: courseData.difficultyLevel,
      studentRequirements: courseData.studentRequirements,
      learningObjectives: courseData.learningObjectives,
      targetAudienceDesc: courseData.targetAudienceDesc,
      courseImage: courseImgupload.IpfsHash,
      courseCurriculum: courseData.courseCurriculum,
      coursePricing: courseData.coursePricing,
      promoAndDiscount: courseData.promoAndDiscount,
      publishWithCertificate: courseData.publishWithCertificate,
    });

    if (dataUpload) {
      const courseContract = new Contract(
        attensysCourseAbi,
        attensysCourseAddress,
        wallet?.account,
      );

      const create_course_calldata = courseContract.populate("create_course", [
        wallet?.account?.address,
        false,
        courseImgupload.IpfsHash,
        courseData.courseName,
        "XXX",
        dataUpload.IpfsHash,
      ]);

      console.log("call data value populate", create_course_calldata);

      const callCourseContract = await wallet?.account.execute([
        {
          contractAddress: attensysCourseAddress,
          entrypoint: "create_course",
          calldata: create_course_calldata.calldata,
        },
      ]);

      const receipt = await wallet?.account?.provider
        .waitForTransaction(callCourseContract.transaction_hash)
        .then((res: any) => {
          console.log("what is ", res);
          setReceiptData(res);
        })
        .catch((e: any) => {
          console.error("Error: ", e);
        })
        .finally(() => {
          setIsUploading(false);
          setIsSaving(false);

          handleCreateCourse(e, "course-landing-page", router);
          // setCourseData(ResetCourseRegistrationData);
        });
    }
  };

  useEffect(() => {
    // Check if file is a valid File object
    if (courseData.courseImage instanceof File) {
      // Create a temporary URL for the fetched image
      const imageUrl = URL.createObjectURL(courseData.courseImage);
      setImageSrc(imageUrl);

      // Clean up the URL object to free up memory
      return () => {
        URL.revokeObjectURL(imageUrl);
      };
    }
  }, [courseData.courseImage]);

  useEffect(() => {}, [receiptData]);

  return (
    <div className="lg:flex">
      <div className="hidden xl:block">
        <CourseSideBar courseData={courseData} />
      </div>

      <div className="flex-1">
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div>

        <div className="p-4 lg:p-0 lg:px-4 xl:px-0">
          <div className="block lg:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] lg:px-5 items-center">
            <div className="flex items-center">
              <div className="px-8 border-r border-blue-100">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-[#4A90E2] text-xl font-bold">
                Preview & Publish
              </p>
            </div>

            <button
              className="hidden xl:block bg-[#C5D322] px-7 py-3 rounded text-white"
              disabled={isUploading}
            >
              {isUploading ? (
                <LoadingSpinner size="sm" colorVariant="white" />
              ) : (
                "Publish"
              )}
            </button>
          </div>

          <div className="lg:mx-4 xl:mx-24 mt-12">
            {/* field */}
            <div className="mb-3 order-first block lg:hidden">
              <p className="text-[#5801A9] text-[16px] font-medium leading-[22px]">
                {courseData.courseCategory} | Web Development
              </p>
            </div>
            <div className="block lg:grid lg:grid-cols-2 gap-4">
              {/* Course Image */}
              <div className="relative h-[350px]  w-[500px]">
                {imageSrc ? (
                  <Image
                    src={(imageSrc as string) || "/placeholder.svg"}
                    alt="Fetched Image"
                    width={500} // Explicit width
                    height={500} // Explicit height
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner size="md" colorVariant="primary" />
                  </div>
                )}
              </div>

              {/* Course information */}
              <div>
                {/* field */}
                <div className="mb-3 order-first hidden lg:block">
                  <p className="text-[#5801A9] text-[16px] font-medium leading-[22px]">
                    {courseData.courseCategory} | Web Development
                  </p>
                </div>

                <h4 className="text-[19px] text-[#333333] leading-[34px] font-bold my-2 ">
                  {courseData.courseName}
                </h4>
                <div className="my-3">
                  <p className="  text-[#333333] text-[14px] font-light leading-[22px]">
                    {courseData.courseDescription}
                  </p>
                </div>

                <div className="bg-[#5801A9] py-2 text-white w-fit p-2 text-center mt-6 mb-3 lg:w-[50%] rounded-lg">
                  <p className="text-[14px] font-extrabold leading-[22px]">
                    {courseData.courseCreator}
                  </p>
                </div>

                <div className="flex space-x-3 items-center">
                  <MdOutlineDiamond color="#333333" />
                  <p className="text-[#333333] text-[14px] font-medium leading-[22px]">
                    Difficulty level : {courseData.difficultyLevel}
                  </p>
                </div>
              </div>
            </div>
            <div className="  text-[#333333] text-[14px] font-light leading-[22px]">
              <p>{courseData.targetAudienceDesc}</p>
            </div>

            <div className="mt-8">
              {/* Student Requirements */}
              <div className="mb-6 block lg:hidden">
                <h2 className="font-semibold text-[18px] leading-[31px] text-[#333333] mb-2">
                  Student Requirements
                </h2>
                <div>
                  <p>{courseData.studentRequirements}</p>
                </div>
              </div>

              {/* Target Audience */}
              <div className="mb-6 block lg:hidden">
                <h2 className="font-semibold text-[18px] leading-[31px] text-[#333333] mb-2">
                  Target Audience
                </h2>
                {/* <ul className="text-sm text-[#333333] list-disc pl-5 space-y-1">
                  <li>Beginners interested in web development</li>
                  <li>
                    Aspiring web developers looking to start their journey
                  </li>
                  <li>Anyone wanting to create their own websites</li>
                </ul> */}
                {courseData.targetAudience}
              </div>

              {/* lectures in course */}
              <Lectures
                lectures={lectures}
                courseData={courseData}
                learningObj={courseData.learningObjectives}
              />
              {/* course desc & student req */}

              <div className="">
                <div>
                  <div className="flex justify-between lg:w-[30%] mt-5">
                    <h4 className="font-semibold text-[18px] leading-[31px] text-[#333333]">
                      Certification for this course
                    </h4>

                    <Switch
                      //@ts-ignore
                      onChange={handleSwitch}
                      checked={isActivated}
                      onColor="#9B51E0"
                      offColor="#4A90E2"
                      uncheckedHandleIcon={<div />}
                      checkedHandleIcon={<div />}
                      checkedIcon={<div />}
                      uncheckedIcon={<div />}
                      className="mx-2"
                    />
                  </div>
                  <p className="text-[#333333] text-[14px] font-normal leading-[22px]">
                    After completion students will be issued certification
                  </p>
                </div>
                <div className="mt-12 mb-24 p-10">
                  <button
                    className={`w-full lg:w-auto rounded-xl px-8 lg:px-24 py-3 text-white ${
                      isSaving
                        ? " bg-[#357ABD] cursor-not-allowed"
                        : "bg-[#4A90E2]"
                    }`}
                    type="submit"
                    onClick={!isSaving ? handleCourseUpload : undefined}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <LoadingSpinner size="sm" colorVariant="white" />
                    ) : (
                      "Save and Publish Course"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFormView5;
