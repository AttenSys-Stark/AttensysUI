import React from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";

const Previous = () => {
  return (
    <div
      className="absolute left-[-60%] flex items-center cursor-pointer text-[#9B51E0] space-x-2 "
      onClick={() => history.back()}
    >
      <IoMdArrowBack />
      <p>Previous</p>
    </div>
  );
};

export default Previous;
