import React from "react";
import Info from "./Info";
import Notifcation from "./Notifcation";
import MybootcampInfo from "./MybootcampInfo";

const MybootcampLanding = () => {
  return (
    <div className="h-auto w-full bg-[#F5F7FA] pb-8">
      <div className={`bg-[url('/mybootcampbg.png')] w-full h-[222px]`}></div>
      <Info />
      <Notifcation />
      <MybootcampInfo />
    </div>
  );
};

export default MybootcampLanding;
