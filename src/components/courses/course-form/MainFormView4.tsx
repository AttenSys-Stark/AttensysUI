import React, { useState } from "react"
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack"
import Image from "next/image"
import free from "@/assets/free.svg"
import paid from "@/assets/paid.svg"
import CourseSideBar from "./SideBar"
import { handleCreateCourse } from "@/utils/helpers"
import { useRouter } from "next/navigation"
import Stepper from "@/components/Stepper"

const MainFormView4 = () => {
  const router = useRouter()
  const [selectedPricing, setSelectedPricing] = useState("")
  const [formErrors, setFormErrors] = useState({
    coursePricing: false,
  })

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
  ]

  const handlePricingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPricing(event.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <CourseSideBar />
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
          <div className="mx-4 sm:ml-24 sm:mr-96 mt-12">
            <form onSubmit={handleSubmit}>
          <div className="mx-4 sm:ml-24 lg:mr-96 mt-12">
            <form action="CourseSetup5">
              <div className="my-12">
                <label
                  htmlFor="coursePricing"
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Pricing
                </label>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px] my-2">
                  {`Set a price for your course that reflects the value of the content you’re offering.Pricing your course 
appropriately can help attract the right audience while providing a fair return on your effort.`}
                </p>
                <div className="sm:flex my-12">
                  {pricing.map((item, id) => (
                    <div
                      key={id}
                      className="relative border border-3 border-black mr-12 px-5 py-5 rounded-xl sm:my-0 my-8"
                    >
                      <div className="fle ">
                        <div className="flex content-start">
                          <div>
                            <Image src={item.sym} alt={item.cost} width={30} />
                          </div>
                          <div className="mx-4">

                            <p className="font-semibold text-[16px] leading-[31px] text-[#333333]">
                              {item.cost}
                            </p>
                            <p className="font-normal text-[13px] text-[#2D3A4B] leading-[21px]">
                              {item.desc}{" "}
                            </p>
                          </div>
                        </div>

                        <div className="p-1 rounded-xl absolute right-4 top-4">
                          <input
                            type="radio"
                            name="coursePricing"
                            value={item.cost}
                            checked={selectedPricing === item.cost}
                            onChange={handlePricingChange}
                            required
                          />

                            <p className="font-semibold text-base leading-[31px] text-[#333333]">{item.cost}</p>
                            <p className="font-normal text-[13px]/[145%] text-[#2D3A4B]">{item.desc} </p>
                          </div>
                        </div>

                        <div className="p-1 rounded-xl absolute right-5 top-3">
                          <input type="checkbox" name="xxw" id="" />

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {formErrors.coursePricing && (
                  <p className="text-red-500 text-sm">
                    Please select a pricing option.
                  </p>
                )}
              </div>
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
  )
}

export default MainFormView4
