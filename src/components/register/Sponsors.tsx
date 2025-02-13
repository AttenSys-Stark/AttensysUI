import React, { useState } from "react";
import Image from "next/image";
import bootlog from "@/assets/bootlog.svg";
import ramp from "@/assets/ramplog.svg";
import { Button } from "@headlessui/react";
import Modal from "../eventdetails/Modal";

const Sponsors = () => {
  const [modal, setModal] = useState(false);

  const handlemodal = () => {
    setModal(!modal);
  };
  return (
    <>
      {modal && <Modal status={modal} />}
      <div className="h-auto w-auto px-8 space-y-4 py-2" onClick={handlemodal}>
        <h1 className="text-md text-[#2D3A4B] font-semibold">Sponsors</h1>

        <div className="flex space-x-4 lg:space-x-8">
          <div className="flex space-x-2 items-center">
            <div className="h-[32px] w-[32px] lg:h-[40px] lg:w-[40px] rounded-xl">
              <Image
                src={bootlog}
                alt="logo"
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-xs sm:text-sm lg:text-md text-[#2D3A4B] font-semibold">
              Cryptotesters
            </h1>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="h-[32px] w-[32px] lg:h-[40px] lg:w-[40px] rounded-xl">
              <Image src={ramp} alt="logo" />
            </div>
            <h1 className="text-xs sm:text-sm lg:text-md text-[#2D3A4B] font-semibold">
              Ramp
            </h1>
          </div>
        </div>

        <Button className="mt-4 py-2.5 px-6 lg:py-4 lg:px-8 bg-[#9B51E0] rounded-xl flex justify-center items-center text-[#FFFFFF] text-sm font-semibold">
          Sponsor this event
        </Button>
      </div>
    </>
  );
};

export default Sponsors;
