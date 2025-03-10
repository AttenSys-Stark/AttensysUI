import React from "react";
import MyCourses from "../MyCourses";

const MyCoursePage = (props: any) => {
  return (
    <div className="h-auto w-full bg-[#F5F7FA]">
      <MyCourses section={props.section} />
    </div>
  );
};

export default MyCoursePage;
