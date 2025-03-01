import React from "react";
import CourseOutlinecard from "./CourseOutlinecard";

const CourseOutline = () => {
  return (
    <div className="w-full max-w-[90%] h-full lg:h-[720px] mt-4 bg-[#FFFFFF] mx-auto rounded-xl border-[#D2D2D2] border-[1px] px-4 lg:px-8 overflow-auto lg:overflow-y-scroll">
      <CourseOutlinecard status={true} />
      <CourseOutlinecard status={true} />
      <CourseOutlinecard status={true} />
      <CourseOutlinecard status={false} />
      <div className="flex items-center justify-center space-x-4 border-b-[1px] mt-2 h-[80px]">
        <h1 className="font-medium text-[16px] leading-[22px] underline">
          4/6 Lectures available{" "}
        </h1>
      </div>
    </div>
  );
};

export default CourseOutline;
