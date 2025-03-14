import React from "react";
import Image from "next/image";
import moon from "@/assets/moon.svg";
import purple from "@/assets/purple.svg";
import top from "@/assets/top.svg";
import { useRouter } from "next/navigation";

const Eventdetailsdiscover = (props: any) => {
  const router = useRouter();

  const handleDiscover = () => {
    router.push("/Discoverevent");
  };

  return (
    <div className="h-[70px] clg:h-[80px] lg:[70px] lclg:[60px] flex justify-between w-[90%] mx-auto items-center">
      <div className="flex clg:w-[380px] lg:w-[380px] w-[80%] lclg:w-[400px] space-x-8 items-center">
        <div
          onClick={handleDiscover}
          className="flex space-x-3 items-center cursor-pointer"
        >
          <Image src={moon} alt="moon" />
          <h1>Discover</h1>
        </div>
        <div className="w-[1px] h-[24px] bg-[#9B51E0]"></div>
        <div className="flex space-x-3 items-center cursor-pointer w-[500px]">
          <Image src={purple} alt="moon" />
          <h1 className="text-[#5801A9]">{decodeURIComponent(props.name)}</h1>
        </div>
      </div>
      <Image src={top} alt="moon" className="hidden lg:block" />
    </div>
  );
};

export default Eventdetailsdiscover;
