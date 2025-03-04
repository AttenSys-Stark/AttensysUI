import React from "react";
import Image from "next/image";
import placeholder from "@/assets/placeholder.jpg";

const Heading = (props: any) => {
  return (
    <div className="w-full h-[305px]">
      <div className="h-full relative">
        {props.banner ? (
          <Image
            src={props.banner}
            alt="shake"
            className="w-full h-full object-cover"
            layout="fill"
          />
        ) : (
          <Image
            src={placeholder}
            alt="shake"
            className="w-full h-full object-cover"
          />
        )}
        <div className="h-[189px] w-[189px] rounded-full absolute z-20 bottom-[-25%] left-12">
          {props.logo ? (
            <Image
              src={props.logo}
              alt="logo"
              className="w-full h-full object-cover rounded-full"
              layout="fill"
            />
          ) : (
            <Image
              src={placeholder}
              alt="logo"
              className="w-full h-full object-cover rounded-full"
              width={189} // Specify width
              height={189} // Specify height
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Heading;
