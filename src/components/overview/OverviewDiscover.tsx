import React from "react"
import Image from "next/image"
import moon from "@/assets/moon.svg"
import upcoming from "@/assets/upcoming.svg"
import top from "@/assets/top.svg"
import { useRouter } from "next/navigation"
import { Button } from "@headlessui/react"
import edit from "@/assets/edit.svg"
import goto from "@/assets/goto.svg"

const OverviewDiscover = (props: any) => {
  const router = useRouter()

  const handlerouting = () => {
    router.push("/Events/events")
  }
  const handleEventPage = () => {
    router.push(`/Eventpage/${props.eventsname}`)
  }

  const handleDiscover = () => {
    router.push("/Discoverevent")
  }

  return (
    <div className="h-[100px] clg:h-[80px] lg:[70px] lclg:[60px] flex justify-between w-[90%] mx-auto items-center">
      <div className="flex w-[600px] clg:w-[700px] lclg:w-[700px] space-x-8 items-center">
        <div
          onClick={handleDiscover}
          className="flex space-x-3 items-center cursor-pointer"
        >
          <Image src={moon} alt="moon" />
          <h1>Discover</h1>
        </div>
        <div className="w-[1px] h-[24px] bg-[#9B51E0]"></div>
        <div
          className="flex space-x-3 items-center cursor-pointer"
          onClick={handlerouting}
        >
          <Image src={upcoming} alt="moon" />
          <h1>My Events</h1>
        </div>
        <div className="w-[1px] h-[24px] bg-[#9B51E0]"></div>
        <div className="flex space-x-3 items-center cursor-pointer">
          <h1>{props.eventsname}</h1>
        </div>
      </div>
      <div className="space-x-6 flex">
        <Button className="hidden lg:flex rounded-lg bg-[#4A90E21F] py-2 px-4 lg:h-[50px] items-center lg:w-[138px] text-sm text-[#5801A9] data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
          <div className="flex space-x-4 items-center font-semibold text-[16px]">
            <Image src={edit} alt="ticket" className="mr-2" />
          </div>
          <div>Edit Event</div>
        </Button>
        <Button
          onClick={handleEventPage}
          className="hidden justify-center lg:flex rounded-lg bg-[#2D3A4B] py-2 px-4 lg:h-[50px] items-center lg:w-[147px] text-sm text-[#FFFFFF] data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
        >
          <div>Event Page</div>
          <div className="flex space-x-4 items-center font-semibold text-[16px]">
            <Image src={goto} alt="ticket" className="" />
          </div>
        </Button>
        <Image src={top} alt="moon" />
      </div>
    </div>
  )
}

export default OverviewDiscover
