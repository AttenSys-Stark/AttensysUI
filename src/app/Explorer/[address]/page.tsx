"use client"
import React from "react"
import Coursedropdown from "@/components/courses/Coursedropdown"
import { useAtom, useSetAtom } from "jotai"
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext"
import ExplorePage from "@/components/explorer/ExplorePage"
import { useParams } from "next/navigation"
// import ExplorerLanding from "@/components/explorer/ExplorerLanding"
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown"
import ExploreResult from "@/components/explorer/result/ExploreResult"

const Index = () => {
  const [status, setStatus] = useAtom(coursestatusAtom)
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  )

  const params = useParams()

  const handlePageClick = () => {
    setbootcampdropstat(false)
    setStatus(false)
  }

  return (
    <div onClick={handlePageClick}>
      {status && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      {bootcampdropstat && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      <div onClick={(e) => e.stopPropagation()}>
        <Coursedropdown />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Bootcampdropdown />
      </div>

      <ExploreResult params={params} />
    </div>
  )
}

export default Index
