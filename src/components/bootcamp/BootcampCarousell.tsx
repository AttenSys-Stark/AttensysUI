import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Carosellcard from './Carosellcard';
import {caroselldata} from '@/constants/data'

const BootcampCarousell = () => {
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 4
        },
        desktop: {
          breakpoint: { max: 3000, min: 1440 },
          items: 4
        },
        desktop_: {
          breakpoint: { max: 1440, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 3
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };
 
    return (
    <div className='h-[450px] w-full flex flex-col items-center justify-center'>
        <h1 className='w-[90%] mx-auto text-[20px] text-[#333333] font-semibold leading-[22px]'>Ongoing Bootcamps</h1>
        <div className='w-[90%] mx-auto flex flex-col justify-center items-center'>
        <Carousel responsive={responsive} centerMode={false} containerClass="container" className='mt-6'  renderArrowsWhenDisabled={false}
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
                    />
                ))}
                    </Carousel>
        </div>
                           
    </div>
  )
}

export default BootcampCarousell