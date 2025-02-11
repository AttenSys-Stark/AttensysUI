"use client";
import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import Image from "next/image";
import cancel from "@/assets/cancel.svg";
import { addclassmodal } from "@/state/connectedWalletStarknetkitNext";
import clsx from "clsx";
import { FaPlus } from "react-icons/fa6";
import cloud from "@/assets/cloud.svg";
import dividers from "@/assets/Dividers.svg";

export default function UploadModal(prop: any) {
  const [open, setOpen] = useState(prop.status);
  const [addClass, setAddclass] = useAtom(addclassmodal);

  useEffect(() => {
    if (open) {
      window.scrollTo({
        top: Math.max(0, 130), // Scroll up by 100 pixels
        behavior: "smooth",
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[#0F0E0E82] transition-opacity"
      />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel className="relative h-[800px] w-[988px] transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8">
            <div className="px-10 flex justify-between pt-10 cursor-pointer">
              <h1 className="text-[22px] font-semibold leading-[31px] text-[#5801A9]">
                Course Outline upload
              </h1>
              <Image
                src={cancel}
                alt="cancel"
                onClick={() => {
                  setOpen(false);
                  setAddclass(false);
                }}
              />
            </div>

            <div className="w-[90%] mx-auto h-[75%] my-auto border-[1px] bg-[#EFEFEF52] border-[#C2C2C2] rounded-xl mt-7 px-8 py-6 space-y-4 overflow-y-scroll">
              <div className="space-y-2">
                <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
                  Topic:
                </h1>
                <Field>
                  <Input
                    placeholder="Class title "
                    className={clsx(
                      "h-[55px] border-[2px] border-[#D0D5DD] block md:w-[50%] rounded-lg bg-white/5 py-1.5 px-3 w-full text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
                  Class Description
                </h1>
                <Field>
                  <textarea
                    placeholder="A short overview of the class, its focus areas..."
                    className={clsx(
                      "h-[126px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full md:w-[90%] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
                  Assignment
                </h1>
                <Field>
                  <textarea
                    placeholder="Assignment description"
                    className={clsx(
                      "h-[126px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full md:w-[90%] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
                <div className="flex space-x-10">
                  <div className="cursor-pointer relative flex items-center space-x-3 w-[130px]">
                    <FaPlus className="text-[#5801A9]" />
                    <h1 className="text-[15px] leading-[18px] font-light text-[#5801A9]">
                      Resources
                    </h1>
                  </div>
                  <div className="cursor-pointer relative flex items-center space-x-3 w-[130px]">
                    <FaPlus className="text-[#5801A9]" />
                    <h1 className="text-[15px] leading-[18px] font-light text-[#5801A9]">
                      Assignment
                    </h1>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h1 className="text-[16px] leading-[23px] font-semibold text-[#2D3A4B]">
                  Upload Recording
                </h1>

                <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:space-x-16">
                  <div className="h-[316px] w-full md:w-[459px] mt-3 rounded-lg  flex flex-col md:flex-row justify-center items-center">
                    <div className="h-[246px] w-full md:w-[400px] border-[3px] border-dotted border-[#D0D5DD] bg-[#FFFFFF] rounded-xl space-y-3 flex flex-col items-center justify-center">
                      <Image src={cloud} alt="upload" />
                      <h1 className="text-[14px] text-[#475367] font-light leading-[20px]">
                        <span className="text-[#4A90E2]">Click to upload</span>{" "}
                        or drag and drop
                      </h1>
                      <p className="text-[12px] text-[#475367] font-light leading-[17px]">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                      <Image src={dividers} alt="divider" className="mt-7" />
                      <input
                        // ref={logoInputRef}
                        type="file"
                        accept="image/jpeg, image/jpg, image/png"
                        // onChange={handleLogoChange}
                        style={{ display: "none" }} // Hide the input
                      />
                      <Button className="h-[36px] w-[118px] flex justify-center items-center bg-[#9B51E0] rounded-xl text-[14px] text-[#FFFFFF] font-light leading-[20px]">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <h1 className="w-[254px] text-[14px] font-light text-[#2D3A4B] leading-[21px]">
                      Upload your Recorded class here for your students to watch
                      later
                    </h1>
                    <div className="h-auto py-4 md:py-0 md:h-[166px] w-full md:w-[251px] border-[3px] border-dotted border-[#D0D5DD] bg-[#FFFFFF] rounded-xl space-y-3 md:space-y-0 flex flex-col items-center justify-center">
                      <Image src={cloud} alt="upload" />
                      <h1 className="text-[14px] md:text-[8px] text-[#475367] font-light leading-[20px]">
                        <span className="text-[#4A90E2]">Click to upload</span>{" "}
                        or drag and drop
                      </h1>
                      <p className="text-[12px] md:text-[7.5px] text-[#475367] font-light leading-[17px]">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                      <Image src={dividers} alt="divider" className="mt-7" />
                      <Button className="h-[36px] md:h-[23px] w-[118px] md:w-[74px] flex justify-center items-center bg-[#9B51E0] rounded-xl text-[14px] md:text-[8px] text-[#FFFFFF] font-light leading-[20px]">
                        Browse Files
                      </Button>
                    </div>
                    <h1 className="text-[18px] text-[#333333] font-semibold leading-[31px] ">
                      Upload thumbnail
                    </h1>
                    <p className="w-[254px] text-[14px] font-light text-[#2D3A4B] leading-[21px]">
                      Upload your bootcamp image here. 750x422 pixels; .jpg,
                      .jpeg,. gif, or .png.{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end my-5 px-16">
              <div
                onClick={() => {
                  setOpen(false);
                  setAddclass(false);
                }}
                className="h-[47px] w-[342px] rounded-xl bg-[#9B51E0] flex items-center justify-center cursor-pointer"
              >
                <h1 className="text-[#FFFFFF] text-[14px] font-semibold leading-[16px]">
                  Save updates
                </h1>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
