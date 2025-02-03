import { Button } from "@headlessui/react"
import React from "react"
import {
  insightClick,
  guestlistclick,
  attendanceclick,
  sponsorshipclick,
} from "@/state/connectedWalletStarknetkitNext"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"

const Tab = () => {
  const [insightClickstat, setinsightClickstat] = useAtom(insightClick)
  const [guestlistclickstat, setguestlistclickstat] = useAtom(guestlistclick)
  const [attendanceclickstat, setattendanceclickstat] = useAtom(attendanceclick)
  const [sponsorshipclickstat, setsponsorshipclickstat] =
    useAtom(sponsorshipclick)
  const router = useRouter()

  const handleinsightclick = () => {
    setinsightClickstat(true)
    setguestlistclickstat(false)
    setattendanceclickstat(false)
    setsponsorshipclickstat(false)
    //@todo replace sample event with event name
    router.push("/Overview/sample-event/insight")
  }

  const handlegueslistclick = () => {
    setinsightClickstat(false)
    setguestlistclickstat(true)
    setattendanceclickstat(false)
    setsponsorshipclickstat(false)
    //@todo replace sample event with event name
    router.push("/Overview/sample-event/guestlist")
  }
  const handleAttendanceclick = () => {
    setinsightClickstat(false)
    setguestlistclickstat(false)
    setattendanceclickstat(true)
    setsponsorshipclickstat(false)
    //@todo replace sample event with event name
    router.push("/Overview/sample-event/attendance")
  }

  const handleSponsorshipclick = () => {
    setinsightClickstat(false)
    setguestlistclickstat(false)
    setattendanceclickstat(false)
    setsponsorshipclickstat(true)
    //@todo replace sample event with event name
    router.push("/Overview/sample-event/sponsorship")
  }

  return (
    <div className="h-[55px] w-full border-b-[2px] border-[#D0D0D0] items-center flex justify-center">
      <div className="w-[50%] clg:w-[55%] lclg:w-[60%] flex space-x-32 h-[40px] mt-5">
        <Button
          onClick={handleinsightclick}
          className={`${insightClickstat && `border-[#9B51E0] border-b-[4px]`} w-[102px] text-[16px] font-medium text-[#333333]`}
        >
          Insights
        </Button>
        <Button
          onClick={handlegueslistclick}
          className={`${guestlistclickstat && `border-[#9B51E0] border-b-[4px]`} lg:w-[102px] clg:w-[130px] lclg:w-[200px] text-[16px] font-medium text-[#333333]`}
        >
          Guests list
        </Button>
        <Button
          onClick={handleAttendanceclick}
          className={`${attendanceclickstat && `border-[#9B51E0] border-b-[4px]`} w-[102px] text-[16px] font-medium text-[#333333]`}
        >
          Attendance
        </Button>
        <Button
          onClick={handleSponsorshipclick}
          className={`${sponsorshipclickstat && `border-[#9B51E0] border-b-[4px]`} w-[102px] text-[16px] font-medium text-[#333333]`}
        >
          Sponsorship
        </Button>
      </div>
    </div>
  )
}

export default Tab
