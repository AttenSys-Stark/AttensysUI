import React, { useState } from "react";
import Image from "next/image";
import tdesign_video from "../../assets/tdesign_video.svg";
import ReactPlayer from "react-player";

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
}

const Lectures = ({ lectures, courseData, learningObj }: LectureData) => {
  const [durations, setDurations] = useState<{ [key: number]: number }>({});

  const handleDuration = (id: number, duration: number) => {
    // Set the duration for the specific video ID
    setDurations((prevDurations) => ({
      ...prevDurations,
      [id]: duration,
    }));
  };

  return (
    <div className="block sm:grid grid-cols-2 gap-4">
      <div className="lg:py-6 sm:py-12  order-last sm:order-first">
        <h2 className="block xl:hidden">Lectures in this course (2)</h2>
        {courseData.courseCurriculum?.map((item: any, id: any) => (
          <div key={id} className="block sm:flex py-3">
            <div className="flex-3 border-4 border w-48 h-24">
              {item.video && (
                <ReactPlayer
                  url={`https://${item.video}`}
                  controls
                  light={true}
                  playing={false} // Auto-play next video
                  // onEnded={handleVideoEnd} // Trigger when video ends
                  width="100%"
                  height="100px"
                  onDuration={(duration) => handleDuration(id, duration)}
                />
              )}
            </div>

            <div className="sm:mx-10 mb-5 flex-1">
              <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px] my-2">
                {item.name}
                <span className="text-[#5801A9] ml-3">
                  ({durations[id]?.toFixed(2)} mins)
                </span>
              </h4>

              <p className="font-light text-[14px] text-[#333333] leading-[22px] h-[68px] ">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 hidden xl:block">
        <div className="  text-[#333333] text-[14px] font-light leading-[22px]">
          <p>{learningObj}</p>
        </div>

        <div className="py-5">
          <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px]">
            Student Requirements
          </h4>

          {/* <ul className="list-disc mx-6 mt-4 text-[#333333] text-[14px] font-light leading-[22px]">
            <li>A computer with internet access</li>
            <li>Basic computer skills</li>
            <li>Willingness to learn and experiment</li>
          </ul> */}
          <div>
            <p>{courseData?.studentRequirements}</p>
          </div>
        </div>

        <div className="py-5">
          <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px]">
            {" "}
            Target Audience
          </h4>

          {/* <ul className="list-disc mx-6 mt-4 text-[#333333] text-[14px] font-light leading-[22px]">
            <li>Beginners interested in web development</li>
            <li>Aspiring web developers looking to start their journey</li>
            <li>Anyone wanting to create their own websites</li>
          </ul> */}

          <div>
            <p>{courseData?.targetAudience}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lectures;
