import Image from "next/image"
import ex from "@/assets/ex.svg"
import correct from "@/assets/correct.png"

const MobileStudentApprovalCard = ({
  arg,
}: {
  arg: "both" | "check" | "cancel"
}) => {
  return (
    <div className="w-full bg-white border border-[#DADADA] rounded-[15px] py-7 px-5 space-y-3 relative">
      <div className="flex items-center justify-between ">
        <p>vladamirocks@gmail.com</p>
        <div className="bg-[#C5D3228C] rounded-[5px] px-[10px] py-[5px] text-[#115E2C] font-normal text-xs">
          Pending
        </div>
      </div>
      <h4 className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
        Victor Jegede
      </h4>
      <p className="text-[14px] leading-[17px] text-[#9B51E0] font-normal">
        11 Oct, 2024 | 10:25 PM
      </p>
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 ${arg == "both" ? "right-5" : "right-16 md:right-5"} flex items-center  gap-[6px]`}
      >
        <Image
          className={arg == "cancel" || arg == "both" ? "block" : "hidden"}
          src={ex}
          alt="cancel"
        />
        <Image
          className={arg == "check" || arg == "both" ? "block" : "hidden"}
          src={correct}
          alt="check"
        />
      </div>
    </div>
  )
}

export default MobileStudentApprovalCard
