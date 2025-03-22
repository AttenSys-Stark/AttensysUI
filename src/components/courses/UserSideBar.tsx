import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import profilePic from "../../assets/profile_pic.png";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark";
import { BsFillExclamationCircleFill } from "@react-icons/all-files/bs/BsFillExclamationCircleFill";
import {
  sideProperties,
  coursesProgress,
  certificateEarned,
  certSideProperties,
} from "@/constants/data";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { coursesDetails, learningDetails } from "@/constants/data";
import CoursesCreated from "./CoursesCreated";
import LearningJourney from "./LearningJourney";
import Notification from "./Notification";
import CreateACourse from "./CreateACourse";
import { shortHex } from "@/utils/helpers";
import filled from "@/assets/filled.svg";
import free_books from "@/assets/free_books.svg";
import notifications from "@/assets/notifications.svg";
import createIcon from "@/assets/create.svg";

interface UserSideBarProps {
  wallet: any;
  courseData: any;
  takenCoursesData: any;
  page: string; // or another type like `number` or a union type
  selected: string; // Replace with appropriate type
  setSelected: (value: string) => void; // Function that sets a value
}
interface argprop {
  no: number;
  title: string;
}
const UserSideBar = ({
  wallet,
  courseData,
  takenCoursesData,
  page,
  selected,
  setSelected,
}: UserSideBarProps) => {
  const [sideProperties, setSideProperties] = useState([
    {
      no: 0,
      title: "Courses created",
      url: filled,
    },
    {
      no: 0,
      title: "My Learning Journey",
      url: free_books,
    },
    {
      no: 0,
      title: "Create a course",
      url: createIcon,
    },
    {
      no: 0,
      title: "Notification",
      url: notifications,
    },
  ]);

  const [isFilterModalOpen, setFilterModalOpen] = useState(false); // State for filter modal

  const renderItem = (arg: argprop) => {
    if (arg.title == "Courses") {
      return (
        <div className="text-[12px] ">
          <span>{takenCoursesData.length + courseData.length}</span> Course
          {arg.no > 1 ? "(s)" : ""}
        </div>
      );
    } else if (arg.title == "Completed courses") {
      return (
        <div className="text-[12px] ">
          <span>{takenCoursesData.length}</span> Completed course
          {arg.no > 1 ? "(s)" : ""}
        </div>
      );
    } else if (arg.title == "Ongoing") {
      return (
        <div className="text-[12px] ">
          <span>{arg.no}</span> Ongoing course{arg.no > 1 ? "(s)" : ""}
        </div>
      );
    } else if (arg.title == "Created") {
      return (
        <div className="text-[12px] ">
          <span>{courseData.length}</span> Course{arg.no > 1 ? "(s)" : ""}
        </div>
      );
    }
  };

  function generateDummyName() {
    const firstNames = [
      "John",
      "Alice",
      "Michael",
      "Sarah",
      "David",
      "Emma",
      "James",
      "Olivia",
      "Daniel",
      "Sophia",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Brown",
      "Williams",
      "Jones",
      "Miller",
      "Davis",
      "Garcia",
      "Rodriguez",
      "Wilson",
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName}`;
  }

  const dummyName = useMemo(() => {
    if (
      wallet?.selectedAddress &&
      typeof wallet.selectedAddress === "string" &&
      wallet.selectedAddress.trim() !== ""
    ) {
      return generateDummyName();
    }
    return "No User";
  }, [wallet?.selectedAddress]);

  useEffect(() => {
    if (wallet?.selectedAddress != undefined) {
      setSideProperties((prev) =>
        prev.map((item) => {
          if (item.title === "Notification") {
            return { ...item, no: 0 };
          } else if (item.title === "My Learning Journey") {
            return { ...item, no: takenCoursesData?.length };
          } else if (item.title === "Courses created") {
            return { ...item, no: courseData?.length };
          } else {
            return { ...item, no: 0 };
          }
        }),
      );
    }
  }, [wallet?.selectedAddress, courseData, takenCoursesData]);

  // Function to handle filter selection
  const handleFilterSelection = (filter: string) => {
    setSelected(filter);
    setFilterModalOpen(false); // Close the modal after selection
  };

  return (
    <>
      <div className="bg-gradient-to-r block lg:hidden from-[#4A90E2] to-[#9B51E0] py-4 px-8 xl:w-[400px]">
        <p className="text-white text-center text-sm">
          Your course creation progress saves automatically, but feel free to
          also save your progress manually
        </p>
      </div>
      <div className="pt-12 px-4">
        {/* User info */}

        <div className="bg-white py-4 px-8 rounded-xl border-[1px] border-[#BCBCBC] lg:w-[293px] xl:w-[400px]">
          <div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4">
                <div className="w-[54px] h-[54px]">
                  <Image
                    src={profilePic}
                    alt="profilePic"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="xl:w-[200px]">
                  <p className="text-[13px] text-[#2D3A4B] font-bold leading-[22px]">
                    {dummyName}
                  </p>
                  <p className="text-[#A01B9B] text-[12px] font-normal leading-[24px]">
                    {!!wallet?.selectedAddress &&
                    typeof wallet.selectedAddress === "string" &&
                    wallet.selectedAddress.trim() !== ""
                      ? shortHex(wallet.selectedAddress)
                      : "Connect Wallet"}
                  </p>
                </div>
              </div>

              <div>
                {page != "myCertificate" ? <IoMdArrowDropdown /> : null}
              </div>
            </div>
          </div>

          <div className="my-4">
            {page == "myCourse" &&
              coursesProgress.map((item, i) => (
                <div
                  key={i}
                  className="flex text-sm items-center space-x-6 my-4"
                >
                  <div className="flex items-center w-[160px]">
                    <IoMdInformationCircleOutline />
                    <p className="ml-3 text-[13px] text-[#333333] font-medium">
                      {item.title}
                    </p>
                  </div>

                  <div className="text-purple-400">
                    <div>{renderItem(item)}</div>
                  </div>
                </div>
              ))}

            {page == "myCertificate" &&
              certificateEarned.map((item, i) => (
                <div
                  key={i}
                  className="flex text-sm items-center justify-between my-4"
                >
                  <div className="flex items-center">
                    <IoMdInformationCircleOutline />
                    <p className="ml-3 text-[13px] text-[#333333] font-medium">
                      {item.title} :
                    </p>
                  </div>

                  <div>
                    <p className="text-[12px] text-[#817676]">
                      <span className="text-[#9B51E0]">{item.no} </span>
                      {item.type}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {page == "myCourse" &&
          sideProperties.map((item, i) => (
            <div key={i}>
              <div
                className={`bg-white py-4 px-8 rounded-xl border-[1px] border-[#BCBCBC] my-2 cursor-pointer hover:bg-violet-600 active:bg-violet-700 ${
                  selected == item.title
                    ? "focus:outline-none focus:ring focus:ring-violet-300"
                    : ""
                } `}
                onClick={() => setSelected(item.title)}
              >
                <div className="flex justify-between text-sm items-start">
                  <div className="flex items-center">
                    <div className="h-[15px] w-[18px]">
                      <Image
                        src={item.url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="ml-3 text-[14px] text-[#2D3A4B] font-bold leading-[19px]">
                      {item.title}{" "}
                      {item.no == 0 ? null : <span>({item.no})</span>}
                    </p>
                  </div>
                  <IoMdArrowDropdown />
                </div>
              </div>

              <div className="sm:hidden">
                {selected === item.title && (
                  <>
                    {coursesDetails.some((course) => course.tag === selected) &&
                      coursesDetails
                        .filter((course) => course.tag === selected)
                        .map((course, index) => (
                          <CoursesCreated
                            courseData={courseData}
                            key={index}
                            item={course}
                            selected={selected}
                          />
                        ))}

                    {learningDetails.some(
                      (journey) => journey.tag === selected,
                    ) &&
                      learningDetails.map((item, i) =>
                        item && item.tag == selected ? (
                          <LearningJourney
                            item={item}
                            takenCoursesData={takenCoursesData}
                            selected={selected}
                            key={i}
                          />
                        ) : null,
                      )}

                    {selected === "Create a course" && <CreateACourse />}

                    {selected === "Notification" && <Notification />}
                  </>
                )}
              </div>
            </div>
          ))}

        {/* Mobile Filter Section */}
        {page == "myCertificate" && (
          <div className="sm:hidden">
            <div className="flex justify-between mt-10 border-b-2 p-3">
              <div>
                <p>All NFTs</p>
              </div>

              <div
                className="flex cursor-pointer"
                onClick={() => setFilterModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                  />
                </svg>

                <h4 className="underline font-bold">Filter</h4>
              </div>
            </div>

            {/* Filter Modal */}
            {isFilterModalOpen && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-[90%] max-w-full">
                  <h2 className="text-lg font-bold mb-4">
                    Filter Certificates
                  </h2>
                  {certSideProperties.map((item, i) => (
                    <div
                      className={`border-[1px] border-[#BCBCBC] bg-[#FFFFFF] rounded-xl my-3 h-[62px] xl:w-[400px] px-6 flex items-center cursor-pointer hover:bg-violet-600 active:bg-violet-700 ${selected == item.title ? "focus:outline-none focus:ring focus:ring-violet-300" : ""} `}
                      key={i}
                      onClick={() => setFilterModalOpen(false)}
                    >
                      <div
                        className="flex justify-between text-sm items-center w-full"
                        onClick={() => {
                          setSelected(item.title);
                        }}
                      >
                        <div className="flex items-center">
                          <Image src={item.url} alt={item.title} />
                          <p className="ml-3 font-bold text-[14px] leading-[19px] text-[#2D3A4B]">
                            {item.title}{" "}
                          </p>
                        </div>

                        <div>
                          {selected == item.title ? (
                            <IoMdCheckmark color="green" size={20} />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="mt-4 w-full bg-violet-600 text-gray-900 py-2 rounded-lg"
                    onClick={() => setFilterModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Desktop display */}
        {page == "myCertificate" && (
          <div className="hidden sm:block my-4">
            <div className="flex space-x-3 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                />
              </svg>

              <h4 className="underline font-medium text-[13px] text-[#2D3A4B]">
                Filter
              </h4>
            </div>

            {certSideProperties.map((item, i) => (
              <div
                className={`border-[1px] border-[#BCBCBC] bg-[#FFFFFF] rounded-xl my-3 h-[62px] xl:w-[400px] px-6 flex items-center cursor-pointer hover:bg-violet-600 active:bg-violet-700 ${selected == item.title ? "focus:outline-none focus:ring focus:ring-violet-300" : ""} `}
                key={i}
              >
                <div
                  className="flex justify-between text-sm items-center w-full"
                  onClick={() => {
                    setSelected(item.title);
                  }}
                >
                  <div className="flex items-center">
                    <Image src={item.url} alt={item.title} />
                    <p className="ml-3 font-bold text-[14px] leading-[19px] text-[#2D3A4B]">
                      {item.title}{" "}
                    </p>
                  </div>

                  <div>
                    {selected == item.title ? (
                      <IoMdCheckmark color="green" size={20} />
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserSideBar;
