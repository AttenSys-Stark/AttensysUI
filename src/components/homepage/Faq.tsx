import React, { useState } from "react";
import faqsearch from "@/assets/faqsearch.svg";
import Image from "next/image";

const Faq = () => {
  const [firstfaq, setFirstfaq] = useState(false);
  const [secondfaq, setsecondfaq] = useState(false);
  const [thirdfaq, setthirdfaq] = useState(false);
  const [fourthfaq, setfourthfaq] = useState(false);
  const [fiftfaq, setfiftfaq] = useState(false);

  const togglefirstfaq = () => setFirstfaq(!firstfaq);
  const togglesecondfaq = () => setsecondfaq(!secondfaq);
  const togglethirdfaq = () => setthirdfaq(!thirdfaq);
  const togglefourthfaq = () => setfourthfaq(!fourthfaq);
  const togglefiftfaq = () => setfiftfaq(!fiftfaq);

  return (
    <div className="w-full bg-[#2D3A4B] py-12 mt-16">
      {" "}
      {/* 📌 ADDED `mt-16` FOR MORE MARGIN ON TOP */}
      {/* 📌 FAQ for large screens (Remains the same) */}
      <div className="hidden lg:flex lg:h-auto w-[100%] flex-col py-12">
        <div className="w-[896px] mx-auto">
          <h1 className="font-bold text-[34px] text-[#FFFFFF] text-center">
            FAQ
          </h1>
          <p className="text-[18px] text-[#BCBCBC] font-semibold pb-10 text-center">
            Frequently Asked Questions
          </p>

          {[
            togglefirstfaq,
            togglesecondfaq,
            togglethirdfaq,
            togglefourthfaq,
            togglefiftfaq,
          ].map((toggle, index) => (
            <div
              key={index}
              className="w-[894px] border-[#C3C3C3] border rounded-xl mb-6"
              onClick={toggle}
            >
              <div className="w-full flex space-x-4 px-8 cursor-pointer">
                <Image alt="icon" src={faqsearch} />
                <h1 className="py-5 text-[#BCBCBC] text-[18px]">
                  How secure are the certificates issued via AttenSys?
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 📌 FAQ for small screens (`sm` and below) */}
      <div className="lg:hidden w-full px-6 py-12 text-center">
        <h1 className="font-bold text-[28px] text-[#FFFFFF] pb-4">FAQ</h1>
        <p className="text-[16px] text-[#BCBCBC] font-semibold pb-6">
          Frequently Asked Questions
        </p>

        {/* Questions in mobile mode */}
        {[
          togglefirstfaq,
          togglesecondfaq,
          togglethirdfaq,
          togglefourthfaq,
          togglefiftfaq,
        ].map((toggle, index) => (
          <div
            key={index}
            className="w-full border-[#C3C3C3] border rounded-lg mb-6 p-4 bg-[#334155]"
          >
            <div
              className="w-full flex items-center space-x-4 cursor-pointer"
              onClick={toggle}
            >
              <Image alt="icon" src={faqsearch} width={20} height={20} />
              <h1 className="text-[#FFFFFF] text-[16px]">
                How secure are the certificates issued via AttenSys?
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
