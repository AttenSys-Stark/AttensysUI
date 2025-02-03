import { Button } from '@headlessui/react'
import React from 'react'
import Image from 'next/image'
import ticket from '@/assets/ticket.svg'
import { useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import { createEventClickAtom } from '@/state/connectedWalletStarknetkitNext'

const Eventsection = () => {
  const [CreateeventClickStat, setCreateeventClickStat] = useAtom(createEventClickAtom)
  const router = useRouter();

  // Handles the creation of a new event
  const handleCreateEventClick = () => {
    setCreateeventClickStat(true)
    router.push('/Events/createevent')
  }

  return (
    <div className="sm:h-auto lg:h-[350px] lg:flex items-center justify-center">
      <div className="h-auto sm:h-[280px] bg-[#FFFFFF] flex flex-col lg:flex-row items-center justify-center rounded-lg shadow-custom-blue w-full max-w-[1370px] mx-auto p-6 lg:space-x-32 space-y-6 lg:space-y-0">
        {/* Title */}
        <h1 className="w-full lg:w-[450px] text-[24px] sm:text-[26px] md:text-[28px] lg:text-[30.19px] text-[#2D3A4B] leading-[30px] sm:leading-[34px] md:leading-[36px] lg:leading-[39px] font-bold text-center lg:text-left">
          Atten<span className="text-[#4A90E2]">sys Events</span> - Create your events and track attendance in real-time.
        </h1>

        {/* Description and Button */}
        <div className="space-y-5 w-full lg:w-[400px] text-center lg:text-left">
          {/* Text visible only on lg screens or larger */}
          <div className="hidden lg:block">
            <h1 className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[17px] text-[#2D3A4B] font-light leading-[20px] sm:leading-[22px] lg:leading-[22px] mx-auto lg:mx-0 w-full lg:w-[485px] sm1275:w-[300px] ">
              The central hub where event organizers can manage all their events, access key statistics, and perform quick actions.
            </h1>
          </div>

          {/* Button always visible */}
          <Button className="flex justify-center lg:justify-start rounded-lg bg-gradient-to-r from-[#9B51E0] to-[#4A90E2] py-2 px-4 lg:h-[50px] items-center lg:w-[170px] text-sm text-white hover:bg-sky-500 active:bg-sky-700">
            <div className="flex space-x-2 items-center font-semibold text-[14px] sm:text-[16px]">
              <Image src={ticket} alt="ticket" className="mr-2" />
            </div>
            <div onClick={handleCreateEventClick}>
              Create an Event
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Eventsection
