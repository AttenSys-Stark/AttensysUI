import React, { useEffect, useRef, useState } from "react";
import { Account, Contract } from "starknet";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { provider } from "@/constants";
import { useAccount } from "@starknet-react/core";
import { usePinataAccess } from "@/hooks/usePinataAccess";
import ReactPlayer from "react-player/lazy";
import { PinataSDK } from "pinata";
import AddLecture from "./course-form/AddLecture";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useExplorer } from "@starknet-react/core";
import { pinata as pinataclone } from "../../../utils/config";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/userutils";
import { decryptPrivateKey } from "@/helpers/encrypt";
import { executeCalls } from "@avnu/gasless-sdk";
import { STRK_ADDRESS } from "@/deployments/erc20Contract";

interface EditCoursePanelProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  onSave: (updatedCourse: any) => void;
  isUpdating: boolean;
  updateSuccess: boolean;
}

const EditCoursePanel: React.FC<EditCoursePanelProps> = ({
  isOpen,
  onClose,
  course,
  onSave,
  isUpdating,
  updateSuccess,
}) => {
  const [formData, setFormData] = useState({
    courseName: course?.data?.courseName || "",
    difficultyLevel: course?.data?.difficultyLevel || "",
    courseDescription: course?.data?.courseDescription || "",
    courseCategory: course?.data?.courseCategory || "",
    studentRequirements: course?.data?.studentRequirements || "",
    learningObjectives: course?.data?.learningObjectives || "",
    courseCurriculum: course?.data?.courseCurriculum || [],
    courseArea: course?.data?.courseArea || "",
    courseCreator: course?.data?.courseCreator || "",
    courseIdentifier: course?.data?.courseIdentifier || "",
    courseImage: course?.data?.courseImage || "",
    coursePricing: course?.data?.coursePricing || "",
    primaryGoal: course?.data?.primaryGoal || "",
    promoAndDiscount: course?.data?.promoAndDiscount || "",
    publishWithCertificate: course?.data?.publishWithCertificate || "",
    targetAudience: course?.data?.targetAudience || "",
    targetAudienceDesc: course?.data?.targetAudienceDesc || "",
  });

  const [activeSection, setActiveSection] = useState("basic");
  const [editingLecture, setEditingLecture] = useState<any>(null);
  const [videoUrls, setVideoUrls] = useState<{ [key: string]: string }>({});
  const [showAddlecture, setShowAddLecture] = useState(false);
  const [savingstate, setsavingstate] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // const { account, address } = useAccount();
  const [account, setAccount] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const { createAccessLink } = usePinataAccess();
  const explorer = useExplorer();
  const playerRef = useRef<ReactPlayer | null>(null);

  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
  });

  function extractCIDFromUrl(ipfsUrl: string): string {
    // Split the URL by '/' and get the last part
    const parts = ipfsUrl.split("/");
    const cid = parts[parts.length - 1];
    return cid.split("?")[0].split(".")[0];
  }

  const handleDeletion = (target: number) => {
    if (
      typeof target !== "number" ||
      target < 0 ||
      target >= formData.courseCurriculum.length
    ) {
      console.error("Invalid target index:", target);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      courseCurriculum: [
        ...prev.courseCurriculum.slice(0, target),
        ...prev.courseCurriculum.slice(target + 1),
      ],
    }));
  };

  const handleCourseCurriculumChange = (newLecture: any) => {
    setFormData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      courseCurriculum: [
        newLecture, // New lecture object
        ...prevData.courseCurriculum, // Existing lectures
      ], // Dynamically update the specific field
    }));
  };

  const handleSavechanges = async (e: any) => {
    e.preventDefault();
    setsavingstate(true);
    onSave({
      ...course,
      data: {
        ...course.data,
        ...formData,
      },
    });

    const handlePlay = () => {
      // Trigger fullscreen when play starts
      const playerElement =
        playerRef.current?.getInternalPlayer() as HTMLElement | null;
      if (playerElement) {
        if (playerElement.requestFullscreen) {
          playerElement.requestFullscreen();
        } else if ((playerElement as any).webkitRequestFullscreen) {
          // Safari
          (playerElement as any).webkitRequestFullscreen();
        } else if ((playerElement as any).msRequestFullscreen) {
          // IE/Edge
          (playerElement as any).msRequestFullscreen();
        }
      }
    };

    console.log("this is the form data", formData);
    const dataUpload = await pinataclone.upload.json({
      primaryGoal: formData.primaryGoal,
      targetAudience: formData.targetAudience,
      courseArea: formData.courseArea,
      courseIdentifier: "1",
      courseCreator: formData.courseCreator,
      courseName: formData.courseName,
      courseDescription: formData.courseDescription,
      courseCategory: formData.courseCategory,
      difficultyLevel: formData.difficultyLevel,
      studentRequirements: formData.studentRequirements,
      learningObjectives: formData.learningObjectives,
      targetAudienceDesc: formData.targetAudienceDesc,
      courseImage: formData.courseImage,
      courseCurriculum: formData.courseCurriculum,
      coursePricing: formData.coursePricing,
      promoAndDiscount: formData.promoAndDiscount,
      publishWithCertificate: formData.publishWithCertificate,
    });
    try {
      if (dataUpload) {
        const courseContract = new Contract(
          attensysCourseAbi,
          attensysCourseAddress,
          account,
        );
        const editcourse_calldata = await courseContract.populate(
          "add_replace_course_content",
          [
            Number(course?.course_identifier),
            address ?? "",
            dataUpload.IpfsHash,
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
              entrypoint: "add_replace_course_content",
              calldata: editcourse_calldata.calldata,
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
        console.log("result", callCourseContract);
        let tx = await provider.waitForTransaction(
          callCourseContract.transactionHash,
        );

        //@ts-ignore
        if (
          ((tx as any)?.finality_status === "ACCEPTED_ON_L2" ||
            (tx as any)?.finality_status === "ACCEPTED_ON_L1") &&
          (tx as any)?.execution_status === "SUCCEEDED"
        ) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          toast.success(
            <div>
              Update successful
              <br />
              Transaction hash:{" "}
              <a
                href={`${explorer.transaction(callCourseContract?.transactionHash)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                {callCourseContract?.transactionHash
                  ? `${callCourseContract.transactionHash.slice(0, 6)}...${callCourseContract.transactionHash.slice(-4)}`
                  : ""}
              </a>
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            },
          );
          setsavingstate(false);
          onClose();
          return;
        } else {
          toast.error("Update failed", {
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
          setsavingstate(false);
        }
      }
    } catch (error) {
      console.log("upload error", error);
      toast.error("Update failed", {
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
      setsavingstate(false);
    }
  };

  const handleAddlectureToggle = (e: any) => {
    e.preventDefault();
    setShowAddLecture(!showAddlecture);
  };
  const createAccess = async (cid: string, expires: number = 86400) => {
    try {
      let formattedCid = extractCIDFromUrl(cid);
      const accessUrl = await pinata.gateways.private.createAccessLink({
        cid: formattedCid,
        expires,
      });
      return accessUrl;
    } catch (err) {
      console.error("Error creating access link:", err);
    }
  };

  useEffect(() => {
    const fetchUrls = async () => {
      const urls: { [key: string]: string } = {};
      for (const item of course?.data.courseCurriculum || []) {
        console.log("testing item", item);
        try {
          const url = await createAccess(item.video);
          if (url) {
            urls[item.video] = url;
          }
        } catch (error) {
          console.error(`Error fetching URL for ${item.video}:`, error);
        }
      }
      setVideoUrls(urls);
    };

    const fetchformDataUrls = async () => {
      const urls: { [key: string]: string } = {};
      for (const item of formData.courseCurriculum || []) {
        console.log("testing item", item);
        try {
          const url = await createAccess(item.video);
          if (url) {
            urls[item.video] = url;
          }
        } catch (error) {
          console.error(`Error fetching URL for ${item.video}:`, error);
        }
      }
      setVideoUrls(urls);
    };

    if (
      course &&
      course?.data?.courseCurriculum?.length >
        formData?.courseCurriculum?.length
    ) {
      console.log("course data here", course);
      fetchUrls();
      setFormData({
        courseName: course.data.courseName || "",
        difficultyLevel: course.data.difficultyLevel || "",
        courseDescription: course.data.courseDescription || "",
        courseCategory: course.data.courseCategory || "",
        studentRequirements: course.data.studentRequirements || "",
        learningObjectives: course.data.learningObjectives || "",
        courseCurriculum: course.data.courseCurriculum || [],
        courseArea: course?.data?.courseArea || "",
        courseCreator: course?.data?.courseCreator || "",
        courseIdentifier: course?.data?.courseIdentifier || "",
        courseImage: course?.data?.courseImage || "",
        coursePricing: course?.data?.coursePricing || "",
        primaryGoal: course?.data?.primaryGoal || "",
        promoAndDiscount: course?.data?.promoAndDiscount || "",
        publishWithCertificate: course?.data?.publishWithCertificate || "",
        targetAudience: course?.data?.targetAudience || "",
        targetAudienceDesc: course?.data?.targetAudienceDesc || "",
      });
    }

    if (
      course &&
      course?.data?.courseCurriculum?.length <
        formData?.courseCurriculum?.length
    ) {
      fetchformDataUrls();
    }
  }, [course, formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLectureChange = (index: number, field: string, value: string) => {
    const updatedCurriculum = [...formData.courseCurriculum];
    updatedCurriculum[index] = {
      ...updatedCurriculum[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      courseCurriculum: updatedCurriculum,
    }));
  };

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
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-1/2 bg-white shadow-lg transform transition-all duration-500 ease-in-out z-[100] ${
          isOpen
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }`}
      >
        <div
          className={`p-6 h-full overflow-y-auto transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#2D3A4B] transform transition-all duration-300 hover:scale-105">
              {updateSuccess ? "Success!" : "Edit Course"}
            </h2>
            <button
              onClick={onClose}
              className="text-[#A01B9B] hover:text-[#4A90E2] cursor-pointer transition-all duration-300 transform hover:rotate-90"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {isUpdating ? (
            <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A01B9B]"></div>
              <p className="mt-4 text-[#2D3A4B]">Updating course...</p>
            </div>
          ) : updateSuccess ? (
            <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)]">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="mt-4 text-[#2D3A4B]">
                Course updated successfully!
              </p>
            </div>
          ) : (
            <>
              {/* Navigation Tabs */}
              <div className="flex space-x-4 mb-6 border-b border-[#A01B9B]/20">
                <button
                  onClick={() => setActiveSection("basic")}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeSection === "basic"
                      ? "text-[#A01B9B] border-b-2 border-[#A01B9B]"
                      : "text-[#2D3A4B] hover:text-[#4A90E2]"
                  }`}
                >
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveSection("details")}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeSection === "details"
                      ? "text-[#A01B9B] border-b-2 border-[#A01B9B]"
                      : "text-[#2D3A4B] hover:text-[#4A90E2]"
                  }`}
                >
                  Course Details
                </button>
                <button
                  onClick={() => setActiveSection("curriculum")}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeSection === "curriculum"
                      ? "text-[#A01B9B] border-b-2 border-[#A01B9B]"
                      : "text-[#2D3A4B] hover:text-[#4A90E2]"
                  }`}
                >
                  Curriculum
                </button>
              </div>

              <form className="space-y-6">
                {/* Basic Info Section */}
                {activeSection === "basic" && (
                  <div className="space-y-6">
                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-[#2D3A4B] mb-1">
                        Course Name
                      </label>
                      <input
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-[#A01B9B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A01B9B] focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-[#2D3A4B] mb-1">
                        Course Category
                      </label>
                      <select
                        name="courseCategory"
                        value={formData.courseCategory}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-[#A01B9B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A01B9B] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">
                          Mobile Development
                        </option>
                        <option value="Data Science">Data Science</option>
                        <option value="Blockchain">Blockchain</option>
                        <option value="Design">Design</option>
                      </select>
                    </div>

                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-[#2D3A4B] mb-1">
                        Difficulty Level
                      </label>
                      <select
                        name="difficultyLevel"
                        value={formData.difficultyLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-[#A01B9B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A01B9B] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                        required
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Course Details Section */}
                {activeSection === "details" && (
                  <div className="space-y-6">
                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-[#2D3A4B] mb-1">
                        Course Description
                      </label>
                      <textarea
                        name="courseDescription"
                        value={formData.courseDescription}
                        onChange={handleChange}
                        rows={8}
                        className="w-full px-4 py-2 border-2 border-[#A01B9B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A01B9B] focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-[#2D3A4B] mb-1">
                        Student Requirements
                      </label>
                      <textarea
                        name="studentRequirements"
                        value={formData.studentRequirements}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-2 border-2 border-[#A01B9B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A01B9B] focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-[#2D3A4B] mb-1">
                        Learning Objectives
                      </label>
                      <textarea
                        name="learningObjectives"
                        value={formData.learningObjectives}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-2 border-2 border-[#A01B9B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A01B9B] focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Curriculum Section */}
                {activeSection === "curriculum" && (
                  <div className="space-y-6">
                    {formData.courseCurriculum
                      ?.slice()
                      .reverse()
                      .map((lecture: any, index: number) => (
                        <div
                          key={index}
                          className="transform transition-all duration-300 hover:scale-[1.02] bg-white p-4 rounded-lg shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-[#2D3A4B]">
                              Lecture {index + 1}
                            </h3>
                            <div className="flex space-x-8">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingLecture(
                                    editingLecture === index ? null : index,
                                  )
                                }
                                className="text-[#4A90E2] hover:text-[#357ABD] transition-colors duration-200"
                              >
                                {editingLecture === index ? "Done" : "Edit"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletion(index)}
                                className="text-red-900 hover:text-red-900 transition-colors duration-200"
                              >
                                {editingLecture === index ? null : "Delete"}
                              </button>
                            </div>
                          </div>

                          {editingLecture === index ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-[#2D3A4B] mb-1">
                                  Lecture Title
                                </label>
                                <input
                                  type="text"
                                  value={lecture.name}
                                  onChange={(e) =>
                                    handleLectureChange(
                                      index,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border-2 border-[#A01B9B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A01B9B] focus:border-transparent transition-all duration-200"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#2D3A4B] mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={lecture.description}
                                  onChange={(e) =>
                                    handleLectureChange(
                                      index,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  rows={6}
                                  className="w-full px-3 py-2 border-2 border-[#A01B9B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A01B9B] focus:border-transparent transition-all duration-200"
                                />
                              </div>
                              <h1>{lecture.fileName}</h1>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex space-x-10 items-center cursor-pointer">
                                <div className="w-[150px] h-[97px] border-[1px] overflow-hidden rounded-lg flex items-center text-center justify-center  ">
                                  {videoUrls[lecture.video] ? (
                                    <div>
                                      <ReactPlayer
                                        url={videoUrls[lecture.video]}
                                        width="100%"
                                        height="100%"
                                        className="rounded-xl"
                                        // playing={isPlaying}
                                        controls
                                        // playing={!showOverlay}
                                        playIcon={<></>}
                                      />
                                    </div>
                                  ) : (
                                    <h1 className="text-sm italic px-3">
                                      Preview unavailable
                                    </h1>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <p className="text-[#2D3A4B] font-medium">
                                    {lecture.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {lecture.description == ""
                                      ? "No Description"
                                      : lecture.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                    {showAddlecture && (
                      <AddLecture
                        courseData={formData}
                        setCourseData={setFormData}
                        handleCourseCurriculumChange={
                          handleCourseCurriculumChange
                        }
                      />
                    )}

                    <button
                      onClick={handleAddlectureToggle}
                      className="px-4 py-2 w-full text-white bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] rounded-md hover:from-[#4A90E2] hover:to-[#9B51E0] transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      {showAddlecture
                        ? "Collapse"
                        : "Upload Additional lecture +"}
                    </button>
                  </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-[#2D3A4B] bg-[#F5F7FA] rounded-md hover:bg-[#E8EAF6] transition-all duration-300 transform hover:scale-105 border-2 border-[#A01B9B]/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavechanges}
                    type="submit"
                    className="px-4 py-2 text-white bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] rounded-md hover:from-[#4A90E2] hover:to-[#9B51E0] transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    {savingstate ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditCoursePanel;
