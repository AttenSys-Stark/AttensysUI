import React from "react";
import Image from "next/image";

interface HighlightCardProp {
  name: string;
  time: string;
  image: any;
}

const Highlightcard: React.FC<HighlightCardProp> = (props) => {
  return (
    <div className="relative h-[380px] w-[75%] mx-auto sm:mx-0 my-12 sm:my-0 sm:w-[278px] rounded-2xl ">
      <Image
        src={props.image}
        alt="eventimage"
        className="h-full w-full object-cover rounded-2xl"
      />
      <div className="absolute bottom-6 z-20 w-full text-center">
        <h1 className="text-[#FFFFFF] text-[13px] font-normal leading-[21px]">
          HIGHLIGHTED EVENT
        </h1>
        <h1 className="text-[#FFFFFF] text-[24px] font-bold leading-[39px]">
          {props.name}
        </h1>
        <h1 className="text-[#FFFFFF] text-[14px] font-semibold leading-[23px]">
          {props.time}
        </h1>
      </div>
    </div>
  );
};

export default Highlightcard;
