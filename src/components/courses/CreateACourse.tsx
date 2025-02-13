import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import edit from "../../assets/edi.svg";
import tdesign_video from "../../assets/tdesign_video.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleCreateCourse } from "@/utils/helpers";
import { courseQuestions } from "@/constants/data";

const CreateACourse = () => {
  const router = useRouter();

  return (
    <div className="py-12">
      {/* header */}
      <div className="px-4 xl:px-0">
        <h1 className="font-bold py-5 text-[#A01B9B] text-[20px] leading-[22px]">
          Create a course
        </h1>
        <div className="bg-transparent sm:bg-white sm:p-10 rounded-xl  border-[#bcbcbc] sm:border">
          <div className="block sm:flex items-center justify-between text-sm">
            <div className="">
              <p className="font-semibold text-[16px] leading-[22px]">{`Let's get started`}</p>
              <p className="text-[14px] font-normal text-[#333333] leading-[22px]">
                Setup your course in a few easy steps
              </p>
            </div>
            <div className="my-4 sm:my-0">
              <button
                className="bg-[#4A90E2] px-24 py-3 text-white text-sm rounded-xl"
                type="submit"
                onClick={(e) =>
                  handleCreateCourse(e, courseQuestions[0], router)
                }
              >
                Create a course
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="bg-white rounded-xl border-[#bcbcbc] border-[1px] my-6">
        <div className="flex justify-between items-center py-5 px-10 border-b border-[#bcbcbc]">
          <h1 className="font-bold py-5 text-[#A01B9B] text-[20px] leading-[22px]">
            Drafts
          </h1>

          <div className="hidden sm:flex items-center">
            <p className="underline">Manage & publish</p>
            <Image src={edit} alt="edit" />
          </div>
        </div>

        <div className="p-10 block sm:flex items-center justify-between text-sm">
          <div className="flex-1">
            <div className="w-[254px] h-[164px] sm:w-[80%] rounded-xl  bg-[#d5d5d5] flex text-center justify-center">
              <Image
                src={tdesign_video}
                alt="tdesign_video"
                className="object-cover h-full w-full rounded-xl"
              />
            </div>
          </div>
          <div className="flex-auto my-3 sm:my-0">
            <div>
              <p className="font-medium text-[20px] text-[#2D3A4B] leading-[22px] mb-3">
                Elementary Crypto Trading
              </p>
              <div>
                <ProgressBar completed={48} height="15px" bgColor="#9B51E0" />
                <p className="flex justify-end mt-2">48% completed</p>
              </div>
            </div>
          </div>

          <div className="my-3 sm:my-0 flex sm:hidden items-center">
            <p className="underline">Manage & publish</p>
            <Image src={edit} alt="edit" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateACourse;
