import React from "react";
import MybootcampTophero from "./MybootcampTophero";
import BootcampDescription from "./BootcampDescription";
import CourseOutline from "./CourseOutline";

const Managebootcamp = (props: any) => {
  return (
    <div className="bg-[#f4f7f9] w-full h-auto py-10">
      <MybootcampTophero bootcampname={props.bootcampname} />
      <BootcampDescription />
      <div className="py-0 border-b-[1px] w-full border-b-[#E0E0E0] px-8 lg:px-20 pt-8">
        <h1 className="w-[160px] border-b-[2px] border-b-[#9B51E0] text-center text-md pb-4 font-medium leading-[22px] text-[#333333]">
          Course Outline
        </h1>
      </div>
      <CourseOutline />
    </div>
  );
};

export default Managebootcamp;
