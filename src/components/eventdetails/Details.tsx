import calendar from "@/assets/calendarr.svg";
import citymap from "@/assets/citymap.svg";
import key from "@/assets/key.svg";
import live from "@/assets/live.svg";
import location from "@/assets/locationn.svg";
import top from "@/assets/top.svg";
import { provider } from "@/constants";
import { approvedsponsors } from "@/constants/data";
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import { modalstatus } from "@/state/connectedWalletStarknetkitNext";
import { Button, Field, Input } from "@headlessui/react";
import { useAtom } from "jotai";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Contract } from "starknet";
import Modal from "./Modal";

import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { decimalToHexAddress, FormatDateFromUnix } from "@/utils/formatAddress";
import clsx from "clsx";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { pinata } from "../../../utils/config";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useAccount } from "@starknet-react/core";

const Details = (props: any) => {
  const { connectorDataAccount } = props;
  const [eventData, seteventData] = useState<any | null>(null);
  const [modalstat, setModalstatus] = useAtom(modalstatus);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logoImagesource, setLogoImage] = useState<string | StaticImport>("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [eventName, setEventName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ifsuccess, setifsuccess] = useState(false);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [walletAddress, setWalletAddress] = useState<string | undefined>("");
  const [alluserRegisterevent, setalluserRegisterevent] = useState([]);
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();
  const params = useParams();
  const formatedParams = decodeURIComponent(params["details"] as string);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { account, address: accountAddress } = useAccount();

  const eventContract = useMemo(
    () => new Contract(attensysEventAbi, attensysEventAddress, provider),
    [],
  );

  const altfetchUserRegisteredEvent = async () => {
    const eventContract = new Contract(
      attensysEventAbi,
      attensysEventAddress,
      provider,
    );
    const res =
      await eventContract.get_all_list_registered_events(accountAddress);
    // setalluserRegisterevent(res);
    res.map((data: any, index: any) => {
      if (Number(data.event_id) == Number(id)) {
        setifsuccess(true);
      } else {
        setifsuccess(false);
      }
    });
  };

  const obtainCIDdata = async (CID: string) => {
    try {
      //@ts-ignore
      const data = await fetchCIDContent(CID);
      //@ts-ignore
      const logoData: GetCIDResponse = await fetchCIDContent(
        //@ts-ignore
        data?.data?.eventDesign,
      );
      const objectURL = URL.createObjectURL(logoData.data as Blob);
      setLogoImage(objectURL);

      //@ts-ignore
      setDescription(data?.data?.description);

      //@ts-ignore
      setAddress(data?.data?.location);
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
      throw error;
    }
  };

  const getEventData = useCallback(async () => {
    setIsLoading(true);

    try {
      //This is calling the get_event_details function from the contract using an hardcoded event_identifier value of 1
      const res = await eventContract.get_event_details(Number(id));

      if (res) {
        seteventData(res);
        setEventName(res?.event_name);
        obtainCIDdata(res.event_uri);
      }
    } catch (error) {
      console.error("get_event_details error", error);
    } finally {
      setIsLoading(false);
    }
  }, [eventContract]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        altfetchUserRegisteredEvent();
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [wallet]);

  useEffect(() => {
    getEventData();
  }, [getEventData, formatedParams]);

  useEffect(() => {
    setWalletAddress(accountAddress);
  }, [wallet]);

  const handleDialog = () => {
    setModalstatus(!modalstat);
  };

  const handleRegisterEvent = async () => {
    if (fullname == "") {
      setNameError(true);
    }
    if (email == "") {
      setEmailError(true);
    }

    if (fullname != "" && email != "") {
      setIsRegistering(true);
      const attendeeDataUpload = await pinata.upload.json({
        student_name: fullname,
        student_email: email,
      });
      if (attendeeDataUpload) {
        try {
          const eventContract = new Contract(
            attensysEventAbi,
            attensysEventAddress,
            account,
          );

          const registerEventCall = eventContract.populate(
            "register_for_event",
            [Number(id), attendeeDataUpload.IpfsHash],
          );

          const result = await eventContract.register_for_event(
            registerEventCall.calldata,
          );

          //@ts-ignore
          await account?.provider.waitForTransaction(result.transaction_hash);

          try {
            const response = await fetch(
              "https://attensys-1a184d8bebe7.herokuapp.com/api/register",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, walletAddress, id, eventName }),
              },
            );

            if (response.ok) {
              setifsuccess(true);
            } else {
              alert("Registration failed. Please try again.");
            }
          } catch (err) {
            console.error("Error during registration:", err);
            alert("An error occurred. Please try again.");
          }
        } catch (error) {
          setIsRegistering(false);
          console.error("Error registering for event:", error);
        } finally {
          setIsRegistering(false);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className=" h-full flex items-center justify-center">
        <LoadingSpinner size="lg" colorVariant="primary" />
      </div>
    );
  }

  const shortenAddress = (address: string) => {
    if (!address) return "unavailable";
    return `${address.slice(0, 8)}...${address.slice(-10)}`;
  };

  const splitAddress = (address: string) => {
    const parts = address.split(", ");
    if (parts.length < 3) {
      return { mainAddress: address, city: "" }; // If no proper split, return full as mainAddress
    }
    // Extract last two segments as the city/state
    const city = parts.slice(-2).join(", ");
    // Everything before the last two segments is the main address
    const mainAddress = parts.slice(0, -2).join(", ");
    return { mainAddress, city };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "fullname") {
      setNameError(false);
      setFullName(value);
    } else if (name === "email") {
      setEmailError(false);
      setEmail(value);
    }
  };

  return (
    <>
      {modalstat && <Modal status={modalstat} />}

      <div className="h-full w-full  bg-event-gradient flex items-center mx-auto px-8 justify-between md:pt-[5%] md:pb-[10%] py-[15%]">
        <div className="h-full w-full md:max-w-[95%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-8 items-start">
          <div className="w-full col-span-1 flex flex-col space-y-8">
            <div className="w-full min-h-[320px] lg:w-[380px] h-auto rounded-lg overflow-hidden relative mx-auto">
              <Image
                src={logoImagesource}
                alt="story"
                objectFit="cover"
                layout="fill"
              />
            </div>
            <h1 className="mt-4 text-[30px] font-bold leading-[40.53px] text-[#FFFFFF] px-4 ">
              {eventData?.event_name ?? "unavailable"}{" "}
            </h1>
            <div className="w-full">
              <div className="w-full h-[2px] border border-[#FFFFFF3D]"></div>
              <h1 className="w-full mt-8 text-[18px] text-[#FFFFFF] font-semibold leading-[22px]">
                This event is hosted by :
              </h1>
              <div className="w-full mt-4 flex px-4 space-x-4 items-center">
                <div className="w-[49px] h-[49px] rounded-[100%]">
                  <Image src={live} alt="story" objectFit="cover" />
                </div>
                <div className="relative group cursor-pointer">
                  <span className="text-white">
                    {shortenAddress(
                      decimalToHexAddress(eventData?.event_organizer ?? 0n),
                    )}
                  </span>
                  <span className="w-[90%] break-all absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {decimalToHexAddress(eventData?.event_organizer ?? 0n)}
                  </span>
                </div>
              </div>

              <h1 className="text-[18px]  text-[#FFFFFF] font-semibold leading-[22px] mt-8">
                Event sponsors
              </h1>

              {approvedsponsors.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="mt-3 flex space-x-5 justify-center items-center"
                  >
                    <div className="w-[49px] h-[49px] rounded-[100%]">
                      <Image src={data.icon} alt="story" objectFit="cover" />
                    </div>
                    <h1 className="text-[16px] text-[#FFFFFF] font-semibold leading-[22px] w-full">
                      {data.name}
                    </h1>
                  </div>
                );
              })}
              <h1 className="text-[18px] text-[#FFFFFF] font-semibold leading-[22px] mt-8">
                Sponsor this event{" "}
              </h1>
              <p className="w-full text-justify mt-2 text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                Showcase your brand and connect with a community eager to learn
                and grow. Sponsor this event on AttenSys to elevate your reach
                and inspire lifelong learners
              </p>

              <Button
                onClick={handleDialog}
                className="w-auto justify-center lg:flex rounded-lg bg-[#9B51E0] py-2 px-8 lg:h-[50px] items-center lg:w-[240px] mt-8 text-sm text-[#FFFFFF] data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
              >
                <div>Sponsor this event</div>
              </Button>
            </div>
          </div>

          <div className="w-full col-span-1 flex flex-col space-y-8">
            <div className="w-full mx-auto md:mx-0 h-auto py-6 md:flex-row flex-col bg-details-gradient rounded-xl flex justify-center items-center px-6 lg:mt-0 mt-[10%] gap-4">
              <div className="flex justify-center lg:justify-start gap-4 w-full">
                <Image src={key} alt="key" />
                <div>
                  <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                    You have been made a manager on this event{" "}
                  </h1>
                  <h1 className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                    Click to manage event{" "}
                  </h1>
                </div>
              </div>
              <Button className="justify-end flex-none lg:flex rounded-lg bg-[#9B51E0] px-4 h-[50px] items-center w-auto text-sm text-[#FFFFFF] data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
                <div>Manage this event</div>
              </Button>
            </div>

            <div className="flex space-x-4 lg:px-6 items-center">
              <Image src={location} alt="location" />
              <div>
                <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                  {splitAddress(address).mainAddress}
                </h1>
                <h1 className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                  {splitAddress(address).city}
                </h1>
              </div>
            </div>

            <div className="flex space-x-4 lg:px-6 ">
              <Image src={calendar} alt="calendar" />
              <div>
                <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                  {FormatDateFromUnix(eventData?.time.start_time ?? 0n).date ??
                    "unavailable"}
                </h1>
                <h1 className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                  {FormatDateFromUnix(eventData?.time.start_time ?? 0n).time ??
                    "unavailable AM"}{" "}
                  -{" "}
                  {FormatDateFromUnix(eventData?.time.end_time ?? 0n).time ??
                    "unavailable AM"}
                </h1>
              </div>
            </div>

            <div className="w-full py-12 h-auto bg-oneclick-gradient rounded-xl flex flex-col justify-center px-6 space-y-4 border-[#FFFFFF7D] border-[1px]">
              {!ifsuccess ? (
                <div>
                  <div className="space-y-2 flex justify-between">
                    <div>
                      <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                        Register for this event
                      </h1>
                      <p className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                        After registration confirmation email will be sent to
                        your inbox. Sit tight!!
                      </p>
                    </div>
                    <Image src={top} alt="moon" />
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <h1 className="text-md text-[#FFFFFF] font-light">
                        Full name
                      </h1>
                      <Field>
                        <Input
                          placeholder="Enter your name"
                          name="fullname"
                          value={fullname}
                          onChange={handleInputChange}
                          className={clsx(
                            "h-[55px] border-[2px] border-[#D0D5DD] block w-full rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/100",
                          )}
                        />
                      </Field>
                      {nameError && (
                        <h1 className="text-red-700 text-[13px] font-light leading-[22px] ml-4">
                          Name cannot be empty
                        </h1>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <h1 className="text-md text-[#FFFFFF] font-light">
                        Email Address
                      </h1>
                      <Field>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          name="email"
                          value={email}
                          onChange={handleInputChange}
                          className={clsx(
                            "h-[55px] border-[2px] border-[#D0D5DD] block w-full rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/100",
                          )}
                        />
                      </Field>
                      {emailError && (
                        <h1 className="text-red-700 text-[13px] font-light leading-[22px] ml-4">
                          email cannot be empty
                        </h1>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={!isRegistering ? handleRegisterEvent : undefined}
                    disabled={isRegistering}
                    className={`justify-center mt-4 flex rounded-lg py-2 px-8 h-[50px] items-center w-auto md:w-[320px] text-sm text-[#FFFFFF] data-[hover]:bg-sky-500 data-[active]:bg-sky-700 ${
                      isRegistering
                        ? " bg-[#357ABD] cursor-not-allowed"
                        : "bg-[#4A90E2]"
                    }`}
                  >
                    {isRegistering ? (
                      <LoadingSpinner size="sm" colorVariant="white" />
                    ) : (
                      "One click to apply"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col items-center justify-center">
                  <h2 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                    Thank you for registering!
                  </h2>
                  <p className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                    Check your email for the confirmation QR code.
                  </p>
                </div>
              )}
            </div>

            <div className="w-full">
              <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                About this Event
              </h1>
              <p className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                {description}
              </p>
            </div>

            <div className="w-full h-[2px] border border-[#FFFFFF3D] mt-16"></div>

            <div className="w-full">
              <h1 className="text-[#FFFFFF] text-[16px] font-semibold leading-[22px]">
                {splitAddress(address).mainAddress}
              </h1>
              <p className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
                {splitAddress(address).city}
              </p>
            </div>

            <div className="h-auto w-full rounded-xl mx-auto md:mx-0">
              {/* <Locator /> */}
              <Image src={citymap} alt="moon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
