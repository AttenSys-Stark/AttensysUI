import React, { useEffect, useState } from "react";
import handshake from "@/assets/handshake.svg";
import Image from "next/image";
import testlogo from "@/assets/testlogo.svg";
import StarRating from "./StarRating";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { pinata } from "../../../utils/config";
import axios from "axios";
import { GetCIDResponse } from "pinata";
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest";
import { useAtom } from "jotai";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface OrganizationCardProp {
  name: string;
  about: string;
  numberofbootcamps: string;
  numberofinstructors: string;
  stars: number;
  totalreviews: string;
  tags: Array<string>;
  logo: any;
  flier: any;
}

const orgContract = new Contract(attensysOrgAbi, attensysOrgAddress, provider);

const Organizationcard = (props: any) => {
  const router = useRouter();
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);
  const [logoImagesource, setLogoImage] = useState<string | StaticImport>("");
  const [bannerImagesource, setBannerImage] = useState<string | StaticImport>(
    "",
  );
  const [organizationName, setOrgName] = useState<string | null>(null);
  const [Owneraddress, setOwnerAddress] = useState<string | null>(null);
  const [classessNumber, setNumberofClasses] = useState<number | null>(null);
  const [tutors, setNumberofTutors] = useState<number | null>(null);
  const [creator, setCreator] = useState<number | null>(null);
  const [studentNumber, setStudentNumber] = useState<number | null>(null);
  const [bootcampNumber, setBootcampNumber] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const handleDetailsRoute = () => {
    router.push(`/Bootcamps/${props.name}`);
  };

  const getPubIpfs = async (CID: string) => {
    try {
      //@ts-ignore
      const data = await pinata.gateways.get(CID);
      console.log(data?.data);
      //@ts-ignore
      const logoData: GetCIDResponse = await pinata.gateways.get(
        //@ts-ignore
        data?.data?.OrganizationLogoCID,
      );
      //@ts-ignore
      const bannerData: GetCIDResponse = await pinata.gateways.get(
        //@ts-ignore
        data?.data?.OrganizationBannerCID,
      );
      // Extract the data from the response
      const objectURL = URL.createObjectURL(logoData.data as Blob);
      const bannerobjectURL = URL.createObjectURL(bannerData.data as Blob);

      setLogoImage(objectURL);
      setBannerImage(bannerobjectURL);
      //@ts-ignore
      setOrgName(data?.data.OrganizationName);

      //@ts-ignore
      setOwnerAddress(data?.data.OrganizationAminWalletAddress);

      //@ts-ignore
      setCreator(data?.data.OrganizationAdminName);

      //@ts-ignore
      const truncated = truncateToWords(data?.data.OrganizationDescription);
      setDescription(truncated);
    } catch (error) {}
  };

  const getOrgInfo = async () => {
    let org_info = await orgContract?.get_org_info(props.orgaddress);

    console.log("here is specific org", org_info);
    setNumberofClasses(Number(org_info.number_of_all_classes));
    setNumberofTutors(Number(org_info.number_of_instructors));
    setStudentNumber(Number(org_info.number_of_students));
    setBootcampNumber(Number(org_info.number_of_all_bootcamps));
    getPubIpfs(org_info.org_ipfs_uri);
  };

  function truncateToWords(text: any): string {
    const words = text.split(/\s+/);
    const wordLimit: number = 20;
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return text;
  }

  useEffect(() => {
    getOrgInfo();
  }, [wallet]);

  return (
    <div className="h-auto pb-2 w-full rounded-xl border-[1px] border-[#C8C8C8] bg-[#FFFFFF]">
      <div className="h-[120px] w-full flex flex-none relative">
        <Image
          src={bannerImagesource}
          alt="shake"
          className="absolute object-cover w-full h-full rounded-t-xl"
          layout="fill"
        />
        <div className="h-[60px] w-[60px] rounded-full absolute z-20 bottom-[-25%] left-3">
          <Image
            src={logoImagesource}
            alt="logo"
            layout="fill"
            className="rounded-full"
          />
        </div>
      </div>

      <div className="px-4 mt-12 space-y-4">
        <h1 className="text-[16px] text-[#333333] leading-[18px] font-bold">
          {organizationName}
        </h1>
        <p className="w-auto max-w-[300px] text-[12px] text-[#2D3A4B] leading-[17px] font-light">
          {description}
        </p>
        <div className="flex space-x-4">
          <p className="text-[12px] text-[#817676] leading-[14px] font-medium">
            <span className="text-[#9B51E0]">{bootcampNumber}</span> Bootcamps
          </p>
          <p className="text-[12px] text-[#817676] leading-[14px] font-medium">
            <span className="text-[#9B51E0]">{tutors}</span> Instructors
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between space-x-0">
          <div className="flex items-center flex-none mb-2 mr-6 space-x-2">
            <StarRating totalStars={5} starnumber={4} />
            <p className="text-xs text-[#2D3A4B] leading-[14px] font-medium">
              201 reviews
            </p>
          </div>
          <Button
            onClick={handleDetailsRoute}
            className=" border-[2px] border-[#9B51E0] py-3 px-4 text-[#9B51E0] text-xs leading-[12px] flex items-center justify-center rounded-xl"
          >
            <div>View details</div>
          </Button>
        </div>
        {/* <div className="flex flex-wrap items-center justify-start">
          {props.tags.map((tag, index) => {
            return (
              <div
                key={index}
                className="mr-2 mb-2 px-1.5 py-0.5 rounded-md flex items-center justify-center bg-[#ABABAB52] text-[10px] leading-[12px] font-medium text-[#5801A9]"
              >
                {tag}
              </div>
            )
          })}
        </div> */}
      </div>
    </div>
  );
};

export default Organizationcard;
