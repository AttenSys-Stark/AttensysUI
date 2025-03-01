"use client";
import { Button } from "@headlessui/react";
import React from "react";
import {
  outlineclick,
  allstudentclick,
  certificationsclick,
  addclassmodal,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { FaPlus } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";

const DashboardTab = (props: any) => {
  const [outlineClickstat, setOutlineClickstat] = useAtom(outlineclick);
  const [allstudentclickstat, setallstudentclickstat] =
    useAtom(allstudentclick);
  const [certificationclickstat, setcertificationclickstat] =
    useAtom(certificationsclick);
  const [addClass, setAddclass] = useAtom(addclassmodal);
  const router = useRouter();
  const searchParams = useSearchParams();
  const org = searchParams.get("org");
  const id = searchParams.get("id");

  const handleAddclass = () => {
    setAddclass((prev) => ({ ...prev, modalstatus: true }));
  };

  const handleinsightclick = () => {
    setOutlineClickstat(true);
    setallstudentclickstat(false);
    setcertificationclickstat(false);

    //@todo replace sample dashboard with org name
    router.push(`/Bootcamp/${props.bootcampname}/Outline/?id=${id}&org=${org}`);
  };

  const handlegueslistclick = () => {
    setOutlineClickstat(false);
    setallstudentclickstat(true);
    setcertificationclickstat(false);
    //@todo replace sample dashboard with org name
    router.push(
      `/Bootcamp/${props.bootcampname}/Students/?id=${id}&org=${org}`,
    );
  };
  const handleAttendanceclick = () => {
    setOutlineClickstat(false);
    setallstudentclickstat(false);
    setcertificationclickstat(true);
    //@todo replace sample dashboard with org name
    router.push(
      `/Bootcamp/${props.bootcampname}/Certifications/?id=${id}&org=${org}`,
    );
  };

  return (
    <>
      <div className="h-[55px] w-full border-b-[2px] border-[#D0D0D0] items-center hidden md:flex mt-8 ">
        <div className="w-full clg:w-full lclg:w-full flex lg:space-x-32 md:space-x-28 h-[40px] mt-5 px-24">
          <Button
            onClick={handleinsightclick}
            className={`${outlineClickstat && `border-[#9B51E0] border-b-[4px]`} w-[140px] text-[16px] font-medium text-[#333333]`}
          >
            Course Outline
          </Button>
          <Button
            onClick={handlegueslistclick}
            className={`${allstudentclickstat && `border-[#9B51E0] border-b-[4px]`} lg:w-[102px] clg:w-[130px] lclg:w-[200px] text-[16px] font-medium text-[#333333]`}
          >
            All students
          </Button>
          <Button
            onClick={handleAttendanceclick}
            className={`${certificationclickstat && `border-[#9B51E0] border-b-[4px]`} w-[102px] text-[16px] font-medium text-[#333333]`}
          >
            Certifications
          </Button>
        </div>
      </div>
      <div className="md:hidden px-[22px] mt-8">
        {outlineClickstat && (
          <div
            className=" flex items-center mb-4 gap-[10px] cursor-pointer  md:hidden"
            onClick={handleAddclass}
          >
            <FaPlus />
            <h1 className="font-medium  text-[#2D3A4B] text-[16px] leading-[22px] underline">
              Upload new class recording
            </h1>
          </div>
        )}
        <Menubar className="bg-transparent border-none shadow-none p-0">
          <MenubarMenu>
            <MenubarTrigger className="border-[#9B51E0] border-b-[4px] w-auto !bg-transparent text-[16px] font-medium text-[#333333] px-0">
              {outlineClickstat
                ? "Course Outline"
                : allstudentclickstat
                  ? "All Students"
                  : "Certifications"}
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleinsightclick}>
                Course Ouline
              </MenubarItem>
              <MenubarItem onClick={handlegueslistclick}>
                All students
              </MenubarItem>

              <MenubarItem onClick={handleAttendanceclick}>
                Certifications
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </>
  );
};

export default DashboardTab;
