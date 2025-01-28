import { Field, Input } from "@headlessui/react"
import React from "react"
import { FaRegCalendarAlt } from "react-icons/fa"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import { createBootcampInitState } from "@/state/connectedWalletStarknetkitNext"
import { useAtom } from "jotai"

interface timeProp {
  day: number
}

const BootcampTime: React.FC<timeProp> = (props) => {
  const [bootcampData, setBootcampData] = useAtom(createBootcampInitState)

  const handleStartTimeChange = (newValue: any) => {
    setBootcampData((prevData) => ({
      ...prevData,
      bootcampLecture: prevData.bootcampLecture.map((lecture) =>
        lecture.day == props.day.toString()
          ? { ...lecture, start: newValue }
          : { ...lecture, start: newValue, day: "1" },
      ),
    }))
  }

  const handleEndTimeChange = (newValue: any) => {
    setBootcampData((prevData) => ({
      ...prevData,
      bootcampLecture: prevData.bootcampLecture.map((lecture) =>
        lecture.day == props.day.toString()
          ? { ...lecture, end: newValue }
          : { ...lecture, end: newValue },
      ),
    }))
  }

  return (
    <div className="flex flex-wrap space-x-2 items-center h-full">
      <div className="flex bg-[#A666E3] items-center px-1 sm:px-4 space-x-1 sm:space-x-3 border-[1px] border-[#D0D5DD] h-[55px] justify-center w-[105px] rounded-lg mt-2">
        <FaRegCalendarAlt className="h-[20px] w-[14px] text-[#FFFFFF]" />
        <h1 className="text-[12px] leading-[18px] font-light text-[#FFFFFF]">
          Day {props.day} 
        </h1>
        <div className=""></div>
      </div>

      <div className="h-full text-[8px]">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="Start Time"
              sx={{ width: "30%" }}
              onChange={handleStartTimeChange}
              className="w-fit sm:w-1/2"
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <div className="">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="End Time"
              sx={{ width: "50%" }}
              onChange={handleEndTimeChange}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>
    </div>
  )
}

export default BootcampTime
