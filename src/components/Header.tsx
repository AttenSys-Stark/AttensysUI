"use client";
import React, { useEffect, useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Input,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "@/assets/Logo.svg";
import Image from "next/image";
import { ConnectButton } from "./connect/ConnectButton";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { RESET } from "jotai/utils";
import { DisconnectButton } from "./DisconnectButton";
import { connect, disconnect } from "starknetkit";
import Coursedropdown from "./courses/Coursedropdown";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom, useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleSubmit } from "@/utils/helpers";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import ImagenCourses1 from "@/assets/ImagenCourses1.png";
import ImagenCourses2 from "@/assets/ImagenCourses2.png";
import ImagenCourses3 from "@/assets/ImagenCourses3.png";

import Lupa from "@/assets/Lupa.png";
import PeopleBoot from "@/assets/PeopleBoot.png";
import ProfilePic from "@/assets/profile_pic.png";
import LupaPurple from "@/assets/LupaPurple.png";
import organizationHeader from "@/assets/organizationHeader.png";
import { courseQuestions } from "@/constants/data";
import { useWallet } from "@/hooks/useWallet";
import { NetworkSwitchButton } from "./connect/NetworkSwitchButton";
import { connectWallet } from "@/utils/connectWallet";
import { CatridgeConnect } from "./connect/CatridgeConnect";
import { useAccount, useConnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { ArgentInvisibleButton } from "./connect/ArgentInvisibleButton";
import { useArgentInvisible } from "@/hooks/useArgentInvisible";
import { ProviderSelector } from "./auth/ProviderSelector";

const navigation = [
  { name: "Courses", href: "#", current: false },
  { name: "Events", href: "#", current: false },
  { name: "Bootcamps", href: "#", current: false },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const router = useRouter();
  const [wallet] = useAtom(walletStarknetkit);
  const [searchValue, setSearchValue] = useState("");
  const [coursestatus, setcourseStatus] = useAtom(coursestatusAtom);
  const [status] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const {
    disconnectWallet,
    isCorrectNetwork,
    setIsCorrectNetwork,
    wallet: hookWallet,
    isConnecting,
  } = useWallet();
  const { account, address } = useAccount();
  const { connect, connectors } = useConnect();
  const controller = connectors[0] as ControllerConnector;
  const [username, setUsername] = useState<string>();
  // const [networkCorrect, setNetworkCorrect] = useState(isCorrectNetwork)
  const [isBootcampsOpen, setIsBootcampsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [error, setError] = useState("");

  const [showProviderSelector, setShowProviderSelector] = useState(false);

  const { account: argentAccount, isLoading } = useArgentInvisible();

  const handleChange = (event: { target: { value: any } }) => {
    setSearchValue(event.target.value);
    if (error) setError("");
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!searchValue.trim()) {
      e.preventDefault();
      setError("Please enter an address to search");
      return;
    }

    handleSubmit(e, searchValue, router);
  };

  const handleDropdownClose = () => {
    if (coursestatus) {
      setcourseStatus(false);
    } else if (bootcampdropstat) {
      setbootcampdropstat(false);
    }
  };

  const handleTabClick = (arg: string) => {
    setcourseStatus(false);
    setbootcampdropstat(false);
    if (arg == "Courses") {
      setcourseStatus(!coursestatus);
      setbootcampdropstat(false);
    } else if (arg == "Events") {
      // router.push("/Discoverevent");
    } else if (arg == "Bootcamps") {
      // e.stopPropagation();
      // setbootcampdropstat(!bootcampdropstat);
      // setcourseStatus(false);
    }
  };
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);

  useEffect(() => {
    setIsCorrectNetwork(isCorrectNetwork);
  }, [isCorrectNetwork, hookWallet, wallet]);

  const handleMobileNavClick = () => {
    setIsOpen(false);
    setIsCoursesOpen(false);
    setIsBootcampsOpen(false);
  };

  useEffect(() => {
    if (!address) return;
    controller.username()?.then((n) => setUsername(n));
  }, [address, controller]);

  return (
    <>
      <Disclosure
        as="nav"
        className={`${status ? "bg-white opacity-80 backdrop-blur-sm" : "bg-white"} 
    pt-1 relative z-20 overflow-hidden 
    w-[98%] mx-auto 
     lclg:w-[100%] clg:w-[98%] xlg:w-[100%]`}
        onClick={() => handleDropdownClose()}
      >
        {({ open, close }) => (
          <>
            <div className="lg:flex hidden sm:hidden justify-center items-center sm:px-6 lg:px-8 lg:h-[85px] lg:my-auto clg:w-[100%] w-full sm1275:hidden">
              <div className="relative flex h-20 items-center justify-between w-[98%]">
                <div className="lg:flex flex-shrink-0 items-center flex justify-between clg:w-[55%] lclg:w-[46%] lclg:mx-auto clg:mx-auto space-x-6 clg:space-x-6 lclg:space-x-6 md:hidden sm:hidden">
                  <Link href="/" className="cursor-pointer">
                    <Image
                      alt="Your Company"
                      src={Logo}
                      className="w-full h-8"
                    />
                  </Link>
                  <a
                    href="/Explorer"
                    className="w-[28%] lclg:w-[40%] flex justify-center text-[#9B51E0]"
                  >
                    Use our explorer
                  </a>
                  <div className="relative w-[550px] lclg:w-[380px]">
                    <form onSubmit={onSubmit}>
                      <Input
                        name="search by address"
                        type="text"
                        placeholder="       Search by address"
                        value={searchValue}
                        onChange={handleChange}
                        className="w-[80%] clg:w-[70%] lclg:w-[90%] p-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
                      />
                      {!searchValue && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                          />
                        </svg>
                      )}
                      {error && (
                        <p className="absolute left-0 text-sm text-red-500 -bottom-6">
                          {error}
                        </p>
                      )}
                    </form>
                  </div>
                </div>

                <div className="flex items-center justify-center sm:items-stretch sm:justify-end">
                  <div className="hidden lg:flex">
                    <div className="flex text-sm xlg:space-x-24">
                      {navigation.map((item, index) => {
                        const isComingSoon =
                          item.name === "Events" || item.name === "Bootcamps";

                        return (
                          <div key={item.name} className="relative group">
                            <a
                              href={isComingSoon ? "#" : item.href}
                              aria-current={item.current ? "page" : undefined}
                              className={classNames(
                                item.current
                                  ? "bg-white text-[#333333]"
                                  : isComingSoon
                                    ? "text-gray-400 cursor-not-allowed" // Greyed out style
                                    : "text-[#333333] hover:bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] hover:text-white",
                                "rounded-md px-3 py-2 font-medium cursor-pointer",
                              )}
                              onClick={(e) => {
                                if (isComingSoon) {
                                  e.preventDefault(); // Prevent navigation for coming soon items
                                } else {
                                  handleTabClick(item.name);
                                }
                              }}
                            >
                              {item.name}{" "}
                              {index !== 1 && (
                                <span className="text-[10px] mx-1">
                                  {item.current ? "▲" : "▼"}
                                </span>
                              )}
                            </a>

                            {/* Tooltip for coming soon features */}
                            {isComingSoon && (
                              <div className="absolute z-10 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-700 rounded whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2">
                                Feature is coming soon
                                <div className="absolute w-2 h-2 bg-gray-700 rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 items-center hidden md:hidden lg:flex sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <div className="flex items-center space-x-4">
                    {!address && !argentAccount ? (
                      <button
                        onClick={() => setShowProviderSelector(true)}
                        className="flex rounded-md xl:rounded-lg bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] py-2 px-2 xl:px-3 data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
                      >
                        <div className="flex items-center space-x-2 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03 4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                            />
                          </svg>
                          <span className="text-sm font-semibold">LOGIN</span>
                        </div>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-4">
                        {argentAccount || isLoading ? (
                          <ArgentInvisibleButton />
                        ) : (
                          <CatridgeConnect />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 🔹 HEADER FOR MOBILE */}
            <div className="flex items-center justify-between px-4 py-2 lg:hidden sm1275:flex">
              {/* Hamburger menu */}
              <DisclosureButton className="text-gray-500 focus:outline-none ">
                <Bars3Icon className="w-6 h-6" />
              </DisclosureButton>

              {/* Logo */}
              <Link
                href="/"
                className="flex justify-center flex-1"
                onClick={() => close()}
              >
                <Image alt="Attensys Logo" src={Logo} className="w-auto h-8" />
              </Link>

              {/* Search icon on the right */}
              <button className="text-gray-500 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>

            {/* 🔹 MOBILE MENU DROP-DOWN PANEL */}
            <DisclosurePanel className="fixed top-0 left-0 right-0 h-auto bg-white shadow-md lg:hidden sm1275:block overflow-y-auto">
              <div className="flex flex-col h-full">
                {/* 📌 Barra superior con logo y botón de cerrar */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => close()}
                  >
                    <Image
                      alt="Attensys Logo"
                      src={Logo}
                      className="w-auto h-8"
                    />
                  </Link>
                  {/* Close button */}

                  <DisclosureButton className="text-gray-500 focus:outline-none">
                    <XMarkIcon className="w-6 h-6" />
                  </DisclosureButton>
                </div>
              </div>
              <div className="px-4 py-3 space-y-2">
                {/* 🟢 Wallet data */}

                <div className="flex items-center px-4 py-3 space-x-3 border-b">
                  {account ? (
                    <>
                      {/* Profile picture */}

                      <Image
                        src={ProfilePic}
                        alt="Profile Picture"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />

                      {/* Wallet information */}

                      <div>
                        <p className="font-semibold text-gray-900">
                          {username || "Connected User"}
                        </p>
                        <p className="text-[#9B51E0] text-sm">
                          {address
                            ? `${address.slice(0, 6)}...${address.slice(-4)}`
                            : "Unknown"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full py-2 text-center">
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  )}
                </div>

                {/* 🟢 Navigation */}

                <nav className="px-4 space-y-2">
                  <Link
                    href="/"
                    className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                    onClick={() => close()}
                  >
                    Home
                  </Link>
                  <Link
                    href="/Explorer"
                    className="block px-3 py-2 text-[#9B51E0] font-semibold hover:bg-gray-200"
                    onClick={() => close()}
                  >
                    Use our explorer
                  </Link>

                  {/* 📌 Courses - DESPLEGABLE */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                      onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                    >
                      <span>Courses</span>
                      {isCoursesOpen ? (
                        <ChevronUpIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                      )}
                    </button>

                    {isCoursesOpen && (
                      <div className="pl-4 mt-2 space-y-2">
                        <Link
                          href="/Course"
                          className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                          onClick={() => close()}
                        >
                          <Image
                            src={LupaPurple}
                            alt="Explore Courses"
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                          Explore Courses
                        </Link>

                        <Link
                          href={`/mycoursepage/${address}`}
                          className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                          onClick={() => close()}
                        >
                          <Image
                            src={ImagenCourses2}
                            alt="My Courses"
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                          My Courses
                        </Link>

                        <Link
                          href={`/Certifications/${address}`}
                          className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                          onClick={() => close()}
                        >
                          <Image
                            src={ImagenCourses3}
                            alt="My Certifications"
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                          My Certifications
                        </Link>

                        <Link
                          href={`/Course/CreateACourse/${courseQuestions[0]}`}
                          className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                          onClick={() => close()}
                        >
                          <Image
                            src={ImagenCourses3}
                            alt="Create a Course"
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                          Create a Course
                        </Link>
                      </div>
                    )}
                  </div>
                  {/* 📌 Events - Enlace directo */}
                  <Link
                    href="/Discoverevent"
                    className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                    onClick={() => close()}
                  >
                    Events
                  </Link>
                </nav>

                {/* 📌 Events - Direct link */}

                <div>
                  <button
                    className="flex items-center justify-between w-full py-2 text-gray-700 rounded-md px-7 hover:bg-gray-200"
                    onClick={() => setIsBootcampsOpen(!isBootcampsOpen)}
                  >
                    <span>Bootcamps</span>
                    {isBootcampsOpen ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </button>

                  {isBootcampsOpen && (
                    <div className="pl-4 mt-2 space-y-2">
                      <Link
                        href="/Bootcamps"
                        className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                        onClick={() => close()}
                      >
                        <Image
                          src={Lupa}
                          alt="Explore Bootcamps"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Explore Bootcamps
                      </Link>

                      <Link
                        href="/Createorganization"
                        className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                        onClick={() => close()}
                      >
                        <Image
                          src={organizationHeader}
                          alt="Explore Bootcamps"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Create organization
                      </Link>

                      <Link
                        href="/Mybootcamps"
                        className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                        onClick={() => close()}
                      >
                        <Image
                          src={PeopleBoot}
                          alt="My Bootcamps"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        My Bootcamps
                      </Link>
                    </div>
                  )}
                </div>

                {/* 🔹 Connect/Disconnect Wallet button */}

                <div className="px-4 py-3">
                  <div className="flex items-center space-x-4">
                    {!address && !argentAccount ? (
                      <button
                        onClick={() => setShowProviderSelector(true)}
                        className="flex rounded-md xl:rounded-lg bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] py-2 px-2 xl:px-3 data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
                      >
                        <div className="flex items-center space-x-2 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03 4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                            />
                          </svg>
                          <span className="text-sm font-semibold">Connect Wallet</span>
                        </div>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-4">
                        {argentAccount ? (
                          <ArgentInvisibleButton />
                        ) : (
                          <CatridgeConnect />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      {showProviderSelector && (
        <ProviderSelector onClose={() => setShowProviderSelector(false)} />
      )}
    </>
  );
};

export default Header;
