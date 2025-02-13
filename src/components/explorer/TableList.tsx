import React from "react";
import Image from "next/image";
import copy_addr from "@/assets/copy_addr.svg";
import copy from "copy-to-clipboard";

interface TableListProp {
  timestamp: string;
  address: string;
  status: string;
  category: string;
}

const TableList: React.FC<TableListProp> = (props) => {
  const handleCopy = () => {
    copy(props.address);
  };

  const CardView = () => (
    <div className="bg-[#F2F1F1] rounded-2xl border w-full my-3 p-5">
      <div className="mb-4">
        <p className="text-[16px] font-[400] text-[#115E2C] mb-2 leading-[19.79px]">
          {props.status}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-[600] text-[#5801A9] leading-[19.79px] truncate max-w-[200px]">
            {props.address}
          </p>
          <Image
            src={copy_addr}
            alt="copy"
            onClick={handleCopy}
            className="cursor-pointer flex-shrink-0"
          />
        </div>
      </div>
      <div>
        <p className="text-[14px] font-[400] text-[#2D3A4B] mb-2 leading-[19.79px]">
          {props.category}
        </p>
        <p className="text-[14px] font-[400] text-[#2D3A4B] leading-[19.79px]">
          {props.timestamp}
        </p>
      </div>
    </div>
  );

  const TableRow = () => (
    <tr className="h-[56px] text-[14px] font-normal text-[#5801A9] bg-[#F2F1F1] leading-[19.79px] text-center my-10 rounded-2xl border">
      <td className="px-4 py-2 rounded-tl-xl rounded-bl-xl whitespace-nowrap">
        {props.timestamp}
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          <span className="truncate max-w-[200px]">{props.address}</span>
          <Image
            src={copy_addr}
            alt="copy"
            onClick={handleCopy}
            className="cursor-pointer flex-shrink-0"
          />
        </div>
      </td>
      <td className="px-4 py-2">
        <div className="h-[30px] flex justify-center items-center text-[#115E2C] text-center rounded-lg bg-[#C4FFA2] whitespace-nowrap px-3">
          {props.status}
        </div>
      </td>
      <td className="px-4 py-2 rounded-tr-xl rounded-br-xl whitespace-nowrap">
        {props.category}
      </td>
    </tr>
  );

  return (
    <>
      <div className="block xl:hidden">
        <CardView />
      </div>
      <tbody className="hidden xl:table-row-group">
        <TableRow />
      </tbody>
    </>
  );
};

export default TableList;
