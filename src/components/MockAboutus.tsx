import React, { useState } from "react";
import Animation from "@/components/Animation";
import Logo from "@/assets/Attensys.png";
import Image from "next/image";

const MockAboutus = () => {
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);

  const [isorgOpen, setIsorgOpen] = useState(false);
  const [isexplorerOpen, setIsExplorerOpen] = useState(false);

  const toggleCourse = () => {
    setIsCourseOpen(!isCourseOpen);
  };
  const toggleEvent = () => {
    setIsEventOpen(!isEventOpen);
  };

  const toggleOrg = () => {
    setIsorgOpen(!isorgOpen);
  };
  const toggleExplorer = () => {
    setIsExplorerOpen(!isexplorerOpen);
  };

  return (
    <div>
      {" "}
      <h1 className="text-4xl text-[#2D3A4B] font-bold text absolute mx-10 my-10">
        Atten<span className="text-[#9B51E0]">Sys</span>
      </h1>
      <div className="lg:flex sm:inline-block">
        <Animation />
        <div className="bg-[#9B51E0] lg:w-[60%] h-auto flex flex-col justify-center text-white p-8">
          <h1 className="border border-white p-4 inline-block text-center text-2xl mb-6">
            About us - AttenSys
          </h1>
          <p className="text-justify">
            Transforming education & events with blockchain. Organize bootcamps,
            manage courses, track attendance, & issue verifiable NFT
            certificates. Empower learning, elevate events, & ensure
            certifications last forever. Seamlessly verify certificates, manage
            events attendance alongside proof of attendance for organizers,
            track class attendance for educational institutions, stream free
            courses, and facilitate sponsorships for events and bootcamps
          </p>
          <div className="space-y-2 mt-8 mb-2">
            <h1
              className="font-semibold text-[20px] cursor-pointer"
              onClick={toggleCourse}
            >
              AttenSys Course <span>{isCourseOpen ? "▲" : "▼"}</span>
            </h1>
            {isCourseOpen && (
              <div>
                <div>
                  <h2 className="text-[15px] font-semibold">
                    Monetize Your Expertise With AttenSys Course
                  </h2>
                  <p className="text-[12px] text-justify">
                    Are you a course creator ready to share your expertise? With
                    AttenSys, you can turn your knowledge into income, teaching
                    what you love. Whether you are a seasoned professional or a
                    passionate enthusiast, AttenSys helps you reach learners
                    worldwide, offering a platform to grow your influence and
                    generate revenue. Join us and let your skills shape others
                    futures!
                  </p>
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold">
                    Unlock New Career Opportunities with AttenSys Course
                  </h2>
                  <p className="text-[12px] text-justify">
                    For those looking to learn, AttenSys offers a pathway to new
                    career horizons. Whether you are aiming to switch fields or
                    advance in your current role, our courses offer globally
                    recognized, blockchain-backed credentials that set you
                    apart. Dive into learning, get certified, and open doors in
                    competitive job markets with AttenSys.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 mb-2">
            <h1
              className="font-semibold text-[20px] cursor-pointer"
              onClick={toggleEvent}
            >
              AttenSys Events <span>{isEventOpen ? "▲" : "▼"}</span>
            </h1>
            {isEventOpen && (
              <div>
                <div>
                  <h2 className="text-[15px] font-semibold">
                    Manage, Track & Certify Your Attendees with AttenSys Event
                  </h2>
                  <p className="text-[12px] text-justify">
                    Event organizers, streamline your processes with AttenSys!
                    Manage registrations, track attendance in real-time, and
                    certify participation with NFT certificates—all from one
                    platform. Gain valuable insights to enhance your events and
                    attract sponsors, taking your events to the next level.
                  </p>
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold">
                    Earn Credible Certificates for Attending with AttenSys Event
                  </h2>
                  <p className="text-[12px] text-justify">
                    As an event attendee, turn your participation into a
                    verified achievement. AttenSys provides blockchain-verified
                    certificates for the events you attend, adding value to your
                    professional portfolio. Make every event count with
                    recognition that stands out.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 mb-2">
            <h1
              className=" font-semibold text-[20px] cursor-pointer"
              onClick={toggleOrg}
            >
              AttenSys Organizations <span>{isorgOpen ? "▲" : "▼"}</span>
            </h1>
            {isorgOpen && (
              <div>
                <div>
                  <h2 className="text-[15px] font-semibold">
                    Empower Your Bootcamp with AttenSys Org
                  </h2>
                  <p className="text-[12px] text-justify">
                    For organizations running educational programs, AttenSys
                    makes it easier than ever. Upload class videos, manage
                    attendance, and issue verifiable certificates to
                    students—all within our streamlined platform. Enhance your
                    program’s credibility, attract sponsorship, and provide a
                    seamless educational experience.
                  </p>
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold">
                    Boost Your Skills and Get Certified with AttenSys Org
                  </h2>
                  <p className="text-[12px] text-justify">
                    Learners can join top-tier bootcamps and organizations
                    through AttenSys, gaining access to live and recorded
                    classes, tracking progress, and receiving verified NFT
                    certificates. Develop skills, stand out in the job market,
                    and unlock new opportunities through trusted certification.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 ">
            <h1
              className="font-semibold text-[20px] cursor-pointer"
              onClick={toggleExplorer}
            >
              AttenSys Explorer <span>{isexplorerOpen ? "▲" : "▼"}</span>
            </h1>
            {isexplorerOpen && (
              <div>
                <div>
                  <h2 className="text-[15px] font-semibold">
                    Verify Your Certifications Instantly with AttenSys Explorer
                  </h2>
                  <p className="text-[12px] text-justify">
                    Keep all your credentials in one place with the AttenSys
                    Explorer. With our blockchain-verifiable certificates, you
                    can easily search and confirm your achievements anytime,
                    ensuring your qualifications are always secure and
                    accessible.
                  </p>
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold">Our Promise</h2>
                  <p className="text-[12px] text-justify">
                    With AttenSys, your certifications live forever!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockAboutus;
