import React, { useEffect } from "react";
import {
  bootcampdropdownstatus,
  isRegisteredatom,
  orgnameatom,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom, useSetAtom } from "jotai";
import { VscNewFile } from "react-icons/vsc";
import bootsearch from "@/assets/bootsearch.svg";
import bootcreate from "@/assets/bootcreate.svg";
import Image from "next/image";
import people from "@/assets/people.svg";
import { useRouter } from "next/navigation";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest";

const orgContract = new Contract(attensysOrgAbi, attensysOrgAddress, provider);

const Bootcampdropdown = () => {
  const [bootcampdropstat] = useAtom(bootcampdropdownstatus);
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);
  const [isreg, setisRegistered] = useAtom(isRegisteredatom);
  const [orgname, setOrgname] = useAtom(orgnameatom);
  const router = useRouter();

  // const handleBootcampExplore = () => {
  //   router.push('')
  // }

  const getOrgInfo = async () => {
    let org_info = await orgContract?.get_org_info(
      wallet?.selectedAddress ?? "0x0",
    );
    console.log(org_info);

    if (org_info?.org_name != "") {
      setisRegistered(true);
      setOrgname(org_info.org_name);
      console.log(org_info.org_name);
    } else {
      setisRegistered(false);
    }
  };

  useEffect(() => {
    const fetchOrgInfo = async () => {
      await getOrgInfo();
    };

    fetchOrgInfo();
  }, [wallet]);

  return (
    <>
      {bootcampdropstat && (
        <div className=" bg-[#FFFFFF] h-[157px] w-[100%] absolute z-50 shadow-2xl">
          <div className="flex justify-between mx-auto w-[80%] h-[90%] items-center">
            <div className="space-y-4 w-[337px] text-[16px]">
              <a href="/Bootcamps" className=" cursor-pointer">
                <div className="flex space-x-3  my-3">
                  <Image src={bootsearch} alt="search" />

                  <h1 className="text-[16px] font-bold cursor-pointer">
                    Explore Bootcamps
                  </h1>
                </div>
                <p className="text-[13px] text-[#2D3A4B]">
                  Discover amazing organizations that have already been
                  established on attensys; and learn more about their courses.
                </p>
              </a>
            </div>
            <div className="space-y-2 w-[337px]">
              {isreg ? (
                <a href={`/Organization/${orgname}`} className="cursor-pointer">
                  <div className="flex space-x-3">
                    <Image src={bootcreate} alt="search" />
                    <h1 className="text-[16px] font-bold cursor-pointer">
                      Manage Organization
                    </h1>
                  </div>
                  <p className="text-[13px] text-[#2D3A4B] ">
                    Manage your organization profile, add or edit instructors,
                    create new courses, and track your organizations
                    performance.
                  </p>
                </a>
              ) : (
                <a href="/Createorganization" className="cursor-pointer">
                  <div className="flex space-x-3">
                    <Image src={bootcreate} alt="search" />
                    <h1 className="text-[16px] font-bold cursor-pointer">
                      Create Organization
                    </h1>
                  </div>
                  <p className="text-[13px] text-[#2D3A4B] ">
                    Create & Manage your organization profile, add or edit
                    instructors, create new courses, and track your
                    organizations performance.
                  </p>
                </a>
              )}
            </div>

            <div className="space-y-2 w-[350px]">
              <a href="/Mybootcamps" className="cursor-pointer">
                <div className="flex space-x-3">
                  <Image src={people} alt="people" />
                  <h1 className="text-[16px] font-bold cursor-pointer">
                    <a>My Bootcamps</a>
                  </h1>
                </div>
                <p className="text-[13px] text-[#2D3A4B]">
                  Accelerate your learning journey with our intensive
                  bootcamps—designed to equip you with hands-on skills in record
                  time.
                </p>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bootcampdropdown;
