import React from "react";
import check from "@/assets/check.svg";
import Image from "next/image";
import option from "@/assets/option.svg";

interface ListProp {
  name: string;
  address: string;
  status: string;
  role: string;
  regdate: string;
}

const List: React.FC<ListProp> = (props) => {
  return (
    <tbody>
      <tr className="h-[56px] text-[14px] font-normal text-[#5801A9] bg-[#F2F1F1] leading-[19.79px] text-center px-4 my-10 rounded-2xl border overflow-hidden">
        <td className="px-4 py-4 rounded-tl-xl rounded-bl-xl">
          <Image src={check} alt="ticket" />
        </td>
        <td className="px-4 py-2">{props.name}</td>
        <td className="px-4 py-2 text-[14px] font-normal text-[#5801A9] leading-[19.79px]">
          {props.address}
        </td>
        <td className="px-4 py-2 text-[14px] font-normal text-[#5801A9] leading-[19.79px]">
          <h1 className="h-[30px] flex justify-center items-center  text-[#115E2C] text-center rounded-lg bg-[#C4FFA2]">
            {props.status}
          </h1>
        </td>
        <td className="px-4 py-2 text-[14px] font-normal text-[#5801A9] leading-[19.79px]">
          {props.role}
        </td>
        <td className="px-4 py-2 text-[14px] font-normal text-[#5801A9] leading-[19.79px]">
          {props.regdate}
        </td>
        <td className="px-4 py-2  rounded-tr-xl rounded-br-xl ">
          <Image src={option} alt="ticket" className="mx-auto" />
        </td>
      </tr>
    </tbody>
  );
};

export default List;
