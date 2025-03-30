import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { format } from "date-fns";

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

const Notification = (props: any) => {
  const { wallet } = props;
  const [notifications, setNotifications] = useState<any[]>([]);

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
              type: "ATTENDANCE_MARKED",
              attendee: event.attendee,
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

    setNotifications(filterNotificationsByAddress(wallet?.selectedAddress));

    console.log(
      "what does it return",
      filterNotificationsByAddress(wallet?.selectedAddress),
    );
  }, [data, coursedata, eventdata]);

  console.log("The real notifications", notifications);

  // Add this helper function
  const formatAddress = (addr: string) => {
    if (addr.startsWith("0x")) {
      return addr.startsWith("0x0") ? addr : "0x0" + addr.slice(2);
    }
    return "0x0" + addr;
  };

  const formatTimestamp = (timestamp: number) => {
    // Convert from seconds to milliseconds if needed
    const date = new Date(timestamp * 1000);
    return format(date, "MMM dd, yyyy HH:mm:ss");
  };
  return (
    <div className="bg-white py-6 my-0 sm:my-12 lg:mx-2 rounded-xl border-[1px] border-[#BCBCBC]">
      {/* header */}
      <div className="px-12 py-5">
        <h1 className="font-bold text-lg text-[#A01B9B]">
          Notifications ({notifications.length})
        </h1>
      </div>

      {/* content */}
      <div className="border-t-[1px] border-t-[#BCBCBC] text-sm h-[1014px] overflow-y-scroll scrollbar-hide">
        {notifications.map((item, i) => (
          <div key={i}>
            <div
              className={`py-3 px-5 lg:px-12 min-h-[75px] border grid grid-cols-[1fr_200px_150px] gap-4 items-center ${
                i % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <p className="truncate">
                {`You have ${item.type === "COURSE_CREATED" ? "created a course" : item.type === "CERT_CLAIMED" ? "claimed a certificate" : item.type === "INSTRUCTOR_ADDED" ? "added an instructor" : item.type === "INSTRUCTOR_REMOVED" ? "removed an instructor" : item.type === "BOOTCAMP_REGISTRATION" ? "registered for a bootcamp" : item.type === "EVENT_REGISTRATION" ? "registered for an event" : item.type === "ATTENDANCE_MARKED" ? "marked attendance" : item.type === "ORGANIZATION_PROFILE_CREATED" ? "created an organization profile" : item.type === "ORGANIZATION_APPROVED" ? "approved an organization" : item.type === "ORGANIZATION_DECLINED" ? "declined an organization" : ""}`}
              </p>
              <p className="text-right">{formatTimestamp(item.timestamp)}</p>
              <p className="text-right">
                <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  Block #{item.blockNumber}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
