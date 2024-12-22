import React, { useEffect } from 'react'
import Coursedropdown from '../courses/Coursedropdown'
import Bootcampdropdown from '../bootcamp/Bootcampdropdown'
import { coursestatusAtom,bootcampdropdownstatus } from '@/state/connectedWalletStarknetkitNext'
import { useAtom, useSetAtom } from "jotai"
import Herosection from './Herosection'
import Cardsection from './Cardsection'
import Mantrasection from './Mantrasection'
import Guide from './Guide'
import World from './World'
import Eventsection from './Eventsection'
import Experience from './Experience'
import Testimonial from './Testimonial'
import Faq from './Faq'
import {
  eventcreatedAtom,
  eventregistedAtom,
} from "@/state/connectedWalletStarknetkitNext"

const Landing = () => {
    const [status, setstatus] = useAtom(coursestatusAtom); 
    const [bootcampdropstat, setbootcampdropstat] = useAtom(bootcampdropdownstatus)
    const [createdstat, setCreatedStat] = useAtom(eventcreatedAtom)
    const [Regstat, setRegStat] = useAtom(eventregistedAtom)


    useEffect(() => {
    setCreatedStat(true)
    setRegStat(false)
    }, )
  

    const handlePageClick = () => {
      setbootcampdropstat(false);
      setstatus(false);
  };

  return (
    <div className='h-auto bg-[#F5F7FA] w-[100%]' onClick={handlePageClick}>
       {status && (<div className='fixed inset-0 bg-black opacity-5 backdrop-blur-sm'></div>)}
       {bootcampdropstat && (<div className='fixed inset-0 bg-black opacity-5 backdrop-blur-sm'></div>)}
       <div onClick={(e) => e.stopPropagation()} >
        <Coursedropdown />
        </div>
        <div onClick={(e) => e.stopPropagation()} > 
        <Bootcampdropdown />
        </div>

        <Herosection />
        <Cardsection />
        <Mantrasection />
        <Guide />
        <World />
        <Eventsection />
        <Experience />
        <Testimonial />
        <Faq />
    </div>
  )
}

export default Landing