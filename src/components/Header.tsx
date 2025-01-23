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
import harmburger from "@/assets/hamburger.svg"
import search_solid from "@/assets/search_solid.svg"
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

const navigation = [
  { name: "Courses", href: "/Course", current: false },
  { name: "Events", href: "/Events", current: false },
  { name: "Bootcamps", href: "/Bootcamps", current: false },
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
        className={`${status ? "bg-[#FFFFFF] opacity-80 backdrop-blur-sm" : "bg-[#FFFFFF]"} h-full max-w-screen-2xl flex flex-col items-center justify-center lg:h-full relative z-20 overflow-hidden w-[100%] clg:overflow-hidden clg:w-[98%] lclg:w-[100%] lclg:overflow-hidden ipad:w-[100%] ipad:overflow-hidden mx-auto`}
      >
        <div className="hidden xl:flex justify-center items-center px-4 sm:px-6 lg:px-10 xl:px-0 lg:h-[85px] lg:my-auto clg:w-[100%] w-full">
          <div className="relative flex h-20 items-center justify-between xl:w-full xl:px-5">
            <div className="lg:flex flex-shrink-0 items-center flex justify-between clg:w-[55%] lclg:w-[46%] xl:w-[48%] space-x-6 clg:space-x-6 lclg:space-x-6  md:hidden sm:hidden">
              <Link href="/" className="cursor-pointer">
                <Image alt="Your Company" src={Logo} className="h-8 w-full" />
              </Link>
              <a
                href="/Explorer"
                className="w-[45%] lclg:w-[40%] flex justify-center text-[#9B51E0]"
              >
                Use our explorer
              </a>
              <div className="relative 2xl:w-[550px] lclg:w-[380px] w-full">
                <form onSubmit={(e) => handleSubmit(e, searchValue, router)}>
                  <Input
                    name="search by address"
                    type="text"
                    placeholder="       Search by address"
                    value={searchValue}
                    onChange={handleChange}
                    className="w-[80%] clg:w-[70%] lclg:w-[90%] xl:w-full p-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
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
                        "rounded-md px-3 lg:!ml-0 pr-2 xl:py-2 font-medium cursor-pointer",
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
            <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
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

        {/* mobile  */}
        <div className="relative inset-y-0 left-0 flex px-4 py-4 w-full justify-between items-center xl:hidden">
          <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span className="absolute -inset-0.5" />
            <span className="sr-only">Open main menu</span>
            {/* <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" /> */}
            <Image src={harmburger} alt="" aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />

            <XMarkIcon aria-hidden="true" className="hidden invert h-6 w-6 group-data-[open]:block" />
          </DisclosureButton>
          <Link href="/" className="cursor-pointer">
                <Image alt="Your Company" src={Logo} className="h-8 w-full" />
          </Link>
          <Image src={search_solid} alt="" aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />              
        </div>

        <DisclosurePanel className="xl:hidden">
          <div className="space-y-1 px-2 pb-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  )
}

export default Header
