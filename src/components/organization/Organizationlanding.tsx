import React, { useEffect, useRef, useState } from "react";
import Heading from "./Heading";
import Panel from "./Panel";
import Organizationtabs from "./Organizationtabs";
import Create from "./Create";
import { createbootcampoverlay } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { pinata } from "../../../utils/config";
import axios from "axios";
import { GetCIDResponse } from "pinata";

const Organizationlanding = (prop: any) => {
  const [createOverlayStat] = useAtom(createbootcampoverlay);
  const [orgHeight, setOrgHeight] = useState<number | null>(null); // State to store the height
  const landingRef = useRef<HTMLDivElement>(null); // Ref for OrganizationLanding
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [logoImagesource, setLogoImage] = useState<string | null>(null);
  const [bannerImagesource, setBannerImage] = useState<string | null>(null);
  const [organizationName, setOrgName] = useState<string | null>(null);
  const [Owneraddress, setOwnerAddress] = useState<string | null>(null);
  const [classessNumber, setNumberofClasses] = useState<number | null>(null);
  const [tutors, setNumberofTutors] = useState<number | null>(null);
  const [creator, setCreator] = useState<number | null>(null);
  const [studentNumber, setStudentNumber] = useState<number | null>(null);
  const [bootcampNumber, setBootcampNumber] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [bootcampDataInfo, setBootcampdataInfo] = useState([]);

  const orgContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  );

  const getPubIpfs = async (CID: string) => {
    try {
      const data = await pinata.gateways.get(CID);
      //@ts-ignore
      console.info(data?.data);
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
      setDescription(data?.data.OrganizationDescription);
      // console.dir(logoData, {depth: null})
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
      throw error;
    }
  };

  const getOrgInfo = async () => {
    const org_info = await orgContract?.get_org_info(wallet?.selectedAddress);
    setNumberofClasses(Number(org_info.number_of_all_classes));
    setNumberofTutors(Number(org_info.number_of_instructors));
    setStudentNumber(Number(org_info.number_of_students));
    setBootcampNumber(Number(org_info.number_of_all_bootcamps));
    console.info(org_info);
    const ipfsdata = getPubIpfs(org_info.org_ipfs_uri);
    console.info(ipfsdata);
  };

  const getAllOrgBootcamp = async () => {
    const org_boot_camp_info = await orgContract?.get_all_org_bootcamps(
      wallet?.selectedAddress,
    );
    setBootcampdataInfo(org_boot_camp_info);
  };

  useEffect(() => {
    // Update height dynamically
    if (landingRef.current) {
      setOrgHeight(landingRef.current.offsetHeight);
    }
  }, [createOverlayStat]);

  useEffect(() => {
    if (createOverlayStat) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [createOverlayStat]);

  useEffect(() => {
    getOrgInfo();
    getAllOrgBootcamp();
  }, [wallet]);

  function truncateAddress(address: any): string {
    const start = address?.slice(0, 10);
    const end = address?.slice(-10);
    return `${start}...${end}`;
  }

  return (
    <div ref={landingRef} className="h-auto bg-[#f5f8fa] relative">
      {createOverlayStat && (
        <Create organizationName={organizationName} height={orgHeight} />
      )}
      <Heading logo={logoImagesource} banner={bannerImagesource} />
      <Panel
        orgname={organizationName}
        owner={truncateAddress(Owneraddress)}
        classes={classessNumber}
        tutors={tutors}
        creator={creator}
        studentNumber={studentNumber}
        bootcampNumber={bootcampNumber}
        description={description}
      />
      <Organizationtabs bootcampinfo={bootcampDataInfo} />
    </div>
  );
};

export default Organizationlanding;
