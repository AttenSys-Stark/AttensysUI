import React from "react";
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

const CourseFormLanding = (prop: any) => {
  switch (prop.section) {
    case "What%20is%20the%20primary%20goal%20of%20your%20course":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <CourseForm section={prop.section} />
        </div>
      );

    case "create-a-course":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <CourseForm2 />
        </div>
      );

    case "create-a-course-2":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <CourseForm3 />
        </div>
      );
    case "CourseSetup":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <MainFormView />
        </div>
      );

    case "courseSetup2":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <MainFormView2 />
        </div>
      );

    case "courseSetup3":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <MainFormView3 />
        </div>
      );
    case "courseSetup4":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <MainFormView4 />
        </div>
      );
    case "courseSetup5":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <MainFormView5 />
        </div>
      );
    case "course-landing-page":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <LandingPage />
        </div>
      );
    case "course-home-landing-page":
      return (
        <div className="h-auto w-full bg-[#F5F7FA]">
          <LandingPage />
        </div>
      );
    default:
      return <>hey</>;
  }
};

export default CourseFormLanding;
