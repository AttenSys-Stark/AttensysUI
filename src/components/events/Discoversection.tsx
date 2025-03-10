import React from "react";
import Image from "next/image";
import moon from "@/assets/moon.svg";
import upcoming from "@/assets/upcoming.svg";
import top from "@/assets/top.svg";
import { useRouter } from "next/navigation";

const Discoversection = () => {
  const router = useRouter();

  const handlerouting = () => {
    router.push("/Events/createdevent");
  };
  const handleDiscover = () => {
    router.push("/Discoverevent");
  };

  return (
    <div className="h-[100px] clg:h-[80px] lg:[70px] lclg:[60px] flex justify-between w-[90%] mx-auto items-center">
      <div className="flex w-[290px] clg:w-[300px] lclg:w-[300px] space-x-8 items-center">
        <div
          onClick={handleDiscover}
          className="flex space-x-3 items-center cursor-pointer"
        >
          <Image src={moon} alt="moon" />
          <h1>Discover</h1>
        </div>
        <div className="w-[1px] h-[24px] bg-[#9B51E0]"></div>
        <div
          className="flex space-x-3 items-center cursor-pointer"
          onClick={handlerouting}
        >
          <Image src={upcoming} alt="moon" />
          <h1>My Events</h1>
        </div>
      </div>

      <div className="hidden sm:block">
        <Image src={top} alt="moon" />
      </div>
    </div>
  );
};

export default Discoversection;
