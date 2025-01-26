import React from "react"
import { IoIosPeople } from "react-icons/io"
import { IoIosArrowDropdown } from "react-icons/io"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { caroselldata } from "@/constants/data"
import Carosellcard from "../bootcamp/Carosellcard"

const MybootcampInfo = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1800 },
      items: 4,
    },
    desktop_: {
      breakpoint: { max: 1800, min: 1200 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1200, min: 800 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 800, min: 0 },
      items: 1,
    },
  }
  return (
    <div className="mt-4 w-[90%] sm:w-[80%] mx-auto h-auto max-h-[450px] rounded-xl bg-[#FFFFFF] border-[1px] border-[#D9D9D9] py-3">
      <div className="h-[80px] w-full border-b-[1px] border-b-[#D9D9D9] flex justify-between px-4 sm:px-8 items-center">
        <div className="flex space-x-3 items-center justify-center">
          <IoIosPeople className="h-[24px] w-[24px] text-[#5801A9]" />
          <h1 className="font-medium text-[18px] leading-[26px] text-[#333333]">
            My Bootcamps (1)
          </h1>
        </div>

        <div className="flex space-x-3 items-center justify-center">
          <IoIosArrowDropdown className="h-[24px] w-[24px] text-[#333333]" />
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 mx-auto flex flex-col justify-center items-center">
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
              action="Manage"
              height="300px"
              width="90%"
            />
          ))}
        </Carousel>
      </div>
    </div>
  )
}

export default MybootcampInfo
