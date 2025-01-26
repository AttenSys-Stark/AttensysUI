"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/router"
import { useParams } from "next/navigation"
import {
  coursestatusAtom,
  bootcampdropdownstatus,
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { RESET } from "jotai/utils"
import { connect, disconnect } from "starknetkit"
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants"

import Coursedropdown from '@/components/courses/Coursedropdown'
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown"
import { useAtom, useSetAtom } from "jotai"
import BootcampLanding from "@/components/bootcamp/BootcampLanding"

const Index = () => {
  const [courseDropdown, setCourseDropdown] = useAtom(coursestatusAtom)
  const [bootcampDropdown, setBootcampDropdown] = useAtom(
    bootcampdropdownstatus,
  )
  const setWalletLatest = useSetAtom(walletStarknetkitLatestAtom)
  const setWalletNext = useSetAtom(walletStarknetkitNextAtom)
  const setConnectorData = useSetAtom(connectorDataAtom)
  const setConnector = useSetAtom(connectorAtom)

  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom)

  useEffect(() => {
    setWalletLatest(RESET)
    setWalletNext(RESET)
    setConnectorData(RESET)
    setConnector(RESET)
  }, [])

  useEffect(() => {
    const autoConnect = async () => {
      try {
        const { wallet: connectedWallet } = await connect({
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
        })
        setWallet(connectedWallet)
      } catch (e) {
        console.error(e)
        alert((e as any).message)
      }
    }

    if (!wallet) {
      autoConnect()
    }
  }, [wallet])
  const handlePageClick = () => {
    setBootcampDropdown(false)
    setCourseDropdown(false)
  }
  return (
    <div onClick={handlePageClick}>
      {courseDropdown && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      {bootcampDropdown && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      <div onClick={(e) => e.stopPropagation()}>
        <Coursedropdown />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Bootcampdropdown />
      </div>
      <BootcampLanding />
    </div>
  )
}

export default Index
