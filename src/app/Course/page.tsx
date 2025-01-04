"use client"
import React from "react"
import Coursedropdown from "@/components/courses/Coursedropdown"
import { useAtom, useSetAtom } from "jotai"
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext"
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown"
import Explore from "@/components/courses/Explore"
import CourseNews from "@/components/courses/CourseNews"

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom)
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  )

  const handlePageClick = () => {
    setbootcampdropstat(false)
    setstatus(false)
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

      <CourseNews />
      <Explore />
    </div>
  )
}

export default Index
