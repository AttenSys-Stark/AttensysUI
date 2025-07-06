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
import { createMeeting } from "@/state/connectedWalletStarknetkitNext";
import clsx from "clsx";
import { FaPlus } from "react-icons/fa6";
import cloud from "@/assets/cloud.svg";
import dividers from "@/assets/Dividers.svg";
import { RiInformation2Line } from "react-icons/ri";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { useSearchParams } from "next/navigation";
import { pinata } from "../../../utils/config";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useAccount, useConnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";

export default function Createmeeting(prop: any) {
  const [open, setOpen] = useState(prop.status);
  const [meetingCreation, setMeetingCreation] = useAtom(createMeeting);
  const [status, setStatus] = useState(false);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [link, setLink] = useState("");
  const [orgname, setOrgname] = useState<string>();
  const { account, address } = useFirebaseAuth();
  // const { connect, connectors } = useConnect();
  // const controller = connectors[0] as ControllerConnector;
  const searchParams = useSearchParams();
  const org = searchParams.get("org");
  const id = searchParams.get("id");

  // useEffect(() => {
  //   if (!address) return;
  //   controller.username()?.then((n) => setOrgname(n));
  // }, [address, controller]);

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

    const linkUpload = await pinata.upload.json({
      meetinglink: link,
    });

    if (linkUpload) {
      const organizationContract = new Contract(
        attensysOrgAbi,
        attensysOrgAddress,
        account,
      );
      const add_active_meet_link_calldata = organizationContract.populate(
        "add_active_meet_link",
        //@ts-ignore
        [linkUpload.IpfsHash, Number(id), true, org],
      );

      const callContract = await account?.execute([
        {
          contractAddress: attensysOrgAddress,
          entrypoint: "add_active_meet_link",
          calldata: add_active_meet_link_calldata.calldata,
        },
      ]);
      if (!callContract) {
        throw new Error("Transaction not executed");
      }
      await account
        ?.waitForTransaction(callContract?.transaction_hash)
        .then(() => {})
        .catch((e: any) => {
          console.error("Error: ", e);
        })
        .finally(() => {
          setOpen(false);
          setMeetingCreation(false);
          setStatus(false);
        });
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[#0F0E0E82] transition-opacity"
      />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-2 text-center sm:p-0">
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
            <div className="px-8 mt-5 space-y-2 mb-3">
              <div className="flex space-x-2 items-center">
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
            <div className="flex space-x-3 px-8 justify-between items-center">
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
                onClick={!status ? handleUploadActiveMeetLink : undefined}
                className={`h-[47px] w-[103px] rounded-xl flex items-center justify-center cursor-pointer ${
                  status ? "bg-[#822DBF] cursor-not-allowed" : "bg-[#9B51E0]"
                }`}
              >
                {status ? (
                  <LoadingSpinner size="sm" colorVariant="primary" />
                ) : (
                  <h1 className="text-[#FFFFFF] text-[14px] font-semibold leading-[16px]">
                    Post link
                  </h1>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
