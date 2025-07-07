import React, { useState, useEffect } from "react";
import CourseForm from "./CourseForm";
import CourseForm2 from "./CourseForm2";
import CourseForm3 from "./CourseForm3";
import MainFormView from "./MainFormView";
import MainFormView2 from "./MainFormView2";
import MainFormView3 from "./MainFormView3";
import MainFormView4 from "./MainFormView4";
import MainFormView5 from "./MainFormView5";
import { courseQuestions } from "@/constants/data";
import LandingPage from "../LandingPage";
import {
  courseInitState,
  connectorAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { connect } from "starknetkit";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const CourseFormLanding = (prop: any) => {
  const [courseData, setCourseData] = useAtom(courseInitState);
  const [connector] = useAtom(connectorAtom);
  const [isConnecting, setIsConnecting] = useState(false);

  const [wallet, setWallet] = useAtom(walletStarknetkit);

  // console.log(courseData);

  const handleCoursePrimaryGoalChange = (e: string) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      primaryGoal: e, // Dynamically update the specific field
    }));
  };

  const handleCourseTargetAudienceChange = (e: string) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      targetAudience: e, // Dynamically update the specific field
    }));
  };
  const handleCoursePlanChange = (e: string) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      courseArea: e, // Dynamically update the specific field
    }));
  };
  const handleCourseNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      courseName: event.target.value, // Dynamically update the specific field
    }));
  };

  const handleCourseCreatorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      courseCreator: event.target.value, // Dynamically update the specific field
    }));
  };
  const handleCourseDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement> | string,
  ) => {
    const value = typeof event === "string" ? event : event.target.value;
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      courseDescription: value, // Dynamically update the specific field
    }));
  };
  const handleCourseCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      courseCategory: event.target.value, // Dynamically update the specific field
    }));
  };
  const handleDifficultyLevelChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      difficultyLevel: event.target.value, // Dynamically update the specific field
    }));
  };
  const handleStudentReqChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      studentRequirements: event.target.value, // Dynamically update the specific field
    }));
  };
  const handleLearningObjChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      learningObjectives: event.target.value, // Dynamically update the specific field
    }));
  };
  const handleTADescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      targetAudienceDesc: event.target.value, // Dynamically update the specific field
    }));
  };
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleCourseImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg")
    ) {
      // Process the file
      setCourseData((prevData) => ({
        ...prevData, // Spread existing data to retain untouched fields
        courseImage: file, // Dynamically update the specific field
      }));

      // Create a temporary URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    } else {
      console.log("Please select a valid image file (JPEG, JPG, or PNG).");
    }
  };
  const handleCourseCurriculumChange = (newLecture: any) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      courseCurriculum: [
        newLecture, // New lecture object
        ...prevData.courseCurriculum, // Existing lectures
      ], // Dynamically update the specific field
    }));
  };
  const handleCoursePricing = (selectedCost: string) => {
    setCourseData((prevData) => ({
      ...prevData,
      coursePricing:
        prevData.coursePricing === selectedCost ? "" : selectedCost,
    }));
    if (selectedCost === "Free") {
      setCourseData((prevData) => ({
        ...prevData,
        price: 0,
      }));
    }
  };
  const handleCoursePromoCode = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      promoAndDiscount: event.target.value, // Dynamically update the specific field
    }));
  };

  const handleCoursePublishWithCert = (
    event: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent, Event>,
  ) => {
    setCourseData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      publishWithCertificate: !prevData.publishWithCertificate, // Dynamically update the specific field
    }));
  };

  if (isConnecting) {
    return (
      <div className="h-auto w-full bg-[#F5F7FA] flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" colorVariant="primary" />
      </div>
    );
  }

  switch (prop.section) {
    case "What%20is%20the%20primary%20goal%20of%20your%20course":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <CourseForm
            section={prop.section}
            handleCoursePrimaryGoalChange={handleCoursePrimaryGoalChange}
          />
        </div>
      );

    case "create-a-course":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <CourseForm2
            section={prop.section}
            handleCourseTargetAudienceChange={handleCourseTargetAudienceChange}
          />
        </div>
      );

    case "create-a-course-2":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <CourseForm3
            section={prop.section}
            handleCoursePlanChange={handleCoursePlanChange}
          />
        </div>
      );
    case "CourseSetup":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <MainFormView
            courseData={courseData}
            handleCourseNameChange={handleCourseNameChange}
            handleCourseCreatorChange={handleCourseCreatorChange}
            handleCourseDescriptionChange={handleCourseDescriptionChange}
            handleCourseCategoryChange={handleCourseCategoryChange}
            handleDifficultyLevelChange={handleDifficultyLevelChange}
          />
        </div>
      );

    case "courseSetup2":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <MainFormView2
            courseData={courseData}
            setCourseData={setCourseData}
            handleStudentReqChange={handleStudentReqChange}
            handleLearningObjChange={handleLearningObjChange}
            handleTADescriptionChange={handleTADescriptionChange}
          />
        </div>
      );

    case "courseSetup3":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <MainFormView3
            imageUrl={imageUrl}
            courseData={courseData}
            setCourseData={setCourseData}
            handleCourseImageChange={handleCourseImageChange}
            handleCourseCurriculumChange={handleCourseCurriculumChange}
          />
        </div>
      );
    case "courseSetup4":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <MainFormView4
            courseData={courseData}
            handleCoursePricing={handleCoursePricing}
            handleCoursePromoCode={handleCoursePromoCode}
          />
        </div>
      );
    case "courseSetup5":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <MainFormView5
            courseData={courseData}
            setCourseData={setCourseData}
            handleCoursePublishWithCert={handleCoursePublishWithCert}
            wallet={wallet}
          />
        </div>
      );
    // case "course-landing-page":
    //   return (
    //     <div className="h-auto w-full bg-[#F5F7FA]">
    //       <LandingPage
    //         courseData={courseData}
    //         setCourseData={setCourseData}
    //         wallet={wallet}
    //       />
    //     </div>
    //   );
    default:
      return;
  }
};

export default CourseFormLanding;
