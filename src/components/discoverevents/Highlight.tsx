import React from "react";
import Image from "next/image";
import { HighlightData } from "@/constants/data";
import Highlightcard from "./Highlightcard";

const Highlight = () => {
  return (
    <div className="mt-24 min-:h-[400px] sm:w-[87%] mx-auto justify-items-center flex flex-wrap justify-between items-center mb-20 gap-5">
      {HighlightData.map((data, index) => {
        return (
          <Highlightcard
            key={index}
            name={data.name}
            image={data.image}
            time={data.time}
          />
        );
      })}
    </div>
  );
};

export default Highlight;
