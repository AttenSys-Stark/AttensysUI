"use client";
import {
  bootcampdropdownstatus,
  connectorAtom,
  coursestatusAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { useState } from "react";

import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import Coursedropdown from "@/components/courses/Coursedropdown";
import Detailslanding from "@/components/eventdetails/Detailslanding";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const params = useParams();
  const details = params.details;
  const [connector] = useAtom(connectorAtom);

  const [connectorDataAccount] = useState<null | any>(
    connector?.wallet.account,
  );

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  return (
    <div onClick={handlePageClick}>
      {status && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      {bootcampdropstat && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      <div onClick={(e) => e.stopPropagation()}>
        <Coursedropdown />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Bootcampdropdown />
      </div>
      <Detailslanding
        connectorDataAccount={connectorDataAccount}
        name={details}
      />
    </div>
  );
};

export default Index;
