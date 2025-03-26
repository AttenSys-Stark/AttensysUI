import React, { useState } from "react";
import Previous from "./previous";
import { useRouter } from "next/navigation";

interface CourseFormProps {
  section: string;
  handleCoursePrimaryGoalChange: (e: string) => void;
}

const options = [
  { id: "jobSkills", label: "Helping people build skills for their job" },
  {
    id: "certificate",
    label: "Giving a certificate for completing the course",
  },
  { id: "hobby", label: "Sharing knowledge about a hobby or interest" },
  { id: "newIdeas", label: "Teaching new ideas or concepts in a field" },
];

const CourseForm = ({
  section,
  handleCoursePrimaryGoalChange,
}: CourseFormProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedOption) {
      setError("Please select an option before proceeding.");
      return;
    }

    handleCoursePrimaryGoalChange(selectedOption);
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
          {options.map((option) => (
            <div key={option.id} className="flex">
              <input
                type="radio"
                id={option.id}
                name="courseGoal"
                value={option.label}
                checked={selectedOption === option.label}
                onChange={handleOptionChange}
                className="required:border-red-500 indeterminate:bg-gray-300"
              />

              <label
                htmlFor={option.id}
                className="block my-2 ml-3 text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]"
              >
                {option.label}
              </label>
            </div>
          ))}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="text-center">
          <button
            className="bg-[#4A90E2] rounded-xl py-3 mt-12 mb-44 text-white w-[190px] md:w-[350px]"
            type="submit"
          >
            Next
          </button>
        </div>
      </form>
      <div className="block absolute left-[37.5%]  md:left-[42%] bottom-36 lg:hidden">
        <Previous />
      </div>
    </div>
  );
};

export default CourseForm;
