import React, { useState } from "react"
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack"
import Dropdown from "../Dropdown"
import Image from "next/image"
import free from "@/assets/free.svg"
import paid from "@/assets/paid.svg"
import CourseSideBar from "./SideBar"
import { handleCreateCourse } from "@/utils/helpers"
import { useRouter } from "next/navigation"

const MainFormView4 = () => {
  const router = useRouter()
  const [selectedPricing, setSelectedPricing] = useState(null)
  const [promoCode, setPromoCode] = useState("")
  const [formErrors, setFormErrors] = useState({})

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

  const handlePricingSelect = (index) => {
    setSelectedPricing(index)
  }

  const validateForm = (e) => {
    e.preventDefault()
    const errors = {}

    if (selectedPricing === null) {
      errors.pricing = "Please select a pricing option"
    }

    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      handleCreateCourse(e, "courseSetup5", router)
    }
  }

  return (
    <div className="flex">
      <div className="hidden sm:block">
        <CourseSideBar />
      </div>

      <div className="flex-1">
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
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
            <form onSubmit={validateForm}>
              <div className="my-12">
                <label htmlFor="" className="font-semibold text-[18px] leading-[31px] text-[#333333]">
                  Course Pricing
                </label>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px] my-2">
                  {`Set a price for your course that reflects the value of the content you're offering. Pricing your course 
appropriately can help attract the right audience while providing a fair return on your effort.`}
                </p>
                <div className="sm:flex my-12">
                  {pricing.map((item, id) => (
                    <div
                      key={id}
                      className={`relative border border-3 mr-12 px-5 py-10 rounded-xl sm:my-0 my-8 ${
                        selectedPricing === id 
                          ? 'border-[#4A90E2]' 
                          : 'border-black'
                      }`}
                      onClick={() => handlePricingSelect(id)}
                    >
                      <div className="fle ">
                        <div className="flex content-start">
                          <Image src={item.sym} alt={item.cost} />
                          <div className="mx-4">
                            <p className="font-semibold text-[16px] leading-[31px] text-[#333333]">{item.cost}</p>
                            <p className="font-normal text-[13px] text-[#2D3A4B] leading-[21px]">{item.desc} </p>
                          </div>
                        </div>

                        <div className="p-1 rounded-xl absolute right-4 top-4">
                          <input 
                            type="checkbox" 
                            name="pricing" 
                            checked={selectedPricing === id}
                            onChange={() => handlePricingSelect(id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {formErrors.pricing && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.pricing}</p>
                )}
              </div>

              <div className="my-16">
                <label htmlFor="" className="font-semibold text-[18px] leading-[31px] text-[#333333]">
                  Promo and Discount
                </label>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                  Promotional pricing is a great way to create urgency and
                  increase the visibility of your course, helping you reach a
                  wider audience while rewarding early sign-ups.
                </p>
                <div className="block sm:flex py-4">
                  <input
                    type="text"
                    placeholder="Create Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="rounded-xl flex-1 mr-4 bg-white text-[#2d3a4b] border-[#c0c0c0] border-[1px] py-2 pl-10"
                  />
                  <button 
                    type="button"
                    className="rounded-xl bg-white font-normal text-[13px] text-[#2D3A4B] leading-[21px] border-[#d0d5dd] border-[1px] py-3 px-6"
                  >
                    + Add Promo Code
                  </button>
                </div>
              </div>

              <div className="my-12">
                <div className="mt-12 mb-24">
                  <button
                    className="rounded-xl bg-[#4A90E2] px-12 sm:px-48 py-3 text-white"
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