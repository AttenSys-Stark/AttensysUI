import React, { useState } from "react";
import Previous from "./previous";
import { useRouter } from "next/navigation";

interface CourseFormProps {
  section: string;
}

interface FormData {
  jobSkills: boolean;
  certificate: boolean;
  hobby: boolean;
  newIdeas: boolean;
}

interface FormErrors {
  jobSkills: string;
  certificate: string;
  hobby: string;
  newIdeas: string;
  general: string;
}

const CourseForm = ({ section }: CourseFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    jobSkills: false,
    certificate: false,
    hobby: false,
    newIdeas: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    jobSkills: "",
    certificate: "",
    hobby: "",
    newIdeas: "",
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
      jobSkills: "",
      certificate: "",
      hobby: "",
      newIdeas: "",
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

    router.push("/Course/CreateACourse/create-a-course");
  };

  return (
    <div className="relative mx-10 md:mx-auto w-auto md:w-3/4 lg:w-5/12 pt-16">
      <div className="hidden lg:block">
        <Previous />
      </div>
      <div className="flex items-center w-full justify-center">
        <h1 className="mb-12 font-semibold text-[17px] md:text-[26px] text-[#333333] text-center w-[266px] md:w-full">
          What is the primary goal of your course?
        </h1>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white px-5 md:px-12 py-9 md:py-16 rounded-2xl flex flex-col gap-5 md:gap-6 justify-center w-full max-w-[524px] mx-auto">
          <div className="flex flex-col">
            <div className="flex">
              <input
                type="checkbox"
                id="jobSkills"
                checked={formData.jobSkills}
                onChange={() => handleCheckboxChange("jobSkills")}
                className="required:border-red-500 indeterminate:bg-gray-300"
              />
              <label
                htmlFor="jobSkills"
                className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium leading-[22px]"
              >
                Helping people build skills for their job
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex">
              <input
                type="checkbox"
                id="certificate"
                checked={formData.certificate}
                onChange={() => handleCheckboxChange("certificate")}
                className="required:border-red-500 indeterminate:bg-gray-300"
              />
              <label
                htmlFor="certificate"
                className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium leading-[22px]"
              >
                Giving a certificate for completing the course
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex">
              <input
                type="checkbox"
                id="hobby"
                checked={formData.hobby}
                onChange={() => handleCheckboxChange("hobby")}
                className="required:border-red-500 indeterminate:bg-gray-300"
              />
              <label
                htmlFor="hobby"
                className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium leading-[22px]"
              >
                Sharing knowledge about a hobby or interest
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex">
              <input
                type="checkbox"
                id="newIdeas"
                checked={formData.newIdeas}
                onChange={() => handleCheckboxChange("newIdeas")}
                className="required:border-red-500 indeterminate:bg-gray-300"
              />
              <label
                htmlFor="newIdeas"
                className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium leading-[22px]"
              >
                Teaching new ideas or concepts in a field
              </label>
            </div>
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm mt-2">{errors.general}</p>
          )}
        </div>

        <div className="text-center w-full">
          <button
            className="bg-[#4A90E2] w-full max-w-[350px] rounded-xl py-3 mt-12 mb-44 text-white"
            type="submit"
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

export default CourseForm;
