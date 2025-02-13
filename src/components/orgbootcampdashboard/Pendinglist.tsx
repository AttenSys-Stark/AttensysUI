import React from "react";
import ex from "@/assets/ex.svg";
import correct from "@/assets/correct.png";
import Image from "next/image";

const Pendinglist = (props: any) => {
  const renderButton = (arg: any) => {
    if (arg == "both") {
      return (
        <>
          <div className="flex space-x-3 items-center justify-center">
            <Image src={ex} alt="cancel" />
            <Image src={correct} alt="check" />
          </div>
        </>
      );
    } else if (arg == "check") {
      return (
        <>
          <div className="flex items-center justify-center">
            <Image src={correct} alt="check" />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="flex items-center justify-center">
            <Image src={ex} alt="cancel" />
          </div>
        </>
      );
    }
  };

  const renderStatus = (arg: any) => {
    if (arg == "both") {
      return (
        <>
          <h1 className="text-[#115E2C]">Pending</h1>
        </>
      );
    } else if (arg == "check") {
      return (
        <>
          <h1 className="text-[#115E2C]">Approved</h1>
        </>
      );
    } else {
      return (
        <>
          <h1 className="text-[#DC1D16]">Declined</h1>
        </>
      );
    }
  };

  return (
    <tbody>
      <tr>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] text-[14px] font-medium leading-[23px] text-[#333333]">
          vladamirocks@gmail.com
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] text-[14px] font-medium leading-[23px] text-[#333333]">
          Victor Jegede
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] font-medium leading-[23px]">
          {renderStatus(props.arg)}
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] text-[14px] font-medium leading-[23px] text-[#9B51E0]">
          11 Oct, 2024 | 10:25 PM
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] font-medium leading-[23px] text-[#9B51E0]">
          {renderButton(props.arg)}
        </td>
      </tr>
    </tbody>
  );
};

export default Pendinglist;
