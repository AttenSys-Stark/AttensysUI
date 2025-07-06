import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useAtom } from "jotai";
import {
  registerModal,
  detailsEntryStat,
  detailsEntryLoading,
  registrationsuccess,
} from "@/state/connectedWalletStarknetkitNext";
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
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { Contract } from "starknet";
import { pinata } from "../../../utils/config";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import ControllerConnector from "@cartridge/connector/controller";

const RegistrationDetails = (props: any) => {
  const [regModal, setRegModal] = useAtom(registerModal);
  const [inputValue, setInputValue] = useState<number | string>("");
  const [detailsEntrystatus, setDetailsEntryStatus] = useAtom(detailsEntryStat);
  const [detailsEntryLoadingstatus, setDetailsEntryLoadingStatus] =
    useAtom(detailsEntryLoading);
  const [registrationsuccessstatus, setregistrationsuccessstatus] =
    useAtom(registrationsuccess);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [orgname, setOrgname] = useState<string>();
  const { account, address } = useFirebaseAuth();
  // const { connect, connectors } = useConnect();
  // const controller = connectors[0] as ControllerConnector;

  // useEffect(() => {
  //   if (!address) return;
  //   controller.username()?.then((n) => setOrgname(n));
  //   console.log(address, "address");
  // }, [address, controller]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Validate numeric input or clear it
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "fullname") {
      setFullName(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  const handlePay = async () => {
    setIsRegistering(true);
    try {
      setDetailsEntryStatus(false);
      setDetailsEntryLoadingStatus(true);

      const studentDataUpload = await pinata.upload.json({
        student_name: fullname,
        student_email: email,
      });

      if (studentDataUpload) {
        const organizationContract = new Contract(
          attensysOrgAbi,
          attensysOrgAddress,
          account,
        );
        const register_calldata = organizationContract.populate(
          "register_for_bootcamp",
          [props.org_info, props.id_info, studentDataUpload.IpfsHash],
        );
        const callContract = await account?.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "register_for_bootcamp",
            calldata: register_calldata.calldata,
          },
        ]);

        // setIsRegistering(false);
        // setregistrationsuccessstatus(true);
        // setDetailsEntryLoadingStatus(false);
        if (!callContract) {
          throw new Error("Transaction not executed");
        }
        await account?.waitForTransaction(callContract?.transaction_hash);
        console.log("Registration successful");
        setregistrationsuccessstatus(true);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setregistrationsuccessstatus(false);
    } finally {
      console.log("registration process completed");
      setDetailsEntryLoadingStatus(false);
      setIsRegistering(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 space-y-4 mt-8">
      <div className="space-y-1.5">
        <h1 className="text-md text-[#2D3A4B] font-light">Full name</h1>
        <Field>
          <Input
            placeholder="Enter your name"
            name="fullname"
            value={fullname}
            onChange={handleInputChange}
            className={clsx(
              "h-[55px] border-[2px] border-[#D0D5DD] block w-full rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-[#667185]",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
            )}
          />
        </Field>
      </div>
      <div className="space-y-1.5">
        <h1 className="text-md text-[#2D3A4B] font-light">Email Address</h1>
        <Field>
          <Input
            placeholder="Enter your email"
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            className={clsx(
              "h-[55px] border-[2px] border-[#D0D5DD] block w-full rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-[#667185]",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
            )}
          />
        </Field>
      </div>

      <div className="w-full h-auto py-4 rounded-xl bg-amount-gradient flex flex-col justify-center space-y-6">
        <div className="text-[#FFFFFF] flex flex-col items-center justify-center">
          <div className="flex space-x-1 items-center">
            <Input
              onChange={handleAmountChange}
              placeholder="0"
              className={clsx(
                "bg-transparent text-[#FFFFFF] outline-none placeholder-white font-bold w-auto text-3xl lg:text-4xl",
              )}
              style={{
                width: `${Math.max(2, inputValue.toString().length || 1)}ch`,
              }}
            />
            <h1 className="text-3xl lg:text-4xl font-bold">USDT</h1>
          </div>
          <p className="text-md font-normal">$0.00</p>
        </div>

        <div className="flex justify-between px-4">
          <div>
            <h1 className="text-xs font-semibold text-[#FFFFFF]">
              Available to send
            </h1>
            <h1 className="text-lg font-normal text-[#FFFFFF]">
              15,025.01 USDT
            </h1>
          </div>

          <Button className="text-[#5801A9] text-[12px] font-bold w-[60px] py-1.5 rounded-2xl bg-[#FFFFFF]">
            Max
          </Button>
        </div>
      </div>
      <Button
        onClick={!isRegistering ? handlePay : undefined}
        disabled={isRegistering}
        className={`h-[47px] w-full rounded-xl text-[#FFFFFF] text-[14px] leading-md font-semibold flex items-center justify-center ${
          isRegistering ? "bg-[#357ABD] cursor-not-allowed" : "bg-[#4A90E2]"
        }`}
      >
        {isRegistering ? (
          <LoadingSpinner size="sm" colorVariant="white" />
        ) : (
          "Register & pay"
        )}
      </Button>
    </div>
  );
};

export default RegistrationDetails;
