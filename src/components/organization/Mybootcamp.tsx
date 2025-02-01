import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Mybootcampcarousel from './Mybootcampcarousel';
import {caroselldata} from '@/constants/data'
import { useRouter } from 'next/navigation';
import MobileBootcampCard from '../bootcamp/MobileBootcampCard';

const Mybootcamp = () => {
  const router = useRouter();

  const handlebootcamproute = (props : string) => {
    router.push(`/Bootcamp/${props}/Outline`)

  }
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
    <div className='h-auto w-full flex flex-col items-start lg:items-center bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-b-xl py-8'>
        <div className='w-[100%] mx-auto md:flex flex-col items-center -z-0 hidden'>
          <Carousel responsive={responsive} centerMode={false} containerClass="container"  renderArrowsWhenDisabled={false}
            additionalTransfrom={0}
            arrows
            dotListClass=""
            draggable
            focusOnSelect={false}
            infinite
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            autoPlay={false} // Enables auto-scrolling
            autoPlaySpeed={3000}
          >
           {caroselldata.map((data, index) => (
              <Mybootcampcarousel
              key={index}
                  name={data.name} 
                  time={data.time}
                  flier={data.flier}
                  logo={data.logo}
                  action="Ongoing"
                  height="200px"
                  width='200px'
                  onClick={() => handlebootcamproute(data.name)}
              />
            ))}
          </Carousel>
        </div>
        <div className='flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-4 justify-start px-3 py-5 items-start md:hidden'>
          {caroselldata.slice(0, 3).map((data, index) => (
            <div className={`flex flex-col ${index === 2 && 'hidden'} items-center gap-2`} key={index}>
              <MobileBootcampCard
                  key={index}
                  name={data.name} 
                  time={data.time}
                  flier={data.flier}
                  logo={data.logo}
                  action="Ongoing"
                  height="150px"
                  width='150px'
                  onClick={() => handlebootcamproute(data.name)}
              />
            </div>
          ))}
        </div>
                           
    </div>
  )
}

export default Mybootcamp