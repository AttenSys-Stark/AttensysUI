import React from "react";
import Image from "next/image";
import green from "@/assets/green.svg";
import red from "@/assets/red.svg";

interface AttendancListProp {
  name: string;
  address: string;
  role: string;
  regdate: string;
  checkstat: boolean;
}

const AttendanceList: React.FC<AttendancListProp> = (props) => {
  return (
    <tbody>
      <tr className="h-[56px] text-[14px] font-normal text-[#5801A9] bg-[#F2F1F1] leading-[19.79px] text-center px-4 my-10 rounded-2xl border overflow-hidden">
        <td className="px-4 py-4  rounded-tl-xl rounded-bl-xl">
          <Image src={props.checkstat ? green : red} alt="stat" />
        </td>
        <td className="px-4 py-2">{props.name}</td>
        <td className="px-4 py-2 text-[14px] font-normal text-[#5801A9] leading-[19.79px]">
          {props.address}
        </td>
        <td className="px-4 py-2 text-[14px] font-normal text-[#5801A9] leading-[19.79px]">
          <h1
            className={`h-[30px] flex justify-center items-center  text-[#115E2C] text-center rounded-lg ${props.checkstat ? "bg-[#C4FFA2] text-[#115E2C]" : "bg-[#FF2F2F54] text-[#F76969] "} bg-[#C4FFA2]`}
          >
            {props.checkstat ? "Confirmed" : "Error"}
          </h1>
        </td>
        <td className="px-4 py-2 text-[14px] font-normal text-[#5801A9] leading-[19.79px]">
          {props.role}
        </td>
        <td className="px-4 py-2 text-[14px] font-normal text-[#5801A9] leading-[19.79px] rounded-tr-xl rounded-br-xl">
          {props.regdate}
        </td>
      </tr>
    </tbody>
  );
};

export default AttendanceList;
