import React from "react";
import LecturePage from "./LecturePage";

const CourseLanding = (props: any) => {
  return (
    <div className="h-auto w-full bg-[#F5F7FA]">
      <LecturePage course={props.course} />
    </div>
  );
};

export default CourseLanding;
