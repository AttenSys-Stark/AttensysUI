import React, { useEffect, useRef, useState } from "react";
import Heading from "@/components/organization/Heading";
import Panel from "@/components/organization/Panel";
import { createbootcampoverlay } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import Userbootcamps from "./Userbootcamps";
import Registered from "./Registered";

const Explorebootcampdetails = () => {
  return (
    <div className="h-auto bg-[#f5f8fa] relative pb-8">
      <Heading />
      <Panel />
      <Userbootcamps />
      <Registered />
    </div>
  );
};

export default Explorebootcampdetails;
