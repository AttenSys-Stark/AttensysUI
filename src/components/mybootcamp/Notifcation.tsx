import React from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import Notifycard from "./Notifycard";

const Notifcation = () => {
  return (
    <div className="mt-4 w-[90%] sm:w-[80%] mx-auto h-auto rounded-xl bg-[#FFFFFF] border-[1px] border-[#D9D9D9] py-3">
      <div className="h-[60px] sm:h-[80px] w-full border-b-[1px] border-b-[#D9D9D9] flex justify-between px-4 sm:px-8 items-center">
        <div className="flex space-x-3 items-center justify-center">
          <IoMdNotificationsOutline className="h-[20px] w-[20px] sm:h-[22px] sm:w-[22px] text-[#5801A9]" />
          <h1 className="font-medium text-sm sm:text-[20px] text-[#333333]">
            Notifications
          </h1>
        </div>

        <div className="flex space-x-2 items-center justify-center">
          <h1 className="font-medium text-[12px] text-[#5801A9] underline">
            <span className="hidden sm:flex">See all notifications</span>
            <span className="flex sm:hidden">See all</span>
          </h1>
          <IoCloseCircleOutline className="h-[20px] w-[20px] sm:h-[22px] sm:w-[22px] text-[#333333]" />
        </div>
      </div>

      <div className="w-[90%] sm:w-[80%] h-auto mt-3 mx-auto">
        <Notifycard />
        <Notifycard />
        <Notifycard />
        <Notifycard />
        <Notifycard />
      </div>
    </div>
  );
};

export default Notifcation;
