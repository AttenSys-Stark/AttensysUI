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
import { FileObject } from "pinata";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Contract } from "starknet";
import { pinata } from "../../../utils/config";
import Eventcard from "./Eventcard";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { decimalToHexAddress, FormatDateFromUnix } from "@/utils/formatAddress";
import LoadingSpinner from "../ui/LoadingSpinner";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";

interface timeProp {
  day: number;
}

const StyledTimePicker = styled(TimePicker)(({ theme }) => ({
  "& .MuiInputBase-root": {
    minWidth: "100px",
    width: "150px",
    [theme.breakpoints.up("lg")]: {
      minWidth: "200px",
      width: "200px",
    },
  },
}));

const Myevents = (props: any) => {
  const { connectorDataAccount } = props;
  const { events, getEvents } = useEvents();
  const [isSubmitting, setisSubmitting] = useState(false);

  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [location, setLocation] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftSymbol, setNftSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const [EventDays, setEventDays] = useState(0);
  const [Eventplatform, setEventPlatform] = useState(3);
  const [allusercreatedevent, setallusercreatedevent] = useState([]);
  const [alluserRegisterevent, setalluserRegisterevent] = useState([]);
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
      setSelectedFile(file);
      setErrors((prev) => ({ ...prev, file: "" }));
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

  const convertToUnixTimeStamp = (date: Dayjs | null, time: Dayjs | null) => {
    if (!date || !time) return 0; // Handle null case

    // Merge date and time correctly (UTC)
    const dateTime = date.hour(time.hour()).minute(time.minute()).second(0);

    // Convert to Unix timestamp
    return dateTime.unix();
  };

  const handleCreateEventButton = async () => {
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

    const eventDesignUpload = await pinata.upload.file(selectedFile!);

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
      numberofdays: EventDays,
      eventplatform: Eventplatform,
    });
    if (Dataupload) {
      const eventContract = new Contract(
        attensysEventAbi,
        attensysEventAddress,
        connectorDataAccount,
      );

      const startdateandtime = convertToUnixTimeStamp(startDate, startTime);

      const enddateandtime = convertToUnixTimeStamp(endDate, endTime);

      const createEventCall = eventContract.populate("create_event", [
        wallet?.account?.address,
        eventName,
        Dataupload.IpfsHash,
        nftName,
        nftSymbol,
        startdateandtime,
        enddateandtime,
        1,
        Dataupload.IpfsHash,
        Eventplatform,
      ]);

      const result = await eventContract.create_event(createEventCall.calldata);
      //@ts-ignore
      connectorDataAccount?.provider
        .waitForTransaction(result.transaction_hash)
        .then(() => {})
        .catch((e: any) => {})
        .finally(() => {
          //Resets all event data input
          setEventName("");
          setStartDate(null);
          setStartTime(null);
          setEndDate(null);
          setEndTime(null);
          setLocation("");
          setNftName("");
          setNftSymbol("");
          setDescription("");
          setSelectedFile(null);
          setEventPlatform(3);
          setEventDays(0);
          setisSubmitting(false);
          router.push("/Events/createdevent");
        });
    }
  };

  const handleCreatedEventCardclick = (eventname: any, eventid: any) => {
    router.push(`/Overview/${eventname}/insight/?id=${eventid}`);
  };

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
        return (
          <>
            <div className="h-full sm:w-[85%] mx-auto flex justify-between py-16 flex-col md:flex-row">
              <div className="w-full md:w-[60%]">
                <div className="flex space-x-4 items-center">
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
                  </div>
                </div>
                <div className="w-full max-w-lg px-4">
                  <Input
                    className={clsx(
                      "mt-3 block w-full border-b-[1px] border-white bg-transparent text-[40px] font-bold leading-[83.53px] text-[#FFFFFF]",
                      "placeholder-white/50 focus:border-b-4 focus:border-white focus:outline-none",
                      errors.eventName && "border-red-500",
                    )}
                    placeholder="Type Event Name Here"
                    value={eventName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEventName(e.target.value);
                      setErrors((prev) => ({ ...prev, eventName: "" }));
                    }}
                  />
                  {errors.eventName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.eventName}
                    </p>
                  )}
                </div>
                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="text-sm/6 font-medium text-white">
                      Select number of days
                    </Label>
                    <div className="flex space-x-4 items-center">
                      <Description className="text-sm/6 text-white/50">
                        The event will last for how many days?
                      </Description>
                      <select
                        className="w-[90px] px-2 py-1 bg-transparent text-white border border-white rounded-md focus:ring-2"
                        onChange={(e) => setEventDays(Number(e.target.value))}
                      >
                        <option value="" disabled selected>
                          days
                        </option>
                        {[...Array(30)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? "day" : "days"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>
                </div>

                {/* Show only Start Date if 1 day is selected */}
                {EventDays === 1 && (
                  <div className="w-full max-w-lg px-4 mt-4">
                    <Field>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="Date"
                            onChange={(date) => {
                              setStartDate(date);
                              setErrors((prev) => ({ ...prev, startDate: "" }));
                              setEndDate(date);
                              setErrors((prev) => ({ ...prev, endDate: "" }));
                            }}
                            sx={{
                              width: "100%",
                              "& .MuiOutlinedInput-root": {
                                color: "white",
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "gray" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "white",
                                },
                              },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiSvgIcon-root": { color: "white" },
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.startDate}
                        </p>
                      )}
                    </Field>
                  </div>
                )}

                {/* Show Start Date and End Date if more than 1 day is selected */}
                {EventDays > 1 && (
                  <>
                    <div className="w-full max-w-lg px-4 mt-4">
                      <Field>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              label="Start date"
                              onChange={(date) => {
                                setStartDate(date);
                                setErrors((prev) => ({
                                  ...prev,
                                  startDate: "",
                                }));
                              }}
                              sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                  color: "white",
                                  "& fieldset": { borderColor: "white" },
                                  "&:hover fieldset": { borderColor: "gray" },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "white",
                                  },
                                },
                                "& .MuiInputLabel-root": { color: "white" },
                                "& .MuiSvgIcon-root": { color: "white" },
                              }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                        {errors.startDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.startDate}
                          </p>
                        )}
                      </Field>
                    </div>

                    <div className="w-full max-w-lg px-4 mt-4">
                      <Field>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              label="End date"
                              onChange={(date) => {
                                setEndDate(date);
                                setErrors((prev) => ({ ...prev, endDate: "" }));
                              }}
                              sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                  color: "white",
                                  "& fieldset": { borderColor: "white" },
                                  "&:hover fieldset": { borderColor: "gray" },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "white",
                                  },
                                },
                                "& .MuiInputLabel-root": { color: "white" },
                                "& .MuiSvgIcon-root": { color: "white" },
                              }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                        {errors.endDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.endDate}
                          </p>
                        )}
                      </Field>
                    </div>
                  </>
                )}
                {EventDays >= 1 && (
                  <div className="w-[70%] flex">
                    <div className="w-full max-w-lg px-4 mt-4">
                      <Field>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["TimePicker"]}>
                            <StyledTimePicker
                              label="Start Time"
                              onChange={(time) => {
                                setStartTime(time);
                                setErrors((prev) => ({
                                  ...prev,
                                  startTime: "",
                                }));
                              }}
                              sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                  color: "white",
                                  "& fieldset": { borderColor: "white" },
                                  "&:hover fieldset": { borderColor: "gray" },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "white",
                                  },
                                },
                                "& .MuiInputLabel-root": { color: "white" },
                                "& .MuiSvgIcon-root": { color: "white" },
                              }}
                              // @ts-expect-error
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </DemoContainer>
                        </LocalizationProvider>

                        {errors.startTime && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.startTime}
                          </p>
                        )}
                      </Field>
                    </div>

                    <div className="w-full max-w-lg px-4 mt-4">
                      <Field>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["TimePicker"]}>
                            <StyledTimePicker
                              label="End Time"
                              onChange={(time) => {
                                setEndTime(time);
                                setErrors((prev) => ({ ...prev, endTime: "" }));
                              }}
                              sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                  color: "white",
                                  "& fieldset": { borderColor: "white" },
                                  "&:hover fieldset": { borderColor: "gray" },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "white",
                                  },
                                },
                                "& .MuiInputLabel-root": { color: "white" },
                                "& .MuiSvgIcon-root": { color: "white" },
                              }}
                              // @ts-expect-error
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                        {errors.endTime && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.endTime}
                          </p>
                        )}
                      </Field>
                    </div>
                  </div>
                )}

                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="text-sm/6 font-medium text-white">
                      Add Event Location
                    </Label>
                    <div className="flex space-x-4 items-center">
                      <Description className="text-sm/6 text-white/50">
                        Choose Onsite Location type{" "}
                      </Description>
                      <div className="flex space-x-4 items-center mt-2">
                        <select
                          className="w-[90px] px-2 py-1 bg-transparent text-white border border-white rounded-md focus:ring-2"
                          onChange={(e) =>
                            setEventPlatform(Number(e.target.value))
                          }
                        >
                          <option value="" disabled selected>
                            Select location type
                          </option>
                          <option value="0">Online</option>
                          <option value="1">Physical</option>
                        </select>
                      </div>
                    </div>
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                    {(Eventplatform === 1 || Eventplatform === 0) && (
                      <>
                        {Eventplatform === 1 ? (
                          <Description className="text-sm/6 text-white/50">
                            Paste physical Location address{" "}
                          </Description>
                        ) : (
                          <Description className="text-sm/6 text-white/50">
                            Paste Virtual Link{" "}
                          </Description>
                        )}
                        <textarea
                          className={clsx(
                            "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white h-20",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 resize-none",
                            errors.location && "border border-red-500",
                          )}
                          value={location}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>,
                          ) => {
                            setLocation(e.target.value);
                            setErrors((prev) => ({ ...prev, location: "" }));
                          }}
                        />
                        {errors.location && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.location}
                          </p>
                        )}
                      </>
                    )}
                  </Field>
                </div>

                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="text-sm/6 font-medium text-white">
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.nftName}
                      </p>
                    )}
                  </Field>
                </div>
                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="text-sm/6 font-medium text-white">
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.nftSymbol}
                      </p>
                    )}
                  </Field>
                </div>
                <div className="w-full max-w-lg px-4 mt-4">
                  <Field>
                    <Label className="text-sm/6 font-medium text-white">
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
                      <p className="text-red-500 text-sm mt-1">
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
                    <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                  )}
                </div>
                <Button
                  onClick={handleCreateEventButton}
                  disabled={isSubmitting}
                  className={`rounded-lg py-2 px-4 lg:h-[50px] items-center lg:w-[422px] text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 justify-center hidden md:flex ${
                    isSubmitting
                      ? "bg-[#357ABD] cursor-not-allowed"
                      : "bg-[#4A90E2]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner
                        size="sm"
                        colorVariant="white"
                        text="Creating Event"
                      />
                    </>
                  ) : (
                    "Create an Event"
                  )}
                </Button>
              </div>

              <Button
                onClick={handleCreateEventButton}
                disabled={isSubmitting}
                className={`flex rounded-lg py-2 px-4 lg:h-[50px] items-center lg:w-[422px] text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 justify-center md:hidden w-[90%] mt-10 mx-auto ${
                  isSubmitting
                    ? "bg-[#357ABD] cursor-not-allowed"
                    : "bg-[#4A90E2]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner
                      size="sm"
                      colorVariant="white"
                      text="Creating Event"
                    />
                  </>
                ) : (
                  "Create an Event"
                )}
              </Button>
            </div>
          </>
        );
      case "createdevent":
        return (
          <>
            {boiler()};
            {allusercreatedevent?.length === 0 ? (
              <div className="h-[500px] pb-10 mb-12 w-[70%] flex flex-col mx-auto items-center justify-center mt-5">
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
            ) : (
              <div className="sm:h-[650px] sm:overflow-y-auto md:px-24">
                <div className="h-[650px] overflow-y-auto">
                  {allusercreatedevent.map((dataitem: any, index: any) => (
                    <Eventcard
                      key={index}
                      time={dataitem.time}
                      eventname={dataitem.event_name}
                      host={dataitem.event_organizer}
                      uri={dataitem.event_uri}
                      eventid={dataitem.event_id}
                      organizers={dataitem.event_organizer}
                      property="createdevent"
                      onClick={() =>
                        handleCreatedEventCardclick(
                          dataitem.event_name,
                          dataitem.event_id,
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        );
      case "registeredevent":
        return (
          <>
            {boiler()};
            <div className="sm:h-[600px] sm:overflow-y-auto md:px-24">
              {alluserRegisterevent?.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-[20px] leading-[39px] font-bold text-[#FFFFFF]">
                  No registered events
                </div>
              ) : (
                alluserRegisterevent.map((dataitem: any, index: number) => (
                  <Eventcard
                    key={index}
                    time={dataitem.time}
                    eventname={dataitem.event_name}
                    host={dataitem.event_organizer}
                    uri={dataitem.event_uri}
                    eventid={dataitem.event_id}
                    organizers={dataitem.event_organizer}
                    property="registeredevent"
                  />
                ))
              )}
            </div>
          </>
        );
      case "events":
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
                {events.map((dataitem, index) => (
                  <Link
                    key={index}
                    href={`/Overview/${dataitem.event_name ?? "sample_event"}/insight`}
                  >
                    <Eventcard
                      key={index}
                      todaydate={
                        FormatDateFromUnix(dataitem.time.start_time ?? 0n).date
                      }
                      time={
                        FormatDateFromUnix(dataitem.time.start_time ?? 0n).time
                      }
                      eventname={dataitem.event_name}
                      host={decimalToHexAddress(dataitem.event_organizer ?? 0)}
                      location={"Google Meet"}
                    />
                  </Link>
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
    switch (props.section) {
      case "createevent":
        setCreateorExplorestat(true);
        break;
      case "createdevent":
        setCreatedStat(true);
        setRegStat(false);
        setCreateorExplorestat(false);
        break;
      case "registeredevent":
        setCreatedStat(false);
        setRegStat(true);
        setCreateorExplorestat(false);
        break;
      case "events":
        setCreatedStat(true);
        setRegStat(false);
        setCreateorExplorestat(false);
        break;
      default:
        break;
    }
  }, [props.section]);

  const altfetchCreatedEvent = async () => {
    const eventContract = new Contract(
      attensysEventAbi,
      attensysEventAddress,
      provider,
    );
    const res = await eventContract.get_all_created_events(
      wallet?.selectedAddress,
    );
    setallusercreatedevent(res);
  };

  const altfetchUserRegisteredEvent = async () => {
    const eventContract = new Contract(
      attensysEventAbi,
      attensysEventAddress,
      provider,
    );
    const res = await eventContract.get_all_list_registered_events(
      wallet?.selectedAddress,
    );
    setalluserRegisterevent(res);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        altfetchCreatedEvent();
        altfetchUserRegisteredEvent();
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [wallet]);

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
      className="w-[100%] bg-event-gradient my-8 h-auto"
    >
      {renderContent()}
    </div>
  );
};

export default Myevents;
