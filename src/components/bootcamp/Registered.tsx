import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { regcaroselldata } from "@/constants/data";
import Image from "next/image";
import drop from "@/assets/droporg.svg";
import { IoIosArrowDropdown } from "react-icons/io";
import Carosellcard from "./Carosellcard";
import { IoMdPerson } from "react-icons/io";
import { useRouter } from "next/navigation";
import MobileBootcampCard from "../organization/MobileBootcampCard";
import { FcSettings } from "react-icons/fc";
import { ImBooks } from "react-icons/im";

const Registered = (props: any) => {
  const router = useRouter();
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1440 },
      items: 4,
    },
    desktop_: {
      breakpoint: { max: 1440, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const handlegotomybootcamp = () => {
    router.push("/Mybootcamps");
  };
  // console.log("checking reg", props.regbootcamp)

  return (
    <div className="h-[448px] w-[90%] mx-auto flex flex-col items-start md:items-center bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl py-8 mt-8">
      <div className="h-[50px] w-full border-b-[1px] border-b-[#D9D9D9] px-10 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[11px] sm:text-[14px] md:text-[25px] leading-[31px] text-[#333333] font-semibold border-b-2 border-[#4A90E2]">
          <span>
            <ImBooks className="text-[#9B51E0] text-2xl" />
          </span>
          Registered Bootcamps ({props?.regbootcamp.length})
        </div>
        <div className="flex space-x-3 items-center">
          <div
            className="flex items-center justify-center space-x-2 text-[#5801A9] cursor-pointer"
            onClick={handlegotomybootcamp}
          >
            <IoMdPerson />
            <h1 className="text-[11px] md:text-[14px] font-medium underline">
              Go to My bootcamp
            </h1>
          </div>
          <IoIosArrowDropdown className="h-[35px] w-[35px] text-[#6B6D6E] hidden sm:block" />
        </div>
      </div>
      <div className="w-[90%] mx-auto hidden sm:flex flex-col justify-center items-center">
        <Carousel
          responsive={responsive}
          centerMode={false}
          containerClass="container"
          className="mt-6"
          renderArrowsWhenDisabled={false}
          additionalTransfrom={0}
          arrows
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          autoPlay={window.innerWidth >= 464 ? true : false} // Enables auto-scrolling
          autoPlaySpeed={3000}
        >
          {props?.regbootcamp?.map((data: any, index: any) => (
            <Carosellcard
              key={index}
              name={data.bootcamp_name}
              uri={data.bootcamp_ipfs_uri}
              action="Ongoing"
              height="300px"
              width="300px"
              alldata={data}
            />
          ))}
        </Carousel>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-3 justify-start px-3 py-5 items-start sm:hidden">
        {props?.regbootcamp?.map((data: any, index: any) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <MobileBootcampCard
              key={index}
              name={data.bootcamp_name}
              uri={data.bootcamp_ipfs_uri}
              action="Manage"
              height={"150px"}
              width={"150px"}
              alldata={data}
            />
            {/* <div className='flex items-center justify-center text-black'>
                <FcSettings />
                <span className='text-[11px]'>Manage bootcamp</span>
              </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Registered;
