import { Button } from "@headlessui/react";
import React from "react";
import ticket from "@/assets/ticket.svg";
import Image from "next/image";
import { createorexplore } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import discover from "@/assets/discover.svg";
import { useRouter } from "next/navigation";

const Createevents = () => {
  const [CreateorExplorestat] = useAtom(createorexplore);
  const router = useRouter();

  const handlerouting = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    event.preventDefault();
    if (!CreateorExplorestat) {
      router.push("/Events/createevent");
    } else {
      router.push("/Discoverevent");
    }
  };

  return (
    <div
      className={`bg-[url('/hero_asset.png')] bg-center bg-no-repeat bg-cover h-[389px] w-[100%] sm:w-[90%] sm:mx-auto sm:rounded-xl flex items-center`}
    >
      <div className="w-[100%] sm:w-[80%] h-[250px] px-6 sm:px-12">
        <h1 className="text-[30px] sm:text-[30.19px] font-bold text-[#FFFFFF] leading-7 sm:leading-[39px] sm:w-[450px]">
          Create{" "}
          <span className="bg-gradient-to-r from-[#9B51E0] via-[#9B51E0] to-[#4A90E2] text-transparent bg-clip-text">
            events,
          </span>
          <br />
          send out invitations, and effortlessly track attendance
        </h1>
        <p className="text-[17px] text-[#FFFFFF] leading-[22px] font-light py-4 sm:w-[571px] hidden sm:block">
          Simplifying certificate issuance, attendance tracking, and online
          course management for schools, organizations, and event managers.
        </p>
        <Button className="flex rounded-lg bg-[#a01b73] py-[16px] px-[22px] lg:h-[50px] items-center lg:w-[230px] text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 justify-center mt-16 sm:mt-0">
          <div className="flex space-x-4 items-center font-semibold text-[16px]">
            {CreateorExplorestat ? (
              <Image src={discover} alt="discover" className="mr-2" />
            ) : (
              <Image src={ticket} alt="ticket" className="mr-2" />
            )}
          </div>
          <div onClick={handlerouting}>
            {CreateorExplorestat ? "Discover More Events" : "Create an Event"}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Createevents;
