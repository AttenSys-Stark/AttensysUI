"use client";
import add from "@/assets/add.svg";
import calenderimage from "@/assets/calendar.svg";
import ticket from "@/assets/ticket.svg";
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import {
  createEventClickAtom,
  createorexplore,
  eventcreatedAtom,
  eventregistedAtom,
  existingeventCreationAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { Button, Description, Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Contract } from "starknet";
import { pinata } from "../../../utils/config";
import Eventcard from "./Eventcard";
import { useWallet } from "@/hooks/useWallet";
import { provider } from "@/constants";

const Myevents = (props: any) => {
  const [isSubmitting, setisSubmitting] = useState(false);
  const { wallet, session, sessionAccount, sessionKeyMode } = useWallet();
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftSymbol, setNftSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    eventName: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    nftName: "",
    nftSymbol: "",
    location: "",
    description: "",
    file: "",
  });
  const [createdstat, setCreatedStat] = useAtom(eventcreatedAtom);
  const [Regstat, setRegStat] = useAtom(eventregistedAtom);
  const [existingeventStat, setexistingeventStat] = useAtom(
    existingeventCreationAtom,
  );
  const [CreateeventClickStat, setCreateeventClickStat] =
    useAtom(createEventClickAtom);
  const [CreateorExplorestat, setCreateorExplorestat] =
    useAtom(createorexplore);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    // Trigger the file input on image click
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg")
    ) {
      const objectUrl = URL.createObjectURL(file);

      setImageUrl(objectUrl);

      setSelectedFile(file);
      setErrors((prev) => ({ ...prev, file: "" }));
      console.log("Selected file:", file);
    } else {
      setSelectedFile(null);
      setErrors((prev) => ({
        ...prev,
        file: "Please select a valid image file (JPEG, JPG, or PNG).",
      }));
    }
  };

  const height = props.section === "createevent" ? "900px" : "630px";
  const handlecreatedEventStat = () => {
    setCreatedStat(true);
    setRegStat(false);
    sessionStorage.setItem("scrollPosition", `${window.scrollY}`);
    router.push("/Events/createdevent");
  };
  const handleRegEventStat = () => {
    setCreatedStat(false);
    setRegStat(true);
    sessionStorage.setItem("scrollPosition", `${window.scrollY}`);
    router.push("/Events/registeredevent");
  };

  const handleCreateEventClick = () => {
    setCreateeventClickStat(true);
    sessionStorage.setItem("scrollPosition", `${window.scrollY}`);
    router.push("/Events/createevent");
  };

  const convertToUnixTimeStamp = (date: string, time: string) => {
    // Combine date and time into a single string
    const datetimeString = `${date}T${time}:00Z`; // Assume UTC

    // Convert to a Unix timestamp (seconds)
    const unixTimestamp = Math.floor(new Date(datetimeString).getTime() / 1000);

    return unixTimestamp;
  };

  const handleCreateEventButton = async () => {
    console.log("Here");

    // Validate form inputs
    const newErrors = {
      eventName: !eventName.trim() ? "Event name is required" : "",
      startDate: !startDate ? "Start date is required" : "",
      startTime: !startTime ? "Start time is required" : "",
      endDate: !endDate ? "End date is required" : "",
      endTime: !endTime ? "End time is required" : "",
      nftName: !nftName ? "Nft name is required" : "",
      nftSymbol: !nftSymbol ? "Nft symbol is required" : "",
      location: !location.trim() ? "Location is required" : "",
      description: !description.trim() ? "Description is required" : "",
      file: !selectedFile ? "Event image is required" : "",
    };

    // Time validation
    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) return;

    setisSubmitting(true);

    try {
      // Upload event image
      const eventDesignUpload = await pinata.upload.file(selectedFile!);

      // Upload event metadata
      const Dataupload = await pinata.upload.json({
        name: eventName,
        startday: startDate,
        endday: endDate,
        starttime: startTime,
        endtime: endTime,
        location: location,
        nftname: nftName,
        nftsymbol: nftSymbol,
        description: description,
        eventDesign: eventDesignUpload.IpfsHash,
      });

      if (!Dataupload) {
        throw new Error("Failed to upload event metadata to Pinata");
      }

      // Initialize contract
      const eventContract = new Contract(
        attensysEventAbi,
        attensysEventAddress,
        provider,
      );
      const startdateandtime = convertToUnixTimeStamp(startDate, startTime);
      const enddateandtime = convertToUnixTimeStamp(endDate, endTime);

      if (!wallet?.account) {
        throw new Error("Wallet not connected");
      }

      // Prepare calldata
      const createEventCall = eventContract.populate("create_event", [
        wallet?.account?.address,
        eventName,
        Dataupload.IpfsHash,
        nftName,
        nftSymbol,
        startdateandtime,
        enddateandtime,
        true,
      ]);

      let result: { transaction_hash: string };

      // Use session account if present
      if (sessionKeyMode && session && sessionAccount) {
        result = await sessionAccount.execute([
          {
            contractAddress: attensysEventAddress,
            entrypoint: "create_event",
            calldata: createEventCall.calldata,
          },
        ]);
      } else {
        result = await wallet.account.execute([
          {
            contractAddress: attensysEventAddress,
            entrypoint: "create_event",
            calldata: createEventCall.calldata,
          },
        ]);
      }

      // Wait for transaction confirmation
      await provider.waitForTransaction(result.transaction_hash);

      // Reset form fields
      setEventName("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      setLocation("");
      setNftName("");
      setNftSymbol("");
      setDescription("");
      setSelectedFile(null);

      router.push(`/Overview/${eventName}/insight`);
    } catch (e) {
      console.error("Error in handleCreateEventButton:", e);
    } finally {
      setisSubmitting(false); // Ensure state is reset in all cases
    }
  };

  const data = [
    {
      today: "Today, Fri 11 Oct, 2024",
      time: "9:00 AM",
      name: "CEX Convention ‘24",
      host: "Selfless hearts Foundation",
      location: "Google Meet",
    },
    {
      today: "Sat 12 Oct, 2024",
      time: "9:00 AM",
      name: "CEX Convention ‘24",
      host: "Selfless hearts Foundation",
      location: "Google Meet",
    },
    {
      today: "Tue 14 Oct, 2024",
      time: "9:00 AM",
      name: "CEX Convention ‘24",
      host: "Selfless hearts Foundation",
      location: "Google Meet",
    },
  ];

  const mockeventcreatedData = [
    {
      today: "Tue 14 Oct, 2024",
      time: "9:00 AM",
      name: "CEX Convention ‘24",
      host: "Selfless hearts Foundation",
      location: "Google Meet",
    },
  ];

  const boiler = () => {
    return (
      <>
        <div className="block sm:flex justify-between sm:w-[90%] mx-auto  h-[100px] items-center px-5 md:px-0 py-4 sm:py-0">
          <h1 className="text-[20px] leading-[39px] font-bold text-[#FFFFFF]">
            My Events
          </h1>
          <div className="hidden sm:flex w-[420px] clg:w-[400px] lclg:w-[350px] space-x-8 items-center">
            <div
              className={`${createdstat && "bg-[#4e556b]"} flex space-x-2 items-center w-[200px] h-[42px] rounded-xl hover:bg-[#4e556b] text-white justify-center cursor-pointer`}
              onClick={handlecreatedEventStat}
            >
              <h1>Created events</h1>
            </div>
            <div className="w-[1px] h-[42px] bg-[#9B51E0]"></div>
            <div
              className={`${Regstat && "bg-[#4e556b]"} flex space-x-3 items-center w-[190px] h-[42px] rounded-xl hover:bg-[#4e556b] text-white justify-center cursor-pointer`}
              onClick={handleRegEventStat}
            >
              <h1>Registered Events</h1>
            </div>
          </div>
        </div>
        <div className="w-[100%] h-[1px] bg-[#7B7B7B8A]"></div>
      </>
    );
  };

  const renderContent = () => {
    switch (props.section) {
      case "createevent":
        {
          setCreateorExplorestat(true);
        }
        return (
          <>
            <div className="h-full sm:w-[85%] mx-auto flex justify-between py-16 flex-col md:flex-row">
              <div className="w-full md:w-[60%]">
                <div className="flex items-center space-x-4">
                  <div className="w-[6px] sm:h-[69px] bg-[#9B51E0]"></div>
                  <div>
                    <h1 className="text-[#FFFFFF] font-bold text-[24px] leading-[39px]">
                      Create an event
                    </h1>
                    <p className="text-[16px] text-[#FFFFFF] font-light leading-[22px]">
                      Tell us more about your event
                    </p>
                  </div>
                </div>
                <div className="md:w-[50%] flex flex-col justify-center w-[90%] mx-auto space-y-8 md:hidden">
                  <h1 className="text-[24px] font-bold text-start text-[#FFFFFF] mt-8">
                    Add an event design
                  </h1>
                  <div className="h-[394.44px] bg-[#3F3E58] border-[#DCDCDC] border-[1px] rounded-xl flex justify-center items-center w-full">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="add"
                        onClick={handleImageClick}
                        className="cursor-pointer"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <Image
                        src={add}
                        alt="add"
                        onClick={handleImageClick}
                        className="cursor-pointer"
                      />
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg, image/jpg, image/png"
                      onChange={handleFileChange}
                      style={{ display: "none" }} // Hide the input
                    />
                  </div>
                </div>
                <div className="w-full max-w-lg px-4">
                  <Input
                    className={clsx(
                      "mt-3 block w-full border-b-[1px] border-white/50 bg-transparent text-[40px] font-bold leading-[83.53px] text-[#FFFFFF]",
                      "placeholder-white/50 focus:border-b-4 focus:border-[#ABADBA] focus:outline-none",
                      errors.eventName && "border-red-500",
                    )}
                    placeholder="Event Name"
                    value={eventName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEventName(e.target.value);
                      setErrors((prev) => ({ ...prev, eventName: "" }));
                    }}
                  />
                  {errors.eventName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.eventName}
                    </p>
                  )}
                </div>
                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="font-medium text-white text-sm/6">
                      Start Day
                    </Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setStartDate(e.target.value);
                        setErrors((prev) => ({ ...prev, startDate: "" }));
                      }}
                      className={clsx(
                        "mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                      )}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.startDate}
                      </p>
                    )}
                  </Field>
                </div>
                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="font-medium text-white text-sm/6">
                      End day
                    </Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setEndDate(e.target.value);
                        setErrors((prev) => ({ ...prev, endDate: "" }));
                      }}
                      className={clsx(
                        "mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                      )}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.endDate}
                      </p>
                    )}
                  </Field>
                </div>
                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="font-medium text-white text-sm/6">
                      Start time
                    </Label>
                    <Input
                      type="time"
                      className={clsx(
                        "mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                        errors.startTime && "border border-red-500",
                      )}
                      value={startTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setStartTime(e.target.value);
                        setErrors((prev) => ({ ...prev, startTime: "" }));
                      }}
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.startTime}
                      </p>
                    )}
                  </Field>
                </div>

                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="font-medium text-white text-sm/6">
                      End Time
                    </Label>
                    <Input
                      type="time"
                      className={clsx(
                        "mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                        errors.endTime && "border border-red-500",
                      )}
                      value={endTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setEndTime(e.target.value);
                        setErrors((prev) => ({ ...prev, endTime: "" }));
                      }}
                    />
                    {errors.endTime && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.endTime}
                      </p>
                    )}
                  </Field>
                </div>

                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="font-medium text-white text-sm/6">
                      Add Event Location
                    </Label>
                    <Description className="text-sm/6 text-white/50">
                      Choose Onsite Location or Virtual link{" "}
                    </Description>
                    <textarea
                      className={clsx(
                        "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white h-20",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 resize-none",
                        errors.location && "border border-red-500",
                      )}
                      value={location}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setLocation(e.target.value);
                        setErrors((prev) => ({ ...prev, location: "" }));
                      }}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.location}
                      </p>
                    )}
                  </Field>
                </div>

                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="font-medium text-white text-sm/6">
                      Add NFT Name
                    </Label>
                    <Description className="text-sm/6 text-white/50">
                      Choose your preferred NFT name
                    </Description>
                    <input
                      value={nftName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNftName(e.target.value);
                        setErrors((prev) => ({ ...prev, nftName: "" }));
                      }}
                      className={clsx(
                        "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white ",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 resize-none",
                      )}
                    />
                    {errors.nftName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.nftName}
                      </p>
                    )}
                  </Field>
                </div>
                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="font-medium text-white text-sm/6">
                      Add NFT Symbol
                    </Label>
                    <Description className="text-sm/6 text-white/50">
                      Choose your preferred NFT Symbol
                    </Description>
                    <input
                      value={nftSymbol}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNftSymbol(e.target.value);
                        setErrors((prev) => ({ ...prev, nftSymbol: "" }));
                      }}
                      className={clsx(
                        "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white ",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 resize-none",
                      )}
                    />
                    {errors.nftSymbol && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.nftSymbol}
                      </p>
                    )}
                  </Field>
                </div>
                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="font-medium text-white text-sm/6">
                      Add Description
                    </Label>
                    <Description className="text-sm/6 text-white/50">
                      A brief description of the event{" "}
                    </Description>
                    <textarea
                      className={clsx(
                        "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white h-36",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 resize-none",
                        errors.description && "border border-red-500",
                      )}
                      value={description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setDescription(e.target.value);
                        setErrors((prev) => ({ ...prev, description: "" }));
                      }}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </Field>
                </div>
              </div>

              <div className="md:w-[50%] flex-col justify-center items-center space-y-8 hidden md:flex">
                <h1 className="w-[422px] text-[24px] font-bold leading-[39px] text-[#FFFFFF]">
                  Add an event design
                </h1>
                <div className="w-[422px] h-[394.44px] bg-[#3F3E58] border-[#DCDCDC] border-[1px] rounded-xl flex justify-center items-center">
                  <Image
                    src={add}
                    alt="add"
                    onClick={handleImageClick}
                    className="cursor-pointer"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/jpg, image/png"
                    onChange={handleFileChange}
                    style={{ display: "none" }} // Hide the input
                  />
                  {errors.file && (
                    <p className="mt-1 text-sm text-red-500">{errors.file}</p>
                  )}
                </div>
                <Button
                  onClick={handleCreateEventButton}
                  className="rounded-lg bg-[#4A90E2] py-2 px-4 lg:h-[50px] items-center lg:w-[422px] text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 justify-center hidden md:flex"
                >
                  Create an Event
                </Button>
              </div>
              <Button
                onClick={handleCreateEventButton}
                disabled={isSubmitting}
                className="flex rounded-lg bg-[#4A90E2] py-2 px-4 lg:h-[50px] items-center lg:w-[422px] text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 justify-center md:hidden w-[90%] mt-10 mx-auto"
              >
                {isSubmitting ? "Creating Event..." : "Create an Event"}
                Create an Event
              </Button>
            </div>
          </>
        );
      case "createdevent":
        {
          setCreatedStat(true);
          setRegStat(false);
          setCreateorExplorestat(false);
        }
        return (
          <>
            {boiler()};
            {!Regstat && !existingeventStat && (
              <div className="h-[400px] w-[70%] flex flex-col mx-auto items-center justify-center mt-5">
                <Image src={calenderimage} alt="calendar" className="mb-10" />
                <p className="mb-10 text-[16px] text-[#FFFFFF] leading-[22px] font-light w-[320px] text-center">
                  You have not created an event.{" "}
                  <span className="font-bold">
                    How about we get you started?
                  </span>
                </p>
                <Button
                  onClick={handleCreateEventClick}
                  className="flex rounded-lg bg-[#4A90E2] py-2 px-4 lg:h-[50px] items-center lg:w-[170px] text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
                >
                  <div className="flex space-x-4 items-center font-semibold text-[16px]">
                    <Image src={ticket} alt="ticket" className="mr-2" />
                  </div>
                  <div>Create an Event</div>
                </Button>
              </div>
            )}
            {existingeventStat && (
              <div className="h-[508px] overflow-y-auto ">
                {mockeventcreatedData.map((dataitem, index) => (
                  <Eventcard
                    key={index}
                    todaydate={dataitem.today}
                    time={dataitem.time}
                    eventname={dataitem.name}
                    host={dataitem.host}
                    location={dataitem.location}
                  />
                ))}
              </div>
            )}
          </>
        );
      case "registeredevent":
        {
          setCreatedStat(false);
          setRegStat(true);
          setCreateorExplorestat(false);
        }
        return (
          <>
            {boiler()};
            <div className="sm:h-[508px] sm:overflow-y-auto md:px-24">
              {data.map((dataitem, index) => (
                <Eventcard
                  key={index}
                  todaydate={dataitem.today}
                  time={dataitem.time}
                  eventname={dataitem.name}
                  host={dataitem.host}
                  location={dataitem.location}
                />
              ))}
            </div>
          </>
        );
      case "events":
        {
          setCreatedStat(true);
          setRegStat(false);
          setCreateorExplorestat(false);
        }
        return (
          <>
            {boiler()};
            {!Regstat && !existingeventStat && (
              <div className="h-[400px] sm:w-[70%] flex flex-col mx-auto items-center justify-center mt-5">
                <Image src={calenderimage} alt="calendar" className="mb-10" />
                <p className="mb-10 text-[16px] text-[#FFFFFF] leading-[22px] font-light text-center">
                  You have not created an event.
                  <span className="font-bold">
                    How about we get you started?
                  </span>
                </p>
                <Button
                  onClick={handleCreateEventClick}
                  className="flex rounded-lg bg-[#4A90E2] py-2 px-4 lg:h-[50px] items-center lg:w-[170px] text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
                >
                  <div className="flex space-x-4 items-center font-semibold text-[16px]">
                    <Image src={ticket} alt="ticket" className="mr-2" />
                  </div>
                  <div>Create an Event</div>
                </Button>
              </div>
            )}
            {existingeventStat && (
              <div className="h-[508px] overflow-y-auto ">
                {mockeventcreatedData.map((dataitem, index) => (
                  <Eventcard
                    key={index}
                    todaydate={dataitem.today}
                    time={dataitem.time}
                    eventname={dataitem.name}
                    host={dataitem.host}
                    location={dataitem.location}
                  />
                ))}
              </div>
            )}
          </>
        );
      default:
        return <p>Error 404</p>;
    }
  };

  useEffect(() => {
    setexistingeventStat(false);
  });

  useEffect(() => {
    const scrollY = sessionStorage.getItem("scrollPosition");
    if (scrollY) {
      window.scrollTo(0, parseFloat(scrollY));
    }
    if (props.section == "events") {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div
      // style={{ height }}
      className="w-[100%] bg-event-gradient my-8 "
    >
      {renderContent()}
    </div>
  );
};

export default Myevents;
