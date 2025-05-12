import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { format } from "date-fns";
import { useAccount } from "@starknet-react/core";

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

// Add interface for the event data structure
interface EventData {
  courses: {
    courseCreateds?: any[];
    courseCertClaimeds?: any[];
  };
}

const headers = { Authorization: "Bearer {api-key}" };

const courseurl =
  "https://api.studio.thegraph.com/query/107628/coursesubgraph/version/latest";

const Notification = (props: any) => {
  const { wallet } = props;
  const [notifications, setNotifications] = useState<any[]>([]);
  const { address } = useAccount();

  const { data: coursedata } = useQuery({
    queryKey: ["coursedata"],
    async queryFn() {
      return await request(courseurl, coursequery, {}, headers);
    },
    refetchInterval: 10000,
  });

  const eventData: EventData = React.useMemo(
    () => ({
      courses: coursedata ?? {},
    }),
    [coursedata],
  );

  React.useEffect(() => {
    // Add this function after the queries and before the return statement
    const filterNotificationsByAddress = (address: string | undefined) => {
      // if (!address) return [];

      const notifications: any = [];

      // Filter course-related notifications
      if (Object.keys(eventData.courses).length != 0) {
        // Check course creations
        eventData.courses?.courseCreateds?.forEach((event: any) => {
          if (
            formatAddress(event.owner_.toLowerCase()) ==
            formatAddress(address?.toLowerCase())
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
            formatAddress(event.candidate.toLowerCase()) ==
            formatAddress(address?.toLowerCase())
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
      // Sort notifications by timestamp (most recent first)
      return notifications.sort((a: any, b: any) => b.timestamp - a.timestamp);
    };
    setNotifications(filterNotificationsByAddress(address));
  }, [coursedata, address]);

  // Add this helper function
  const formatAddress = (addr: string | undefined) => {
    if (addr?.startsWith("0x")) {
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
      <div className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
        <div className="text-sm h-[1014px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {notifications.map(
            (
              item: { type: string; timestamp: number; blockNumber: number },
              i: number,
            ) => (
              <div
                key={`notification-${i}-${item.blockNumber}`}
                className="group transition-all duration-200 ease-in-out"
              >
                <div
                  className={`py-4 px-6 lg:px-8 min-h-[80px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } group-hover:bg-blue-50 border-b border-gray-100 last:border-b-0`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`mt-1 flex-shrink-0 h-3 w-3 rounded-full ${
                        (
                          {
                            COURSE_CREATED: "bg-emerald-500",
                            CERT_CLAIMED: "bg-indigo-500",
                            INSTRUCTOR_ADDED: "bg-amber-500",
                            INSTRUCTOR_REMOVED: "bg-rose-500",
                            BOOTCAMP_REGISTRATION: "bg-blue-500",
                            EVENT_REGISTRATION: "bg-purple-500",
                            ATTENDANCE_MARKED: "bg-teal-500",
                            ORGANIZATION_PROFILE_CREATED: "bg-cyan-500",
                            ORGANIZATION_APPROVED: "bg-green-500",
                            ORGANIZATION_DECLINED: "bg-red-500",
                          } as Record<string, string>
                        )[item.type] || "bg-gray-400"
                      }`}
                    ></div>

                    <p className="text-gray-800 font-medium leading-snug">
                      <span className="font-semibold text-gray-900">
                        You have{" "}
                      </span>
                      {(
                        {
                          COURSE_CREATED: "created a new course",
                          CERT_CLAIMED: "successfully claimed a certificate",
                          INSTRUCTOR_ADDED: "added a new instructor",
                          INSTRUCTOR_REMOVED: "removed an instructor",
                          BOOTCAMP_REGISTRATION: "registered for a bootcamp",
                          EVENT_REGISTRATION:
                            "registered for an upcoming event",
                          ATTENDANCE_MARKED: "marked attendance",
                          ORGANIZATION_PROFILE_CREATED:
                            "created an organization profile",
                          ORGANIZATION_APPROVED:
                            "approved an organization request",
                          ORGANIZATION_DECLINED:
                            "declined an organization application",
                        } as Record<string, string>
                      )[item.type] || "performed an action"}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pl-5 sm:pl-0">
                    <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                      {formatTimestamp(item.timestamp)}
                    </p>
                    <p className="hidden sm:block text-gray-300">|</p>
                    {/* <p>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium tracking-wide">
                Block #{item.blockNumber}
              </span>
            </p> */}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
