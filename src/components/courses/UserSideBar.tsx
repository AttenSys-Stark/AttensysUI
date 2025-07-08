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
import ControllerConnector from "@cartridge/connector/controller";
import { useAccount, useConnect } from "@starknet-react/core";

import { Check, Copy, Key, Shield } from "lucide-react";
import BalanceModal from "./BalanceModal";
import PrivateKeyModal from "./PrivateKeyModal";

interface UserSideBarProps {
  wallet: any;
  courses: any;
  courseData: any;
  takenCoursesData: any;
  validCertificates: any;
  page: string;
  selected: string;
  setSelected: (value: string) => void;
  refreshCourses: () => Promise<void>;
  username: string;
  address: string;
}
interface argprop {
  no: number;
  title: string;
}
const UserSideBar = ({
  wallet,
  courses,
  courseData,
  takenCoursesData,
  validCertificates,
  page,
  selected = "All NFTs",
  setSelected,
  refreshCourses,
  username,
  address,
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
  const { connect, connectors } = useConnect();
  // const controller = connectors[0] as ControllerConnector;
  // const { address } = useAccount();
  // const [username, setUsername] = useState<string>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [isFilterModalOpen, setFilterModalOpen] = useState(false); // State for filter modal
  const [isPrivateKeyModalOpen, setIsPrivateKeyModalOpen] = useState(false); // State for private key modal

  const [certificateEarned, setCertificateEarned] = useState([
    {
      title: "All NFTs",
      no: 0,
      type: "NFTs",
    },
    {
      title: "Bootcamp",
      no: 0,
      type: "NFTs",
    },
    {
      title: "Course",
      no: 0,
      type: "NFTs",
    },
  ]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSectionClick = (title: string) => {
    if (activeSection === title) {
      setActiveSection(null);
    } else {
      setActiveSection(title);
    }
    setSelected(title);
    // setIsDropdownOpen(false);
  };

  const handleCopy = () => {
    if (!address || typeof address !== "string" || address.trim() === "")
      return;

    navigator.clipboard
      .writeText(
        address.startsWith("0x") ? "0x0" + address.slice(2) : "0x0" + address,
      )
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy address:", err);
      });
  };

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
    } else if (arg.title == "Created") {
      return (
        <div className="text-[12px] ">
          <span>{courseData.length}</span> Course{arg.no > 1 ? "(s)" : ""}
        </div>
      );
    }
  };

  // useEffect(() => {
  //   if (!address) return;
  //   controller.username()?.then((n) => setUsername(n));
  //   console.log(address, "address");
  // }, [address, controller]);

  useEffect(() => {
    if (wallet?.address != undefined) {
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
  }, [wallet?.address, courseData, takenCoursesData]);

  useEffect(() => {
    if (validCertificates) {
      // Calculate total number of certificates (all valid certificates)
      const totalCertificates = validCertificates.length;

      // Calculate number of bootcamp certificates (currently 0 as we don't have bootcamp data)
      const bootcampCertificates = 0;

      // Calculate number of course certificates (all current certificates are course certificates)
      const courseCertificates = validCertificates.length;

      const updatedCertificates = [
        {
          title: "All NFTs",
          no: totalCertificates,
          type: "NFTs",
        },
        {
          title: "Bootcamp",
          no: bootcampCertificates,
          type: "NFTs",
        },
        {
          title: "Course",
          no: courseCertificates,
          type: "NFTs",
        },
      ];

      setCertificateEarned(updatedCertificates);
    } else {
      console.log("No valid certificates available");
      // Reset to 0 if no valid certificates
      setCertificateEarned([
        {
          title: "All NFTs",
          no: 0,
          type: "NFTs",
        },
        {
          title: "Bootcamp",
          no: 0,
          type: "NFTs",
        },
        {
          title: "Course",
          no: 0,
          type: "NFTs",
        },
      ]);
    }
  }, [validCertificates]);

  useEffect(() => {
    refreshCourses(); // Fetch courses when the wallet address changes
  }, []);

  // Set activeSection to match selected prop
  useEffect(() => {
    if (selected && selected !== "All NFTs") {
      setActiveSection(selected);
    }
  }, [selected]);

  return (
    <>
      {/* <div className="bg-gradient-to-r block lg:hidden from-[#4A90E2] to-[#9B51E0] py-4 px-8 xl:w-[400px]">
        <p className="text-white text-center text-sm">
          Your course creation progress saves automatically, but feel free to
          also save your progress manually
        </p>
      </div> */}
      <div className="pt-12 px-4">
        {/* User info */}

        <div className="bg-white py-4 px-8 rounded-xl border-[1px] border-[#BCBCBC] lg:w-[293px] xl:w-[400px] mb-6">
          <div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4 w-full">
                <div className="w-[54px] h-[54px]">
                  <Image
                    src={profilePic}
                    alt="profilePic"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="xl:w-full w-full">
                  <p className="text-[13px] text-[#2D3A4B] font-bold leading-[22px]">
                    {username}
                  </p>
                  <div className="flex space-x-2 w-full">
                    <p
                      onClick={handleCopy}
                      className="text-[#A01B9B] cursor-pointer text-[12px] font-normal leading-[24px]"
                    >
                      {!!address &&
                      typeof address === "string" &&
                      address.trim() !== ""
                        ? shortHex(
                            address.startsWith("0x")
                              ? "0x0" + address.slice(2)
                              : "0x0" + address,
                          )
                        : "Login"}
                    </p>
                    <div className="flex justify-between w-full">
                      <div>
                        {!!address && typeof address === "string" && (
                          <span onClick={handleCopy} className="cursor-pointer">
                            {copied ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-center">
                        {/* Private Key Security Button */}
                        {!!address &&
                          typeof address === "string" &&
                          address.trim() !== "" && (
                            <div className="">
                              <button
                                onClick={() => setIsPrivateKeyModalOpen(true)}
                                className="flex items-center space-x-2 text-[11px] text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                              >
                                <Shield size={12} />
                                <span>View Private Key</span>
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`
        overflow-hidden
        transition-all duration-300 ease-in-out
        ${isDropdownOpen && page != "myCertificate" ? "max-h-[220px] opacity-100" : "max-h-0 opacity-0"}
      `}
            >
              <BalanceModal account={wallet} address={address} />
            </div>
          </div>

          <div className="my-4 mb-8">
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
          <div className="mb-5"></div>
        </div>

        {page == "myCourse" &&
          sideProperties.map((item, i) => (
            <div key={i}>
              <div
                className={`bg-white py-4 px-8 rounded-xl border-[1px] border-[#BCBCBC] my-2 cursor-pointer hover:bg-violet-600 active:bg-violet-700 ${
                  activeSection === item.title
                    ? "focus:outline-none focus:ring focus:ring-violet-300"
                    : ""
                } `}
                onClick={() => handleSectionClick(item.title)}
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
                  <IoMdArrowDropdown
                    className={`transition-transform duration-200 ${
                      activeSection === item.title ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="sm:hidden">
                {activeSection === item.title && (
                  <>
                    {"Courses created" == item.title && (
                      <CoursesCreated
                        courseData={courseData}
                        item={{ courses }}
                        selected={item.title}
                        key={courses[0]?.course_identifier || "no-courses"}
                        refreshCourses={refreshCourses}
                      />
                    )}

                    {learningDetails.some(
                      (journey) => journey.tag === item.title,
                    ) &&
                      learningDetails.map((item, i) =>
                        item && item.tag == activeSection ? (
                          <LearningJourney
                            item={item}
                            takenCoursesData={takenCoursesData}
                            selected={activeSection}
                            key={i}
                          />
                        ) : null,
                      )}

                    {item.title === "Create a course" && <CreateACourse />}

                    {item.title === "Notification" && (
                      <Notification wallet={wallet} address={address} />
                    )}
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

      {/* Private Key Modal */}
      <PrivateKeyModal
        isOpen={isPrivateKeyModalOpen}
        onClose={() => setIsPrivateKeyModalOpen(false)}
        address={address}
      />
    </>
  );
};

export default UserSideBar;
