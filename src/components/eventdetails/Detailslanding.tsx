import React from "react";
import Eventdetailsdiscover from "@/components/eventdetails/Eventdetailsdiscover";
import Details from "./Details";

const Detailslanding = (props: any) => {
  return (
    <div className="h-auto w-full bg-[#F5F7FA]">
      <Eventdetailsdiscover name={props.name} />
      <Details connectorDataAccount={props.connectorDataAccount} />
    </div>
  );
};

export default Detailslanding;
