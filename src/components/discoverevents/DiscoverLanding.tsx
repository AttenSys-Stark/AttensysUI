import React from "react";
import TopdiscoverSection from "./TopdiscoverSection";
import Backgroundsection from "./Backgroundsection";
import Timesection from "./Timesection";
import Highlight from "./Highlight";
import Allevents from "./Allevents";

const DiscoverLanding = () => {
  return (
    <div className=" w-full bg-event-gradient">
      <TopdiscoverSection />
      <Backgroundsection />
      <Timesection />
      <Highlight />
      <Allevents />
    </div>
  );
};

export default DiscoverLanding;
