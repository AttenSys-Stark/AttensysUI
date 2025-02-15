import React, { useState } from "react";
import Previous from "./previous";
import { useRouter } from "next/navigation";

interface FormData {
  beginner: boolean;
  bitOfKnowledge: boolean;
  intermediate: boolean;
  advanced: boolean;
  general: boolean;
}

interface FormErrors {
  beginner: string;
  bitOfKnowledge: string;
  intermediate: string;
  advanced: string;
  general: string;
}

const CourseForm2 = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    beginner: false,
    bitOfKnowledge: false,
    intermediate: false,
    advanced: false,
    general: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    beginner: "",
    bitOfKnowledge: "",
    intermediate: "",
    advanced: "",
    general: "",
  });

  const handleCheckboxChange = (field: keyof FormData): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: "",
      }));
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setErrors({
      beginner: "",
      bitOfKnowledge: "",
      intermediate: "",
      advanced: "",
      general: "",
    });

    const isAnyChecked = Object.values(formData).some((value) => value);

    if (!isAnyChecked) {
      setErrors((prev) => ({
        ...prev,
        general: "Please select at least one goal for your course",
      }));
      return;
    }

    router.push("/Course/CreateACourse/create-a-course-2");
  };

  return (
    <div className="relative mx-10 md:mx-auto w-auto md:w-3/4 lg:w-5/12 pt-16">
      <div className="hidden lg:block">
        <Previous />
      </div>
      <div className="flex items-center w-full justify-center">
        <h1 className="mb-12 font-semibold text-[17px] md:text-[26px] text-[#333333] text-center w-[266px] md:w-full">
          Who is your course for, and what should they know before starting?
        </h1>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className=" bg-white px-5 md:px-12 py-9 md:py-16 rounded-2xl flex flex-col gap-5 md:gap-6 justify-center w-full max-w-[524px] mx-auto">
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="beginner"
              name="beginner"
              value="Bike"
              checked={formData.beginner}
              onChange={() => handleCheckboxChange("beginner")}
            />
            <label
              htmlFor="beginner"
              className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]"
            >
              Beginners with no experience
            </label>
          </div>
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="bitOfKnowledge"
              name="bitOfKnowledge"
              value="Bike"
              checked={formData.bitOfKnowledge}
              onChange={() => handleCheckboxChange("bitOfKnowledge")}
            />
            <label
              htmlFor="bitOfKnowledge"
              className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]"
            >
              People with some basic knowledge
            </label>
          </div>
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="intermediate"
              name="intermediate"
              value="Bike"
              checked={formData.intermediate}
              onChange={() => handleCheckboxChange("intermediate")}
            />
            <label
              htmlFor="intermediate"
              className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]"
            >
              Intermediate learners looking to grow
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="advanced"
              name="advanced"
              value="Bike"
              checked={formData.advanced}
              onChange={() => handleCheckboxChange("advanced")}
            />
            <label
              htmlFor="advanced"
              className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]"
            >
              Advanced learners or professionals
            </label>
          </div>
          {errors.general && (
            <p className="text-red-500 text-sm mt-2">{errors.general}</p>
          )}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className=" w-full max-w-[350px] rounded-xl  bg-[#4A90E2] py-3 mt-12 mb-44 text-white"
          >
            Next
          </button>
        </div>
      </form>

      <div className="block absolute left-[35%] bottom-36 lg:hidden">
        <Previous />
      </div>
    </div>
  );
};

export default CourseForm2;
