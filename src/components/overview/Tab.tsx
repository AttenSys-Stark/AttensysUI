import { Button } from "@headlessui/react";
import React from "react";
import {
  insightClick,
  guestlistclick,
  attendanceclick,
  sponsorshipclick,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";

const Tab = (props: any) => {
  const [insightClickstat, setinsightClickstat] = useAtom(insightClick);
  const [guestlistclickstat, setguestlistclickstat] = useAtom(guestlistclick);
  const [attendanceclickstat, setattendanceclickstat] =
    useAtom(attendanceclick);
  const [sponsorshipclickstat, setsponsorshipclickstat] =
    useAtom(sponsorshipclick);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const handleinsightclick = () => {
    setinsightClickstat(true);
    setguestlistclickstat(false);
    setattendanceclickstat(false);
    setsponsorshipclickstat(false);
    //@todo replace sample event with event name
    router.push(`/Overview/${props.eventname}/insight/?id=${id}`);
  };

  const handlegueslistclick = () => {
    setinsightClickstat(false);
    setguestlistclickstat(true);
    setattendanceclickstat(false);
    setsponsorshipclickstat(false);
    //@todo replace sample event with event name
    router.push(`/Overview/${props.eventname}/guestlist/?id=${id}`);
  };
  const handleAttendanceclick = () => {
    setinsightClickstat(false);
    setguestlistclickstat(false);
    setattendanceclickstat(true);
    setsponsorshipclickstat(false);
    //@todo replace sample event with event name
    router.push(`/Overview/${props.eventname}/attendance/?id=${id}`);
  };

  const handleSponsorshipclick = () => {
    setinsightClickstat(false);
    setguestlistclickstat(false);
    setattendanceclickstat(false);
    setsponsorshipclickstat(true);
    //@todo replace sample event with event name
    router.push(`/Overview/${props.eventname}/sponsorship/?id=${id}`);
  };

  return (
    <div className="h-[55px] w-full border-b-[2px] border-[#D0D0D0] items-end lg:items-center flex justify-start lg:justify-center mt-5">
      {/* Desktop view */}
      <div className="hidden md:flex justify-center md:w-[85%] lg:w-[60%] clg:w-[65%] lclg:w-[80%] lg:space-x-20 md:space-x-8 h-[40px] mt-5">
        <Button
          onClick={handleinsightclick}
          className={`${insightClickstat && `border-[#9B51E0] border-b-[4px]`} text-[16px] font-medium text-[#333333]`}
        >
          Insights
        </Button>
        <Button
          onClick={handlegueslistclick}
          className={`${guestlistclickstat && `border-[#9B51E0] border-b-[4px]`} text-[16px] font-medium text-[#333333]`}
        >
          Guests list
        </Button>
        <Button
          onClick={handleAttendanceclick}
          className={`${attendanceclickstat && `border-[#9B51E0] border-b-[4px]`} text-[16px] font-medium text-[#333333]`}
        >
          Attendance
        </Button>
        <Button
          onClick={handleSponsorshipclick}
          className={`${sponsorshipclickstat && `border-[#9B51E0] border-b-[4px]`} text-[16px] font-medium text-[#333333]`}
        >
          Sponsorship
        </Button>
      </div>

      {/* Mobile dropdown */}
      <div className="md:hidden lg:hidden w-[60%] pl-[6%] mt-2">
        <div className="flex lg:items-center gap-2 border-b-4 border-[#9B51E0]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <select
            className="w-full p-2 text-[16px] font-medium text-[#333333] bg-transparent border-none focus:outline-none"
            onChange={(e) => {
              switch (e.target.value) {
                case "insights":
                  handleinsightclick();
                  break;
                case "guestlist":
                  handlegueslistclick();
                  break;
                case "attendance":
                  handleAttendanceclick();
                  break;
                case "sponsorship":
                  handleSponsorshipclick();
                  break;
              }
            }}
            value={
              insightClickstat
                ? "insights"
                : guestlistclickstat
                  ? "guestlist"
                  : attendanceclickstat
                    ? "attendance"
                    : sponsorshipclickstat
                      ? "sponsorship"
                      : "insights"
            }
          >
            <option value="insights">Insights</option>
            <option value="guestlist">Guests list</option>
            <option value="attendance">Attendance</option>
            <option value="sponsorship">Sponsorship</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Tab;
