import React from "react";
import Image from "next/image";

interface SponsorProp {
  icon: any;
  name: string;
  amount: number;
  address: string;
  time: string;
}

const Sponsorlist: React.FC<SponsorProp> = (props) => {
  return (
    <tr className="h-[56px] text-[14px] font-normal leading-[19.79px] text-center px-4 my-10 rounded-2xl overflow-hidden">
      <td className="px-4 py-4 flex space-x-4 items-center border-r-[2px] border-[#E9EBEC]">
        <Image src={props.icon} alt="ticket" />
        <h1 className="px-4 py-2 text-[#2D3A4B]">{props.name}</h1>
      </td>
      <td className="px-4 py-2 text-[14px] font-normal text-[#2D3A4 leading-[19.79px] border-r-[2px] border-[#E9EBEC]">
        {props.amount}
      </td>
      <td className="px-4 py-2 text-[14px] font-normal text-[#2D3A4 leading-[19.79px] text-[#5801A9] underline border-r-[2px] border-[#E9EBEC]">
        <h1>{props.address}</h1>
      </td>
      <td className="px-4 py-2 text-[14px] font-normal text-[#2D3A4 leading-[19.79px] border-r-[2px] border-[#E9EBEC]">
        {props.time}
      </td>
    </tr>
  );
};

export default Sponsorlist;
