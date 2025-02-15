import React, { useState } from "react";
import Previous from "./previous";
import { useRouter } from "next/navigation";

interface FormData {
  completePlan: boolean;
  roughPlan: boolean;
  clearPlan: boolean;
  helpOrganizing: boolean;
  general: boolean;
}

interface FormErrors {
  completePlan: string;
  roughPlan: string;
  clearPlan: string;
  helpOrganizing: string;
  general: string;
}

const CourseForm3 = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    completePlan: false,
    roughPlan: false,
    clearPlan: false,
    helpOrganizing: false,
    general: false,
  });
  const [errors, setErrors] = useState<FormErrors>({
    completePlan: "",
    roughPlan: "",
    clearPlan: "",
    helpOrganizing: "",
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
      completePlan: "",
      roughPlan: "",
      clearPlan: "",
      helpOrganizing: "",
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
        <div className=" bg-white px-5 md:px-12 py-9 md:py-16 rounded-2xl flex flex-col gap-5 md:gap-6 justify-center w-full max-w-[524px] mx-auto">
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="completePlan"
              name="completePlan"
              value="Bike"
              checked={formData.completePlan}
              onChange={() => handleCheckboxChange("completePlan")}
            />
            <label
              htmlFor="completePlan"
              className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]"
            >
              Yes, I have a complete course plan
            </label>
          </div>
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="roughPlan"
              name="roughPlan"
              value="Bike"
              checked={formData.roughPlan}
              onChange={() => handleCheckboxChange("roughPlan")}
            />
            <label
              htmlFor="roughPlan"
              className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]"
            >
              I have a rough plan, but it needs work
            </label>
          </div>
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="clearPlan"
              name="clearPlan"
              value="Bike"
              checked={formData.clearPlan}
              onChange={() => handleCheckboxChange("clearPlan")}
            />
            <label
              htmlFor="clearPlan"
              className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]"
            >
              I have some ideas but no clear plan yet
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="helpOrganizing"
              name="helpOrganizing"
              value="Bike"
              checked={formData.helpOrganizing}
              onChange={() => handleCheckboxChange("helpOrganizing")}
            />
            <label
              htmlFor="helpOrganizing"
              className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]"
            >
              I need help organizing the course
            </label>
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm mt-2">{errors.general}</p>
          )}
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] w-full max-w-[350px] rounded-xl  py-3 text-xs md:text-base mt-12 mb-44 text-white">
            Setup my course
          </button>
        </div>
      </form>

      <div className="block absolute left-[35%] bottom-36 lg:hidden">
        <Previous />
      </div>
    </div>
  );
};

export default CourseForm3;
