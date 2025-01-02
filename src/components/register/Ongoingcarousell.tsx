import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {caroselldata} from '@/constants/data'
import Image from 'next/image';
import drop from '@/assets/droporg.svg'
import { IoIosArrowDropdown } from "react-icons/io";
import Carosellcard from '@/components/bootcamp/Carosellcard';



const Ongoingcarousell = () => {
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
    <div className='h-[448px] w-full px-10 flex flex-col items-center rounded-xl py-8 mt-10'>
        <div className='h-[50px] w-full'>
            <h1 className='text-[25px] leading-[31px] text-[#333333] font-semibold'>Ongoing Bootcamps</h1>            
        </div>
        <div className='w-[100%] mx-auto flex flex-col justify-center items-center'>
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
                       action="Register"
                        height='300px'
                        width='300px'
                    />
                ))}
                    </Carousel>
        </div>
                           
    </div>
  )
}

export default Ongoingcarousell