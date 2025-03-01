import React from "react";
import nikolas from "@/assets/nikolas.svg";
import Image from "next/image";
import {
  StaticImageData,
  StaticImport,
} from "next/dist/shared/lib/get-img-props";

interface TestimonialCardProps {
  user: string;
  pic: StaticImageData | StaticImport;
  statement: string;
}

const Testimonialccard: React.FC<TestimonialCardProps> = (props) => {
  return (
    <div className="w-[671px] h-[290.29px] bg-[#FFFFFF] rounded-2xl mx-auto">
      <div className="flex justify-center items-center space-x-3 pt-8">
        <Image alt="icon" src={props.pic} className="" />
        <h1 className="font-bold text-[17.74px] leading-[22.91px] text-[#2D3A4B]">
          {props.user}
        </h1>
      </div>
      <p className="text-center w-[550px] mx-auto py-8 text-[#2D3A4B] text-[18.75px] font-bold">
        {props.statement}
      </p>
    </div>
  );
};

export default Testimonialccard;
