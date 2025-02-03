import React from "react"
import handshake from "@/assets/shakeee.svg"
import Image from "next/image"
import companylogo from "@/assets/companylogo.svg"

const Heading = () => {
  return (
    <div className="w-full h-[305px]">
      <div className="h-full relative">
        <Image
          src={handshake}
          alt="shake"
          className="w-full h-full object-cover"
        />
        <div className="h-[189px] w-[189px] rounded-full absolute z-20 bottom-[-25%] left-12">
          <Image
            src={companylogo}
            alt="logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

export default Heading
