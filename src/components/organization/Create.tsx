import React, { ChangeEvent, useRef, useState } from "react"
import { IoIosInformationCircleOutline, IoMdClose } from "react-icons/io"
import { createbootcampoverlay } from "@/state/connectedWalletStarknetkitNext"
import { useAtom } from "jotai"
import { Button, Field, Input, Label } from "@headlessui/react"
import clsx from "clsx"
import TargetCategory from "./TargetCategory"
import { styled } from '@mui/material/styles'
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { FaRegCalendarAlt } from "react-icons/fa"
import "rc-time-picker/assets/index.css"
import moment from "moment"
import TimePicker from "rc-time-picker"
import BootcampTime from "./BootcampTime"
import { FaPlus } from "react-icons/fa6"
import { RiArrowDropDownLine } from "react-icons/ri"
import Toggle from "react-toggle"
import cloud from "@/assets/cloud.svg"
import Image from "next/image"
import dividers from "@/assets/Dividers.svg"
import { useRouter } from "next/navigation"
import add from "@/assets/add.svg"
import { createBootcampInitState } from "@/state/connectedWalletStarknetkitNext"
import { FileObject } from "pinata"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs, { Dayjs } from "dayjs"
import { FcCancel } from "react-icons/fc"
import { pinata } from "../../../utils/config"
import { TextField } from "@mui/material"

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  "& .MuiInputBase-root": {
    minWidth: "100px",
    width: "150px",
    [theme.breakpoints.up("lg")]: {
      minWidth: "200px",
      width: "200px",
    },
  },
}));

const format = "h:mm a"
const now = moment().hour(0).minute(0)

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const emptyData: FileObject = {
  name: "",
  type: "",
  size: 0,
  lastModified: 0,
  arrayBuffer: async () => {
    return new ArrayBuffer(0)
  },
}
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
}

//   {day:"", lecturetitle:"", lectureDescription: "", start:"", end:""}

const Create = ({ height }: { height: number | null }) => {
  const [createOverlayStat, setCreateOverlayStat] = useAtom(
    createbootcampoverlay,
  )
  const [value, onChange] = useState<Value>(new Date())
  const [startdateStat, SetStartDateStatus] = React.useState<Dayjs | null>(
    dayjs(),
  )
  const [EnddateStat, SetEndDateStatus] = React.useState<Dayjs | null>(dayjs())
  const [bootcampTimes, setBootcampTimes] = useState([{ day: 1 }])
  const [isPaid, setIsPaid] = useState<boolean>(false)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const [bootcampData, setBootcampData] = useAtom(createBootcampInitState)
  const [uploading, setUploading] = useState(false)

  // console.dir(bootcampData, {depth: null})
  // console.dir(bootcampTimes, {depth: null})

  const handleBootcampNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      bootcampName: e.target.value, // Dynamically update the specific field
    }))
  }

  const handleBootcampDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      bootcampDescription: e.target.value, // Dynamically update the specific field
    }))
  }

  const handleNFTNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      bootcampNftName: e.target.value, // Dynamically update the specific field
    }))
  }

  const handleNFTSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      bootCampNftSymbol: e.target.value, // Dynamically update the specific field
    }))
  }

  const handleImageClick = () => {
    // Trigger the file input on image click
    fileInputRef.current?.click()
  }
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
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
      }))
    } else {
      console.log("Please select a valid image file (JPEG, JPG, or PNG).")
    }
  }

  const handleBootcampPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      bootcampPrice: e.target.value, // Dynamically update the specific field
    }))
  }

  const handleBrowse = () => {
    // Trigger the file input on image click
    logoInputRef.current?.click()
  }
  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
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
      }))
    } else {
      console.log("Please select a valid image file (JPEG, JPG, or PNG).")
    }
  }

  const handlePublishButton = async () => {
    setUploading(true)
    const bootcamplogo = await pinata.upload.file(bootcampData.BootcampLogo)
    const Nftimage = await pinata.upload.file(bootcampData.bootcampNftImage)
    const Dataupload = await pinata.upload.json({
      BootcampName: bootcampData.bootcampName,
      BootcampLogo: bootcamplogo.cid,
      BootcampDescription: bootcampData.bootcampDescription,
      Bootcamplecturedata: bootcampData.bootcampLecture,
      BootcampStartDate: bootcampData.bootcampStartdate,
      BootEndDate: bootcampData.bootcampEndDate,
      BootcampNFTname: bootcampData.bootcampNftName,
      BootcampNFTsymbol: bootcampData.bootCampNftSymbol,
      BootcampNftImage: Nftimage.cid,
      Organizer: bootcampData.bootcampOrganization,
      PriceStaus: bootcampData.price,
      BootcampPrice: bootcampData.bootcampPrice,
      targetAudience: bootcampData.targetAudience,
    })

    if (Dataupload) {
      console.log("Data upload here", Dataupload)
      console.log("Create bootcamp Cid to send to contract ", Dataupload.cid)
      setUploading(false)
      router.push(`/Bootcamp/${bootcampData.bootcampName}/Outline`)
      setCreateOverlayStat(false)
      setBootcampData(ResetBootcampData)
    }
  }

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPaid(event.target.checked)
    setBootcampData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      price: event.target.checked, // Dynamically update the specific field
    }))
  }

  const handleAddDay = () => {
    // Add a new BootcampTime component with an incremented day value
    setBootcampTimes((prevTimes) => [
      ...prevTimes,
      { day: prevTimes.length + 1 },
    ])

    setBootcampData((prevData) => ({
      ...prevData,
      bootcampLecture: [
        ...prevData.bootcampLecture,
        {
          day: (prevData.bootcampLecture.length + 1).toString(),
          lecturetitle: "",
          lectureDescription: "",
          start: "",
          end: "",
        },
      ],
    }))
  }

  const handleRemoveDay = () => {
    setBootcampTimes((prevTimes) => {
      if (prevTimes.length === 0) return prevTimes // Prevent removing if no days are present
      return prevTimes.slice(0, -1) // Remove the last day
    })
  }

  const handleTitleChange = (index: number, value: string) => {
    setBootcampData((prevData) => ({
      ...prevData,
      bootcampLecture: prevData.bootcampLecture.map((lecture, idx) =>
        idx === index ? { ...lecture, lecturetitle: value } : lecture,
      ),
    }))
  }

  const handleDescriptionChange = (index: number, value: string) => {
    setBootcampData((prevData) => ({
      ...prevData,
      bootcampLecture: prevData.bootcampLecture.map((lecture, idx) =>
        idx === index ? { ...lecture, lectureDescription: value } : lecture,
      ),
    }))
  }

  const handleCreateOverlay = () => {
    setCreateOverlayStat(false)
    setBootcampData(ResetBootcampData)
  }

  const handleStartdateChange = (newValue: any) => {
    setBootcampData((prevData) => ({
      ...prevData,
      bootcampStartdate: newValue ? newValue.format("YYYY-MM-DD") : "",
    }))
  }

  const handleEnddateChange = (newValue: any) => {
    setBootcampData((prevData) => ({
      ...prevData,
      bootcampEndDate: newValue ? newValue.format("YYYY-MM-DD") : "",
    }))
  }

  const vw = window.innerWidth

  return (
    <div
      className="absolute z-[9999] h-auto w-[100%]"
      style={{
        height: height ? `${height}px` : "100vh", // Use dynamic height or fallback to 100vh
      }}
    >
      <div className="h-full flex">
        <div className="w-[35%] h-full bg-[#07070733] hidden md:block"></div>

        <div
          className={`w-[100%] md:w-[65%] h-full bg-[#FFFFFF] overflow-y-scroll`}
        >
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
            <div className="space-y-3 w-full">
              <h1 className="text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                Bootcamp Name
              </h1>
              <Field>
                <Input
                  onChange={handleBootcampNameChange}
                  placeholder="e.g starknet basecamp"
                  className={clsx(
                    "h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  )}
                />
              </Field>
            </div>

            <div className="flex flex-col sm:flex-row gap-y-3 justify-between w-full space-x-2 mt-4">
              <div className="space-y-3 w-full">
                <h1 className="text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                  Bootcamp Organization
                </h1>
                <Field>
                  <Input
                    value="Orangutan Edu Academy"
                    readOnly
                    placeholder="e.g starknet basecamp"
                    className={clsx(
                      "h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full rounded-lg  py-1.5 px-3 text-sm/6 text-[#4A90E2]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
              </div>
              <div className="space-y-3 w-full">
                <h1 className="text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                  Target Audience
                </h1>
                <TargetCategory />
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <h1 className="text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                Description
              </h1>
              <Field>
                <textarea
                  placeholder="Short overview detailing what the bootcamp covers"
                  onChange={handleBootcampDescriptionChange}
                  className={clsx(
                    "h-[110px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[100%] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  )}
                />
              </Field>
            </div>

            {/* NFT data collection */}
            {/* <div className='space-y-3 w-[60%] mt-4'>
                    <h1 className='text-[14px] text-[#2D3A4B] font-light leading-[20px]'>NFT Certificate Name</h1>
                    <Field>
                        <Input
                        onChange={handleNFTNameChange}
                        placeholder='nft name'
                        className={clsx(
                            'h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[100%] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                        />
                    </Field>
                </div>

                <div className='space-y-3 w-[60%] mt-4'>
                    <h1 className='text-[14px] text-[#2D3A4B] font-light leading-[20px]'>NFT Certificate symbol</h1>
                    <Field>
                        <Input
                        onChange={handleNFTSymbolChange}
                        placeholder='Enter nft symbol'
                        className={clsx(
                            'h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[100%] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                        />
                    </Field>
                </div>


                <div className='space-y-3 w-[60%] mt-4'>
            <h1 className='text-[14px] text-[#2D3A4B] font-light leading-[20px]'>Upload NFT Certificate Image</h1>
            <div className="w-[200px] h-[200px] bg-[#3F3E58] rounded-xl flex justify-center items-center cursor-pointer" onClick={handleImageClick}>
                                    <Image src={add} alt="add"   className="cursor-pointer h-[100px] w-[100px] object-cover rounded-xl" />
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg, image/jpg, image/png"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }} // Hide the input
                                    />
            </div>
        </div> */}
            <div className="mt-8">
              <h1 className="text-[16px] leading-[23px] font-semibold text-[#2D3A4B]">
                Structure & schedules
              </h1>
              <div className="mt-3 space-y-2">
                <h1 className="text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                  Bootcamp Date
                </h1>
                <div className="flex flex-wrap space-x-2 gap-x-2 md:space-x-4 max-w-full">
                  <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        {/* <DatePicker
                          label="Start date"
                          onChange={handleStartdateChange}
                          className="w-[150px] min-w-[100px] lg:min-w-[200px] text-[12px] overflow-x-none"
                        /> */}
                        <StyledDatePicker
                          label="Start Date"
                          onChange={handleStartdateChange}
                          // @ts-ignore
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </>

                  <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <StyledDatePicker
                          label="End Date"
                          onChange={handleEnddateChange}
                          // @ts-ignore
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <h1 className="text-[12px] sm:text-[14px] text-[#2D3A4B] font-light leading-[20px]">
                Bootcamp Time
              </h1>
              <div className="flex flex-wrap sm:flex-row space-x-3 items-center">
                <div className="flex flex-col space-y-2">
                  {bootcampTimes.map((component, index) => (
                    <BootcampTime key={index} day={index + 1} />
                  ))}
                </div>
                <div
                  id="add-day"
                  onClick={handleAddDay}
                  className="flex text-nowrap mt-2 cursor-pointer relative items-center px-4 space-x-3 border-[1px] border-[#D0D5DD] h-[55px] w-[130px] rounded-lg"
                >
                  <FaPlus className="text-[#2D3A4B]" />
                  <h1 className="text-[15px] leading-[18px] font-light text-[#2D3A4B]">
                    Add Day
                  </h1>
                </div>

                <div
                  id="add-day"
                  onClick={handleRemoveDay}
                  className="mt-2 text-nowrap cursor-pointer relative flex items-center px-4 space-x-3 border-[1px] border-[#D0D5DD] h-[55px] w-[150px] rounded-lg"
                >
                  <FcCancel className="text-[#2D3A4B]" />
                  <h1 className="text-[15px] leading-[18px] font-light text-[#2D3A4B]">
                    Remove Day
                  </h1>
                </div>
              </div>
            </div>

            <div className="mt-8 max-w-[200px]">
              <h1 className="text-[16px] leading-[23px] font-semibold text-[#2D3A4B]">
                Curriculum
              </h1>
              <div className="flex w-[380px] items-center space-x-1 mt-1">
                <IoIosInformationCircleOutline />
                <h1 className="text-[13px] text-[#2D3A4B] leading-[20px] font-light w-[250px]">
                  You can edit and add more details later in your dashboard{" "}
                </h1>
              </div>
              <div></div>

              <div className="space-y-12 w-[300px]">
                {bootcampTimes.map((component, index) => (
                  <div key={index}>
                    <div className="mt-4 flex flex-wrap space-x-2 gap-y-2">
                      <Field>
                        <Input
                          placeholder="Add lecture title"
                          onChange={(e) =>
                            handleTitleChange(index, e.target.value)
                          }
                          className={clsx(
                            "h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[320px] sm:w-[395px] lg:w-[450px] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                          )}
                        />
                      </Field>

                      <div className="relative flex bg-[#A666E3] items-center px-4  justify-between border-[1px] border-[#D0D5DD] h-[55px] w-fit md:w-[120px] rounded-lg">
                        <div className="space-x-3 flex">
                          <FaRegCalendarAlt className="h-[20px] w-[14px] text-[#FFFFFF]" />
                          <h1 className="text-[12px] leading-[18px] font-light text-[#FFFFFF]">
                            Day {index + 1}
                          </h1>
                        </div>
                      </div>
                    </div>

                    <div className=" mt-4 flex space-x-2 relative gap-y-2">
                      <div>
                        <Field>
                          <textarea
                            onChange={(e) =>
                              handleDescriptionChange(index, e.target.value)
                            }
                            placeholder="Add lecture description"
                            className={clsx(
                              "h-[127px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block  w-[320px] sm:w-[395px] lg:w-[450px] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]",
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
              <div className="flex space-x-8 items-center">
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
                <div className="mt-3 flex space-x-3">
                  <div>
                    <Field>
                      <Input
                        value="Payment method (USDT)"
                        readOnly
                        placeholder="e.g starknet basecamp"
                        className={clsx(
                          "h-[55px] border-[2px] text-center bg-[#FFFFFF] border-[#D0D5DD] block w-[179px] rounded-lg  py-1.5 px-3 text-sm/6 text-[#4A90E2]",
                          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                        )}
                      />
                    </Field>
                  </div>
                  <div className="flex space-x-1 items-center">
                    <h1 className="text-[24px] text-[#2D3A4B] font-light">$</h1>
                    <Field>
                      <Input
                        onChange={handleBootcampPriceChange}
                        className={clsx(
                          "h-[55px] border-[2px] text-center bg-[#FFFFFF] border-[#D0D5DD] block w-[100px] rounded-lg  py-1.5 px-3 text-sm/6 text-[#4A90E2]",
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

                <div className="flex flex-col md:flex-row md:space-x-16 items-center justify-center">
                  <div className="h-[316px] w-[90%] mx-auto md:w-[459px] mt-3 rounded-lg bg-[#DCDCDC] flex justify-center items-center">
                    <div className="h-[246px] w-[400px] border-[3px] border-dotted border-[#D0D5DD] bg-[#FFFFFF] rounded-xl space-y-3 flex flex-col items-center justify-center">
                      <Image src={cloud} alt="upload" />
                      <h1 className="text-[14px] text-[#475367] font-light leading-[20px]">
                        <span className="text-[#4A90E2]">Click to upload</span>{" "}
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
                        className="h-[36px] w-[118px] flex justify-center items-center bg-[#9B51E0] rounded-xl text-[14px] text-[#FFFFFF] font-light leading-[20px]"
                      >
                        Browse Files
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 mx-auto w-[90%]">
                    <div className="h-[166px] w-full md:w-[251px] border-[3px] border-dotted border-[#D0D5DD] bg-[#FFFFFF] rounded-xl space-y-0 flex flex-col items-center justify-center">
                      <Image src={cloud} alt="upload" />
                      <h1 className="text-[8px] text-[#475367] font-light leading-[20px]">
                        <span className="text-[#4A90E2]">Click to upload</span>{" "}
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
                    <p className="w-[254px] text-[14px] font-light text-[#2D3A4B] leading-[21px]">
                      Upload your bootcamp image here. 750x422 pixels; .jpg,
                      .jpeg,. gif, or .png.{" "}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end my-5">
                  <div
                    className="h-[47px] w-full md:w-[342px] rounded-xl bg-[#4A90E2] flex items-center justify-center cursor-pointer"
                    onClick={handlePublishButton}
                  >
                    <h1 className="text-[#FFFFFF] text-[14px] font-semibold leading-[16px]">
                      {uploading
                        ? "Uploading data"
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
  )
}

export default Create
