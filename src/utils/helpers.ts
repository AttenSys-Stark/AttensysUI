import { attensysCourseAddress } from "@/deployments/contracts";
import { attensysCourseAbi } from "@/deployments/abi";
import { Contract } from "starknet";
import { provider } from "@/constants";
import { gql, request } from "graphql-request";

export const shortenAddress = (address: any) => {
  return address.slice(0, 10) + "..." + address.slice(-10);
};

const courseContract = new Contract(
  attensysCourseAbi,
  attensysCourseAddress,
  provider,
);

export const getAllCoursesInfo = async () => {
  const callCourseContract = await courseContract?.get_all_courses_info();
  return callCourseContract;
};
export const getUserCoursesInfo = async (user: string) => {
  const callCourseContract =
    await courseContract?.get_all_creator_courses(user);
  return callCourseContract;
};

export function shortHex(input?: any) {
  if (!input || typeof input !== "string" || input.length < 6) {
    console.error("Invalid input to shortHex:", input);
    return "Invalid Address";
  }
  return `${input.slice(0, 8)}.....${input.slice(-4)}`;
}

export const handleSubmit = (
  event: React.FormEvent<HTMLFormElement>,
  searchValue: any,
  router: any,
) => {
  event.preventDefault();
  if (searchValue.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/Explorer/${searchValue}`);
  }
};

export const handleCourse = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  courseName: any,
  router: any,
  courseid: any,
) => {
  event.preventDefault();
  if (courseName.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/coursepage/${courseName}/?id=${Number(courseid)}`);
  }
};

export const handleCoursehome = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  courseName: any,
  router: any,
) => {
  event.preventDefault();
  if (courseName.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/Course/Coursehome/course-home-landing-page`);
  }
};

export const handleMyCourse = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  section: any,
  router: any,
) => {
  event.preventDefault();
  if (section.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/mycoursepage/${section}`);
  }
};

export const handleMyCourseSubComp = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  section: any,
  router: any,
  sub: any,
) => {
  event.preventDefault();
  sessionStorage.setItem("scrollPosition", `${window.scrollY}`);
  // Redirect to the dynamic page with the user's input
  router.push(`/mycoursepage/${section}/`);
};

export const handleCreateCourse = (
  event: React.FormEvent<HTMLButtonElement | HTMLDivElement | HTMLFormElement>,
  section: any,
  router: any,
) => {
  event.preventDefault();
  if (section.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/Course/CreateACourse/${section}`);
  }
};

export function base64ToBlob(base64: string): Blob {
  const [metadata, data] = base64.split(",");
  const mimeType = metadata.match(/:(.*?);/)?.[1] || "application/octet-stream"; // Extract MIME type
  const binary = atob(data); // Decode Base64
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mimeType });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer(); // Convert Blob to ArrayBuffer
  const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
  return `data:${blob.type};base64,` + buffer.toString("base64"); // Return Base64 with MIME type
}

// Add this helper function
const formatAddress = (addr: string) => {
  if (addr.startsWith("0x")) {
    return addr.startsWith("0x0") ? addr : "0x0" + addr.slice(2);
  }
  return "0x0" + addr;
};

const formatShortAddress = (addr: string) => {
  if (!addr) return "";
  const formattedAddr = formatAddress(addr); // Use existing formatAddress first
  return `${formattedAddr.slice(0, 6)}...${formattedAddr.slice(-4)}`;
};

export const getRecentEvents = (eventData: any) => {
  const allEvents = [];

  // Get bootcamp registrations
  if (eventData.organizations?.bootcampRegistrations) {
    allEvents.push(
      ...eventData.organizations.bootcampRegistrations.map((event: any) => ({
        data: `${formatShortAddress(event.org_address)} registered for bootcamp ${event.bootcamp_id}`,
        timestamp: event.block_timestamp,
      })),
    );
  }

  // Get instructor additions
  if (eventData.organizations?.instructorAddedToOrgs) {
    allEvents.push(
      ...eventData.organizations.instructorAddedToOrgs.map((event: any) => ({
        data: `${formatShortAddress(event.instructors[0])} added as instructor to ${event.org_name}`,
        timestamp: event.block_timestamp,
      })),
    );
  }

  // Get organization approvals
  if (eventData.organizations?.registrationApproveds) {
    allEvents.push(
      ...eventData.organizations.registrationApproveds.map((event: any) => ({
        data: `${formatShortAddress(event.student_address)} approved for bootcamp ${event.bootcamp_id}`,
        timestamp: event.block_timestamp,
      })),
    );
  }

  // Sort by timestamp and get latest 4
  return allEvents.sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);
};

export const orgquery = gql`
  {
    organizationProfiles {
      org_name
      block_number
      block_timestamp
    }
    bootCampCreateds {
      bootcamp_name
      org_name
      block_number
      block_timestamp
    }
    bootcampRegistrations {
      bootcamp_id
      org_address
      block_number
      block_timestamp
    }
    instructorAddedToOrgs {
      instructors
      org_name
      block_number
      block_timestamp
    }
    instructorRemovedFromOrgs {
      instructor_addr
      org_owner
      block_number
      block_timestamp
    }
    registrationApproveds {
      bootcamp_id
      student_address
      block_number
      block_timestamp
    }
    registrationDeclineds {
      bootcamp_id
      student_address
      block_number
      block_timestamp
    }
  }
`;

export const coursequery = gql`
  {
    adminTransferreds {
      new_admin
      block_number
      block_timestamp
    }
    courseCertClaimeds {
      candidate
      block_number
      block_timestamp
    }
    courseCreateds {
      owner_
      course_ipfs_uri
      block_number
      block_timestamp
    }
    courseReplaceds {
      owner_
      new_course_uri
      block_number
      block_timestamp
    }
  }
`;

export const eventquery = gql`
  {
    eventCreateds {
      event_name
      event_organizer
      block_number
      block_timestamp
    }
    adminOwnershipClaimeds {
      new_admin
      block_number
      block_timestamp
    }
    adminTransferreds {
      new_admin
      block_number
      block_timestamp
    }
    attendanceMarkeds {
      attendee
      block_number
      block_timestamp
    }
    registeredForEvents {
      attendee
      block_number
      block_timestamp
    }
    registrationStatusChangeds {
      registration_open
      block_number
      block_timestamp
    }
  }
`;

export const orgurl =
  "https://api.studio.thegraph.com/query/107628/orgsubgraph/version/latest";
export const headers = { Authorization: "Bearer {api-key}" };

export const courseurl =
  "https://api.studio.thegraph.com/query/107628/coursesubgraph/version/latest";

export const eventurl =
  "https://api.studio.thegraph.com/query/107628/eventsubgraph/version/latest";
