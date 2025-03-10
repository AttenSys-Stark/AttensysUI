import React, { FC } from "react";
import { courseSetup } from "@/constants/data";
import { courseInitState } from "@/state/connectedWalletStarknetkitNext";
import { PrimitiveAtom, atom, useAtom, useAtomValue } from "jotai";

// Defining the shape of the course data
interface CourseRegistrationData {
  primaryGoal: string;
  targetAudience: string;
  courseArea: string;
  courseName: string;
  courseDescription: string;
  courseCategory: string;
  difficultyLevel: string;
  studentRequirements: string;
  learningObjectives: string;
  targetAudienceDesc: string;
  courseImage: string;
  courseCurriculum: any[];
  coursePricing: string;
  promoAndDiscount: string;
  publishWithCertificate: boolean;
}

// Defining props for the component
interface CourseSideBarProps {
  courseData: PrimitiveAtom<CourseRegistrationData>;
}

// Mapping of courseSetup items to InitCourseRegistrationData keys
const fieldMapping: { [key: string]: keyof CourseRegistrationData } = {
  "Course name": "courseName",
  "Course description": "courseDescription",
  "Course category": "courseCategory",
  "Course level": "difficultyLevel",
  "Student requirements": "studentRequirements",
  "Learning objectives": "learningObjectives",
  "Target audience": "targetAudienceDesc",
  "Course creative": "courseImage",
  "Course Curriculum": "courseCurriculum",
  "Course pricing": "coursePricing",
  "Promos and discounts": "promoAndDiscount",
  "Publish course": "publishWithCertificate",
};

const CourseSideBar: FC<CourseSideBarProps> = ({ courseData }) => {
  // Unwrap the atom value using useAtomValue from Jotai
  // console.log(fieldMapping);
  const data = useAtomValue(courseInitState);
  // // Function to check if a field is filled
  const isFieldFilled = (field: keyof CourseRegistrationData) => {
    const value = data[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "boolean") {
      return value;
    }
    return value !== "";
  };

  return (
    <div className="bg-gradient-to-b from-[#9b51e052] to-[#4a90e252] py-8 px-8 h-full">
      <div>
        {courseSetup.map((item, i) => (
          <div key={i} className={`${i == 0 ? "my-2" : "my-12"}`}>
            <div className="border-l-4 border-[#4a90e2] text-[#4a90e2] my-4 pl-6">
              <h1 className="font-semibold text-[16px] leading-[31px]">
                {item.head}
              </h1>
            </div>

            <div>
              {item.items.map((sub, j) => {
                // Get the corresponding field key
                const fieldKey = fieldMapping[sub];
                // Check if the field is filled
                const isChecked = fieldKey ? isFieldFilled(fieldKey) : false;

                return (
                  <div key={j} className="flex items-center mx-6 my-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="appearance-none w-4 h-4 rounded-full border-[1px] border-[#2D3A4B] checked:bg-[#115E2C] checked:border-[#115E2C] required:border-red-500 checked:before:content-['✔'] checked:before:absolute checked:before:top-[-1px] checked:before:left-[3px] checked:before:text-white checked:before:text-[10px] relative"
                    />
                    <p className="ml-4 text-[#333333] text-[14px] leading-[22px]">
                      {sub}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSideBar;
