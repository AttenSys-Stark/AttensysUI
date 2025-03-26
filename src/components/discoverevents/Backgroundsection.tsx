import { Button } from "@headlessui/react";
import React from "react";
import Image from "next/image";
import ticket from "@/assets/ticket.svg";
import { useRouter } from "next/navigation";

const Backgroundsection = () => {
  const router = useRouter();

  const handlerouting = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    event.preventDefault();
    router.push("/Events/createevent");
  };

  return (
    <div
      className={`bg-[url('/AttensysEventssection.png')] h-[305px] w-[90%] rounded-xl mx-auto mt-10`}
    >
      <div className="h-full w-[70%] space-y-4 flex flex-col mx-auto items-center justify-center ">
        <h1 className="text-[24px] sm:text-[32px] md:text-[42px] text-[#FFFFFF] md:leading-[53px] font-bold text-center">
          Register for Events with Just <br /> One Click
        </h1>
        <Button
          onClick={handlerouting}
          className="flex rounded-lg flex-none bg-[#A01B9B] py-2 px-4 lg:h-[50px] items-center lg:w-[170px] text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
        >
          <div className="flex space-x-4 items-center font-semibold text-[16px]">
            <Image src={ticket} alt="ticket" className="mr-2" />
          </div>
          <div>Create an Event</div>
        </Button>
      </div>
    </div>
  );
};

export default Backgroundsection;
