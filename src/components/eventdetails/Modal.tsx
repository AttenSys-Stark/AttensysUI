"use client";

import { ChangeEvent, SetStateAction, useRef, useState } from "react";
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
import {
  modalstatus,
  orguploadstatus,
  confirmationstatus,
  sendingstatus,
  successstatus,
} from "@/state/connectedWalletStarknetkitNext";
import Image from "next/image";
import cancel from "@/assets/cancel.svg";
import UploadOrglogo from "./UploadOrglogo";
import Confirmation from "./Confirmation";
import Sending from "./Sending";
import Success from "./Success";

export default function Modal(prop: any) {
  const [open, setOpen] = useState(prop.status);
  const [modalstat, setModalstatus] = useAtom(modalstatus);
  const [orguploadstat, setOrguploadStat] = useAtom(orguploadstatus);
  const [confirmationstat, setConfirmationStat] = useAtom(confirmationstatus);

  const [sendingstat, setsendingstat] = useAtom(sendingstatus);
  const [successstat, setsuccessstat] = useAtom(successstatus);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[#0F0E0E82] transition-opacity"
      />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel className="relative h-auto pb-8  md:h-[700px] w-[100%] md:w-[90%] lg:w-[1024px] transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8">
            <div
              className="px-16 flex justify-end pt-10 cursor-pointer"
              onClick={() => {
                setOpen(false);
                setModalstatus(false);
                setOrguploadStat(true);
                setConfirmationStat(false);
                setsuccessstat(false);
              }}
            >
              <Image src={cancel} alt="cancel" />
            </div>
            {orguploadstat && <UploadOrglogo />}
            {confirmationstat && <Confirmation />}
            {sendingstat && <Sending />}
            {successstat && <Success />}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
