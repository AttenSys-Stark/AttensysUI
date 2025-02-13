import React from "react";

import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Image from "next/image";
import profilePic from "../../assets/profile_pic.png";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark";
import { BsFillExclamationCircleFill } from "@react-icons/all-files/bs/BsFillExclamationCircleFill";
import {
  sideProperties,
  coursesProgress,
  certificateEarned,
  certSideProperties,
} from "@/constants/data";

interface CourseSideBarProps {
  page: string; // or another type like `number` or a union type
  selected: string; // Replace with appropriate type
  setSelected: (value: string) => void; // Function that sets a value
}

const CourseSideBar = () => {
  const courseSetup = [
    {
      head: "Course Setup (Basic info)",
      items: [
        "Course name",
        "Course description",
        "Course category",
        "Course level",
      ],
    },
    {
      head: "Learning outcomes",
      items: ["Student requirements", "Learning objectives", "Target audience"],
    },
    {
      head: "Course & curriculum",
      items: ["Course creative", "Course Curriculum"],
    },
    {
      head: "Pricing & Discounts",
      items: ["Course pricing", "Promos and discounts"],
    },
    {
      head: "Review & Publish",
      items: ["Publish course"],
    },
  ];
  return (
    <div className="bg-gradient-to-b from-[#9b51e052] to-[#4a90e252] py-8 px-8 h-full">
      <div>
        {courseSetup.map((item, i) => (
          <div key={i} className={`${i == 0 ? "my-2" : "my-12"}`}>
            <div className="border-l-4 border-[#4a90e2] text-[#4a90e2] my-4 pl-6">
              <h1 className="font-semibold text-[16px] leading-[31px]">
                {item.head}
              </h1>
            </div>

            <div>
              {item.items.map((sub, j) => (
                <div key={j} className="flex items-center mx-6 my-4">
                  <input
                    type="checkbox"
                    // onChange={onChange}
                    // disabled={this.state.disabled}
                    className="appearance-none w-4 h-4 rounded-full border-[1px] border-[#2D3A4B] checked:bg-[#115E2C] checked:border-[#115E2C] required:border-red-500 checked:before:content-['✔'] checked:before:absolute checked:before:top-[-1px] checked:before:left-[3px] checked:before:text-white checked:before:text-[10px] relative"
                  />
                  <p className="ml-4 text-[#333333] text-[14px] leading-[22px]">
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSideBar;
