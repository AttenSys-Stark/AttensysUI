import React, { useState } from "react";
import Previous from "./previous";
import { useRouter } from "next/navigation";

interface Option {
  id: keyof FormData;
  label: string;
}

interface FormData {
  completePlan: boolean;
  roughPlan: boolean;
  clearPlan: boolean;
  helpOrganizing: boolean;
}

interface FormErrors {
  general: string;
}

interface ChildComponentProps {
  section: any;
  handleCoursePlanChange: (e: string) => void;
}

const options: Option[] = [
  { id: "completePlan", label: "Yes, I have a complete course plan" },
  { id: "roughPlan", label: "I have a rough plan, but it needs work" },
  { id: "clearPlan", label: "I have some ideas but no clear plan yet" },
  { id: "helpOrganizing", label: "I need help organizing the course" },
];

const CourseForm3 = ({
  section,
  handleCoursePlanChange,
}: ChildComponentProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({ general: "" });

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setErrors({ general: "" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleCoursePlanChange(selectedOption);

    if (!selectedOption) {
      setErrors({ general: "Please select one option." });
      return;
    }

    handleCoursePlanChange(selectedOption);
    router.push("/Course/CreateACourse/CourseSetup");
  };

  return (
    <div className="relative mx-10 md:mx-auto w-auto md:w-3/4 lg:w-5/12 pt-16">
      <div className="hidden lg:block">
        <Previous />
      </div>
      <div className="flex items-center w-full justify-center">
        <h1 className="mb-12 font-semibold text-[17px] md:text-[26px] text-[#333333] text-center w-[266px] md:w-full">
          Do you already have a plan for what your course will cover?
        </h1>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white px-5 md:px-12 py-9 md:py-16 rounded-2xl flex flex-col gap-5 md:gap-6 justify-center w-full max-w-[524px] mx-auto">
          {options.map((option) => (
            <div className="flex" key={option.id}>
              <input
                type="radio"
                className="required:border-red-500"
                id={option.id}
                name="coursePlan"
                value={option.label}
                checked={selectedOption === option.label}
                onChange={handleRadioChange}
              />
              <label
                htmlFor={option.id}
                className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]"
              >
                {option.label}
              </label>
            </div>
          ))}
          {errors.general && (
            <p className="text-red-500 text-sm mt-2">{errors.general}</p>
          )}
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] w-[190px] md:w-[350px rounded-xl py-3 text-xs md:text-base mt-12 mb-44 text-white"
          >
            Setup my course
          </button>
        </div>
      </form>
      <div className="block absolute left-[37.5%]  md:left-[42%] bottom-36 lg:hidden">
        <Previous />
      </div>
    </div>
  );
};

export default CourseForm3;
