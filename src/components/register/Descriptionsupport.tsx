import React from "react";

const Descriptionsupport = (prop: any) => {
  return (
    <div className="mt-4 w-full flex flex-col space-y-4 max-w-[96%] mx-auto h-auto px-2 sm:px-4 py-8">
      <h1 className="text-md text-[#2D3A4B] font-semibold">
        Bootcamp description
      </h1>
      <p className="text-sm text-[#2D3A4B] font-light w-full flex-none text-justify">
        {prop.bootcampDescription}
      </p>
      <div className="space-y-2">
        <h1 className="text-md text-[#2D3A4B] font-semibold">
          Support and resources
        </h1>
        <p className="text-sm text-[#2D3A4B] font-light">
          For more enquires contact us on Telegram: @XCODElaunch24
          <br /> X : @thexcodelaunch
        </p>
      </div>
    </div>
  );
};

export default Descriptionsupport;
