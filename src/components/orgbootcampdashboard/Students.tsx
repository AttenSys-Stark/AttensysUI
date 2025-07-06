import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Input } from "@headlessui/react";
import filter from "@/assets/filter.png";
import exportimg from "@/assets/export.svg";
import Studentlist from "./Studentlist";
import Pendinglist from "./Pendinglist";
import MobileStudentApprovalCard from "./MobileStudentApprovalCard";
import MobileStudentRegisteredCard from "./MobileStudentRegisteredCard";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { pinata } from "../../../utils/config";
import { useSearchParams } from "next/navigation";
import { useAtom } from "jotai";

const Students = () => {
  const [pendingclickstat, setPendingclickstat] = useState(true);
  const [registeredclick, setRegisteredClick] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [pendingStudent, setPendingStudent] = useState([]);
  const [pendingStudentStatus, setpendingStudentStatus] = useState(false);
  const searchParams = useSearchParams();
  const org = searchParams.get("org");
  const id = searchParams.get("id");

  const orgContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  );

  const handlependingClick = () => {
    setPendingclickstat(true);
    setRegisteredClick(false);
  };
  const handleRegclick = () => {
    setPendingclickstat(false);
    setRegisteredClick(true);
  };

  const handleChange = (event: { target: { value: any } }) => {
    setSearchValue(event.target.value);
  };

  const getPendingApplication = async () => {
    const pending_info = await orgContract?.get_all_registration_request(org);
    // const pending_info = [];
    console.log(pending_info);
    if (pending_info.length > 0) {
      setpendingStudentStatus(true);
      setPendingStudent(pending_info);
    } else {
      setpendingStudentStatus(false);
    }
  };

  useEffect(() => {
    getPendingApplication();
  }, [wallet]);

  return (
    <div className="w-[88%] mx-auto">
      <div className="w-full md:w-[486px] flex justify-between border-b-[1px] border-[#D0D0D0]">
        <div
          onClick={handlependingClick}
          className={`${pendingclickstat && `border-[#9B51E0] border-b-[4px]`} w-[213px] px-4 flex justify-center items-center cursor-pointer h-full`}
        >
          Pending
        </div>
        <div
          onClick={handleRegclick}
          className={`${registeredclick && `border-[#9B51E0] border-b-[4px]`} w-[213px] px-4 flex justify-center items-center cursor-pointer`}
        >
          Registered
        </div>
      </div>

      {pendingclickstat && (
        <div>
          <div className="lg:hidden w-full py-7 space-y-4">
            <h1 className="text-[18px] leading-[23px] font-semibold  text-[#5801A9] mt-2">
              Pending Approval
            </h1>
            <div className="relative w-full ">
              <Input
                name="search by address"
                type="text"
                placeholder="        Search student ID, wallet, name ..."
                value={searchValue}
                onChange={handleChange}
                className="w-[90%] clg:w-[70%] lclg:w-[90%] p-2 border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-[#817676] bg-transparent"
              />
              {!searchValue && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#817676]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              )}
            </div>

            {pendingStudentStatus && pendingStudent.length > 0 ? (
              pendingStudent.some((data: any) => Number(data.status) === 0) ? (
                pendingStudent
                  .filter((data: any) => Number(data.status) === 0)
                  .map((data: any, index: number) =>
                    Number(data.status) === 0 ? (
                      <MobileStudentApprovalCard
                        key={index}
                        arg={
                          Number(data.status) === 0
                            ? "both"
                            : Number(data.status) === 1
                              ? "check"
                              : "cancel"
                        }
                        student={data}
                      />
                    ) : null,
                  )
              ) : (
                <h1>No pending application</h1>
              )
            ) : null}
          </div>

          <div className="hidden lg:block w-[88%] lg:w-[100%]  mx-auto mt-8 bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl h-[600px]">
            <div className=" w-[90%] mx-auto px-16 py-4 border-b-[1px] border-[#B8B9BA]">
              <h1 className="text-[18px] leading-[23px] font-semibold  text-[#5801A9] mt-2">
                Pending Approval
              </h1>
            </div>
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              {pendingStudentStatus && pendingStudent.length > 0 ? (
                pendingStudent.some(
                  (data: any) => Number(data.status) === 0,
                ) ? (
                  <table className="w-[90%] mx-auto border-separate border-spacing-y-3 ">
                    <thead>
                      <tr className="h-[60px] text-[14px] leading-[19.79px] text-[#333333]">
                        <th className=" text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                          Email
                        </th>
                        <th className=" text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                          Name
                        </th>
                        <th className=" text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                          Registration status
                        </th>
                        <th className=" text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                          Registration Date
                        </th>
                        <th className="text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                          Accept Registration
                        </th>
                      </tr>
                    </thead>
                    {pendingStudent
                      .filter((data: any) => Number(data.status) === 0)
                      .map((data: any, index: number) =>
                        Number(data.status) === 0 ? (
                          <Pendinglist
                            key={index}
                            arg={
                              Number(data.status) === 0
                                ? "both"
                                : Number(data.status) === 1
                                  ? "check"
                                  : "cancel"
                            }
                            info={data}
                          />
                        ) : null,
                      )}
                  </table>
                ) : (
                  <div className="flex h-[400px] w-full justify-center items-center">
                    <h1 className="text-center text-lg font-semibold">
                      No pending application
                    </h1>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      )}

      {registeredclick && (
        <div>
          <div className="lg:hidden w-full py-7 space-y-4">
            <h1 className="text-[18px] leading-[23px] font-semibold  text-[#5801A9] mt-2">
              Registered Students (210)
            </h1>
            <div className="relative w-full ">
              <Input
                name="search by address"
                type="text"
                placeholder="        Search student ID, wallet, name ..."
                value={searchValue}
                onChange={handleChange}
                className="w-[90%] clg:w-[70%] lclg:w-[90%] p-2 border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-[#817676] bg-transparent"
              />
              {!searchValue && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#817676]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              )}
            </div>
            {pendingStudent.map(
              (data: any, index: number) =>
                (Number(data.status) === 1 || Number(data.status) === 2) && (
                  <MobileStudentRegisteredCard
                    key={index}
                    arg={Number(data.status) === 1 ? "check" : "cancel"}
                    info={data}
                  />
                ),
            )}
          </div>

          <div className="hidden lg:block w-[100%] mx-auto mt-8 bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl h-[911px]">
            <div className="flex justify-between lg:px-8 xl:px-16 py-4 border-b-[1px] border-[#B8B9BA]">
              <h1 className="text-[18px] leading-[23px] font-semibold  text-[#5801A9] mt-2">
                Registered students (210)
              </h1>
              <div className="flex space-x-8">
                <div className="relative w-[550px] lclg:w-[380px]">
                  <Input
                    name="search by address"
                    type="text"
                    placeholder="        Search student ID, wallet, name ..."
                    value={searchValue}
                    onChange={handleChange}
                    className="w-[90%] h-full clg:w-[70%] lclg:w-[90%] p-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
                  />
                  {!searchValue && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  )}
                </div>

                <Button className="hidden space-x-2 lg:flex rounded-lg py-2 px-4 lg:h-[42px] items-center text-sm text-[#2D3A4B] data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
                  <div className="flex items-center font-semibold">
                    <Image
                      src={exportimg}
                      alt="export"
                      className=" h-[16px] w-[16px]"
                    />
                  </div>
                  <div className="text-[16px] font-medium text-[#2D3A4B]">
                    Export
                  </div>
                </Button>
              </div>
            </div>

            <div style={{ maxHeight: "800px", overflowY: "auto" }}>
              {pendingStudentStatus && pendingStudent.length > 0 ? (
                <table className="w-full border-separate border-spacing-y-3 ">
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f9f9f9",
                      zIndex: 1,
                    }}
                  >
                    <tr className="h-[60px] text-[14px] leading-[19.79px] text-[#333333]">
                      <th className=" text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                        Email
                      </th>
                      <th className=" text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                        Full name
                      </th>
                      <th className=" text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                        Wallet address
                      </th>
                      <th className=" text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                        Admission status
                      </th>
                      <th className="text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                        Attendance
                      </th>
                      <th className="text-center font-medium border-b-[1px] border-b-[#B8B9BA]">
                        Assignment submission
                      </th>
                    </tr>
                  </thead>
                  {pendingStudent.map(
                    (data: any, index: number) =>
                      (Number(data.status) === 1 ||
                        Number(data.status) === 2) && (
                        <Studentlist
                          key={index}
                          arg={Number(data.status) === 1 ? "check" : "cancel"}
                          info={data}
                        />
                      ),
                  )}
                </table>
              ) : (
                <div className="flex h-[400px] w-full justify-center items-center">
                  <h1 className="text-center text-lg font-semibold">
                    No pending application
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
