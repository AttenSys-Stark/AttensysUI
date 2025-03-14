import React, { useState, useEffect } from "react";
import UserSideBar from "../courses/UserSideBar";
import Image from "next/image";
import red_love from "@/assets/red_love.svg";
import love from "@/assets/love.svg";
import { certContent } from "@/constants/data";

const MyCertifications = (props: any) => {
  const [selected, setSelected] = useState("");
  const [page, setPage] = useState("");

  useEffect(() => {
    setPage("myCertificate");
  }, [page]);

  if (selected == "" || selected == "All NFTs") {
    return (
      <div className="lg:flex max-w-screen-2xl xl:mx-auto">
        <UserSideBar
          wallet={props.wallet}
          courseData={props.courseData}
          takenCoursesData={props.takenCoursesData}
          page={page}
          selected={selected}
          setSelected={setSelected}
        />

        <div className="w-full sm:mx-auto px-4 my-12 ">
          {certContent.map((item, i) => (
            <div key={i} className="w-[100%]">
              <h1 className="text-[#A01B9B] font-bold text-2xl">
                {item.heading} ({item.no})
              </h1>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 md:gap-y-8 md:gap-x-3 my-6 ">
                {item.certificates.map((cert, j) => (
                  <div
                    key={j}
                    className="bg-[#FFFFFF] rounded-xl shadow-lg my-4 sm:my-0 w-full "
                  >
                    <div className="relative">
                      <Image
                        src={cert.img}
                        alt={cert.cert_name}
                        className="object-cover w-[100%]"
                      />
                      <div className="bg-white absolute right-3 top-3 flex py-1 px-2 rounded">
                        <Image src={red_love} alt="love" color="red" />
                        <p className="text-xs ml-3">18k</p>
                      </div>
                    </div>

                    <div className="px-8 py-6">
                      <div className="flex justify-between items-center py-1">
                        <h4 className="text-[14px] text-[#333333] font-bold leading-[15px]">
                          {cert.cert_name}
                        </h4>
                        <Image
                          src={love}
                          alt="love"
                          className="h-[12px] w-[13px]"
                        />
                      </div>
                      <div className="flex justify-between my-3">
                        <p className="text-[9px] text-[#333333] font-bold leading-[15px]">
                          Recipient address:{" "}
                        </p>
                        <p className="text-[9px] text-[#A01B9B] font-medium leading-[15px]">
                          {cert.recipient}
                        </p>
                      </div>
                      <div className="flex justify-between my-3">
                        <p className="text-[9px] text-[#333333] font-bold leading-[15px]">
                          Author:{" "}
                        </p>
                        <p className="text-[9px] text-[#333333] font-medium leading-[15px]">
                          {cert.author}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] lg:text-[10px] text-[#333333] font-medium leading-[15px]">
                          {cert.nft_description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row mx-20 my-8">
      <UserSideBar
        wallet={props.wallet}
        courseData={props.courseData}
        takenCoursesData={props.takenCoursesData}
        page={page}
        selected={selected}
        setSelected={setSelected}
      />

      <div className="mx-20 my-12">
        {certContent.map((item, i) =>
          item.type == selected ? (
            <div key={i}>
              <h1 className="text-[#A01B9B] font-bold text-2xl">
                {item.heading} ({item.no})
              </h1>

              <div className="grid lg:grid-cols-3 md:grid-cols-4 lclg:grid-cols-2 gap-8 my-6">
                {item.certificates.map((cert, j) => (
                  <div
                    key={j}
                    className="bg-[#FFFFFF] rounded-xl shadow-lg my-20 sm:my-0 w-[300px]"
                  >
                    <div className="relative">
                      <Image
                        src={cert.img}
                        alt={cert.cert_name}
                        className="object-cover w-[100%]"
                      />
                      <div className="bg-white absolute right-3 top-3 flex py-1 px-2 rounded">
                        <Image src={love} alt="love" color="red" />
                        <p className="text-xs ml-3">18k</p>
                      </div>
                    </div>

                    <div className="px-8 py-6">
                      <div className="flex justify-between items-center py-1">
                        <h4 className="text-[14px] text-[#333333] font-bold leading-[15px]">
                          {cert.cert_name}
                        </h4>
                        <Image
                          src={love}
                          alt="love"
                          className="h-[12px] w-[13px]"
                        />
                      </div>
                      <div className="flex justify-between my-3">
                        <p className="text-[9px] text-[#333333] font-bold leading-[15px]">
                          Recipient address:{" "}
                        </p>
                        <p className="text-[9px] text-[#A01B9B] font-medium leading-[15px]">
                          {cert.recipient}
                        </p>
                      </div>
                      <div className="flex justify-between my-3">
                        <p className="text-[9px] text-[#333333] font-bold leading-[15px]">
                          Author:{" "}
                        </p>
                        <p className="text-[9px] text-[#333333] font-medium leading-[15px]">
                          {cert.author}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] lg:text-[10px] text-[#333333] font-medium leading-[15px]">
                          {cert.nft_description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
};

export default MyCertifications;
