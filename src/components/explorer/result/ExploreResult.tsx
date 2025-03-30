// ExploreResult.tsx
import React, { useState } from "react";
import { Button, Input } from "@headlessui/react";
import Image from "next/image";
import filter from "@/assets/filter.png";
import { RiArrowDropDownLine } from "react-icons/ri";
import { eventsData, gridsData } from "@/constants/data";
import ResultGrid from "./ResultGrid";
import { handleSubmit } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { format } from "date-fns";

type Params = {
  address?: string;
};

const orgquery = gql`
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

const coursequery = gql`
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

const eventquery = gql`
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

// Add interface for the event data structure
interface EventData {
  organizations: {
    bootcampRegistrations?: any[];
    instructorAddedToOrgs?: any[];
    instructorRemovedFromOrgs?: any[];
  };
  courses: {
    courseCreateds?: any[];
    courseCertClaimeds?: any[];
  };
  events: {
    attendanceMarkeds?: any[];
    eventCreateds?: any[];
    registeredForEvents?: any[];
  };
}

const orgurl =
  "https://api.studio.thegraph.com/query/107628/orgsubgraph/version/latest";
const headers = { Authorization: "Bearer {api-key}" };

const courseurl =
  "https://api.studio.thegraph.com/query/107628/coursesubgraph/version/latest";

const eventurl =
  "https://api.studio.thegraph.com/query/107628/eventsubgraph/version/latest";

const ExploreResult: React.FC<{ params: Params }> = ({ params }) => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { address } = params;
  const [resultData, setResultData] = useState<any[]>([]);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(eventsData.length / itemsPerPage);

  const goToPage = (page: any) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    if (currentPage > 2) pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages);
      i++
    ) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push("...");
    if (currentPage < totalPages - 1) pageNumbers.push(totalPages);
    return pageNumbers;
  };

  const handleChange = (event: { target: { value: any } }) => {
    setSearchValue(event.target.value);
  };

  const shortenAddress = (address: any) => {
    return address.slice(0, 10) + "..." + address.slice(-10);
  };

  const { data } = useQuery({
    queryKey: ["data"],
    async queryFn() {
      return await request(orgurl, orgquery, {}, headers);
    },
    refetchInterval: 10000,
  });

  const { data: coursedata } = useQuery({
    queryKey: ["coursedata"],
    async queryFn() {
      return await request(courseurl, coursequery, {}, headers);
    },
    refetchInterval: 10000,
  });

  const { data: eventdata } = useQuery({
    queryKey: ["eventdata"],
    async queryFn() {
      return await request(eventurl, eventquery, {}, headers);
    },
    refetchInterval: 10000,
  });

  const eventData: EventData = React.useMemo(
    () => ({
      organizations: data ?? {},
      courses: coursedata ?? {},
      events: eventdata ?? {},
    }),
    [data, coursedata],
  );

  React.useEffect(() => {
    if (!address) return;
    // Add this function after the queries and before the return statement
    const filterNotificationsByAddress = (address: string) => {
      if (!address) return [];

      const notifications: any = [];
      // Filter org-related notifications
      if (Object.keys(eventData.organizations).length != 0) {
        // Check bootcamp created
        // eventData.organizations?.bootcampCreateds.forEach((event: any) => {
        //   if (
        //     formatAddress(event.org_address.toLowerCase()) ===
        //     address.toLowerCase()
        //   ) {
        //     notifications.push({
        //       type: "BOOTCAMP_CREATED",
        //       bootcampId: event.bootcamp_id,
        //       timestamp: event.block_timestamp,
        //       blockNumber: event.block_number,
        //     });
        //   }
        // });

        // Check bootcamp registrations
        eventData.organizations?.bootcampRegistrations?.forEach(
          (event: any) => {
            if (
              formatAddress(event.org_address.toLowerCase()) ===
              address.toLowerCase()
            ) {
              notifications.push({
                type: "BOOTCAMP_REGISTRATION",
                bootcampId: event.bootcamp_id,
                timestamp: event.block_timestamp,
                blockNumber: event.block_number,
              });
            }
          },
        );

        // Check instructor additions
        eventData.organizations?.instructorAddedToOrgs?.forEach(
          (event: any) => {
            for (let i = 0; i < event.instructors.length; i++) {
              if (
                formatAddress(event.instructors[i].toLowerCase()) ===
                address.toLowerCase()
              ) {
                notifications.push({
                  type: "INSTRUCTOR_ADDED",
                  orgName: event.org_name,
                  timestamp: event.block_timestamp,
                  blockNumber: event.block_number,
                });
              }
            }
          },
        );

        // Check instructor removed
        eventData.organizations?.instructorRemovedFromOrgs?.forEach(
          (event: any) => {
            if (
              formatAddress(event.org_address.toLowerCase()) ===
              address.toLowerCase()
            ) {
              notifications.push({
                type: "INSTRUCTOR_REMOVED",
                bootcampId: event.bootcamp_id,
                timestamp: event.block_timestamp,
                blockNumber: event.block_number,
              });
            }
          },
        );

        // Check organization profile created
        // eventData.organizations?.organizationProfiles.forEach((event: any) => {
        //   if (
        //     formatAddress(event.org_address.toLowerCase()) ===
        //     address.toLowerCase()
        //   ) {
        //     notifications.push({
        //       type: "ORGANIZATION_PROFILE_CREATED",
        //       bootcampId: event.bootcamp_id,
        //       timestamp: event.block_timestamp,
        //       blockNumber: event.block_number,
        //     });
        //   }
        // });

        // Check organization approved
        // eventData.organizations?.organizationApproveds.forEach((event: any) => {
        //   if (
        //     formatAddress(event.student_address.toLowerCase()) ===
        //     address.toLowerCase()
        //   ) {
        //     notifications.push({
        //       type: "ORGANIZATION_APPROVED",
        //       bootcampId: event.bootcamp_id,
        //       timestamp: event.block_timestamp,
        //       blockNumber: event.block_number,
        //     });
        //   }
        // });

        // Check organization declined
        // eventData.organizations?.organizationDeclineds.forEach((event: any) => {
        //   if (
        //     formatAddress(event.student_address.toLowerCase()) ===
        //     address.toLowerCase()
        //   ) {
        //     notifications.push({
        //       type: "ORGANIZATION_APPROVED",
        //       bootcampId: event.bootcamp_id,
        //       timestamp: event.block_timestamp,
        //       blockNumber: event.block_number,
        //     });
        //   }
        // });
      }

      // Filter course-related notifications
      if (Object.keys(eventData.courses).length != 0) {
        // Check course creations
        eventData.courses?.courseCreateds?.forEach((event: any) => {
          if (
            formatAddress(event.owner_.toLowerCase()) === address.toLowerCase()
          ) {
            notifications.push({
              type: "COURSE_CREATED",
              owner: event.owner_,
              uri: event.course_ipfs_uri,
              timestamp: event.block_timestamp,
              blockNumber: event.block_number,
            });
          }
        });

        // Check certificate claims
        eventData.courses?.courseCertClaimeds?.forEach((event: any) => {
          if (
            formatAddress(event.candidate.toLowerCase()) ===
            address.toLowerCase()
          ) {
            notifications.push({
              type: "CERT_CLAIMED",
              candidate: event.candidate,
              timestamp: event.block_timestamp,
              blockNumber: event.block_number,
            });
          }
        });

        //TODO: check for course replaced
        //TODO: check for admin transfer
      }

      // Filter event-related notifications
      if (Object.keys(eventData.events).length != 0) {
        //TODO: check for admin ownership claimed
        //TODO: check for admin transfer

        // Check attendance marks
        eventData.events?.attendanceMarkeds?.forEach((event: any) => {
          if (
            formatAddress(event.attendee.toLowerCase()) ===
            address.toLowerCase()
          ) {
            notifications.push({
              type: "ATTENDANCE_MARKED",
              attendee: event.attendee,
              timestamp: event.block_timestamp,
              blockNumber: event.block_number,
            });
          }
        });

        // Check event created
        eventData.events?.eventCreateds?.forEach((event: any) => {
          if (
            formatAddress(event.event_organizer.toLowerCase()) ===
            address.toLowerCase()
          ) {
            notifications.push({
              type: "EVENT_CREATED",
              attendee: event.event_organizer,
              eventName: event.event_name,
              timestamp: event.block_timestamp,
              blockNumber: event.block_number,
            });
          }
        });

        // Check event registrations
        eventData.events?.registeredForEvents?.forEach((event: any) => {
          if (
            formatAddress(event.attendee.toLowerCase()) ===
            address.toLowerCase()
          ) {
            notifications.push({
              type: "EVENT_REGISTRATION",
              attendee: event.attendee,
              timestamp: event.block_timestamp,
              blockNumber: event.block_number,
            });
          }
        });

        //TODO: check for registration status changed
      }

      // Sort notifications by timestamp (most recent first)
      return notifications.sort((a: any, b: any) => b.timestamp - a.timestamp);
      // return notifications;
    };
    const filteredNotifications = filterNotificationsByAddress(address);
    setResultData(filteredNotifications);
    // console.log("what does it return", filterNotificationsByAddress(address));
  }, [data, coursedata, eventdata]);

  const formatTimestamp = (timestamp: number) => {
    // Convert from seconds to milliseconds if needed
    const date = new Date(timestamp * 1000);

    if (isNaN(date.getTime())) return "Invalid date"; // Handle invalid Date objects

    return format(date, "MMM dd, yyyy HH:mm:ss");
  };

  // First fix the mapping function
  const mapResultDataToGrids = (resultData: any[]) => {
    return resultData
      .map((notification) => {
        // Keep the original type in the mapped data
        const baseData = {
          type: notification.type,
          certification: "View certifications",
          nftImg: "",
        };

        switch (notification.type) {
          case "EVENT_REGISTRATION":
            return {
              ...baseData,
              eventName: "Event Registration",
              status: "Registered",
              date: formatTimestamp(notification.timestamp),
            };
          case "ATTENDANCE_MARKED":
            return {
              ...baseData,
              eventName: "Event Attendance",
              status: "Attendance Verified",
              date: formatTimestamp(notification.timestamp),
            };
          case "EVENT_CREATED":
            return {
              ...baseData,
              eventName: notification.eventName || "New Event",
              status: "Event Created",
              date: formatTimestamp(notification.timestamp),
            };
          case "COURSE_CREATED":
            return {
              ...baseData,
              eventName: notification.uri || "New Course",
              status: "Course Created",
              date: "BCK Web3 Pro",
            };
          case "CERT_CLAIMED":
            return {
              ...baseData,
              eventName: "Certificate Claimed",
              status: "Certificate Claimed",
              date: formatTimestamp(notification.timestamp),
            };
          default:
            return null;
        }
      })
      .filter(Boolean);
  };

  // Then update the gridsData transformation
  const updatedGridsData = React.useMemo(() => {
    const mappedResultData = mapResultDataToGrids(resultData);
    console.log("mappedResultData", mappedResultData);

    return gridsData.map((grid) => {
      console.log("the grid", grid);

      switch (grid.name) {
        case "Event": {
          const eventData = mappedResultData.filter((item: any) =>
            [
              "EVENT_REGISTRATION",
              "ATTENDANCE_MARKED",
              "EVENT_CREATED",
            ].includes(item.type),
          );
          console.log("Filtered Event Data:", eventData);
          return {
            ...grid,
            eventsData: [...grid.eventsData, ...eventData],
          };
        }

        case "Courses": {
          const courseData = mappedResultData.filter((item: any) =>
            ["COURSE_CREATED"].includes(item.type),
          );
          console.log("Filtered Course Data:", courseData);
          return {
            ...grid,
            eventsData: [...grid.eventsData, ...courseData],
          };
        }

        case "Certifications": {
          const certData = mappedResultData.filter((item: any) =>
            ["CERT_CLAIMED"].includes(item.type),
          );
          console.log("Filtered Cert Data:", certData);
          return {
            ...grid,
            eventsData: [...grid.eventsData, ...certData],
          };
        }

        default:
          return grid;
      }
    });
  }, [resultData, gridsData]);

  // Add this helper function
  const formatAddress = (addr: string) => {
    if (addr.startsWith("0x")) {
      return addr.startsWith("0x0") ? addr : "0x0" + addr.slice(2);
    }
    return "0x0" + addr;
  };

  return (
    <div className="bg-[#F5F7FA] w-full">
      <div className="mx-4 lg:mx-36 py-5">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b-2 border-[#e0e0e0] pb-4">
          <div className="space-y-2 mb-4 lg:mb-0">
            <h1 className="text-[18px] font-medium leading-[22px] text-[#333333]">
              Explorer Result
            </h1>
            <p className="text-[15px] font-medium leading-[18px] text-[#817676]">
              Key : Address{" "}
              <span className="text-[#9b51e0]">
                ({shortenAddress(address)})
              </span>
            </p>
          </div>

          <div className="w-full lg:w-[50%] relative">
            <form onSubmit={(e) => handleSubmit(e, searchValue, router)}>
              <div className="w-full h-[50px] rounded-xl bg-[#FFFFFF] px-6 flex items-center justify-between">
                <div className="w-full lg:w-[70%] relative">
                  <Input
                    name="search by address"
                    type="text"
                    placeholder="Search an address | organization | Course"
                    value={searchValue}
                    onChange={handleChange}
                    className="w-full h-[50px] p-2 pl-10 rounded-xl text-[15px] focus:outline-none font-medium text-[#817676] placeholder-[#817676]"
                  />
                  {!searchValue && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-[25px] w-[25px] text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  )}
                </div>

                <div className="hidden lg:flex h-[42px] w-[20%] rounded-xl items-center justify-center bg-[#4A90E21F] border-[1px] border-[#6B6D6E] space-x-1">
                  <h1 className="text-[#2D3A4B] text-[14px] leading-[21px] font-medium">
                    All Filters
                  </h1>
                  <RiArrowDropDownLine className="h-[20px] w-[20px] text-[#2D3A4B]" />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap lg:flex-nowrap gap-3 my-5">
          {["Filter", "Events", "Organization", "Certification", "Courses"].map(
            (category, index) => (
              <Button
                key={index}
                className="hidden lg:flex rounded-lg bg-[#4A90E21F] py-2 px-4 h-[42px] items-center w-[90px] text-sm text-[#2d3a4b]"
              >
                {category === "Filter" && (
                  <Image src={filter} alt="filter" className="mr-2" />
                )}
                <div className="text-[11px]">{category}</div>
              </Button>
            ),
          )}
        </div>
      </div>

      {/* Grid Results */}
      <div className="mx-4 lg:mx-36">
        {updatedGridsData.map((item: any, i: any) => (
          <ResultGrid
            key={i}
            item={item}
            eventsData={item.eventsData}
            generatePageNumbers={generatePageNumbers}
            goToPage={goToPage}
            currentPage={currentPage}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreResult;
