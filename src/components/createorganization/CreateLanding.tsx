import React from "react";
import Image from "next/image";
import highfive from "@/assets/highfive.svg";
import { Button } from "@headlessui/react";
import createicon from "@/assets/createicon.svg";
import { GoOrganization } from "react-icons/go";
import { useRouter, useParams } from "next/navigation";

const CreateLanding = () => {
  const router = useRouter();

  const handleRoute = () => {
    router.push("/Createorganization/basic-info");
  };

  return (
    <div className="bg-[#f5f8fa] h-[700px] w-full flex justify-center items-center">
      <div className="h-[450px] w-[80%] mx-auto bg-[#FFFFFF] rounded-xl flex flex-col items-center justify-center space-y-4">
        <Image src={highfive} alt="highfive" />
        <h1 className="font-bold text-[22px] leading-[22px] text-[#333333]">
          The More the Merrier...
        </h1>
        <p className="text-center font-medium text-[16px] text-[#6B6D6E] leading-[25px]">
          Seems like you are all alone right now; lets get more people into{" "}
          <br /> your party!!
        </p>
        <Button
          onClick={handleRoute}
          className="flex justify-center items-center space-x-3 w-[232px] text-[#4A90E2] h-[46px] border-[1px] border-[#4A90E2] rounded-lg hover:bg-[#4A90E2] hover:text-[#FFFFFF]"
        >
          <GoOrganization className="h-[22px] w-[21px]" />
          <h1 className="text-[14px] font-bold">Create an Organization</h1>
        </Button>
      </div>
    </div>
  );
};

export default CreateLanding;
