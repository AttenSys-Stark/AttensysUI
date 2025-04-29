import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";

// Updated interfaces to include block information
interface OrganizationProfile {
  org_name: string;
  block_number: number;
  block_timestamp: number;
}

interface BootCampCreated {
  bootcamp_name: string;
  org_name: string;
  block_number: number;
  block_timestamp: number;
}

interface BootcampRegistration {
  bootcamp_id: string;
  org_address: string;
  block_number: number;
  block_timestamp: number;
}

interface InstructorAddedToOrg {
  instructors: string[];
  org_name: string;
  block_number: number;
  block_timestamp: number;
}

interface InstructorRemovedFromOrg {
  instructor_addr: string;
  org_owner: string;
  block_number: number;
  block_timestamp: number;
}

interface RegistrationApproved {
  bootcamp_id: string;
  student_address: string;
  block_number: number;
  block_timestamp: number;
}

interface RegistrationDeclined {
  bootcamp_id: string;
  student_address: string;
  block_number: number;
  block_timestamp: number;
}

interface AdminTransferred {
  new_admin: string;
  block_number: number;
  block_timestamp: number;
}

interface CourseCertClaimed {
  candidate: string;
  block_number: number;
  block_timestamp: number;
}

interface CourseCreated {
  owner_: string;
  course_ipfs_uri: string[];
  block_number: number;
  block_timestamp: number;
}

interface CourseReplaced {
  owner_: string;
  new_course_uri: string;
  block_number: number;
  block_timestamp: number;
}

interface EventCreated {
  event_name: string[];
  event_organizer: string;
  block_number: number;
  block_timestamp: number;
}

interface AttendanceMarked {
  attendee: string;
  block_number: number;
  block_timestamp: number;
}

interface RegisteredForEvent {
  attendee: string;
  block_number: number;
  block_timestamp: number;
}

interface RegistrationStatusChanged {
  registration_open: number;
  block_number: number;
  block_timestamp: number;
}

interface OrganizationEvents {
  organizationProfiles?: OrganizationProfile[];
  bootCampCreateds?: BootCampCreated[];
  bootcampRegistrations?: BootcampRegistration[];
  instructorAddedToOrgs?: InstructorAddedToOrg[];
  instructorRemovedFromOrgs?: InstructorRemovedFromOrg[];
  registrationApproveds?: RegistrationApproved[];
  registrationDeclineds?: RegistrationDeclined[];
}

interface CourseEvents {
  adminTransferreds?: AdminTransferred[];
  courseCertClaimeds?: CourseCertClaimed[];
  courseCreateds?: CourseCreated[];
  courseReplaceds?: CourseReplaced[];
}

interface EventEvents {
  eventCreateds?: EventCreated[];
  adminOwnershipClaimeds?: any[];
  adminTransferreds?: any[];
  attendanceMarkeds?: AttendanceMarked[];
  registeredForEvents?: RegisteredForEvent[];
  registrationStatusChangeds?: RegistrationStatusChanged[];
}

interface EventData {
  organizations?: OrganizationEvents;
  courses?: CourseEvents;
  events?: EventEvents;
}

interface EventItem {
  id: string;
  message: string;
  blockNumber: number;
  timestamp: number;
  type: string;
}

const EventFeed = ({ data }: { data: EventData }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);
  const previousDataRef = useRef<EventData | null>(null);

  const isNewItem = <T extends keyof EventData>(
    type: T,
    field: keyof (T extends "organizations"
      ? OrganizationEvents
      : T extends "courses"
        ? CourseEvents
        : EventEvents),
    item: any,
  ): boolean => {
    const currentTypeData = previousDataRef.current?.[type] as
      | (T extends "organizations"
          ? OrganizationEvents
          : T extends "courses"
            ? CourseEvents
            : EventEvents)
      | undefined;

    if (!currentTypeData) return true;

    const fieldData = currentTypeData[field as keyof typeof currentTypeData] as
      | any[]
      | undefined;
    if (!fieldData) return true;

    return !fieldData.some(
      (prevItem) => JSON.stringify(prevItem) === JSON.stringify(item),
    );
  };

  useEffect(() => {
    if (!data) return;

    const newEvents: EventItem[] = [];

    // Process organization events
    if (data.organizations) {
      data.organizations.organizationProfiles?.forEach((org) => {
        if (isNewItem("organizations", "organizationProfiles", org)) {
          newEvents.push({
            id: `${org.org_name}-profile-${org.block_number}`,
            message: `${org.org_name} created a profile`,
            blockNumber: org.block_number,
            timestamp: org.block_timestamp,
            type: "organizationProfile",
          });
        }
      });

      data.organizations.bootCampCreateds?.forEach((bootcamp) => {
        if (isNewItem("organizations", "bootCampCreateds", bootcamp)) {
          newEvents.push({
            id: `${bootcamp.bootcamp_name}-created-${bootcamp.block_number}`,
            message: `${bootcamp.org_name} created a bootcamp: ${bootcamp.bootcamp_name}`,
            blockNumber: bootcamp.block_number,
            timestamp: bootcamp.block_timestamp,
            type: "bootcampCreated",
          });
        }
      });

      data.organizations.bootcampRegistrations?.forEach((reg) => {
        if (isNewItem("organizations", "bootcampRegistrations", reg)) {
          newEvents.push({
            id: `${reg.bootcamp_id}-reg-${reg.block_number}`,
            message: `${truncateAddress(reg.org_address)} got a new registration for bootcamp with id ${reg.bootcamp_id}`,
            blockNumber: reg.block_number,
            timestamp: reg.block_timestamp,
            type: "bootcampRegistration",
          });
        }
      });

      data.organizations.instructorAddedToOrgs?.forEach((instructor) => {
        if (isNewItem("organizations", "instructorAddedToOrgs", instructor)) {
          newEvents.push({
            id: `${instructor.org_name}-instructor-add-${instructor.block_number}`,
            message: `${instructor.org_name} added instructors`,
            blockNumber: instructor.block_number,
            timestamp: instructor.block_timestamp,
            type: "instructorAdded",
          });
        }
      });

      data.organizations.instructorRemovedFromOrgs?.forEach((instructor) => {
        if (
          isNewItem("organizations", "instructorRemovedFromOrgs", instructor)
        ) {
          newEvents.push({
            id: `${instructor.org_owner}-instructor-remove-${instructor.block_number}`,
            message: `${truncateAddress(instructor.org_owner)} removed an instructor`,
            blockNumber: instructor.block_number,
            timestamp: instructor.block_timestamp,
            type: "instructorRemoved",
          });
        }
      });

      data.organizations.registrationApproveds?.forEach((approval) => {
        if (isNewItem("organizations", "registrationApproveds", approval)) {
          newEvents.push({
            id: `${approval.bootcamp_id}-approval-${approval.block_number}`,
            message: `${truncateAddress(approval.student_address)} was approved for bootcamp with id ${approval.bootcamp_id}`,
            blockNumber: approval.block_number,
            timestamp: approval.block_timestamp,
            type: "registrationApproved",
          });
        }
      });

      data.organizations.registrationDeclineds?.forEach((declined) => {
        if (isNewItem("organizations", "registrationDeclineds", declined)) {
          newEvents.push({
            id: `${declined.bootcamp_id}-declined-${declined.block_number}`,
            message: `${truncateAddress(declined.student_address)} was declined for bootcamp with id ${declined.bootcamp_id}`,
            blockNumber: declined.block_number,
            timestamp: declined.block_timestamp,
            type: "registrationDeclined",
          });
        }
      });
    }

    // Process course events
    if (data.courses) {
      data.courses.adminTransferreds?.forEach((transfer) => {
        if (isNewItem("courses", "adminTransferreds", transfer)) {
          newEvents.push({
            id: `${transfer.new_admin}-admin-${transfer.block_number}`,
            message: `${truncateAddress(transfer.new_admin)} became an admin`,
            blockNumber: transfer.block_number,
            timestamp: transfer.block_timestamp,
            type: "adminTransferred",
          });
        }
      });

      data.courses.courseCertClaimeds?.forEach((cert) => {
        if (isNewItem("courses", "courseCertClaimeds", cert)) {
          newEvents.push({
            id: `${cert.candidate}-cert-${cert.block_number}`,
            message: `${truncateAddress(cert.candidate)} claimed a course`,
            blockNumber: cert.block_number,
            timestamp: cert.block_timestamp,
            type: "courseCertClaimed",
          });
        }
      });

      data.courses.courseCreateds?.forEach((course) => {
        if (isNewItem("courses", "courseCreateds", course)) {
          newEvents.push({
            id: `${course.owner_}-create-${course.block_number}`,
            message: `${truncateAddress(course.owner_)} created a course`,
            blockNumber: course.block_number,
            timestamp: course.block_timestamp,
            type: "courseCreated",
          });
        }
      });

      data.courses.courseReplaceds?.forEach((course) => {
        if (isNewItem("courses", "courseReplaceds", course)) {
          newEvents.push({
            id: `${course.owner_}-update-${course.block_number}`,
            message: `${truncateAddress(course.owner_)} updated a course`,
            blockNumber: course.block_number,
            timestamp: course.block_timestamp,
            type: "courseReplaced",
          });
        }
      });
    }

    // Process event-related events
    if (data.events) {
      data.events.eventCreateds?.forEach((event) => {
        if (isNewItem("events", "eventCreateds", event)) {
          newEvents.push({
            id: `${event.event_name[0]}-created-${event.block_number}`,
            message: `${truncateAddress(event.event_organizer)} created event: ${event.event_name[0]}`,
            blockNumber: event.block_number,
            timestamp: event.block_timestamp,
            type: "eventCreated",
          });
        }
      });

      data.events.attendanceMarkeds?.forEach((attendance) => {
        if (isNewItem("events", "attendanceMarkeds", attendance)) {
          newEvents.push({
            id: `${attendance.attendee}-attended-${attendance.block_number}`,
            message: `${truncateAddress(attendance.attendee)} attended an event`,
            blockNumber: attendance.block_number,
            timestamp: attendance.block_timestamp,
            type: "attendanceMarked",
          });
        }
      });

      data.events.registeredForEvents?.forEach((registration) => {
        if (isNewItem("events", "registeredForEvents", registration)) {
          newEvents.push({
            id: `${registration.attendee}-registered-${registration.block_number}`,
            message: `${truncateAddress(registration.attendee)} registered for an event`,
            blockNumber: registration.block_number,
            timestamp: registration.block_timestamp,
            type: "registeredForEvent",
          });
        }
      });

      data.events.registrationStatusChangeds?.forEach((statusChange) => {
        if (isNewItem("events", "registrationStatusChangeds", statusChange)) {
          newEvents.push({
            id: `status-change-${statusChange.block_number}`,
            message: `Registration status was updated for an event`,
            blockNumber: statusChange.block_number,
            timestamp: statusChange.block_timestamp,
            type: "registrationStatusChanged",
          });
        }
      });
    }

    if (newEvents.length > 0) {
      // Sort all events by block number in descending order
      const sortedEvents = [...newEvents, ...events].sort(
        (a, b) => b.blockNumber - a.blockNumber,
      );
      setEvents(sortedEvents);
    }

    previousDataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (feedRef.current && events.length > 0) {
      feedRef.current.scrollTop = 0;
    }
  }, [events]);

  const truncateAddress = (address: string) => {
    if (!address) return "Unknown";
    return `${address.substring(0, 10)}...${address.substring(address.length - 4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    // Convert from seconds to milliseconds if needed
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return "Invalid date"; // Handle invalid Date objects

    return format(date, "MMM dd, yyyy HH:mm:ss");
  };

  // function to format just the time portion
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return "";

    return format(date, "h:mm a").toUpperCase();
  };

  return (
    <div className="max-w-[92%] mx-auto mt-4">
      {/* Header row */}
      <div className="flex justify-between items-center py-3 px-4 bg-[#ECD9FF] rounded-lg mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#9B51E052] mr-2">
            <Package className="h-4 w-4 text-[#5801A9]" />
          </div>
          <span className="text-sm font-medium text-[#5801A9]">
            Wallet address / status
          </span>
        </div>
        <span className="text-sm font-medium text-[#5801A9]">Timestamp</span>
      </div>

      {/* Activity items */}
      <div
        ref={feedRef}
        className="space-y-2 max-h-[700px] overflow-y-auto pr-1"
      >
        {events.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No recent activity
          </p>
        ) : (
          events.map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="flex justify-between items-center py-3 px-4 bg-[#F9F5FF] hover:bg-[#F0E6FF] transition-colors duration-200 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#D8C3F2] mr-2">
                  <Package className="h-4 w-4 text-[#5801A9]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#5801A9]">
                    #{event.blockNumber}
                  </p>
                  <p className="text-xs text-[#7F56D9]">{event.message}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-[#5801A9]">
                  {formatTimestamp(event.timestamp)}
                </p>
                <p className="text-xs text-[#7F56D9]">
                  {formatTime(event.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View all link */}
      {/* <div className="flex justify-center mt-4">
        <Link
          href="#"
          className="flex items-center text-sm text-[#5801A9] hover:text-[#7F56D9] transition-colors duration-200"
        >
          View all recent searches
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div> */}
    </div>
  );
};

export default EventFeed;
