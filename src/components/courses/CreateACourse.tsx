import React from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import edit from "../../assets/edi.svg"
import tdesign_video from "../../assets/tdesign_video.svg"
import Image from "next/image"
import { useRouter } from "next/navigation"

const CreateACourse = () => {
  const router = useRouter()

  const handleCreateCourse = () => {
    sessionStorage.setItem("scrollPosition", `${window.scrollY}`)
    router.push("/Course/CreateACourse")
  }
  return (
    <div className="py-12 ">
      {/* header */}
      <div className="">
        <h1 className="font-bold py-5 text-[#A01B9B]">Create a course</h1>
        <div className="bg-white p-10 rounded border-[#bcbcbc] border">
          <div className="flex items-center justify-between text-sm">
            <div className="">
              <p className="font-bold">Let's get started</p>
              <p>Setup your course in a few easy steps</p>
            </div>
            <div>
              <button
                className="rounded bg-[#4A90E2] px-24 py-3 text-white text-sm"
                type="submit"
                onClick={handleCreateCourse}
              >
                Create a course
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="bg-white rounded border-[#bcbcbc] border my-12">
        <div className="flex justify-between items-center py-5 px-10 border-b border-[#bcbcbc]">
          <h1 className="font-bold py-5 text-[#A01B9B]">Drafts</h1>

          <div className="flex items-center">
            <p className="underline">Manage & publish</p>
            <Image src={edit} alt="edit" />
          </div>
        </div>

        <div className="p-10 flex items-center justify-between text-sm">
          <div className="flex-1">
            <div className="w-[80%] h-48 bg-[#d5d5d5] flex text-center justify-center">
              <Image src={tdesign_video} alt="tdesign_video" />
            </div>
          </div>
          <div className="flex-auto">
            <div>
              <p className="font-bold text-xl mb-3">
                Elementary Crypto Trading
              </p>
              <div>
                <ProgressBar completed={48} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateACourse