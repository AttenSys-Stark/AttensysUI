import { provider } from "@/constants";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import {
  createbootcampoverlay,
  createbootcampupload,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { GetCIDResponse } from "pinata";
import { useEffect, useRef, useState } from "react";
import { Contract } from "starknet";
import LoadingSpinner from "../ui/LoadingSpinner";
import Create from "./Create";
import Heading from "./Heading";
import Organizationtabs from "./Organizationtabs";
import Panel from "./Panel";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

const Organizationlanding = (prop: any) => {
  const [createOverlayStat] = useAtom(createbootcampoverlay);
  const [createbootebootcampstat] = useAtom(createbootcampupload);
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
  const [isLoadingIPFS, setIsLoadingIPFS] = useState(false);
  const [isLoadingOrgInfo, setIsLoadingOrgInfo] = useState(false);
  const [isLoadingBootcamps, setIsLoadingBootcamps] = useState(false);
  const { account, address } = useFirebaseAuth();
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();
  const orgContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  );

  const getPubIpfs = async (CID: string) => {
    setIsLoadingIPFS(true);
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
    } finally {
      setIsLoadingIPFS(false);
    }
  };

  const getOrgInfo = async () => {
    setIsLoadingOrgInfo(true);

    try {
      const org_info = await orgContract?.get_org_info(address);
      setNumberofClasses(Number(org_info.number_of_all_classes));
      setNumberofTutors(Number(org_info.number_of_instructors));
      setStudentNumber(Number(org_info.number_of_students));
      setBootcampNumber(Number(org_info.number_of_all_bootcamps));
      console.info(org_info);
      const ipfsdata = await getPubIpfs(org_info.org_ipfs_uri);
      console.info(ipfsdata);
    } catch (error) {
      console.error("Error fetching org info:", error);
    } finally {
      setIsLoadingOrgInfo(false);
    }
  };

  const getAllOrgBootcamp = async () => {
    setIsLoadingBootcamps(true);
    try {
      const org_boot_camp_info =
        await orgContract?.get_all_org_bootcamps(address);
      setBootcampdataInfo(org_boot_camp_info);
    } catch (error) {
      console.error("Error fetching bootcamps:", error);
    } finally {
      setIsLoadingBootcamps(false);
    }
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
  }, [account, address, createbootebootcampstat]);

  function truncateAddress(address: any): string {
    const start = address?.slice(0, 10);
    const end = address?.slice(-10);
    return `${start}...${end}`;
  }

  return (
    <div ref={landingRef} className="h-auto bg-[#f5f8fa] relative">
      {isLoadingOrgInfo || isLoadingIPFS ? (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" colorVariant="primary" />
        </div>
      ) : (
        <>
          {/* Full screen loading overlay */}
          {createbootebootcampstat && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" colorVariant="primary" />
                <p className="text-gray-700 font-medium">
                  Publishing bootcamp... Please wait
                </p>
              </div>
            </div>
          )}
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
          <Organizationtabs
            bootcampinfo={bootcampDataInfo}
            isLoading={isLoadingBootcamps}
          />
        </>
      )}
    </div>
  );
};

export default Organizationlanding;
