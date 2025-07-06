import React, { useEffect, useRef, useState } from "react";
import { HiMiniCheckBadge } from "react-icons/hi2";
import Image from "next/image";
import classvid from "@/assets/classtsest.svg";
import { IoMdCalendar } from "react-icons/io";
import { GoEye } from "react-icons/go";
import { MdOutlineAssignment } from "react-icons/md";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { MdOutlinePending } from "react-icons/md";
import { AiFillSignature } from "react-icons/ai";
import { PiVideo } from "react-icons/pi";
import ReactPlayer from "react-player/lazy";
import screenfull from "screenfull";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { Contract } from "starknet";
import { pinata } from "../../../utils/config";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { ThreeDots } from "react-loader-spinner";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useConnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";

const CourseOutlinecard = (props: any) => {
  const playerRef = useRef<ReactPlayer | null>(null);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const org = searchParams.get("org");
  const [spinner, setSpinner] = useState(false);
  const [class_attendance_status, setclass_attendance_status] = useState(false);
  const [username, setUsername] = useState<string>();
  const { account, address } = useFirebaseAuth();
  // const { connect, connectors } = useConnect();
  // const controller = connectors[0] as ControllerConnector;

  // useEffect(() => {
  //   if (!address) return;
  //   controller.username()?.then((n) => setUsername(n));
  //   console.log(address, "address");
  // }, [address, controller]);

  const TruncatedText = ({
    text,
    maxLength = 50,
  }: {
    text: string;
    maxLength?: number;
  }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <span>
        {expanded
          ? text
          : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")}
        {text.length > maxLength && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-500 underline ml-1"
          >
            {expanded ? "See Less" : "See More"}
          </button>
        )}
      </span>
    );
  };

  const handleClick = () => {
    if (playerRef.current) {
      // Play/Pause logic
      if (playerRef.current.getInternalPlayer().paused) {
        playerRef.current.getInternalPlayer().play();
      } else {
        playerRef.current.getInternalPlayer().pause();
      }

      // Request fullscreen if supported
      if (screenfull.isEnabled) {
        //@ts-ignore
        screenfull.request(playerRef.current.getInternalPlayer());
      }
    }
  };

  const handleSign = async () => {
    setSpinner(true);
    const organizationContract = new Contract(
      attensysOrgAbi,
      attensysOrgAddress,
      account,
    );
    const sign_calldata = organizationContract.populate(
      "mark_attendance_for_a_class",
      //@ts-ignore
      [org, org, Number(props.classid), id],
    );

    const callContract = await account?.execute([
      {
        contractAddress: attensysOrgAddress,
        entrypoint: "mark_attendance_for_a_class",
        calldata: sign_calldata.calldata,
      },
    ]);
    if (!callContract) {
      throw new Error("Transaction not executed");
    }
    account
      ?.waitForTransaction(callContract?.transaction_hash)
      .then(() => {})
      .catch((e: any) => {
        console.error("Error: ", e);
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const get_attendance_status = async () => {
    const orgContract = new Contract(
      attensysOrgAbi,
      attensysOrgAddress,
      provider,
    );
    let attendance_status = await orgContract.get_class_attendance_status(
      org,
      id,
      Number(props.classid),
      wallet?.selectedAddress,
    );
    console.log("attendance status here", attendance_status);
    setclass_attendance_status(attendance_status);
  };
  useEffect(() => {
    get_attendance_status();
  }, [wallet, spinner]);

  return (
    <div className="flex flex-col xl:flex-row h-auto lg:space-x-8 lg:items-center xl:justify-between xl:h-auto md:items-start md:space-y-4 xl:space-y-0 w-full mt-2 border-b-[1px] border-b-[#ABABAB52] pb-12 xl:pb-6">
      <div className="flex flex-col space-y-2 lg:space-x-8 md:flex-row md:space-x-4 md:space-y-0 items-center">
        <div className="flex items-center  space-x-6 border-[1px] border-[#B8B9BA] rounded-xl">
          <div
            className="lg:h-[126px] lg:w-[188px] rounded-xl cursor-pointer overflow-hidden"
            onClick={handleClick}
          >
            <ReactPlayer
              ref={playerRef}
              url={`https://${props.videolink}`}
              width="100%"
              height="100%"
              className="rounded-xl"
              controls={true} // Adds play/pause controls
              muted={false} // Mute initially to prevent autoplay blocking
              light={props.thumbnail}
              playing={false}
            />
          </div>
        </div>

        <div className="space-y-6 md:space-y-4">
          {/* <div className="w-full flex flex-none space-x-1">
            <div className="py-2 px-2.5 rounded-lg space-x-1 flex items-center justify-center bg-[#2D3A4B]">
              <IoMdCalendar className="h-[14px] w-[14px] md:h-xs md:text-sm md:w-[14px] text-[#FFFFFF]" />
              <h1 className="text-[#FFFFFF] text-sm font-medium">Day 1</h1>
            </div>
            <div className="flex space-x-2 items-center justify-center h-[33px] w-[85px]">
              <GoEye className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] text-[#2D3A4B]" />
              <h1 className="text-xs text-[#2D3A4B] font-medium">301</h1>
            </div>
          </div> */}
          <h1 className="text-[#2D3A4B] text-[14px] leading-[22px] font-bold">
            Topic : {props.topic}
          </h1>
          <h1 className="text-[#2D3A4B] text-[12px] leading-[22px] font-medium">
            <span className="font-bold text-[14px]">Description</span> :{" "}
            <TruncatedText text={props.description} maxLength={220} />
          </h1>
          <h1 className="text-[#2D3A4B] text-[12px] leading-[22px] font-medium">
            <span className="font-bold text-[14px]">Assignment</span> :{" "}
            <TruncatedText text={props.assignment} maxLength={220} />
          </h1>
          <div className="w-full flex flex-wrap md:flex-nowrap md:flex-none md:space-x-4">
            <div
              className="space-x-1 mr-3 md:mr-0 mb-2 flex items-center justify-center flex-none cursor-pointer"
              onClick={handleClick}
            >
              <PiVideo className="text-[#4A90E2] h-[22px] w-[22px]" />
              <h1 className="text-[#4A90E2] text-sm font-medium underline">
                Watch class
              </h1>
            </div>
            {/* <div className="space-x-1 mr-3 md:mr-0 mb-2 flex items-center justify-center flex-none">
              <MdOutlineAssignment className="text-[#9747FF] h-[20px] w-[20px]" />
              <h1 className="text-[#9B51E0] text-sm font-medium underline">
                1 assignment
              </h1>
            </div>
            <div className="space-x-1 mr-3 md:mr-0 mb-2 flex items-center justify-center flex-none">
              <BsFillFileEarmarkSpreadsheetFill className="text-[#9747FF] h-[20px] w-[20px]" />
              <h1 className="text-[#9B51E0] text-sm font-medium underline">
                1 resource
              </h1>
            </div> */}
          </div>
        </div>
      </div>

      <div className="space-y-2 flex-none flex flex-col lg:items-center lg:justify-center md:items-end md:justify-end items-center justify-center">
        {class_attendance_status ? (
          <div className="flex space-x-2 items-center">
            <HiMiniCheckBadge className="h-[22px] w-[22px] text-[#1BA74C]" />
            <h1 className="text-[12px] font-medium text-[#1BA74C]">
              Attendance signed
            </h1>
          </div>
        ) : (
          <div className="py-2 px-4 rounded-xl bg-[#4A90E21F] border-[1px] border-[#4A90E2] space-x-2 flex items-center justify-center">
            {spinner ? (
              <ThreeDots
                visible={true}
                height="20"
                width="40"
                color="#4fa94d"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              <div
                onClick={handleSign}
                className="flex space-x-1 cursor-pointer"
              >
                <AiFillSignature />
                <h1 className="text-xs font-medium text-[#2D3A4B]">
                  Sign attendance
                </h1>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseOutlinecard;
