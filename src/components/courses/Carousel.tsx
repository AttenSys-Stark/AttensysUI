import React from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { CardWithLink } from "./Cards"

const CarouselComp = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
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
    },
  }
  return (
    <div className="hidden w-full mx-auto lg:flex flex-col justify-center items-center">
      <Carousel 
        className="course-carousel" 
        responsive={responsive} 
        centerMode={true} 
        containerClass="container" 
        additionalTransfrom={0}
        arrows
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass="carousel-item-custom"
        keyBoardControl
        minimumTouchDrag={80}
        autoPlay={true}
        autoPlaySpeed={3000}>
        <CardWithLink />
        <CardWithLink />
        <CardWithLink />
        <CardWithLink />
        <CardWithLink />
      </Carousel>
    </div>
  )
}

export default CarouselComp
