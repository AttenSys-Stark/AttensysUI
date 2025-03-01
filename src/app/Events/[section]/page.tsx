"use client";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import Coursedropdown from "@/components/courses/Coursedropdown";
import Eventslanding from "@/components/events/Eventslanding";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import {
  bootcampdropdownstatus,
  connectorAtom,
  connectorDataAtom,
  coursestatusAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useState } from "react";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const params = useParams();
  const section = params.section;

  const [connector] = useAtom(connectorAtom);

  const [connectorDataAccount] = useState<null | any>(
    connector?.wallet.account,
  );

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  return (
    <div className="overflow-x-hidden" onClick={handlePageClick}>
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
      <Eventslanding
        connectorDataAccount={connectorDataAccount}
        section={section}
      />
    </div>
  );
};

export default Index;
