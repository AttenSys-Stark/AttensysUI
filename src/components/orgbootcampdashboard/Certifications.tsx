import { Input } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import batch from "@/assets/batch.svg";
import single from "@/assets/single.svg";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { Contract } from "starknet";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useAccount, useConnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";

const Certifications = () => {
  const [inputValue, setinputValue] = useState("");
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const org = searchParams.get("org");
  const [awarding, setAwarding] = useState(false);
  const [batchawarding, setbatchawarding] = useState(false);
  const [orgname, setOrgname] = useState<string>();
  const { address, account } = useAccount();
  const { connect, connectors } = useConnect();
  const controller = connectors[0] as ControllerConnector;

  useEffect(() => {
    if (!address) return;
    controller.username()?.then((n) => setOrgname(n));
  }, [address, controller]);

  const organizationContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    account,
  );

  const handleChange = (event: { target: { value: any } }) => {
    setinputValue(event.target.value);
  };

  const handleAwardSingleCertificate = async () => {
    setAwarding(true);
    const cerify_calldata = organizationContract.populate(
      "single_certify_student",
      //@ts-ignore
      [org, id, inputValue],
    );

    const callContract = await account?.execute([
      {
        contractAddress: attensysOrgAddress,
        entrypoint: "single_certify_student",
        calldata: cerify_calldata.calldata,
      },
    ]);
    if (!callContract) {
      throw new Error("Transaction not executed");
    }
    account
      ?.waitForTransaction(callContract?.transaction_hash)
      .then(() => {})
      .catch((e: any) => {
        console.error("Error: ", e);
      })
      .finally(() => {
        setAwarding(false);
      });
  };

  const handlebatchCertify = async () => {
    setbatchawarding(true);
    const cerify_calldata = organizationContract.populate(
      "batch_certify_students",
      //@ts-ignore
      [org, id],
    );

    const callContract = await account?.execute([
      {
        contractAddress: attensysOrgAddress,
        entrypoint: "batch_certify_students",
        calldata: cerify_calldata.calldata,
      },
    ]);
    if (!callContract) {
      throw new Error("Transaction not executed");
    }
    account
      ?.waitForTransaction(callContract?.transaction_hash)
      .then(() => {})
      .catch((e: any) => {
        console.error("Error: ", e);
      })
      .finally(() => {
        setbatchawarding(false);
      });
  };

  return (
    <div className="w-full">
      <div className="2xl:h-[120px] w-full 2xl:px-24 px-6 flex  flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between 2xl:border-b-[1px] 2xl:border-b-[rgb(202,203,203)] space-y-6 2xl:space-y-0 py-5 2xl:py-0">
        <div className="md:h-[52px] md:w-[80%] lg:w-[500px] xl:w-[650px] bg-transparent  md:bg-[#FFFFFF] md:border-[1px] md:border-[#C0C0C0] md:rounded-xl md:px-4 flex flex-col justify-center">
          <div className="flex flex-col md:flex-row ">
            <h1 className="text-[14px] font-semibold text-[#333333] leading-[31px]">
              Single user certifcation :
            </h1>
            <Input
              name="search by address"
              type="text"
              placeholder="Enter email , wallet address..."
              value={inputValue}
              onChange={handleChange}
              className="w-full md:w-[60%] clg:w-[70%] lclg:w-[90%] p-2 text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div
          onClick={handleAwardSingleCertificate}
          className="cursor-pointer h-[48px] w-[155px] rounded-xl bg-[#9B51E0] text-[#FFFFFF] text-[12px] font-medium leading-[17px] flex items-center justify-center"
        >
          {awarding ? "Awarding..." : "Award certificate"}
        </div>

        <div className="flex flex-col md:flex-row md:items-center h-full md:space-x-6 space-y-5 md:space-y-0">
          <div className="md:border-r-[1px] md:border-l-[1px] md:border-r-[#817676] md:border-l-[#817676] w-[300px] h-[80%] flex flex-col md:px-8 justify-center space-y-2">
            <h1 className="text-[16px] font-light text-[#2D3A4B] leading-[22px]">
              Course completion rate
            </h1>
            <h1 className="text-[22px] font-medium text-[#9B51E0] leading-[30px]">
              71%
            </h1>
          </div>
          <div className="h-[80%] flex flex-col justify-center  space-y-2">
            <h1 className="text-[16px] font-light text-[#2D3A4B] leading-[22px]">
              Certification Issued
            </h1>
            <h1 className="text-[22px] font-medium text-[#9B51E0] leading-[30px]">
              112
            </h1>
          </div>
        </div>
      </div>

      <div className="h-auto lg:h-[500px] w-full ">
        <div className="w-[90%] mx-auto py-10">
          <h1 className="text-[18px] text-[#5801A9] leading-[23px] font-semibold">
            Mass Certification
          </h1>
          <p className="text-[14px] text-[#817676] leading-[19px] font-light">
            Choose your prefered Certification method.
          </p>
          <div className="w-full mt-8 flex-col md:flex-row md:space-x-5 space-y-9 md:space-y-0 flex">
            {/* <div className="h-[246px] w-[243px] bg-[#FFFFFF] rounded-lg border-[1px] border-[#CACACA] px-6 flex flex-col justify-center space-y-4">
              <Image src={single} alt="single" />
              <div className="space-y-1">
                <h1 className="text-[15px] leading-[19px] font-semibold text-[#5801A9]">
                  Single certification
                </h1>
                <p className="text-[14px] text-[#817676] leading-[19px] font-light">
                  Award student individual address
                </p>
              </div>
              <div className="w-[155px] h-[35px] rounded-lg bg-[#2D3A4B] text-[#FFFFFF] text-[12px] font-medium leading-[17px] flex justify-center items-center">
                Award Certifications
              </div>
            </div> */}

            <div className="h-[246px] w-[243px] bg-[#FFFFFF] rounded-lg border-[1px] border-[#CACACA]  px-6 flex flex-col justify-center space-y-4">
              <Image src={batch} alt="single" />
              <div className="space-y-1">
                <h1 className="text-[15px] leading-[19px] font-semibold text-[#5801A9]">
                  Batch certification
                </h1>
                <p className="text-[14px] text-[#817676] leading-[19px] font-light">
                  Award All student
                </p>
              </div>
              <div
                onClick={handlebatchCertify}
                className=" cursor-pointer w-[155px] h-[35px] rounded-lg bg-[#2D3A4B] text-[#FFFFFF] text-[12px] font-medium leading-[17px] flex justify-center items-center"
              >
                {batchawarding ? "Batch awarding..." : "Award Certifications"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
