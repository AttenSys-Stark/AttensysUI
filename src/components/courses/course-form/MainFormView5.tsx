"use client";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import video from "@/assets/video.png";
import youtube from "@/assets/youtube.svg";
import podcast from "@/assets/Podcast.svg";
import rich from "@/assets/Richin2024.svg";
import Image from "next/image";
import Lectures from "../Lectures";
import CourseSideBar from "./SideBar";
import { MdOutlineDiamond } from "react-icons/md";
import { IoSearchOutline, IoMenuOutline } from "react-icons/io5";
import { pinata } from "../../../../utils/config";
import { FileObject } from "pinata";
import {
  courseInitState,
  clearCourseDraft,
} from "@/state/connectedWalletStarknetkitNext";
import { lectures } from "@/constants/data";
import { attensysCourseAddress } from "@/deployments/contracts";
import { attensysCourseAbi } from "@/deployments/abi";
import { Account, Contract } from "starknet";
import { useRouter } from "next/navigation";
import { handleCreateCourse } from "@/utils/helpers";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast, Bounce, ToastContainer } from "react-toastify";
import { useAccount } from "@starknet-react/core";
import { STRK_ADDRESS } from "@/deployments/erc20Contract";
import { executeCalls } from "@avnu/gasless-sdk";
import { provider } from "@/constants";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/userutils";
import { decryptPrivateKey } from "@/helpers/encrypt";

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
  const [showRetry, setShowRetry] = useState(false);
  // const { account, address } = useAccount();
  const [account, setAccount] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const [txnHash, setTxnHash] = useState<string>();

  const router = useRouter();
  const handleSwitch = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<Element, MouseEvent>,
    value: boolean,
  ) => {
    setIsActivated(value);
    if (event instanceof MouseEvent) {
      handleCoursePublishWithCert(event);
    }
  };

  const [receiptData, setReceiptData] = useState<any>(null);

  function dataURLtoBlob(dataURL: any) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  const handleCourseUpload = async (e: any) => {
    // console.log("account", account);
    setIsUploading(true);
    setIsSaving(true);

    try {
      // Get current user's email
      const currentUser = auth.currentUser;
      if (!currentUser?.email) {
        throw new Error("No user email found");
      }

      const blob = dataURLtoBlob(courseData.courseImage.url);

      const realFile = new File([blob], courseData.courseImage.name, {
        type: courseData.courseImage.type,
      });
      const courseImgupload = await pinata.upload.file(realFile);

      const dataUpload = await pinata.upload.json({
        primaryGoal: courseData.primaryGoal,
        targetAudience: courseData.targetAudience,
        courseArea: courseData.courseArea,
        courseIdentifier: "1",
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
        creatorEmail: currentUser.email,
      });
      console.log("dataUpload", dataUpload);

      if (dataUpload) {
        console.log("clicked");
        try {
          const courseContract = new Contract(
            attensysCourseAbi,
            attensysCourseAddress,
            account,
          );

          const create_course_calldata = await courseContract.populate(
            "create_course",
            [
              address,
              false,
              courseImgupload.IpfsHash,
              courseData.courseName,
              "XXX",
              dataUpload.IpfsHash,
              courseData.price,
            ],
          );

          const avnuApiKey = process.env.NEXT_PUBLIC_AVNU_API_KEY;
          if (!avnuApiKey) {
            throw new Error("Missing AVNU API key in environment variables");
          }
          const callCourseContract = await executeCalls(
            account,
            [
              {
                contractAddress: attensysCourseAddress,
                entrypoint: "create_course",
                calldata: create_course_calldata.calldata,
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

          setTxnHash(callCourseContract?.transactionHash);
          console.log("hash", callCourseContract?.transactionHash);
          //@ts-ignore
          if (
            ((tx as any)?.finality_status === "ACCEPTED_ON_L2" ||
              (tx as any)?.finality_status === "ACCEPTED_ON_L1") &&
            (tx as any)?.execution_status === "SUCCEEDED"
          ) {
            // Send notifications
            try {
              // Notify admin about new course
              await fetch(
                "https://attensys-1a184d8bebe7.herokuapp.com/api/notify-admin-new-course",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Origin: window.location.origin,
                  },
                  credentials: "include",
                  mode: "cors",
                  body: JSON.stringify({
                    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
                    creatorName: courseData.courseCreator,
                    courseName: courseData.courseName,
                  }),
                },
              );

              // Notify course creator
              await fetch(
                "https://attensys-1a184d8bebe7.herokuapp.com/api/course-creation-notification",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Origin: window.location.origin,
                  },
                  credentials: "include",
                  mode: "cors",
                  body: JSON.stringify({
                    email: currentUser.email,
                    username: courseData.courseCreator,
                    courseName: courseData.courseName,
                  }),
                },
              );
            } catch (notificationError) {
              console.warn("Error sending notifications:", notificationError);
              // Don't fail the course creation if notifications fail
            }

            toast.success("Course Creation successful!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
            router.push(`/mycoursepage/${address}/?id=created`);
          } else {
            toast.error("Course Creation failed, Try again", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          }
        } catch (error: any) {
          toast.error("Course Creation failed, Try again", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      }
    } catch (error) {
      console.log("from here", error);
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const retryTransaction = (e: any) => {
    handleCourseUpload(e);
  };

  useEffect(() => {
    // Check if courseImage has a url property
    if (courseData.courseImage?.url) {
      setImageSrc(courseData.courseImage.url);
    }
  }, [courseData.courseImage]);

  useEffect(() => {}, [receiptData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
            setAddress(profile.starknetAddress);
          } else {
            console.log("No user profile found in Firestore.");
            setAccount(undefined);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setAccount(undefined);
        }
      } else {
        console.log("No authenticated user found.");
        setAccount(undefined);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="lg:flex">
      <div className="hidden xl:block">
        <CourseSideBar courseData={courseData} />
      </div>

      <div className="flex-1 w-full">
        {/* <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div> */}

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

          <div className="lg:mx-4 xl:mx-24 sm:mt-12">
            {/* field */}
            <div className="mb-3 order-first block lg:hidden">
              <p className="text-[#5801A9] text-[16px] font-medium leading-[22px]">
                Category: {courseData.courseCategory}
              </p>
            </div>
            <div className="block lg:grid lg:grid-cols-2 gap-8">
              {/* Course Image */}
              <div>
                <div className="h-[350px] w-full lg:w-[500px] overflow-hidden block sm:hidden">
                  <div className="relative h-full w-full">
                    {imageSrc ? (
                      <Image
                        src={(imageSrc as string) || "/placeholder.svg"}
                        alt="Fetched Image"
                        width={500}
                        height={350}
                        className="object-cover w-full h-full"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <LoadingSpinner size="md" colorVariant="primary" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-[350px] w-full pr-10 hidden sm:block overflow-hidden">
                  <div className="relative h-full w-full">
                    {imageSrc ? (
                      <Image
                        src={(imageSrc as string) || "/placeholder.svg"}
                        alt="Fetched Image"
                        width={500}
                        height={350}
                        className="object-cover w-full h-full"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <LoadingSpinner size="md" colorVariant="primary" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="  text-[#333333] text-[14px] font-light leading-[22px] my-3 text-justify sm:w-[95%]">
                  <p>
                    {courseData.targetAudienceDesc?.length > 200
                      ? `${courseData.targetAudienceDesc.slice(0, 200)}...`
                      : courseData.targetAudienceDesc}
                  </p>
                </div>
              </div>

              {/* Course information */}
              <div className="flex flex-col justify-between text-justify">
                <div>
                  {/* field */}
                  <div className="mb-3 order-first hidden lg:block">
                    <p className="text-[#5801A9] text-[16px] font-medium leading-[22px]">
                      Category: {courseData.courseCategory}
                    </p>
                  </div>

                  <h4 className="text-[19px] text-[#333333] leading-[34px] font-bold my-2">
                    {courseData.courseName}
                  </h4>
                  <div className="my-3">
                    <div
                      className="text-[#333333] text-[14px] font-light leading-[22px]"
                      dangerouslySetInnerHTML={{
                        __html:
                          courseData.courseDescription?.length > 300
                            ? `${courseData.courseDescription.slice(0, 300)}...`
                            : courseData.courseDescription,
                      }}
                    />
                    <div className="bg-[#5801A9] py-2 text-white text-center mt-4 mb-3 sm:w-[95%] lg:w-[50%] rounded-lg">
                      <p className="text-[14px] font-extrabold leading-[22px]">
                        {courseData.courseCreator}
                      </p>
                    </div>
                    <div className="flex space-x-3 items-center">
                      <MdOutlineDiamond color="#333333" />
                      <p className="text-[#333333] text-[14px] leading-[22px]">
                        <span className="font-medium">Difficulty level :</span>
                        {courseData.difficultyLevel}
                      </p>
                    </div>
                  </div>
                </div>

                <div></div>
              </div>
            </div>

            <div className="mt-3">
              {/* Student Requirements */}

              <div className="mb-6 block lg:hidden">
                <h4 className="font-semibold text-[18px] leading-[31px] text-[#333333] mb-2">
                  Student Requirements
                </h4>
                <div className="text-[#333333] text-[14px] font-light leading-[22px]">
                  <p>
                    {courseData.studentRequirements?.length > 200
                      ? `${courseData.studentRequirements.slice(0, 200)}...`
                      : courseData.studentRequirements}
                  </p>
                </div>
              </div>

              {/* Target Audience */}
              <div className="mb-6 block lg:hidden">
                <h2 className="font-semibold text-[18px] leading-[31px] text-[#333333] mb-2">
                  Target Audience
                </h2>
                <div className="text-[#333333] text-[14px] font-light leading-[22px]">
                  <p>
                    {" "}
                    {courseData.targetAudience?.length > 200
                      ? `${courseData.targetAudience.slice(0, 200)}...`
                      : courseData.targetAudience}
                  </p>
                </div>
              </div>

              <div className=" sm:mt-2 xl:mt-3 mb-10">
                {/* lectures in course */}

                <Lectures
                  lectures={lectures}
                  courseData={courseData}
                  learningObj={courseData.learningObjectives}
                  isActivated={isActivated}
                  handleSwitch={(checked: boolean) => {
                    const mockEvent = new MouseEvent(
                      "click",
                    ) as unknown as React.MouseEvent<Element, MouseEvent>;
                    handleSwitch(mockEvent, checked);
                  }}
                />

                <div>
                  <div className="flex flex-col lg:w-[60%] mt-2">
                    <h4 className="font-semibold text-[18px] leading-[31px] text-[#333333] mb-4">
                      Do you want to issue certification for this course?
                    </h4>

                    <div className="flex items-center space-x-8">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="certification"
                          checked={isActivated}
                          onChange={(e) => handleSwitch(e, true)}
                          className="w-4 h-4 text-[#9B51E0] border-2 border-[#9B51E0] focus:ring-[#9B51E0]"
                        />
                        <span className="text-[#333333] text-[14px] font-normal">
                          Yes
                        </span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="certification"
                          checked={!isActivated}
                          onChange={(e) => handleSwitch(e, false)}
                          className="w-4 h-4 text-[#9B51E0] border-2 border-[#9B51E0] focus:ring-[#9B51E0]"
                        />
                        <span className="text-[#333333] text-[14px] font-normal">
                          No
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* course desc & student req */}
              <div className="">
                <div className="mt-4 sm:mt-8  sm:mb-12">
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

                  {showRetry && (
                    <button
                      onClick={retryTransaction}
                      className="ml-4 px-4 py-2 bg-purple-600 text-white rounded"
                    >
                      Retry
                    </button>
                  )}
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
