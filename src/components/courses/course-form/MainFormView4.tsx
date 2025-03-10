import React, { useState } from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import Dropdown from "../Dropdown";
import Image from "next/image";
import free from "@/assets/free.svg";
import paid from "@/assets/paid.svg";
import CourseSideBar from "./SideBar";
import { handleCreateCourse } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import Stepper from "@/components/Stepper";

interface ChildComponentProps {
  courseData: any;
  handleCoursePricing: (event: string) => void;
  handleCoursePromoCode: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MainFormView4: React.FC<ChildComponentProps> = ({
  courseData,
  handleCoursePricing,
  handleCoursePromoCode,
}) => {
  const router = useRouter();
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null);
  const [pricingError, setPricingError] = useState("");

  const pricing = [
    {
      sym: free,
      cost: "Free",
      desc: "Offer your course for free and reach a wide audience.",
    },
    {
      sym: paid,
      cost: "Paid",
      desc: "Set a price that reflects the value of your content",
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error
    setPricingError("");

    // Validate pricing selection
    if (!courseData.coursePricing) {
      setPricingError("Please select a pricing option");
      return;
    }

    // Proceed to next step
    handleCreateCourse(e, "courseSetup5", router);
  };

  const handlePricingSelection = (cost: string) => {
    setSelectedPricing(cost);
    setPricingError("");
  };

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <CourseSideBar courseData={courseData} />
      </div>

      <div className="flex-1 w-full">
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-[13px]/[145%] md:text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div>

        <div className="lg:hidden w-full flex justify-center mt-[58px] mb-[79px]">
          <Stepper currentStep={4} />
        </div>
        <div className="">
          <div className="block sm:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] px-5 items-center">
            <div className="flex items-center">
              <div className="px-4 sm:px-8 border-r border-blue-100">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-[#4A90E2] text-xl font-bold">
                Pricing & Discount
              </p>
            </div>

            <button className="hidden sm:block bg-[#c5d322] px-7 py-3 rounded text-black">
              Save progress
            </button>
          </div>

          <div className="mx-4 sm:ml-24 lg:mr-96 mt-12">
            <form onSubmit={handleSubmit}>
              <div className="my-12">
                <label className="font-semibold text-[18px] leading-[31px] text-[#333333]">
                  Course Pricing
                </label>
                {pricingError && (
                  <p className="text-red-500 text-sm mt-1">{pricingError}</p>
                )}
                <div className="sm:flex my-12">
                  {pricing.map((item, id: number) => (
                    <div
                      key={id}
                      className={`relative border mr-12 px-5 py-5 rounded-xl sm:my-0 my-8 cursor-pointer ${
                        courseData.coursePricing === item.cost
                          ? "border-2 border-[#4A90E2]"
                          : "border-[#00000033]"
                      }`}
                      onClick={() => handleCoursePricing(item.cost)}
                    >
                      <div className="flex content-start">
                        <div>
                          <Image src={item.sym} alt={item.cost} width={30} />
                        </div>
                        <div className="mx-4">
                          <p className="font-semibold text-base leading-[31px] text-[#333333]">
                            {item.cost}
                          </p>
                          <p className="font-normal text-[13px]/[145%] text-[#2D3A4B]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <div className="p-1 rounded-xl absolute right-5 top-3">
                        <input
                          type="radio"
                          name="pricing"
                          id={item.cost}
                          value={item.cost}
                          checked={courseData.coursePricing === item.cost}
                          onChange={() => handleCoursePricing(item.cost)}
                          className="w-4 h-4 text-[#4A90E2]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-[71px]">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Promo and Discount
                </label>
                <p className="font-normal text-[13px]/[145%] md:text-[14px] mt-5 text-[#2D3A4B] leading-[21px]">
                  Promotional pricing is a great way to create urgency and
                  increase the visibility of your course, helping you reach a
                  wider audience while rewarding early sign-ups.
                </p>
                <div className="block sm:flex py-4">
                  <input
                    type="text"
                    placeholder="Create Promo Code"
                    className="rounded-[5px] flex-1 h-[52px] mr-4 bg-white text-[#2d3a4b] border-[#c0c0c0] border-[1px] py-2 pl-10 w-full md:w-auto"
                    value={courseData.promoAndDiscount}
                    onChange={handleCoursePromoCode}
                  />
                  <button className="rounded-[5px] bg-white font-normal h-[55px] text-[13px] text-[#2D3A4B] leading-[21px] border-[#d0d5dd] mt-5 sm:mt-0 border-[1px]  py-3 px-6">
                    + Add Promo Code
                  </button>
                </div>
              </div>

              <div className="my-12">
                <div className="mt-12 mb-24">
                  <button
                    className="rounded-lg bg-[#4A90E2] px-12 py-3 text-white w-full md:max-w-[350px]"
                    type="submit"
                  >
                    Save and Proceed
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFormView4;
