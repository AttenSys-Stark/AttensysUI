import FavoriteCourseCard from "./FavoriteCoursecard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { favoriteCourseData } from "@/constants/data";

export function FavoriteCourse() {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
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
      breakpoint: { max: 1024, min: 720 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 720, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="h-[488px] w-full bg-event-gradient flex flex-col items-center justify-center mt-8">
      <h1 className="w-[90%] mx-auto  text-[20px] text-[#FFFFFF] font-semibold leading-[22px]">
        Courses from your favourite organizations
      </h1>
      <div className="w-[90%] mx-auto flex flex-col justify-center items-center">
        <Carousel
          responsive={responsive}
          centerMode={false}
          containerClass="container"
          className="mt-6 flex space-x-8"
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
          {favoriteCourseData.map((data, index) => (
            <FavoriteCourseCard
              key={index}
              title={data.coursetitle}
              name={data.organizationname}
              numberofstudent={data.numberofstudents}
              instructor={data.instructor}
              flier={data.flier}
              stars={data.stars}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
}
