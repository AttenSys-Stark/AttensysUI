import React from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddLecture from "./AddLecture";
import Previous from "./previous";

interface CourseSetupProps {
  courseData: any;
  setCourseData: any;
  handleCourseCurriculumChange: (lecture: any) => void;
}

const CourseSetup: React.FC<CourseSetupProps> = ({
  courseData,
  setCourseData,
  handleCourseCurriculumChange,
}) => {
  const router = useRouter();

  const handleAlmostThere = () => {
    if (
      !courseData.courseCurriculum ||
      courseData.courseCurriculum.length === 0
    ) {
      toast.error("Please add at least one lecture to proceed");
      return;
    }
    router.push("/Course/CreateACourse/CoursePricing");
  };

  return (
    <div className="relative mx-10 md:mx-auto w-auto md:w-3/4 lg:w-5/12 pt-16">
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
      <div className="hidden lg:block">
        <Previous />
      </div>
      <div className="flex items-center w-full justify-center">
        <h1 className="mb-12 font-semibold text-[17px] md:text-[26px] text-[#333333] text-center w-[266px] md:w-full">
          Add your course lectures
        </h1>
      </div>

      <AddLecture
        courseData={courseData}
        setCourseData={setCourseData}
        handleCourseCurriculumChange={handleCourseCurriculumChange}
      />

      <div className="text-center">
        <button
          onClick={handleAlmostThere}
          className="bg-[#9B51E0] rounded-xl py-3 mt-12 mb-44 text-white w-[190px] md:w-[350px]"
        >
          Almost there!
        </button>
      </div>
      <div className="block absolute left-[37.5%] md:left-[42%] bottom-36 lg:hidden">
        <Previous />
      </div>
    </div>
  );
};

export default CourseSetup;
