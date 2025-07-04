import React, { use, useEffect, useState } from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import Dropdown from "../Dropdown";
import Image from "next/image";
import free from "@/assets/free.svg";
import paid from "@/assets/paid.svg";
import CourseSideBar from "./SideBar";
import { handleCreateCourse } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import Stepper from "@/components/Stepper";
import PriceSelector from "./PriceSelector";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { provider } from "@/constants";
import { Contract } from "starknet";

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
  const [currentStrkPrice, SetCurrentStrkPrice] = useState(0);
  console.log(courseData);
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

  const courseContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    provider,
  );

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

  useEffect(() => {
    const getCurrentStrkPrice = async () => {
      try {
        const currentPrice = await courseContract?.get_price_of_strk_usd();
        const formattedPrice = Number(currentPrice) / 100000000;
        SetCurrentStrkPrice(formattedPrice);
        console.log("Current STRK price:", formattedPrice);
      } catch (error) {
        console.error("Error fetching current STRK price:", error);
      }
    };

    getCurrentStrkPrice();
    const intervalId = setInterval(getCurrentStrkPrice, 3000);
    return () => clearInterval(intervalId);
  }, [courseContract]);

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <CourseSideBar courseData={courseData} />
      </div>

      <div className="flex-1 w-full">
        {/* <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-[13px]/[145%] md:text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div> */}

        <div className="lg:hidden w-full flex justify-center mt-[58px] mb-[79px]">
          <Stepper currentStep={4} />
        </div>
        <div className="w-full">
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

          <div className="mx-5 mt-12 md:mx-10">
            <form onSubmit={handleSubmit}>
              <div className="my-12 w-full md:w-[80%]">
                <label className="font-semibold text-[18px] leading-[31px] text-[#333333]">
                  Course Pricing
                </label>
                {pricingError && (
                  <p className="text-red-500 text-sm mt-1">{pricingError}</p>
                )}

                <div className="w-full sm:flex sm:flex-row sm:space-x-4 sm:items-stretch my-12">
                  {pricing.map((item, id: number) => (
                    <div
                      key={id}
                      className={`w-full relative border px-5 py-5 rounded-xl sm:my-0 my-8 cursor-pointer ${
                        courseData.coursePricing === item.cost
                          ? "border-2 border-[#4A90E2]"
                          : "border-[#00000033]"
                      }`}
                      onClick={() => handleCoursePricing(item.cost)}
                    >
                      <div className="w-full flex content-start">
                        <div>
                          <Image
                            src={item.sym}
                            className="flex-none"
                            alt={item.cost}
                            width={30}
                          />
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
                {courseData.coursePricing === "Paid" && (
                  <PriceSelector exchangeRate={currentStrkPrice} />
                )}
              </div>

              <div className="mt-[71px] w-full md:w-[80%]">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Promo and Discount
                </label>
                <p className="w-full font-normal text-[13px]/[145%] md:text-[14px] mt-5 text-[#2D3A4B] leading-[21px]">
                  Promotional pricing is a great way to create urgency and
                  increase the visibility of your course, helping you reach a
                  wider audience while rewarding early sign-ups.
                </p>
                <div className="w-full block sm:flex sm:items-center sm:flex-row sm:space-x-2 sm:justify-between py-4">
                  <input
                    type="text"
                    placeholder="Create Promo Code"
                    className="rounded-[5px] h-[55px] w-full bg-white text-[#2d3a4b] border-[#c0c0c0] border-[1px] py-2 pl-10 mb-4 sm:mb-0"
                    value={courseData.promoAndDiscount}
                    onChange={handleCoursePromoCode}
                  />
                  <button className="rounded-[5px] w-auto flex-none bg-white font-normal h-[55px] py-2 text-[13px] text-[#2D3A4B] leading-[21px] border-[#d0d5dd] border-[1px] px-6">
                    + Add Promo Code
                  </button>
                </div>
              </div>

              <div className="mt-12 mb-5 w-full mx-auto flex justify-center md:justify-start">
                <button
                  className="bg-[#4A90E2] rounded-lg py-[15px] text-white w-full w-[190px] md:w-[350px]"
                  type="submit"
                >
                  Save and Proceed
                </button>
              </div>
              <div className="w-full flex justify-center pb-[74px]">
                <button
                  type="button"
                  className="block sm:hidden bg-[#c5d322] text-sm px-12 py-[15px] w-full rounded-lg text-black"
                >
                  Save progress
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFormView4;
