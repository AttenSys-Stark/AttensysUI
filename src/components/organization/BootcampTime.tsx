import { Field, Input } from "@headlessui/react";
import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { createBootcampInitState } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

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

const BootcampTime: React.FC<timeProp> = (props) => {
  const [bootcampData, setBootcampData] = useAtom(createBootcampInitState);

  const handleStartTimeChange = (newValue: any) => {
    setBootcampData((prevData) => ({
      ...prevData,
      //@ts-ignore
      bootcampLecture: prevData.bootcampLecture.map((lecture) =>
        lecture.day == props.day.toString()
          ? { ...lecture, start: newValue }
          : { ...lecture, start: newValue, day: "1" },
      ),
    }));
  };

  const handleEndTimeChange = (newValue: any) => {
    setBootcampData((prevData) => ({
      ...prevData,
      //@ts-ignore
      bootcampLecture: prevData.bootcampLecture.map((lecture) =>
        lecture.day == props.day.toString()
          ? { ...lecture, end: newValue }
          : { ...lecture, end: newValue },
      ),
    }));
  };

  return (
    <div className="flex gap-x-2 items-center h-full flex-wrap md:flex-nowrap">
      <div className="basis-full">
        <div className="flex bg-[#A666E3] text-nowrap md:w-auto items-center px-1 sm:px-4 space-x-1 sm:space-x-3 border-[1px] border-[#D0D5DD] h-[55px] justify-center w-[105px] rounded-lg mt-2">
          <FaRegCalendarAlt className="h-[20px] w-[14px] text-[#FFFFFF]" />
          <h1 className="text-[12px] leading-[18px] font-light text-[#FFFFFF]">
            Day {props.day}
          </h1>
          <div className=""></div>
        </div>
      </div>

      <div className="flex">
        <div className="h-full text-[8px]">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
              <StyledTimePicker
                label="Start Time"
                onChange={handleStartTimeChange}
                // @ts-expect-error
                renderInput={(params) => <TextField {...params} />}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className="h-full text-[8px]">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
              <StyledTimePicker
                label="End Time"
                onChange={handleEndTimeChange}
                // @ts-expect-error
                renderInput={(params) => <TextField {...params} />}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
};

export default BootcampTime;
