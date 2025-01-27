import companylogo from "@/assets/companylogo.svg"
import Image from "next/image"
import bootcamp1 from "@/assets/project.svg"
import { Button } from "@headlessui/react"

type MobileBootcampCardProps = {
    name: string
    time: string
    flier: any
    logo: any
    action: string
    height: string
    width: string
    onClick?: () => void
}

export default function MobileBootcampCard (props: MobileBootcampCardProps) {

    const { name, time, flier, logo, action, height, width, onClick } = props

    return (
        <div style={{}} className={`relative h-[${height}] w-[${width}] rounded-2xl mx-0 md:mx-auto overflow-hidden cursor-pointer`}
            onClick={onClick}
        >

            <Image 
                src={flier}
                alt="eventimage"
                className="h-full w-full object-cover"
            />

            <Button
                className="absolute top-3 right-4 justify-center lg:flex rounded-lg bg-[#9B51E0] text-[#FFFCFC] py-2 px-4 lg:h-[50px] items-center lg:w-[90px] text-[12px] data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
            >
                {action}
            </Button>

            <div className="absolute bottom-0 z-20 w-full flex items-center justify-center text-center bg-carousell-gradient rounded-b-2xl px-1">
                <div className="flex gap-x-[0.125rem] mt-20 items-center justify-start">
                    {/* Logon */}
                    <div className="rounded-full h-[41px] w-[41px] overflow-hidden">
                        <Image src={logo} alt="logo" className="object-cover" />
                    </div>
                    {/* Name and Time */}
                    <div>
                        <h1 className="text-[#FFFFFF] text-[8px] font-bold">
                            {name}
                        </h1>
                        <h1 className="text-[#FFFFFF] text-[6px] font-medium">
                            {time}
                        </h1>
                    </div>
                </div>
                
            </div>

        </div>
    )
}