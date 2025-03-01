import React from "react";
import { mybootcampDescription } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";

const BootcampDescription = () => {
  const [Description, setBootcampDescription] = useAtom(mybootcampDescription);

  return (
    <div className="mt-16 w-full flex flex-col space-y-4 max-w-[90%] mx-auto h-auto bg-[#FFFFFF] border-[1px] border-[#DBDBDB] rounded-xl py-8 px-4 sm:px-8">
      <h1 className="text-md text-[#2D3A4B] font-semibold">
        Bootcamp description
      </h1>
      <p className="text-sm text-[#2D3A4B] font-light w-full flex-none">
        {Description}
      </p>
      <div className="space-y-3">
        <h1 className="text-md text-[#2D3A4B] font-semibold">
          Support and resources
        </h1>
        <p className="text-sm text-[#2D3A4B] font-light">
          For more enquires contact us on Telegram: @XCODElaunch24
          <br /> X : @thexcodelaunch
        </p>
      </div>
    </div>
  );
};

export default BootcampDescription;
