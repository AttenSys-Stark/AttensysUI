import React from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { permisiondata } from "@/constants/data";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { ImBooks } from "react-icons/im";

const Permissions = () => {
  return (
    <div className="h-auto w-full flex flex-col items-center md:bg-[#FFFFFF] sm:border-[1px] border-[#D9D9D9] rounded-b-xl pt-3">
      <div className="hidden lg:block px-0 mx-0 w-[100%] h-[100%]">
        <table className="w-full border-collapse">
          <thead className="">
            <tr className="border-b border-gray-300 h-[40px] text-[14px] text-[#333333]">
              <th className="text-left px-4 leading-[22px] font-bold">Email</th>
              <th className="text-left  px-4 leading-[22px] font-bold">
                Wallet Address
              </th>
              <th className="text-left px-4 leading-[22px] font-bold">
                {" "}
                Roles
              </th>
              <th className="text-left px-4 leading-[22px] font-bold">
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
                        <div className="text-[12px] leading-[22px] font-medium text-[#FFFFFF] h-[28px] w-[58px] bg-[rgb(74,144,226)] rounded-lg flex items-center justify-center">
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
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-5 lg:hidden w-full md:w-5/6 px-4">
        <div className="flex gap-2 text-md items-center justify-start w-full border-b-2 mt-5">
          <ImBooks className="text-[#9B51E0] text-2xl" />
          <p>Permissions and Access</p>
        </div>
        {permisiondata.map((data, index) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-center bg-white border border-[#F7F7F7] my-2 rounded-lg w-full"
            >
              <div className="flex items-start justify-between py-3 px-4 gap-5">
                <div className="flex flex-col gap-3 items-start">
                  <p className="text-[14px]">{data.email}</p>
                  <p className="text-[12px] text-[#A666E3]">{data.address}</p>
                </div>
                <div className="flex flex-col justify-end items-start gap-2">
                  {data.access.map((role, index) => (
                    <div
                      key={index}
                      className={`${role == "Owner" ? "bg-[rgb(74,144,226)]" : "bg-[#A666E3]"} text-white px-2 py-1 rounded-lg text-[12px]`}
                    >
                      {role}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between border border-t-[#333333] px-4 py-2">
                <div className="flex gap-2 items-center text-[12px]">
                  <IoSettingsSharp className="text-[#2D3A4B] text-[14px]" />
                  <h1 className="leading-[22px] font-medium text-[#333333]">
                    Manage bootcamp
                  </h1>
                </div>
                {data.access.length < 2 && (
                  <div className="flex gap-2 items-center text-[12px]">
                    <IoIosRemoveCircleOutline className="text-[#2D3A4B]" />
                    <p>Remove user</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Permissions;
