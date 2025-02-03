import React from "react"
import BootcampHero from "./BootcampHero"
import BootcampCarousell from "./BootcampCarousell"
import Organizations from "./Organizations"
import { FavoriteCourse } from "./FavoriteCourse"

const BootcampLanding = () => {
  return (
    <div className="h-auto w-full bg-[#f5f8fa]">
      <BootcampHero />
      <BootcampCarousell />
      <Organizations />
      <FavoriteCourse />
    </div>
  )
}

export default BootcampLanding
