import React from "react";
import Image from "next/image";
import grad from "@/assets/grad.svg";
import book from "@/assets/book.svg";
import badge from "@/assets/badge.svg";

const Cardsection = () => {
  const data = [
    {
      icon: grad,
      header: "Online Courses",
      paragraph:
        "Join & Schedule classes, webinars, and events easily. Attensys allows you to create and track participant engagement.",
    },
    {
      icon: book,
      header: "Event Tracking",
      paragraph:
        "Automatically track attendance for courses and events with our integrated tools. Issue, and verify certificates with ease.",
    },
    {
      icon: badge,
      header: "Quality Certification",
      paragraph:
        "Issue, and verify certificates with ease. Ensure every certificate is authenticated with our blockchain-backed technology.",
    },
  ];

  return (
    <div className="mt-4 sm:mt-10 md:mt-12 w-[90%] md:w-[80%] sm:w-[80%] sm:pb-10 lg:w-[90%] mx-auto flex flex-col sm:flex-col md:flex-col sm:items-center md:items-center lg:flex-row sm:justify-center sm:space-x-6 space-y-6 sm:space-y-8 sm:px-6 md:space-y-8 md:px-6">
      {data.map((item, index) => (
        <div
          key={index}
          className="w-full sm:w-[424px] md:w-full lg:w-[30%] h-auto bg-[#FFFFFF] rounded-xl shadow-lg flex flex-col sm:flex-row md:flex-col justify-center items-center sm:space-x-4 md:space-x-0 p-6 md:p-8"
        >
          <Image
            alt="icon"
            src={item?.icon}
            className="size-6 text-[#9747FF] w-[46px] h-[46px] my-auto"
          />
          <div className="space-y-2 sm:w-[270px] md:w-full text-center sm:text-left md:text-center">
            <h1 className="text-[18px] text-[#2D3A4B] font-bold">
              {item.header}
            </h1>
            <p className="text-[14px] text-[#2D3A4B] font-light">
              {item.paragraph}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cardsection;
