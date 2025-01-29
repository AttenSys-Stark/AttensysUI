import React from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { CardWithLink } from "./Cards"

const CarouselComp = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 820 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 820, min: 0 },
      items: 1,
      partialVisibilityGutter: 30,
    },
  }

  return (
    <div className="w-full flex justify-center items-center bg-gray-100 py-6">
      {/* Wrapper to change layout based on screen size */}
      <div className="w-[95%] max-w-[1200px]">
        {/* Show Carousel on larger screens, vertical stacking on mobile */}
        <div className="hidden sm:block">
          <Carousel
            responsive={responsive}
            centerMode={true}
            containerClass="carousel-container"
            arrows
            draggable
            infinite
            keyBoardControl
            autoPlay
            autoPlaySpeed={3000}
            itemClass="px-2"
            minimumTouchDrag={80}
          >
            <CardWithLink />
            <CardWithLink />
            <CardWithLink />
            <CardWithLink />
            <CardWithLink />
          </Carousel>
        </div>

        {/* Vertical Layout for Mobile */}
        <div className=" sm:hidden flex flex-col space-y-4 items-center">
          <CardWithLink />
          <CardWithLink />
          <CardWithLink />
          <CardWithLink />
          <CardWithLink />
        </div>
      </div>
    </div>
  )
}

export default CarouselComp
