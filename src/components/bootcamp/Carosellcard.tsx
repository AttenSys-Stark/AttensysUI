import React from "react"
import Image from "next/image"
import { Button } from "@headlessui/react"
import { useRouter } from "next/navigation"

interface CarousellCardProp {
  name: string
  time: string
  flier: any
  logo: any
  action: string
  height: string
  width: string
}

const Carosellcard: React.FC<CarousellCardProp> = (props) => {
  const router = useRouter()

  const handleActionClick = (arg: any) => {
    if (arg == "Register") {
      router.push(`/Register/${props.name}`)
    } else if (arg == "Finished") {
      router.push(`/Register/${props.name}`)
    } else if (arg == "Manage") {
      router.push(`/Mybootcamps/${props.name}`)
    }
  }

  return (
    <div
      onClick={() => handleActionClick(props.action)}
      className={`relative ${`h-[${props.height}] w-[${props.width}]`} rounded-2xl mx-auto overflow-hidden cursor-pointer`}
    >
      {/* Background Image */}
      <Image
        src={props.flier}
        alt="eventimage"
        className="h-full w-full object-cover"
      />

      {/* Action Button */}
      <Button
        onClick={() => handleActionClick(props.action)}
        className="hidden absolute top-3 right-6 justify-center lg:flex rounded-lg bg-[#9B51E0] text-[#FFFCFC] py-2 px-4 lg:h-[50px] items-center lg:w-[90px] text-sm data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
      >
        <div>{props.action}</div>
      </Button>

      {/* Bottom Section with Gradient */}
      <div className="absolute bottom-0 z-20 w-full h-[150px] flex items-center justify-center text-center bg-carousell-gradient rounded-b-2xl">
        <div className="flex space-x-3 mt-20">
          {/* Logo */}
          <div className="rounded-full h-[41px] w-[41px] overflow-hidden">
            <Image src={props.logo} alt="logo" className="object-cover" />
          </div>
          {/* Name and Time */}
          <div>
            <h1 className="text-[#FFFFFF] text-[18px] font-bold leading-[22px]">
              {props.name}
            </h1>
            <h1 className="text-[#FFFFFF] text-[14px] font-medium leading-[13px]">
              {props.time}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carosellcard
