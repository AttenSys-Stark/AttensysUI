import React, { useEffect } from "react";
import OverviewDiscover from "./OverviewDiscover";
import Tab from "./Tab";
import Content from "./Content";

const OverviewLanding = (props: any) => {
  return (
    <div className="h-auto w-full bg-[#F5F7FA]">
      <OverviewDiscover eventsname={props.eventname} />
      <Tab />
      <Content tabsection={props.tab} />
    </div>
  );
};

export default OverviewLanding;
