import React from "react";
import Image from "next/image";

interface Lecture {
  img: string;
  title: string;
  desc: string;
  timing: number;
}

interface LectureData {
  lectures: Lecture[];
}

const Lectures = ({ lectures }: LectureData) => {
  return (
    <div className="block sm:grid grid-cols-2 gap-4">
      <div className="lg:py-6 sm:py-12  order-last sm:order-first">
        <h2 className="block sm:hidden">Lectures in this course (2)</h2>
        {lectures.map((item, id) => (
          <div key={id} className="block sm:flex py-3">
            <Image src={item.img} alt="hero" />

            <div className="sm:mx-10 mb-5-">
              <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px] my-2">
                {item.title}
                <span className="text-[#5801A9] ml-3">
                  ({item.timing} mins)
                </span>
              </h4>

              <p className="font-light text-[14px] text-[#333333] leading-[22px] h-[68px] w-[236px]">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="  text-[#333333] text-[14px] font-light leading-[22px]">
          <p>
            {`  This course provides a foundational understanding of web
            development. You'll learn essential skills in HTML and CSS, enabling
            you to create and style your own web pages. No prior experience is
            necessary!`}
          </p>
        </div>

        <div className="py-5">
          <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px]">
            Student Requirements
          </h4>

          <ul className="list-disc mx-6 mt-4 text-[#333333] text-[14px] font-light leading-[22px]">
            <li>A computer with internet access</li>
            <li>Basic computer skills</li>
            <li>Willingness to learn and experiment</li>
          </ul>
        </div>

        <div className="py-5">
          <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px]">
            {" "}
            Target Audience
          </h4>

          <ul className="list-disc mx-6 mt-4 text-[#333333] text-[14px] font-light leading-[22px]">
            <li>Beginners interested in web development</li>
            <li>Aspiring web developers looking to start their journey</li>
            <li>Anyone wanting to create their own websites</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Lectures;
