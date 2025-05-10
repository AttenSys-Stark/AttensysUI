import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Testimonialccard from "./Testimonialccard";
import nikolas from "@/assets/nikolas.svg";
import profilepic from "@/assets/headshot.svg";
import item from "@/assets/smiling.svg";
import Image from "next/image";

const Testimonial = () => {
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const mockdata = [
    {
      name: "Priya Kapoor",
      profile: nikolas,
      statement:
        "Landing my dream job was easier when employers could instantly verify my AttenSys certificates. No more waiting weeks for background checks!",
    },
    {
      name: "Kenny",
      profile: profilepic,
      statement:
        "Selling my courses became effortless with AttenSys. The STRK integration handles secure payments while I focus on teaching - revenue grew by 40% in 3 months!",
    },
    {
      name: "Aisha Bello",
      profile: item,
      statement:
        "As a busy professional, AttenSys made upskilling seamless. I could verify course quality before enrolling and received my blockchain-certified completion badge in minutes!",
    },
  ];

  return (
    <div className="w-full bg-transparent">
      {" "}
      {/* 🔹 Transparent background */}
      {/* 📌 Section for large screens */}
      <div className="h-[530px] w-[100%] hidden lg:flex items-center justify-center">
        <div className="h-[397.06px] w-[893px]">
          <h1 className="text-center font-bold text-[24px] text-[#2D3A4B] h-[31px] leading-[31px] pt-8">
            Why <span className="text-[#9B51E0]">they</span> Love Attensys...
          </h1>
          <Carousel
            responsive={responsive}
            centerMode={false}
            containerClass="container"
            className="mt-16"
            renderArrowsWhenDisabled={false}
            additionalTransfrom={0}
            arrows
            dotListClass="flex justify-center mt-4"
            draggable
            focusOnSelect={false}
            infinite
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
          >
            {mockdata.map((data, index) => (
              <Testimonialccard
                key={index}
                user={data.name}
                pic={data.profile}
                statement={data.statement}
              />
            ))}
          </Carousel>
        </div>
      </div>
      {/* 📌 Section for small screens */}
      <div className="w-full flex flex-col items-center text-center lg:hidden py-10 px-4 pb-14">
        {" "}
        {/* 🔹 More bottom margin */}
        {/* 📝 Responsive Title */}
        <h1 className="text-center font-bold text-[22px] text-[#2D3A4B] leading-[28px] pb-6">
          Why <span className="text-[#9B51E0]">they</span> Love Attensys...
        </h1>
        {/* 🎡 Testimonial Carousel on Small Screens */}
        <Carousel
          responsive={responsive}
          centerMode={false}
          containerClass="container"
          className="w-full max-w-[90%] mt-4"
          renderArrowsWhenDisabled={false}
          additionalTransfrom={0}
          arrows={false} // 🔹 No arrows on mobile
          dotListClass="flex justify-center mt-4"
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
        >
          {mockdata.map((data, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-8 w-full max-w-[320px] mx-auto flex flex-col items-center text-center"
            >
              {" "}
              {/* 🔹 Bigger and stylish box */}
              {/* 🔹 Profile Image */}
              <Image
                src={data.profile}
                alt={data.name}
                width={90}
                height={90}
                className="w-[90px] h-[90px] rounded-full border-4 object-cover mb-4"
              />
              {/* User Name */}
              <p className="text-[18px] font-bold text-[#2D3A4B] mt-2">
                {data.name}
              </p>
              {/* Testimonial */}
              <p className="text-[14px] text-[#2D3A4B] leading-[20px] mt-4">
                {data.statement}
              </p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Testimonial;
