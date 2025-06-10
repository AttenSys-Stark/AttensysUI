import {
  AccountChangeEventHandler,
  ChainId,
  NetworkChangeEventHandler,
} from "@starknet-io/types-js";
import { useAtomValue, useSetAtom, atom } from "jotai";
import { atomWithReset, atomWithStorage } from "jotai/utils";
import { useEffect } from "react";
import { ConnectorData, StarknetWindowObject } from "starknetkit-next";
import { Connector } from "starknetkit";
import { FileObject } from "pinata";
import { number } from "starknet";

const emptyData: FileObject = {
  name: "",
  type: "",
  size: 0,
  lastModified: 0,
  arrayBuffer: async () => {
    return new ArrayBuffer(0);
  },
};

export const lectureData = {
  lectureName: "",
  description: "",
  video: emptyData,
};

const InitOrganizationRegstrationData = {
  organizationBanner: emptyData,
  organizationName: "",
  organizationDescription: "",
  organizationLogo: emptyData,
  organizationCategory: "",
  organizationAdminfullname: "",
  organizationAminEmail: "",
  organizationAdminWallet: "",
  organizationInstructorEmails: [""],
  organizationInstructorsWalletAddresses: [""],
};

const InitBootcampData = {
  bootcampName: "",
  bootcampOrganization: "",
  targetAudience: "",
  bootcampDescription: "",
  bootcampStartdate: "",
  bootcampEndDate: "",
  bootcampLecture: [
    { day: "", lecturetitle: "", lectureDescription: "", start: "", end: "" },
  ],
  price: false,
  bootcampPrice: "",
  BootcampLogo: emptyData,
  bootcampNftName: "",
  bootCampNftSymbol: "",
  bootcampNftImage: emptyData,
};

const InitBootcampNftData = {
  organizationNftName: "",
  organizationNftSymbol: "",
  organizationNftImage: emptyData,
};

interface Lecture {
  name: string;
  description: string;
  video: File | null;
}

const InitCourseRegistrationData = {
  primaryGoal: "",
  targetAudience: "",
  courseArea: "",
  courseIdentifier: "",
  courseName: "",
  courseCreator: "",
  courseDescription: "",
  courseCategory: "",
  difficultyLevel: "",
  studentRequirements: "",
  learningObjectives: "",
  targetAudienceDesc: "",
  courseImage: emptyData,
  courseCurriculum: [] as Lecture[],
  coursePricing: "",
  promoAndDiscount: "",
  publishWithCertificate: false,
  price: 0,
};

//organization data state
export const organzationInitState = atom(InitOrganizationRegstrationData);
//bootcamp data state
export const createBootcampInitState = atom(InitBootcampNftData);

// course data state
export const courseInitState = atomWithStorage(
  "courseDraft",
  InitCourseRegistrationData,
);

// Function to clear the course draft
export const clearCourseDraft = () => {
  localStorage.removeItem("courseDraft");
};

export const walletStarknetkitNextAtom = atomWithReset<
  StarknetWindowObject | null | undefined
>(undefined);

export const connectorDataAtom = atomWithReset<ConnectorData | null>(null);

export const connectorAtom = atomWithReset<Connector | null>(null);

export const coursestatusAtom = atom(false);

export const eventcreatedAtom = atom(true);
export const eventregistedAtom = atom(false);
export const existingeventCreationAtom = atom(false);
export const createEventClickAtom = atom(false);
export const createorexplore = atom(false);

export const insightClick = atom(true);
export const guestlistclick = atom(false);
export const attendanceclick = atom(false);
export const sponsorshipclick = atom(false);
export const modalstatus = atom(false);

export const orguploadstatus = atom(true);
export const confirmationstatus = atom(false);

export const sendingstatus = atom(false);
export const successstatus = atom(false);

export const bootcampdropdownstatus = atom(false);

export const createbootcampoverlay = atom(false);

export const outlineclick = atom(true);
export const allstudentclick = atom(false);
export const certificationsclick = atom(false);

export const registerModal = atom(false);

export const detailsEntryStat = atom(true);

export const detailsEntryLoading = atom(false);

export const registrationsuccess = atom(false);
export const attendancesuccess = atom(false);
export const specificOrgRoute = atom("undefined");

const data = {
  modalstatus: false,
  idnumber: 0,
};

export const addclassmodal = atom(data);

export const createMeeting = atom(false);
export const isinputError = atom(false);
export const currentID = atom(null);
export const orgowneraddress = atom(null);

export const isRegisteredatom = atom(false);
export const loginorsignup = atom(false);
export const orgnameatom = atom("none");
export const mybootcampDescription = atom("");

export const createbootcampupload = atom(false);
export const universalloadingstatus = atom(false);

export const useWalletAccountChange = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom);
  const setConnectorData = useSetAtom(connectorDataAtom);

  const accountChangeHandler: AccountChangeEventHandler = (
    accounts?: string[],
  ) => {
    setConnectorData((prev) => ({
      account: accounts?.[0],
      chainId: prev?.chainId,
    }));
  };
  const networkChangeHandler: NetworkChangeEventHandler = async (
    chainId?: ChainId,
    accounts?: string[],
  ) => {
    let walletAccount = undefined;
    if (!accounts || accounts.length === 0) {
      walletAccount = await wallet?.request({
        type: "wallet_requestAccounts",
      });
    }

    setConnectorData({
      account: accounts?.[0] || walletAccount?.[0],
      chainId: chainId ? BigInt(chainId) : undefined,
    });
  };

  wallet?.on("accountsChanged", accountChangeHandler);
  wallet?.on("networkChanged", networkChangeHandler);

  useEffect(() => {
    wallet?.off("accountsChanged", accountChangeHandler);
    wallet?.off("networkChanged", networkChangeHandler);
    return;
  }, [wallet, accountChangeHandler, networkChangeHandler]);
};
