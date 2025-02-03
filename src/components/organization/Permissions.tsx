import React from "react"
import { IoSettingsSharp } from "react-icons/io5"
import { permisiondata } from "@/constants/data"

const Permissions = () => {
  return (
    <div className="h-auto w-full flex flex-col items-center bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-b-xl pt-3">
      <table className="w-full border-collapse">
        <thead className="">
          <tr className="border-b border-gray-300 h-[40px]">
            <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">
              Email
            </th>
            <th className="text-left  px-4 text-[14px] leading-[22px] font-bold text-[#333333]">
              Wallet Address
            </th>
            <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">
              {" "}
              Roles
            </th>
            <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {permisiondata.map((data, index) => {
            return (
              <tr key={index} className="border-b border-gray-300 h-[70px]">
                <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#333333]">
                  {data.email}
                </td>
                <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#9B51E0]">
                  {data.address}
                </td>
                <td className="py-3 px-4 flex space-x-1 items-center h-[70px]">
                  {data.access.length > 1 ? (
                    <>
                      <div className="text-[12px] leading-[22px] font-medium text-[#FFFFFF] h-[28px] w-[58px] bg-[#4A90E2] rounded-lg flex items-center justify-center">
                        Owner
                      </div>
                      <div className="text-[12px] leading-[22px] font-medium text-[#FFFFFF] h-[28px] w-[77px] bg-[#A666E3] rounded-lg flex items-center justify-center">
                        Instructor
                      </div>
                    </>
                  ) : (
                    <div className="text-[12px] leading-[22px] font-medium text-[#FFFFFF] h-[28px] w-[77px] bg-[#A666E3] rounded-lg flex items-center justify-center">
                      {data.access[0]}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  {" "}
                  <div className="flex items-center space-x-2">
                    <IoSettingsSharp className="text-[#2D3A4B]" />
                    <h1 className="text-[14px] leading-[22px] font-medium text-[#333333]">
                      Manage bootcamp
                    </h1>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Permissions
