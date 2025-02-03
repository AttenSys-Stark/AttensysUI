import React, { useEffect, useRef, useState } from "react"
import Heading from "./Heading"
import Panel from "./Panel"
import Organizationtabs from "./Organizationtabs"
import Create from "./Create"
import { createbootcampoverlay } from "@/state/connectedWalletStarknetkitNext"
import { useAtom } from "jotai"

const Organizationlanding = (prop: any) => {
  const [createOverlayStat] = useAtom(createbootcampoverlay)
  const [orgHeight, setOrgHeight] = useState<number | null>(null) // State to store the height
  const landingRef = useRef<HTMLDivElement>(null) // Ref for OrganizationLanding

  useEffect(() => {
    // Update height dynamically
    if (landingRef.current) {
      setOrgHeight(landingRef.current.offsetHeight)
    }
  }, [createOverlayStat])

  useEffect(() => {
    if (createOverlayStat) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [createOverlayStat])
  return (
    <div ref={landingRef} className="h-auto bg-[#f5f8fa] relative">
      {createOverlayStat && <Create height={orgHeight} />}
      <Heading />
      <Panel />
      <Organizationtabs />
    </div>
  )
}

export default Organizationlanding
