import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { format } from "date-fns";

interface CourseEvent {
  id?: number;
  courseIdentifier: number;
  owner?: string;
  candidate?: string;
  timestamp?: string;
  blockNumber?: number;
  type: string;
}

const formatAddress = (address: string | undefined | null): string => {
  if (!address) return "N/A";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getEventColor = (type: string): string => {
  const colors = {
    Created: "text-blue-600",
    Replaced: "text-blue-600",
    Removed: "text-blue-600",
    Approved: "text-green-600",
    Unapproved: "text-green-600",
    Suspended: "text-green-600",
    Unsuspended: "text-green-600",
    Acquired: "text-purple-600",
    AdminTransferred: "text-purple-600",
    CertClaimed: "text-yellow-600",
    PriceUpdated: "text-orange-600",
  };
  return colors[type as keyof typeof colors] || "text-gray-600";
};

const CourseList: React.FC = () => {
  const [events, setEvents] = useState<CourseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Starting to fetch events...");

      const [
        acquiredCourses,
        createdCourses,
        replacedCourses,
        certClaimedCourses,
        adminTransferredCourses,
        suspendedCourses,
        unsuspendedCourses,
        removedCourses,
        priceUpdatedCourses,
        approvedCourses,
        unapprovedCourses,
      ] = await Promise.all([
        api.getAcquiredCourses().catch((err) => {
          console.error("Error fetching acquired courses:", err);
          return [];
        }),
        api.getCreatedCourses().catch((err) => {
          console.error("Error fetching created courses:", err);
          return [];
        }),
        api.getReplacedCourses().catch((err) => {
          console.error("Error fetching replaced courses:", err);
          return [];
        }),
        api.getCertClaimedCourses().catch((err) => {
          console.error("Error fetching cert claimed courses:", err);
          return [];
        }),
        api.getAdminTransferredCourses().catch((err) => {
          console.error("Error fetching admin transferred courses:", err);
          return [];
        }),
        api.getSuspendedCourses().catch((err) => {
          console.error("Error fetching suspended courses:", err);
          return [];
        }),
        api.getUnsuspendedCourses().catch((err) => {
          console.error("Error fetching unsuspended courses:", err);
          return [];
        }),
        api.getRemovedCourses().catch((err) => {
          console.error("Error fetching removed courses:", err);
          return [];
        }),
        api.getPriceUpdatedCourses().catch((err) => {
          console.error("Error fetching price updated courses:", err);
          return [];
        }),
        api.getApprovedCourses().catch((err) => {
          console.error("Error fetching approved courses:", err);
          return [];
        }),
        api.getUnapprovedCourses().catch((err) => {
          console.error("Error fetching unapproved courses:", err);
          return [];
        }),
      ]);

      // Log the raw responses
      console.log("Raw API Responses:", {
        acquired: acquiredCourses,
        created: createdCourses,
        replaced: replacedCourses,
        certClaimed: certClaimedCourses,
        adminTransferred: adminTransferredCourses,
        suspended: suspendedCourses,
        unsuspended: unsuspendedCourses,
        removed: removedCourses,
        priceUpdated: priceUpdatedCourses,
        approved: approvedCourses,
        unapproved: unapprovedCourses,
      });

      const allEvents: CourseEvent[] = [
        ...acquiredCourses.map((course: any) => ({
          ...course,
          type: "Acquired",
        })),
        ...createdCourses.map((course: any) => ({
          ...course,
          type: "Created",
        })),
        ...replacedCourses.map((course: any) => ({
          ...course,
          type: "Replaced",
        })),
        ...certClaimedCourses.map((course: any) => ({
          ...course,
          type: "CertClaimed",
        })),
        ...adminTransferredCourses.map((course: any) => ({
          ...course,
          type: "AdminTransferred",
        })),
        ...suspendedCourses.map((course: any) => ({
          ...course,
          type: "Suspended",
        })),
        ...unsuspendedCourses.map((course: any) => ({
          ...course,
          type: "Unsuspended",
        })),
        ...removedCourses.map((course: any) => ({
          ...course,
          type: "Removed",
        })),
        ...priceUpdatedCourses.map((course: any) => ({
          ...course,
          type: "PriceUpdated",
        })),
        ...approvedCourses.map((course: any) => ({
          ...course,
          type: "Approved",
        })),
        ...unapprovedCourses.map((course: any) => ({
          ...course,
          type: "Unapproved",
        })),
      ];

      // Log counts by event type
      const eventCounts = allEvents.reduce(
        (acc, event) => {
          acc[event.type] = (acc[event.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      console.log("Event counts by type:", eventCounts);
      console.log("Total events before sorting:", allEvents.length);

      // Sort events by timestamp (most recent first)
      allEvents.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      });

      // Log sample of events to check data structure
      console.log("First 5 events:", allEvents.slice(0, 5));
      console.log("Last 5 events:", allEvents.slice(-5));

      setEvents(allEvents);
    } catch (err) {
      console.error("Error in fetchEvents:", err);
      setError("Failed to fetch events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "N/A";
    return format(new Date(timestamp), "MMM dd, yyyy HH:mm:ss");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-900">
        Course Events ({events.length} total)
      </h1>
      {events.length === 0 ? (
        <div className="text-center text-gray-500">No events found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Block
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event, index) => {
                // Log each event as it's being rendered
                console.log(`Rendering event ${index}:`, event);
                return (
                  <tr
                    key={`${event.type}-${event.courseIdentifier}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimestamp(event.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${getEventColor(event.type)}`}
                      >
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.courseIdentifier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatAddress(event.owner)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatAddress(event.candidate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.blockNumber || "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseList;
