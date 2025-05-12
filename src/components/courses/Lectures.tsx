import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import tdesign_video from "../../assets/tdesign_video.svg";
import ReactPlayer from "react-player";
import { PinataSDK } from "pinata";

interface Lecture {
  img: string;
  title: string;
  desc: string;
  timing: number;
}

interface LectureData {
  lectures: Lecture[];
  courseData: any;
  learningObj: string;
  isActivated: boolean;
  handleSwitch: (checked: boolean) => void;
}

const Lectures = ({
  lectures,
  courseData,
  learningObj,
  isActivated,
  handleSwitch,
}: LectureData) => {
  const [durations, setDurations] = useState<{ [key: number]: number }>({});
  const [videoUrls, setVideoUrls] = useState<{ [key: string]: string }>({});

  const handleDuration = (id: number, duration: number) => {
    // Set the duration for the specific video ID
    setDurations((prevDurations) => ({
      ...prevDurations,
      [id]: duration,
    }));
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  function extractCIDFromUrl(ipfsUrl: string): string {
    const parts = ipfsUrl.split("/");
    const cid = parts[parts.length - 1];
    return cid.split("?")[0].split(".")[0];
  }

  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
  });

  const createAccess = useCallback(
    async (cid: string, expires: number = 86400) => {
      try {
        const formattedCid = extractCIDFromUrl(cid);
        const accessUrl = await pinata.gateways.private.createAccessLink({
          cid: formattedCid,
          expires,
        });
        return accessUrl;
      } catch (err) {
        console.error("Error creating access link:", err);
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    // Pre-fetch all video URLs when component mounts or courseCurriculum changes
    const fetchUrls = async () => {
      const curriculum = courseData.courseCurriculum || [];
      const urls: { [key: string]: string } = {};

      for (const item of curriculum) {
        try {
          const url = await createAccess(item.video);
          if (url) {
            urls[item.video] = url;
          }
        } catch (error) {
          console.error(`Error fetching URL for ${item.video}:`, error);
        }
      }

      setVideoUrls(urls);
    };

    fetchUrls();
  }, [courseData, createAccess]);

  return (
    <div className="block sm:grid grid-cols-2 gap-4 text-justify">
      <div className="lg:py-6 sm:py-12  order-last sm:order-first">
        <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
          {courseData.courseCurriculum
            ?.slice()
            .reverse()
            .map((item: any, id: any) => {
              return (
                <div key={id} className="block sm:flex py-3">
                  <div className="flex-3 border-4 border w-full h-[48%] sm:w-48 sm:h-24">
                    {videoUrls[item.video] && (
                      <ReactPlayer
                        url={videoUrls[item.video]}
                        controls={false}
                        playing={false}
                        width="100%"
                        height="100%"
                        playIcon={<></>}
                      />
                    )}
                  </div>

                  <div className="sm:mx-10 mb-5 flex-1">
                    <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px] my-2">
                      {item.name}
                      {durations[id] && (
                        <span className="text-[#5801A9] ml-3">
                          ({formatDuration(durations[id])})
                        </span>
                      )}
                    </h4>

                    <p className="font-light text-[14px] text-[#333333] leading-[22px] h-[68px] ">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="mt-2 hidden xl:block">
        <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px]">
          Learning Objective
        </h4>
        <div className="  text-[#333333] text-[14px] font-light leading-[22px]">
          <p>{learningObj}</p>
        </div>

        <div className="py-5">
          <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px]">
            Student Requirements
          </h4>
          <div className="text-[#333333] text-[14px] font-light leading-[22px]">
            <p>{courseData?.studentRequirements}</p>
          </div>
        </div>

        <div className="py-5">
          <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px]">
            {" "}
            Target Audience
          </h4>
          <div className="text-[#333333] text-[14px] font-light leading-[22px]">
            <p>{courseData?.targetAudience}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lectures;
