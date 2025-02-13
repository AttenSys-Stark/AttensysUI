import React, { useState } from "react";
import Image from "next/image";
import story from "@/assets/story.svg";
import live from "@/assets/live.svg";
import { approvedsponsors } from "@/constants/data";
import { Button } from "@headlessui/react";
import key from "@/assets/key.svg";
import location from "@/assets/locationn.svg";
import calendar from "@/assets/calendarr.svg";
import top from "@/assets/top.svg";
import Locator from "./Locator";
import citymap from "@/assets/citymap.svg";
import Modal from "./Modal";
import { modalstatus } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";

const Details = () => {
  const [modalstat, setModalstatus] = useAtom(modalstatus);

  const handleDialog = () => {
    setModalstatus(!modalstat);
  };

  return (
    <>
      {modalstat && <Modal status={modalstat} />}

      <div className="h-full w-full  bg-event-gradient flex items-center mx-auto  justify-center md:pt-[5%] md:pb-[10%] py-[15%]">
        <div className="h-full w-[95%] mx-auto justify-center  lg:w-[80%] md:w-[80%] flex  lg:flex-row flex-col gap-12 ">
          <div className="flex flex-col justify-center">
            <div className=" w-[100%]  lg:w-[380px] h-[350.44px] rounded-lg overflow-hidden relative md:mx-0 mx-auto">
              <Image src={story} alt="story" objectFit="cover" layout="fill" />
            </div>
            <div className=" w-[351px] mx-auto md:w-auto md:mx-0">
              <div className="w-full  h-[2px] border border-[#FFFFFF3D] mt-16"></div>
              <h1 className="mt-8  text-[18px] text-[#FFFFFF] font-semibold leading-[22px]">
                This event is hosted by :
              </h1>

              <div className="mt-4 flex space-x-5 justify-center items-center">
                <div className="w-[49px] h-[49px] rounded-[100%]">
                  <Image src={live} alt="story" objectFit="cover" />
                </div>
                <h1 className="text-[16px] text-[#FFFFFF] font-semibold leading-[22px] w-full">
                  Akinbola Kehinde
                </h1>
              </div>

              <h1 className="text-[18px]  text-[#FFFFFF] font-semibold leading-[22px] mt-8">
                Event sponsors
              </h1>

              {approvedsponsors.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="mt-3 flex space-x-5 justify-center items-center"
                  >
                    <div className="w-[49px] h-[49px] rounded-[100%]">
                      <Image src={data.icon} alt="story" objectFit="cover" />
                    </div>
                    <h1 className="text-[16px] text-[#FFFFFF] font-semibold leading-[22px] w-full">
                      {data.name}
                    </h1>
                  </div>
                );
              })}
              <h1 className="text-[18px] text-[#FFFFFF] font-semibold leading-[22px] mt-8">
                Sponsor this event{" "}
              </h1>
              <p className="md:w-[401px] w-[90%] text-justify mt-2 text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                Showcase your brand and connect with a community eager to learn
                and grow. Sponsor this event on AttenSys to elevate your reach
                and inspire lifelong learners
              </p>

              <Button
                onClick={handleDialog}
                className=" justify-center lg:flex rounded-lg bg-[#9B51E0] py-2 px-4 lg:h-[50px] items-center lg:w-[241px] mt-8 text-sm text-[#FFFFFF] data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
              >
                <div>Sponsor this event</div>
              </Button>
            </div>
          </div>

          <div className="space-y-8   ">
            <div className="md:w-[720px] w-[95%] mx-auto md:mx-0 h-[222px] md:h-[94px] md:flex-row flex-col bg-details-gradient rounded-xl flex  justify-center items-center px-6 lg:mt-0 mt-[10%] gap-4  ">
              <div className="flex gap-4 ">
                <Image src={key} alt="key" />
                <div>
                  <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                    You have been made a manager on this event{" "}
                  </h1>
                  <h1 className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                    Click to manage event{" "}
                  </h1>
                </div>
              </div>
              <Button className=" justify-center lg:flex rounded-lg bg-[#9B51E0] px-4 h-[50px] items-center w-[241px] text-sm text-[#FFFFFF] data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
                <div>Manage this event</div>
              </Button>
            </div>

            <div className="flex space-x-4 lg:px-6 ">
              <Image src={location} alt="location" />
              <div>
                <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                  Shoprite Ikeja City Mall
                </h1>
                <h1 className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                  Ikeja, Lagos
                </h1>
              </div>
            </div>

            <div className="flex space-x-4 lg:px-6 ">
              <Image src={calendar} alt="calendar" />
              <div>
                <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                  Saturday, October 12
                </h1>
                <h1 className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                  8:30 AM - 9:30 AM
                </h1>
              </div>
            </div>

            <div className="md:w-[720px] w-[95%] mx-auto md:mx-0 h-[328px] md:h-[213px] bg-oneclick-gradient rounded-xl flex flex-col justify-center px-6 space-y-4 border-[#FFFFFF7D] border-[1px]">
              <div className="space-y-2 flex justify-between">
                <div>
                  <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                    Register for this event
                  </h1>
                  <p className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                    Your registration requires host approval. Sit tight!!
                  </p>
                </div>
                <Image src={top} alt="moon" />
              </div>
              <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                Welcome, vladamirockz@gmail.com
              </h1>
              <Button className="  justify-center flex rounded-lg bg-[#4A90E2] py-2 px-4 h-[50px] items-center  md:w-[422px] text-sm text-[#FFFFFF] data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
                <div>One click to apply</div>
              </Button>
            </div>

            <div className=" w-[90%] mx-auto md:mx-0">
              <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                About this Event
              </h1>
              <p className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                With a diverse range of courses in areas such as smart contract
                development, NFT creation, and decentralized finance (DeFi),
                Blockchain Academy Pro is the go-to platform for both beginners
                and advanced learners.
              </p>
            </div>

            <div className="md:w-full w-[95%] mx-auto md:mx-0 h-[2px] border border-[#FFFFFF3D] mt-16"></div>

            <div className="md:w-full w-[95%] mx-auto md:mx-0">
              <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                Shoprite Ikeja City Mall
              </h1>
              <p className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                Ikeja, Lagos
              </p>
            </div>

            <div className="md:h-[213px] h-auto md:w-[100%] rounded-xl w-[95%] mx-auto md:mx-0">
              {/* <Locator /> */}
              <Image src={citymap} alt="moon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
