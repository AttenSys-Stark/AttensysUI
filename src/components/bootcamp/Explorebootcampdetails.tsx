import React, { useEffect, useRef, useState } from "react";
import Heading from "@/components/organization/Heading";
import Panel from "@/components/organization/Panel";
import { createbootcampoverlay } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import Userbootcamps from "./Userbootcamps";
import Registered from "./Registered";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { pinata } from "../../../utils/config";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Previous from "../courses/course-form/previous";
import { useFetchCID } from "@/hooks/useFetchCID";
import { useAccount } from "@starknet-react/core";

const Explorebootcampdetails = () => {
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
  const [RegbootcampDataInfo, setRegBootcampdataInfo] = useState<any>([]);
  const searchParams = useSearchParams();
  const org = searchParams.get("org");
  const [isLoading, setIsLoading] = useState(true);
  const { fetchCIDContent, getError } = useFetchCID();
  const { address, account } = useAccount();

  const orgContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  );

  const getPubIpfs = async (CID: string) => {
    try {
      const data = await fetchCIDContent(CID);
      //@ts-ignore
      console.info(data?.data);
      //@ts-ignore
      const logoData: GetCIDResponse = await fetchCIDContent(
        //@ts-ignore
        data?.data?.OrganizationLogoCID,
      );
      //@ts-ignore
      const bannerData: GetCIDResponse = await fetchCIDContent(
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
    try {
      const org_info = await orgContract?.get_org_info(org);
      setNumberofClasses(Number(org_info.number_of_all_classes));
      setNumberofTutors(Number(org_info.number_of_instructors));
      setStudentNumber(Number(org_info.number_of_students));
      setBootcampNumber(Number(org_info.number_of_all_bootcamps));
      await getPubIpfs(org_info.org_ipfs_uri);
    } catch (error) {
      console.error("Error fetching org info:", error);
    }
  };

  const getSpecificOrgInfo = async () => {
    try {
      const specific_org_info =
        await orgContract?.get_specific_organization_registered_bootcamp(
          org,
          address,
        );

      const bootcampInfoArray = await Promise.all(
        specific_org_info.map(async (data: any) => {
          return orgContract?.get_bootcamp_info(
            data.address_of_org,
            Number(data.bootcamp_id),
          );
        }),
      );

      // Update state once with all data
      setRegBootcampdataInfo(bootcampInfoArray);
    } catch (error) {
      console.error("Error fetching specific org info:", error);
    }
  };

  const getAllOrgBootcamp = async () => {
    const org_boot_camp_info = await orgContract?.get_all_org_bootcamps(org);
    setBootcampdataInfo(org_boot_camp_info);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getOrgInfo(),
          getAllOrgBootcamp(),
          getSpecificOrgInfo(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [account, address]);

  function truncateAddress(address: any): string {
    const start = address?.slice(0, 10);
    const end = address?.slice(-10);
    return `${start}...${end}`;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f8fa] flex items-center justify-center">
        <LoadingSpinner size="lg" colorVariant="primary" />
      </div>
    );
  }

  return (
    <div className="h-auto bg-[#f5f8fa] relative pb-8">
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
      <Userbootcamps bootcampinfo={bootcampDataInfo} />
      <Registered regbootcamp={RegbootcampDataInfo} />
    </div>
  );
};

export default Explorebootcampdetails;
