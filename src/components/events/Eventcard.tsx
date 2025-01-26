import React, { useState } from 'react'
import Image from 'next/image'
import blucecirle from '@/assets/bluecircle.svg'
import {Calendar} from "@nextui-org/react";
import type {DateValue} from "@react-types/calendar";
import {today, getLocalTimeZone} from "@internationalized/date";
import eventlog from '@/assets/eventlogo.svg'
import fire from '@/assets/fire.svg'
import { CiLocationOn } from 'react-icons/ci';


interface MyeventCardProp {
    todaydate : string,
    time : string,
    eventname : string,
    host : string,
    location: string
}


const Eventcard : React.FC<MyeventCardProp> = (props)  => {
    let defaultDate = today(getLocalTimeZone());
    // let [focusedDate, setFocusedDate] = useState<DateValue>(defaultDate);
  return (
    <div className="flex max-w-[747px] gap-4 relative px-4 mb-8">
      <div className="flex flex-col justify-center items-center gap-1">
        <span className="bg-[#4A90E2] w-2 h-2 rounded-full" />
        <span className="h-full w-[2px] bg-[#776666]" />
        <span className="text-base font-medium absolute left-11 top-1 text-white">
          Today, Fri 11 Oct, 2024
        </span>
      </div>
      <div className="bg-[#3F3F3F52] w-full p-4 sm:p-10 text-white flex flex-col-reverse sm:flex-row justify-between gap-4 md:gap-0  rounded-md mt-8 border-[#FFFFFF9E] border">
        <div className="font-medium text-base grid gap-1 sm:gap-3">
          <h3>9:00 AM</h3>
          <h2 className="font-bold text-xl">CEX Convention ‘24</h2>
          <div className="flex items-center gap-2">
            <Image src={eventlog} alt="avater" className="rounded-2xl w-5" />
            <h3>Selfless hearts Foundation</h3>
          </div>
          <div className="flex items-center gap-2">
            <CiLocationOn className="w-5" />
            <span>Google Meet</span>
          </div>
        </div>
        <Image src={fire} alt="image avater" className="rounded-3xl w-32" />
      </div>
    </div>
  )
}

export default Eventcard



{/* <Calendar 
                                aria-label="Date (Controlled Focused Value)"
                                focusedValue={focusedDate}
                                value={defaultDate}
                                onFocusChange={setFocusedDate}
                                className=" text-white rounded-lg shadow-2xl p-4 h-[285px]"
                                /> */}