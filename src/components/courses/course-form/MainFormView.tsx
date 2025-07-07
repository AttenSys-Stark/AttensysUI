import React, { useState, useEffect } from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import Dropdown from "../Dropdown";
import { skills, levelOptions } from "@/constants/data";
import CourseSideBar from "./SideBar";
import { handleCreateCourse } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import Stepper from "@/components/Stepper";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtom } from "jotai";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { connect } from "starknetkit";
import { toast } from "react-toastify";
import WalletisConnected from "@/components/createorganization/WalletisConnected";
import TrueFocus from "@/components/createorganization/TrueFocus";
import { useAccount, useConnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { useSetAtom } from "jotai";
import {
  courseInitState,
  connectorAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { auth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/userutils";
import { decryptPrivateKey } from "@/helpers/encrypt";
import { Account } from "starknet";
import RichTextEditor from "@/components/RichTextEditor";

interface ChildComponentProps {
  courseData: any;
  handleCourseNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCourseCreatorChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleCourseDescriptionChange: (
    event: React.ChangeEvent<HTMLTextAreaElement> | string,
  ) => void;
  handleCourseCategoryChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  handleDifficultyLevelChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
}
const MainFormView: React.FC<ChildComponentProps> = ({
  courseData,
  handleCourseNameChange,
  handleCourseCreatorChange,
  handleCourseDescriptionChange,
  handleCourseCategoryChange,
  handleDifficultyLevelChange,
}) => {
  const router = useRouter();
  const [courseNameError, setCourseNameError] = useState("");
  const [courseCreatorError, setCourseCreatorError] = useState("");
  const [courseDescriptionError, setCourseDescriptionError] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [skillError, setSkillError] = useState("");
  const [levelError, setLevelError] = useState("");
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [account, setAccount] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const { connect, connectors } = useConnect();
  const controller = connectors[0] as ControllerConnector;
  const [controllerUsername, setControllerUsername] = useState<string>("");
  const setCourseData = useSetAtom(courseInitState);

  // Helper function to check if HTML content is actually empty
  const isContentEmpty = (htmlContent: string): boolean => {
    if (!htmlContent || htmlContent.trim() === "") return true;

    // Remove HTML tags and check if there's actual text content
    const textContent = htmlContent.replace(/<[^>]*>/g, "").trim();
    return textContent === "";
  };

  // Helper function to get text content length for validation
  const getTextContentLength = (htmlContent: string): number => {
    if (!htmlContent) return 0;
    const textContent = htmlContent.replace(/<[^>]*>/g, "").trim();
    return textContent.length;
  };

  useEffect(() => {
    let isMounted = true;
    if (username) {
      if (isMounted) setControllerUsername(username || "");
      if (isMounted) {
        setCourseData((prevData) => ({
          ...prevData,
          courseCreator: username || "",
        }));
      }
    } else {
      setControllerUsername(username || "");
      setCourseData((prevData) => ({
        ...prevData,
        courseCreator: username || "",
      }));
    }
    return () => {
      isMounted = false;
    };
  }, [account, username]);

  useEffect(() => {
    const logStarknetCredentials = async () => {
      try {
        const user = auth.currentUser;
        if (user && user.uid) {
          const profile = await getUserProfile(user.uid);
          const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
          if (profile) {
            const decryptedPrivateKey = decryptPrivateKey(
              profile.starknetPrivateKey,
              encryptionSecret,
            );
            console.log("starknetAddress:", profile.starknetAddress);
            console.log("starknetPrivateKey:", decryptedPrivateKey);
            const userAccount = new Account(
              provider,
              profile.starknetAddress,
              decryptedPrivateKey,
            );
            console.log("userAccount:", userAccount);
            setAccount(userAccount);
            setAddress(profile.starknetAddress);
            setUsername(profile.displayName);
          } else {
            console.log("No user profile found in Firestore.");
          }
        } else {
          console.log("No authenticated user found.");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    logStarknetCredentials();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCourseNameError("");
    setCourseCreatorError("");
    setCourseDescriptionError("");
    setSkillError("");
    setLevelError("");

    let hasError = false;

    if (!courseData.courseName.trim()) {
      setCourseNameError("Course Name is required.");
      hasError = true;
    }
    if (!courseData.courseCreator.trim()) {
      setCourseCreatorError("Course creator is required.");
      hasError = true;
    }

    if (isContentEmpty(courseData.courseDescription)) {
      setCourseDescriptionError("Course Description is required.");
      hasError = true;
    }

    if (!courseData.courseCategory) {
      setSkillError("Please select a course category.");
      hasError = true;
    }

    if (!courseData.difficultyLevel) {
      setLevelError("Please select a level.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    handleCreateCourse(e, "courseSetup2", router);
  };

  const isImageUploaded = (imageData: any) => {
    return imageData && imageData.name && imageData.name.length > 0;
  };

  if (account == undefined) {
    return (
      <div className="w-screen h-screen z-50 flex justify-center items-center">
        {/* <WalletisConnected /> */}
        <TrueFocus
          sentence="Login To-Continue"
          manualMode={false}
          blurAmount={9}
          borderColor="#9B51E0"
          animationDuration={1}
          pauseBetweenAnimations={1}
        />
      </div>
    );
    // toast.error("Wallet not connetced");
  }

  return (
    <div className="block sm:flex">
      <div className="hidden lg:block">
        <CourseSideBar courseData={courseData} />
      </div>

      <div className="mb-10 flex-1 w-full">
        {/* <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-xs sm:text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div> */}
        <div className="lg:hidden w-full flex justify-center mt-[58px] mb-[79px]">
          <Stepper currentStep={1} />
        </div>
        <div>
          <div className="block sm:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] px-5 items-center">
            <div className="flex items-center">
              <div className="px-4 sm:px-8 border-r border-blue-100">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer text-[#4A90E2]"
                />
              </div>
              <p className="text-[#4A90E2] md:text-xl font-bold">
                Course Setup (Basic info)
              </p>
            </div>

            <button className="hidden sm:block bg-[#c5d322] px-7 py-3 rounded text-black">
              Save progress
            </button>
          </div>

          <div className="mx-6 sm:ml-24 mt-12">
            <form onSubmit={handleSubmit}>
              <div className="my-12">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Title
                </label>
                <p className="font-normal mt-1 text-xs/[145%] md:text-sm text-[#2D3A4B] md:leading-[21px]">
                  {` If you are unsure of the perfect title now, don't worry—you can
                always update it later.`}
                </p>
                <div className="flex items-center my-4 space-x-4">
                  <input
                    type="input"
                    className="w-[100%] h-[55px] sm:w-[80%] px-6 border border-gray-300 rounded-[6px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
                    placeholder="Course name e.g DApp development, Design basics..."
                    value={courseData.courseName}
                    onChange={(e) => {
                      handleCourseNameChange(e);
                      setCourseNameError("");
                    }}
                    maxLength={100}
                  />
                  <input
                    type="checkbox"
                    className="appearance-none w-[23px] h-[23px] hidden md:block rounded-full border-[1px] border-[#C5D322] checked:bg-[#C5D322] checked:border-[#C5D322] required:border-red-500 checked:before:content-['✔'] checked:before:absolute checked:before:top-[3px] checked:before:left-[6px] checked:before:text-white checked:before:text-[10px] relative"
                    checked={courseData.courseName.trim().length > 0}
                    readOnly
                  />
                </div>
                {courseNameError && (
                  <p className="text-red-500 text-xs mt-1">{courseNameError}</p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Creator
                </label>
                <p className="font-normal mt-1 text-xs/[145%] md:text-sm text-[#2D3A4B] md:leading-[21px]">
                  {` If you are unsure of the perfect creator name now, don't worry—you can
                always update it later.`}
                </p>
                <div className="flex items-center my-4 space-x-4">
                  <input
                    type="input"
                    className="w-[100%] h-[55px] sm:w-[80%] px-6 border border-gray-300 rounded-[6px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
                    placeholder="Course creator e.g Mike Smith, Trident Academy..."
                    value={controllerUsername}
                    // onChange={(e) => {
                    //   handleCourseCreatorChange(e);
                    //   setCourseCreatorError("");
                    // }}
                    readOnly
                    maxLength={100}
                  />
                  <input
                    type="checkbox"
                    className="appearance-none w-[23px] h-[23px] hidden md:block rounded-full border-[1px] border-[#C5D322] checked:bg-[#C5D322] checked:border-[#C5D322] required:border-red-500 checked:before:content-['✔'] checked:before:absolute checked:before:top-[3px] checked:before:left-[6px] checked:before:text-white checked:before:text-[10px] relative"
                    checked={courseData.courseCreator.trim().length > 0}
                    readOnly
                  />
                </div>
                {courseCreatorError && (
                  <p className="text-red-500 text-xs mt-1">
                    {courseCreatorError}
                  </p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Description
                </label>
                <p className="font-normal mt-1 text-xs/[145%] md:text-sm text-[#2D3A4B] md:leading-[21px]">
                  Let your students know a little bit about your course
                </p>
                <div className="flex items-start my-4 space-x-4">
                  <div className="w-[100%] sm:w-[80%]">
                    <RichTextEditor
                      value={courseData.courseDescription}
                      onChange={(value) => {
                        handleCourseDescriptionChange(value);
                        setCourseDescriptionError("");
                      }}
                      placeholder="a little bit about your course......"
                      maxLength={2000}
                      className="w-full"
                    />
                  </div>
                  <input
                    type="checkbox"
                    className="appearance-none w-[23px] h-[23px] hidden md:block rounded-full border-[1px] border-[#C5D322] checked:bg-[#C5D322] checked:border-[#C5D322] required:border-red-500 checked:before:content-['✔'] checked:before:absolute checked:before:top-[3px] checked:before:left-[6px] checked:before:text-white checked:before:text-[10px] relative"
                    checked={!isContentEmpty(courseData.courseDescription)}
                    readOnly
                  />
                </div>
                {courseDescriptionError && (
                  <p className="text-red-500 text-xs mt-1">
                    {courseDescriptionError}
                  </p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course category
                </label>
                <div className="my-4 flex items-start w-full max-w-[556px] h-[55px]">
                  <Dropdown
                    options={skills}
                    selectedOption={courseData.courseCategory}
                    onSelect={(option: string) => {
                      setSelectedSkill(option);
                      setSkillError("");
                    }}
                    functionToChange={handleCourseCategoryChange}
                    required
                    errorMessage={skillError}
                  />
                </div>
              </div>

              <div className="my-12 w-full">
                <label
                  htmlFor=""
                  className="font-medium text-[18px] leading-[31px] text-[#333333]"
                >
                  Select the difficulty level (Beginner, Intermediate, Advanced,
                  All levels)
                </label>
                <div className="my-4 flex items-start w-full max-w-[556px] h-[55px]">
                  <Dropdown
                    options={levelOptions}
                    selectedOption={courseData.difficultyLevel}
                    onSelect={(option: string) => {
                      handleDifficultyLevelChange({
                        target: { value: option },
                      } as React.ChangeEvent<HTMLSelectElement>);
                      setLevelError("");
                    }}
                    functionToChange={handleDifficultyLevelChange}
                    required
                    errorMessage={levelError}
                  />
                </div>
              </div>

              <div className="mt-12 mb-5 w-full mx-auto flex justify-center md:justify-start">
                <button
                  className="bg-[#4A90E2] rounded-lg py-[15px] text-white sm:w-full w-[350px]"
                  type="submit"
                >
                  Next
                </button>
              </div>

              <div className="w-full mx-auto flex justify-center pb-[74px] px-4">
                <button
                  type="button"
                  className="block sm:hidden bg-[#c5d322] text-sm px-1 py-[15px] w-full rounded-lg text-black"
                >
                  Save progress
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFormView;
