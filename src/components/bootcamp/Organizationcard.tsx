import React from "react"
import handshake from "@/assets/handshake.svg"
import Image from "next/image"
import testlogo from "@/assets/testlogo.svg"
import StarRating from "./StarRating"
import { Button } from "@headlessui/react"
import { useRouter } from "next/navigation"

interface OrganizationCardProp {
  name: string
  about: string
  numberofbootcamps: string
  numberofinstructors: string
  stars: number
  totalreviews: string
  tags: Array<string>
  logo: any
  flier: any
}

const Organizationcard: React.FC<OrganizationCardProp> = (props) => {
  const router = useRouter()

  const handleDetailsRoute = () => {
    router.push(`/Bootcamps/${props.name}`)
  }

  return (
    <div className="h-auto pb-2 w-full rounded-xl border-[1px] border-[#C8C8C8] bg-[#FFFFFF]">
      <div className="h-[120px] w-full flex flex-none relative">
        <Image
          src={props.flier}
          alt="shake"
          className="w-full h-full rounded-t-xl object-cover absolute"
        />
        <div className="h-[60px] w-[60px] rounded-full absolute z-20 bottom-[-25%] left-3">
          <Image src={props.logo} alt="logo" />
        </div>
      </div>

      <div className="px-4 mt-12 space-y-4">
        <h1 className="text-[16px] text-[#333333] leading-[18px] font-bold">
          {props.name}
        </h1>
        <p className="w-auto max-w-[300px] text-[12px] text-[#2D3A4B] leading-[17px] font-light">
          {props.about}
        </p>
        <div className="flex space-x-4">
          <p className="text-[12px] text-[#817676] leading-[14px] font-medium">
            <span className="text-[#9B51E0]">{props.numberofbootcamps}</span>{" "}
            Bootcamps
          </p>
          <p className="text-[12px] text-[#817676] leading-[14px] font-medium">
            <span className="text-[#9B51E0]">{props.numberofinstructors}</span>{" "}
            Instructors
          </p>
        </div>
        <div className="flex space-x-0 justify-between flex-wrap items-center">
          <div className="flex space-x-2 flex-none items-center mr-6 mb-2">
            <StarRating totalStars={5} starnumber={props.stars} />
            <p className="text-xs text-[#2D3A4B] leading-[14px] font-medium">
              {props.totalreviews} reviews
            </p>
          </div>
          <Button
            onClick={handleDetailsRoute}
            className=" border-[2px] border-[#9B51E0] py-3 px-4 text-[#9B51E0] text-xs leading-[12px] flex items-center justify-center rounded-xl"
          >
            <div>View details</div>
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-start">
          {props.tags.map((tag, index) => {
            return (
              <div
                key={index}
                className="mr-2 mb-2 px-1.5 py-0.5 rounded-md flex items-center justify-center bg-[#ABABAB52] text-[10px] leading-[12px] font-medium text-[#5801A9]"
              >
                {tag}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Organizationcard
