import React from "react";
import { useRouter } from "next/navigation";
import MyCourses from "../MyCourses";

const MyCoursePage = (props: any) => {
  const router = useRouter();

  return (
    <div className="h-auto w-full bg-[#F5F7FA]">
      <MyCourses section={props.section} />
    </div>
  );
};

export default MyCoursePage;
