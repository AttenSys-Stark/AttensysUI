"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Field,
  Input,
} from "@headlessui/react";
import { useAtom } from "jotai";
import Image from "next/image";
import cancel from "@/assets/cancel.svg";
import { createMeeting } from "@/state/connectedWalletStarknetkitNext";
import clsx from "clsx";
import { RiInformation2Line } from "react-icons/ri";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { Contract } from "starknet";
import { useSearchParams } from "next/navigation";
import { pinata } from "../../../utils/config";
import { useWallet } from "@/hooks/useWallet";
import { provider } from "@/constants";

export default function Createmeeting(prop: any) {
  const [open, setOpen] = useState(prop.status);
  const [meetingCreation, setMeetingCreation] = useAtom(createMeeting);
  const [status, setStatus] = useState(false);
  const { wallet, session, sessionAccount, sessionKeyMode } = useWallet();
  const [link, setLink] = useState("");
  const searchParams = useSearchParams();
  const org = searchParams.get("org");
  const id = searchParams.get("id");

  useEffect(() => {
    if (open) {
      window.scrollTo({
        top: Math.max(0, 130), // Scroll up by 100 pixels
        behavior: "smooth",
      });
    }
  }, [open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
  };

  const handleUploadActiveMeetLink = async () => {
    setStatus(true);

    try {
      // Upload meeting link to Pinata
      const linkUpload = await pinata.upload.json({
        meetinglink: link,
      });

      if (!linkUpload) {
        throw new Error("Failed to upload meeting link to Pinata.");
      }

      // Initialize contract
      const organizationContract = new Contract(
        attensysOrgAbi,
        attensysOrgAddress,
        provider,
      );

      if (!org) {
        throw new Error("Org information not found");
      }
      // Prepare calldata
      const addActiveMeetLinkCalldata = organizationContract.populate(
        "add_active_meet_link",
        [linkUpload.IpfsHash, Number(id), true, org],
      );

      let result: { transaction_hash: string };

      // Use session account if present
      if (sessionKeyMode && session && sessionAccount) {
        result = await sessionAccount.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "add_active_meet_link",
            calldata: addActiveMeetLinkCalldata.calldata,
          },
        ]);
      } else {
        if (!wallet?.account) {
          throw new Error("Wallet not connected");
        }

        result = await wallet.account.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "add_active_meet_link",
            calldata: addActiveMeetLinkCalldata.calldata,
          },
        ]);
      }

      // Wait for transaction confirmation
      await provider.waitForTransaction(result.transaction_hash);

      // Reset UI state
      setOpen(false);
      setMeetingCreation(false);
    } catch (e) {
      console.error("Error in handleUploadActiveMeetLink:", e);
    } finally {
      setStatus(false); // Ensure status is reset in all cases
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[#0F0E0E82] transition-opacity"
      />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-2 text-center sm:p-0">
          <DialogPanel className="relative h-[280px] w-[580px] transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8">
            <div className="px-10 flex justify-between pt-10 cursor-pointer border-b-[1px] border-b-[#A6A1A1] pb-5">
              <h1 className="text-[18px] md:text-[22px] font-semibold leading-[31px] text-[#5801A9]">
                Create bootcamp meeting
              </h1>
              <Image
                src={cancel}
                alt="cancel"
                onClick={() => {
                  setOpen(false);
                  setMeetingCreation(false);
                }}
              />
            </div>
            <div className="px-8 mt-5 mb-3 space-y-2">
              <div className="flex items-center space-x-2">
                <RiInformation2Line className="text-[#333333] " />
                <p className="text-[13px] font-light leading-[20px] text-[#333333]">
                  For physical meetings go over to Attensys events, create your
                  meeting and copy the link to be pasted below
                </p>
              </div>
              <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px] ">
                Enter Link{" "}
              </h1>
            </div>
            <div className="flex items-center justify-between px-8 space-x-3">
              <div className="space-y-2 w-[80%] item">
                <Field>
                  <Input
                    value={link}
                    onChange={handleChange}
                    placeholder="paste link here"
                    className={clsx(
                      "h-[55px] border-[2px] border-[#D0D5DD] block w-[100%] rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
              </div>

              <div
                onClick={handleUploadActiveMeetLink}
                className="h-[47px] w-[103px] rounded-xl bg-[#9B51E0] flex items-center justify-center cursor-pointer"
              >
                <h1 className="text-[#FFFFFF] text-[14px] font-semibold leading-[16px]">
                  {status ? "Setting link" : "Post link"}
                </h1>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
