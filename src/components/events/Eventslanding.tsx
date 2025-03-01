import React from "react";
import Discoversection from "./Discoversection";
import Createevents from "./Createevents";
import Myevents from "./Myevents";

const Eventslanding = (props: any) => {
  return (
    <div className="h-auto w-full bg-[#F5F7FA]">
      <Discoversection />
      <Createevents />
      <Myevents
        connectorDataAccount={props.connectorDataAccount}
        section={props.section}
      />
    </div>
  );
};

export default Eventslanding;
