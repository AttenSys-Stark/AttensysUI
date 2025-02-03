import React from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { caroselldata } from "@/constants/data"
import Image from "next/image"
import drop from "@/assets/droporg.svg"
import { IoIosArrowDropdown } from "react-icons/io"
import Carosellcard from "./Carosellcard"

const Userbootcamps = () => {
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
  }

  return (
    <div className="h-[448px] w-[90%] mx-auto flex flex-col items-center bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl py-8 mt-8">
      <div className="h-[50px] w-full border-b-[1px] border-b-[#D9D9D9] px-10 flex justify-between">
        <h1 className="text-[25px] leading-[31px] text-[#333333] font-semibold">
          Bootcamps
        </h1>
        <IoIosArrowDropdown className="h-[35px] w-[35px] text-[#6B6D6E]" />
      </div>
      <div className="w-[90%] mx-auto flex flex-col justify-center items-center">
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
          autoPlay={true} // Enables auto-scrolling
          autoPlaySpeed={3000}
        >
          {caroselldata.map((data, index) => (
            <Carosellcard
              key={index}
              name={data.name}
              time={data.time}
              flier={data.flier}
              logo={data.logo}
              action="Ongoing"
              height="300px"
              width="300px"
            />
          ))}
        </Carousel>
      </div>
    </div>
  )
}

export default Userbootcamps
