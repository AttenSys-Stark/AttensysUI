"use client"
import React, { useEffect, useState } from "react"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Input,
} from "@headlessui/react"
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Logo from "@/assets/Logo.svg"
import Image from "next/image"
import { ConnectButton } from "./connect/ConnectButton"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { RESET } from "jotai/utils"
import { DisconnectButton } from "./DisconnectButton"
import { connect, disconnect } from "starknetkit"
import Coursedropdown from "./courses/Coursedropdown"
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext"
import { useAtom, useSetAtom } from "jotai"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { handleSubmit } from "@/utils/helpers"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"

import ImagenCourses1 from "@/assets/ImagenCourses1.png"
import ImagenCourses2 from "@/assets/ImagenCourses2.png"
import ImagenCourses3 from "@/assets/ImagenCourses3.png"

import Lupa from "@/assets/Lupa.png"
import PeopleBoot from "@/assets/PeopleBoot.png"
import ProfilePic from "@/assets/profile_pic.png"
import LupaPurple from "@/assets/LupaPurple.png"
import organizationHeader from "@/assets/organizationHeader.png"

const navigation = [
  { name: "Courses", href: "#", current: false },
  { name: "Events", href: "#", current: false },
  { name: "Bootcamps", href: "#", current: false },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

const Header = () => {
  const router = useRouter()
  const setWalletLatest = useSetAtom(walletStarknetkitLatestAtom)
  const setWalletNext = useSetAtom(walletStarknetkitNextAtom)
  const setConnectorData = useSetAtom(connectorDataAtom)
  const setConnector = useSetAtom(connectorAtom)
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom)
  const [searchValue, setSearchValue] = useState("")
  const [coursestatus, setcourseStatus] = useAtom(coursestatusAtom)
  const [status] = useAtom(coursestatusAtom)
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  )

  const [isBootcampsOpen, setIsBootcampsOpen] = useState(false)

  const handleChange = (event: { target: { value: any } }) => {
    setSearchValue(event.target.value)
  }

  const handleTabClick = (arg: string) => {
    if (arg == "Courses") {
      setcourseStatus(!coursestatus)
    } else if (arg == "Events") {
      setcourseStatus(false)
      setbootcampdropstat(false)
      router.push("/Events/events")
    } else if (arg == "Bootcamps") {
      // e.stopPropagation();
      setbootcampdropstat(!bootcampdropstat)
    }
  }
  const [isCoursesOpen, setIsCoursesOpen] = useState(false)

  useEffect(() => {
    setWalletLatest(RESET)
    setWalletNext(RESET)
    setConnectorData(RESET)
    setConnector(RESET)
  }, [])

  useEffect(() => {
    setWalletLatest(RESET)
    setWalletNext(RESET)
    setConnectorData(RESET)
    setConnector(RESET)
  }, [])

  return (
    <>
      <Disclosure
        as="nav"
        className={`${status ? "bg-[#FFFFFF] opacity-80 backdrop-blur-sm" : "bg-[#FFFFFF]"} pt-1 relative z-20 overflow-hidden w-[100%] clg:overflow-hidden clg:w-[98%] lclg:w-[100%] lclg:overflow-hidden ipad:w-[100%] ipad:overflow-hidden mx-auto`}
      >
        <div className="hidden sm:flex justify-center items-center sm:px-6 lg:px-8 lg:h-[85px] lg:my-auto clg:w-[100%] w-full">
          <div className="relative flex h-20 items-center justify-between w-[98%]">
            <div className="lg:flex flex-shrink-0 items-center flex justify-between clg:w-[55%] lclg:w-[46%] lclg:mx-auto clg:mx-auto space-x-6 clg:space-x-6 lclg:space-x-6 md:hidden sm:hidden">
              <Link href="/" className="cursor-pointer">
                <Image alt="Your Company" src={Logo} className="h-8 w-full" />
              </Link>
              <a
                href="/Explorer"
                className="w-[28%] lclg:w-[40%] flex justify-center text-[#9B51E0]"
              >
                Use our explorer
              </a>
              <div className="relative w-[550px] lclg:w-[380px]">
                <form onSubmit={(e) => handleSubmit(e, searchValue, router)}>
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
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  )}
                </form>
              </div>
            </div>

            <div className="flex items-center justify-center sm:items-stretch sm:justify-end">
              <div className="hidden lg:flex">
                <div className="flex xlg:space-x-24 text-sm">
                  {navigation.map((item, index) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? "bg-white text-[#333333]"
                          : "text-[#333333] hover:bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] hover:text-white",
                        "rounded-md px-3 py-2 font-medium cursor-pointer",
                      )}
                      onClick={(e) => handleTabClick(item.name)}
                    >
                      {item.name}{" "}
                      {index !== 1 && (
                        <span className="text-[10px] mx-1">
                          {item.current ? "▲" : "▼"}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:hidden lg:flex absolute inset-y-0 right-0 items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {wallet ? (
                <>
                  <DisconnectButton
                    disconnectFn={disconnect}
                    resetFn={() => {
                      setWallet(RESET)
                    }}
                  />
                </>
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>
        </div>

        {/* 🔹 HEADER FOR MOBILE */}
        <div className="flex justify-between items-center px-4 py-2 lg:hidden">
          {/* Hamburger menu */}
          <DisclosureButton className="text-gray-500 focus:outline-none">
            <Bars3Icon className="h-6 w-6" />
          </DisclosureButton>

          {/* Logo */}
          <Link href="/" className="flex justify-center flex-1">
            <Image alt="Attensys Logo" src={Logo} className="h-8 w-auto" />
          </Link>

          {/* Search icon on the right */}
          <button className="text-gray-500 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
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
        <DisclosurePanel className="lg:hidden bg-white shadow-md">
          <div className="flex flex-col h-full">
            {/* 📌 Barra superior con logo y botón de cerrar */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <Link href="/" className="flex items-center">
                <Image alt="Attensys Logo" src={Logo} className="h-8 w-auto" />
              </Link>
              {/* Close button */}

              <DisclosureButton className="text-gray-500 focus:outline-none">
                <XMarkIcon className="h-6 w-6" />
              </DisclosureButton>
            </div>
          </div>
          <div className="space-y-2 px-4 py-3">
            {/* 🟢 Wallet data */}

            <div className="flex items-center space-x-3 px-4 py-3 border-b">
              {wallet && wallet.account ? (
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
                      {wallet.account.name || "Connected User"}
                    </p>
                    <p className="text-[#9B51E0] text-sm">
                      {wallet.account.address
                        ? `${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-4)}`
                        : "Unknown"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full text-center py-2">
                  <p className="text-gray-500 text-sm">Not connected</p>
                </div>
              )}
            </div>

            {/* 🟢 Navigation */}

            <nav className="px-4 space-y-2">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Home
              </Link>
              <Link
                href="/Explorer"
                className="block px-3 py-2 text-[#9B51E0] font-semibold hover:bg-gray-200"
              >
                Use our explorer
              </Link>

              {/* 📌 Courses - DESPLEGABLE */}
              <div>
                <button
                  className="flex justify-between items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
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
                      href="/explore-courses"
                      className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
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
                      href="/my-courses"
                      className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
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
                      href="/my-certifications"
                      className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
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
                      href="/create-course"
                      className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
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
                href="/events"
                className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Events
              </Link>
            </nav>

            {/* 📌 Events - Direct link */}

            <div>
              <button
                className="flex justify-between items-center w-full px-7 py-2 text-gray-700 rounded-md hover:bg-gray-200"
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
                    href="/explore-bootcamps"
                    className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
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
                    href="/explore-bootcamps"
                    className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
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
                    href="/my-bootcamps"
                    className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200"
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
              {wallet ? (
                <button
                  onClick={() => {
                    disconnect()
                    setWallet(RESET)
                  }}
                  className="w-full bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] text-white py-2 rounded-md flex items-center justify-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25V9m-4.5 0h12m-9 0v9a2.25 2.25 0 0 0 2.25 2.25h3A2.25 2.25 0 0 0 15 18V9m-6 0h6"
                    />
                  </svg>
                  <span>Disconnect Wallet</span>
                </button>
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  )
}

export default Header
