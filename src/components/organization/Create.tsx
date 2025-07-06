import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import { IoIosInformationCircleOutline, IoMdClose } from "react-icons/io";
import {
  createbootcampoverlay,
  createbootcampupload,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { Button, Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import TargetCategory from "./TargetCategory";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import TimePicker from "rc-time-picker";
import BootcampTime from "./BootcampTime";
import { FaPlus } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import Toggle from "react-toggle";
import cloud from "@/assets/cloud.svg";
import Image from "next/image";
import dividers from "@/assets/Dividers.svg";
import { useRouter } from "next/navigation";
import add from "@/assets/add.svg";
import { createBootcampInitState } from "@/state/connectedWalletStarknetkitNext";
import { FileObject } from "pinata";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { FcCancel } from "react-icons/fc";
import { pinata } from "../../../utils/config";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { connect } from "starknetkit";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { Contract } from "starknet";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useConnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";

const format = "h:mm a";
const now = moment().hour(0).minute(0);

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const emptyData: FileObject = {
  name: "",
  type: "",
  size: 0,
  lastModified: 0,
  arrayBuffer: async () => {
    return new ArrayBuffer(0);
  },
};
const ResetBootcampData = {
  bootcampName: "",
  bootcampOrganization: "",
  targetAudience: "",
  bootcampDescription: "",
  bootcampStartdate: "",
  bootcampEndDate: "",
  bootcampLecture: [
    { day: "", lecturetitle: "", lectureDescription: "", start: "", end: "" },
  ],
  price: false,
  bootcampPrice: "",
  BootcampLogo: emptyData,
  bootcampNftName: "",
  bootCampNftSymbol: "",
  bootcampNftImage: emptyData,
};

//   {day:"", lecturetitle:"", lectureDescription: "", start:"", end:""}

const Create = (props: any) => {
  // { height }: { height: number | null }
  const { height, organizationName } = props;
  const [createOverlayStat, setCreateOverlayStat] = useAtom(
    createbootcampoverlay,
  );

  const [createbootcampStat, setcreatebootcampStat] =
    useAtom(createbootcampupload);

  const [value, onChange] = useState<Value>(new Date());
  const [startdateStat, SetStartDateStatus] = React.useState<Dayjs | null>(
    dayjs(),
  );
  const [EnddateStat, SetEndDateStatus] = React.useState<Dayjs | null>(dayjs());
  const [bootcampTimes, setBootcampTimes] = useState([{ day: 1 }]);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [bootcampData, setBootcampData] = useAtom(createBootcampInitState);
  const [uploading, setUploading] = useState(false);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [numOfClassesToCreate, setNumOfClassesToCreate] = useState<
    number | any
  >(1);
  const [orgname, setOrgname] = useState<string>();
  const { account, address } = useFirebaseAuth();
  // const { connect: starknetReactConnect, connectors } = useConnect();
  // const controller = connectors[0] as ControllerConnector;

  // useEffect(() => {
  //   if (!address) return;
  //   controller.username()?.then((n) => setOrgname(n));
  //   console.log(address, "address");
  // }, [address, controller]);

  useEffect(() => {
    const autoConnect = async () => {
      try {
        const { wallet: connectedWallet, connector } = await connect({
          //@ts-ignore
          provider,
          modalMode: "neverAsk",
          webWalletUrl: ARGENT_WEBWALLET_URL,
          argentMobileOptions: {
            dappName: "Attensys",
            url: window.location.hostname,
            chainId: CHAIN_ID,
            icons: [],
          },
        });

        // console.log(connector.wallet.account )
        setWallet(connectedWallet);
      } catch (e) {
        console.error(e);
        alert((e as any).message);
      }
    };

    if (!wallet) {
      autoConnect();
    }
  }, [wallet]);

  // console.dir(bootcampData, {depth: null})
  // console.dir(bootcampTimes, {depth: null})

  const handleBootcampNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      bootcampName: e.target.value, // Dynamically update the specific field
    }));
  };

  const handleBootcampDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      bootcampDescription: e.target.value, // Dynamically update the specific field
    }));
  };

  const handleNFTNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      bootcampNftName: e.target.value, // Dynamically update the specific field
    }));
  };

  const handleNFTSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      bootCampNftSymbol: e.target.value, // Dynamically update the specific field
    }));
  };

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
      // Process the file
      setBootcampData((prevData) => ({
        ...prevData, // Spread existing data to retain untouched fields
        bootcampNftImage: file, // Dynamically update the specific field
      }));
    } else {
      console.error("Please select a valid image file (JPEG, JPG, or PNG).");
    }
  };

  const handleBootcampPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      bootcampPrice: e.target.value, // Dynamically update the specific field
    }));
  };

  const handleBrowse = () => {
    // Trigger the file input on image click
    logoInputRef.current?.click();
  };
  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg")
    ) {
      // Process the file
      setBootcampData((prevData) => ({
        ...prevData, // Spread existing data to retain untouched fields
        BootcampLogo: file, // Dynamically update the specific field
      }));
    } else {
      console.error("Please select a valid image file (JPEG, JPG, or PNG).");
    }
  };

  const handlePublishButton = async () => {
    setCreateOverlayStat(false);
    setcreatebootcampStat(true);
    try {
      //@ts-ignore
      const bootcamplogo = await pinata.upload.file(bootcampData.BootcampLogo);
      //@ts-ignore
      const Nftimage = await pinata.upload.file(bootcampData.bootcampNftImage);
      const Dataupload = await pinata.upload.json({
        //@ts-ignore
        BootcampName: bootcampData.bootcampName,
        BootcampLogo: bootcamplogo.IpfsHash,
        //@ts-ignore
        BootcampDescription: bootcampData.bootcampDescription,
        //@ts-ignore
        Bootcamplecturedata: bootcampData.bootcampLecture,
        //@ts-ignore
        BootcampStartDate: bootcampData.bootcampStartdate,
        //@ts-ignore
        BootEndDate: bootcampData.bootcampEndDate,
        //@ts-ignore
        BootcampNFTname: bootcampData.bootcampNftName,
        //@ts-ignore
        BootcampNFTsymbol: bootcampData.bootCampNftSymbol,
        BootcampNftImage: Nftimage.IpfsHash,
        //@ts-ignore
        Organizer: bootcampData.bootcampOrganization,
        //@ts-ignore
        PriceStaus: bootcampData.price,
        //@ts-ignore
        BootcampPrice: bootcampData.bootcampPrice,
        //@ts-ignore
        targetAudience: bootcampData.targetAudience,
      });

      if (Dataupload) {
        console.info("Data upload here", Dataupload);
        console.info(
          "Create bootcamp Cid to send to contract ",
          Dataupload.IpfsHash,
        );
        // setUploading(false);
        // router.push(`/Bootcamp/${bootcampData.bootcampName}/Outline`)
        // setCreateOverlayStat(false);
        // setBootcampData(ResetBootcampData)

        const organizationContract = new Contract(
          attensysOrgAbi,
          attensysOrgAddress,
          account,
        );

        const create_bootcamp_calldata = organizationContract.populate(
          "create_bootcamp",
          [
            organizationName,
            //@ts-ignore
            bootcampData.bootcampName,
            Dataupload.IpfsHash,
            //@ts-ignore
            bootcampData.bootcampNftName,
            //@ts-ignore
            bootcampData.bootCampNftSymbol,
            numOfClassesToCreate,
            Dataupload.IpfsHash,
          ],
        );

        const callContract = await account?.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "create_bootcamp",
            calldata: create_bootcamp_calldata.calldata,
          },
        ]);
        if (!callContract) {
          throw new Error("Transaction not executed");
        }
        await account?.waitForTransaction(callContract?.transaction_hash);
        console.log("Submitted successfully");

        //@ts-ignore
        // router.push(`/Bootcamp/${bootcampData.bootcampName}/Outline`);
      }
    } catch (e: any) {
      console.error("Error: ", e);
    } finally {
      console.log("Finally block running");
      //@ts-ignore
      setBootcampData(ResetBootcampData);
      setcreatebootcampStat(false);
    }
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPaid(event.target.checked);
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      price: event.target.checked, // Dynamically update the specific field
    }));
  };

  const handleAddDay = () => {
    // Add a new BootcampTime component with an incremented day value
    setNumOfClassesToCreate(numOfClassesToCreate + 1);
    setBootcampTimes((prevTimes) => [
      ...prevTimes,
      { day: prevTimes.length + 1 },
    ]);

    setBootcampData((prevData) => ({
      ...prevData,
      bootcampLecture: [
        //@ts-ignore
        ...prevData.bootcampLecture,
        {
          //@ts-ignore
          day: (prevData.bootcampLecture.length + 1).toString(),
          lecturetitle: "",
          lectureDescription: "",
          start: "",
          end: "",
        },
      ],
    }));
  };

  const handleRemoveDay = () => {
    setNumOfClassesToCreate(numOfClassesToCreate - 1);
    setBootcampTimes((prevTimes) => {
      if (prevTimes.length === 0) return prevTimes; // Prevent removing if no days are present
      return prevTimes.slice(0, -1); // Remove the last day
    });
  };

  const handleTitleChange = (index: number, value: string) => {
    setBootcampData((prevData) => ({
      ...prevData,
      //@ts-ignore
      bootcampLecture: prevData.bootcampLecture.map((lecture, idx) =>
        idx === index ? { ...lecture, lecturetitle: value } : lecture,
      ),
    }));
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setBootcampData((prevData) => ({
      ...prevData,
      //@ts-ignore
      bootcampLecture: prevData.bootcampLecture.map((lecture, idx) =>
        idx === index ? { ...lecture, lectureDescription: value } : lecture,
      ),
    }));
  };

  const handleCreateOverlay = () => {
    setCreateOverlayStat(false);
    //@ts-ignore
    setBootcampData(ResetBootcampData);
  };

  const handleStartdateChange = (newValue: any) => {
    setBootcampData((prevData) => ({
      ...prevData,
      bootcampStartdate: newValue ? newValue.format("YYYY-MM-DD") : "",
    }));
  };

  const handleEnddateChange = (newValue: any) => {
    setBootcampData((prevData) => ({
      ...prevData,
      bootcampEndDate: newValue ? newValue.format("YYYY-MM-DD") : "",
    }));
  };

  return (
    <div className="relative">
      <div
        className="absolute z-[999] h-auto w-full"
        style={{
          height: height ? `${height}px` : "100vh", // Use dynamic height or fallback to 100vh
        }}
      >
        <div className="flex h-full">
          <div className="w-[35%] hidden lg:block h-full bg-[#07070733]"></div>

          <div className="lg:w-[65%] w-[100%] h-full bg-[#FFFFFF] overflow-y-scroll">
            <div className="w-[100%] h-[10px] bg-bootcreate-gradient"></div>
            <div className="w-[90%] mx-auto flex justify-between mt-5">
              <h1 className="text-[22px] leading-[22px] text-[#333333] font-semibold">
                Create bootcamp
              </h1>
              <IoMdClose
                className="h-[30px] w-[30px] cursor-pointer"
                onClick={handleCreateOverlay}
              />
            </div>

            <div className="w-[90%] mx-auto mt-6">
              <div className="w-full space-y-3">
                <h1 className="text-[12px] lg:text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                  Bootcamp Name
                </h1>
                <Field>
                  <Input
                    onChange={handleBootcampNameChange}
                    placeholder="e.g starknet basecamp"
                    className={clsx(
                      "h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full rounded-lg  py-1.5 px-3 text-[12px] lg:text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
              </div>

              <div className="flex flex-col justify-between w-full mt-4 space-x-2 space-y-5 lg:flex-row">
                <div className="w-full space-y-3">
                  <h1 className="text-[12px] lg:text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                    Bootcamp Organization
                  </h1>
                  <Field>
                    <Input
                      value={organizationName}
                      readOnly
                      placeholder="e.g starknet basecamp"
                      className={clsx(
                        "h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full rounded-lg  py-1.5 px-3 text-[12px] lg:text-sm/6 text-[#4A90E2]",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                      )}
                    />
                  </Field>
                </div>
                <div className="w-full space-y-3">
                  <h1 className="text-[12px] lg:text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                    Target Audience
                  </h1>
                  <TargetCategory />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <h1 className="text-[12px] lg:text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                  Description
                </h1>
                <Field>
                  <textarea
                    placeholder="Short overview detailing what the bootcamp covers"
                    onChange={handleBootcampDescriptionChange}
                    className={clsx(
                      "h-[110px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[100%] rounded-lg  py-1.5 px-3 text-[12px] lg:text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
              </div>

              {/* NFT data collection */}
              <div className="space-y-3 w-[60%] mt-4">
                <h1 className="text-[12px] lg:text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                  NFT Certificate Name
                </h1>
                <Field>
                  <Input
                    onChange={handleNFTNameChange}
                    placeholder="nft name"
                    className={clsx(
                      "h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[100%] rounded-lg  py-1.5 px-3 text-[12px] lg:text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
              </div>

              <div className="space-y-3 w-[60%] mt-4">
                <h1 className="text-[12px] lg:text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                  NFT Certificate symbol
                </h1>
                <Field>
                  <Input
                    onChange={handleNFTSymbolChange}
                    placeholder="Enter nft symbol"
                    className={clsx(
                      "h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[100%] rounded-lg  py-1.5 px-3 text-[12px] lg:text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
              </div>

              <div className="space-y-3 w-[60%] mt-4">
                <h1 className="text-[12px] lg:text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                  Upload NFT Certificate Image
                </h1>
                <div
                  className="w-[200px] h-[200px] bg-[#3F3E58] rounded-xl flex justify-center items-center cursor-pointer"
                  onClick={handleImageClick}
                >
                  <Image
                    src={add}
                    alt="add"
                    className="cursor-pointer h-[100px] w-[100px] object-cover rounded-xl"
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
              <div className="mt-8">
                <h1 className="text-[16px] leading-[23px] font-semibold text-[#2D3A4B]">
                  Structure & schedules
                </h1>
                <div className="mt-3 space-y-2">
                  <h1 className="text-[12px] lg:text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                    Bootcamp Date
                  </h1>
                  <div className="flex gap-x-4">
                    <>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="Start date"
                            onChange={handleStartdateChange}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </>

                    <>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="End date"
                            onChange={handleEnddateChange}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <h1 className="text-[12px] lg:text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                  Bootcamp Time
                </h1>
                <div className="flex flex-col items-start lg:flex-row gap-x-3 gap-y-4">
                  <div className="flex flex-col items-center lg:flex-col gap-y-2 gap-x-3">
                    {bootcampTimes.map((component, index) => (
                      <BootcampTime key={index} day={index + 1} />
                    ))}
                  </div>

                  <div className="flex ">
                    <div
                      id="add-day"
                      onClick={handleAddDay}
                      className="mt-2 cursor-pointer relative flex items-center px-4 gap-x-3 border-[1px] border-[#D0D5DD] h-[55px] w-[130px] rounded-lg"
                    >
                      <FaPlus className="text-[#2D3A4B]" />
                      <h1 className="text-[15px] leading-[18px] font-light text-[#2D3A4B]">
                        Add Day
                      </h1>
                    </div>
                    <div
                      id="add-day"
                      onClick={handleRemoveDay}
                      className="mt-2 cursor-pointer relative flex items-center px-4 space-x-3 border-[1px] border-[#D0D5DD] h-[55px] w-[150px] rounded-lg"
                    >
                      <FcCancel className="text-[#2D3A4B]" />
                      <h1 className="text-[15px] leading-[18px] font-light text-[#2D3A4B]">
                        Remove Day
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h1 className="text-[16px] leading-[23px] font-semibold text-[#2D3A4B]">
                  Curriculum
                </h1>
                <div className="flex w-[380px] items-center space-x-1 mt-1">
                  <IoIosInformationCircleOutline />
                  <h1 className="text-[13px] text-[#2D3A4B] leading-[20px] font-light">
                    You can edit and add more details later in your
                    dashboard{" "}
                  </h1>
                </div>
                <div></div>

                <div className="space-y-12">
                  {bootcampTimes.map((component, index) => (
                    <div key={index}>
                      <div className="flex flex-col mt-4 space-y-5 lg:flex-row gap-x-2 lg:space-y-0">
                        <Field>
                          <Input
                            placeholder="Add lecture title"
                            onChange={(e) =>
                              handleTitleChange(index, e.target.value)
                            }
                            className={clsx(
                              "h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[395px] rounded-lg  py-1.5 px-3 text-[12px] lg:text-sm/6 text-[#667185]",
                              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                            )}
                          />
                        </Field>

                        <div className="relative flex bg-[#A666E3] items-center px-4  justify-between border-[1px] border-[#D0D5DD] h-[55px] w-[120px] rounded-lg">
                          <div className="flex space-x-3">
                            <FaRegCalendarAlt className="h-[20px] w-[14px] text-[#FFFFFF]" />
                            <h1 className="text-[12px] leading-[18px] font-light text-[#FFFFFF]">
                              Day {index + 1}
                            </h1>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex mt-4 space-x-2 ">
                        <div>
                          <Field>
                            <textarea
                              onChange={(e) =>
                                handleDescriptionChange(index, e.target.value)
                              }
                              placeholder="Add lecture description"
                              className={clsx(
                                "h-[127px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[390px] lg:w-[557px] rounded-lg  py-1.5 px-3 text-[12px] lg:text-sm/6 text-[#667185]",
                                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                              )}
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center space-x-8">
                  <div>
                    <h1 className="text-[16px] leading-[23px] font-semibold text-[#2D3A4B]">
                      Pricing
                    </h1>
                    <p className="text-[13px] text-[#2D3A4B] leading-[20px] font-light">
                      Specify tuition fees, if applicable.
                    </p>
                  </div>
                  <Toggle
                    checked={isPaid}
                    name="isPaid"
                    value="yes"
                    onChange={handleToggleChange}
                  />
                </div>

                {isPaid && (
                  <div className="flex mt-3 space-x-3">
                    <div>
                      <Field>
                        <Input
                          value="Payment method (USDT)"
                          readOnly
                          placeholder="e.g starknet basecamp"
                          className={clsx(
                            "h-[55px] border-[2px] text-center bg-[#FFFFFF] border-[#D0D5DD] block w-[179px] rounded-lg  py-1.5 px-3 text-[12px] lg:text-sm/6 text-[#4A90E2]",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                          )}
                        />
                      </Field>
                    </div>
                    <div className="flex items-center space-x-1">
                      <h1 className="text-[24px] text-[#2D3A4B] font-light">
                        $
                      </h1>
                      <Field>
                        <Input
                          onChange={handleBootcampPriceChange}
                          className={clsx(
                            "h-[55px] border-[2px] text-center bg-[#FFFFFF] border-[#D0D5DD] block w-[100px] rounded-lg  py-1.5 px-3 text-[12px] lg:text-sm/6 text-[#4A90E2]",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                          )}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h1 className="text-[16px] leading-[23px] font-semibold text-[#2D3A4B]">
                    Upload Bootcamp creative
                  </h1>

                  <div className="flex flex-col space-y-10 lg:flex-row gap-x-16 lg:space-x-16">
                    <div className="h-[316px] lg:w-[459px] w-[390px] mt-3 rounded-lg bg-[#DCDCDC] flex justify-center items-center">
                      <div className="h-[256px] lg:w-[400px] w-[350px] border-[3px] border-dotted border-[#D0D5DD] bg-[#FFFFFF] rounded-xl space-y-3 flex flex-col items-center justify-center">
                        <Image src={cloud} alt="upload" />
                        <h1 className="text-[12px] lg:text-[14px] text-[#475367] font-light leading-[20px]">
                          <span className="text-[#4A90E2]">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </h1>
                        <p className="text-[12px] text-[#475367] font-light leading-[17px]">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                        <Image src={dividers} alt="divider" className="mt-7" />
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/jpeg, image/jpg, image/png"
                          onChange={handleLogoChange}
                          style={{ display: "none" }} // Hide the input
                        />
                        <Button
                          onClick={handleBrowse}
                          className="h-[36px] w-[118px] flex justify-center items-center bg-[#9B51E0] rounded-xl text-[12px] lg:text-[14px] text-[#FFFFFF] font-light leading-[20px]"
                        >
                          Browse Files
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col-reverse mt-3 space-y-5 lg:flex-col lg:space-y-2">
                      <div className="h-[166px] w-[251px] border-[3px] border-dotted border-[#D0D5DD] bg-[#FFFFFF] rounded-xl space-y-0 flex flex-col items-center justify-center">
                        <Image src={cloud} alt="upload" />
                        <h1 className="text-[8px] text-[#475367] font-light leading-[20px]">
                          <span className="text-[#4A90E2]">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </h1>
                        <p className="text-[7.5px] text-[#475367] font-light leading-[17px]">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                        <Image src={dividers} alt="divider" className="mt-7" />
                        <Button className="h-[23px] w-[74px] flex justify-center items-center bg-[#9B51E0] rounded-xl text-[8px] text-[#FFFFFF] font-light leading-[20px]">
                          Browse Files
                        </Button>
                      </div>
                      <h1 className="text-[18px] text-[#333333] font-semibold leading-[31px] ">
                        Upload thumbnail
                      </h1>
                      <p className="w-[254px] text-[12px] lg:text-[14px] font-light text-[#2D3A4B] leading-[21px]">
                        Upload your bootcamp image here. 750x422 pixels; .jpg,
                        .jpeg,. gif, or .png.{" "}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end my-10 lg:my-5">
                    <div
                      onClick={!uploading ? handlePublishButton : undefined}
                      className={`h-[47px] w-full px-6 sm:w-auto lg:w-[342px] rounded-xl flex items-center justify-center ${
                        uploading
                          ? "bg-[#822DBF] cursor-not-allowed"
                          : "bg-[#4A90E2] cursor-pointer"
                      }`}
                    >
                      <h1 className="text-[#FFFFFF] text-[12px] lg:text-[14px] font-semibold leading-[16px]">
                        {uploading
                          ? "Publishing..."
                          : "Save and Publish bootcamp"}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
