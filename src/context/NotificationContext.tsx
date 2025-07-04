import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

interface NotificationItem {
  id: string;
  type: string;
  eventType: string;
  message: string;
  timestamp: string;
  blockNumber: number;
  courseIdentifier?: number;
  courseCreator?: string;
  owner?: string;
  candidate?: string;
  newAdmin?: string;
  name?: string;
  isRead?: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadNotifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (notificationIds?: string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

interface NotificationProviderProps {
  children: ReactNode;
  address?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  address,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<
    NotificationItem[]
  >([]);
  const queryClient = useQueryClient();

  // Fetch all notifications for the address
  const {
    data: allNotificationsData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery({
    queryKey: ["notifications", address],
    queryFn: async () => {
      if (!address) return [];
      console.log("Fetching notifications for address:", address);
      const events = await api.getEventsByAddress(address);
      console.log("Fetched events:", events);
      return events;
    },
    enabled: !!address,
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch read status
  const { data: readStatusData, isLoading: isLoadingReadStatus } = useQuery({
    queryKey: ["notificationReadStatus", address],
    queryFn: async () => {
      if (!address) return {};
      try {
        return await api.getNotificationReadStatus(address);
      } catch (error) {
        console.log("Using fallback read status for address:", address);
        return {};
      }
    },
    enabled: !!address,
    retry: 2,
  });

  // Mark notifications as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationIds?: string[]) => {
      if (!address) return;
      return await api.markNotificationsAsRead(address, notificationIds);
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications", address] });
      queryClient.invalidateQueries({
        queryKey: ["notificationReadStatus", address],
      });
    },
  });

  // Process notifications with read status
  useEffect(() => {
    if (allNotificationsData && Array.isArray(allNotificationsData)) {
      console.log("Processing notifications:", allNotificationsData.length);

      const processedNotifications = allNotificationsData.map((event: any) => {
        const id = `${event.type || "unknown"}-${event.id || event.courseIdentifier || event.blockNumber}`;
        const isRead = readStatusData?.[id] || false;

        // Generate message based on event type
        let message = "";
        switch (event.type) {
          case "COURSE_CREATED":
            message = `You created '${event.name || "Unnamed Course"}'`;
            break;
          case "COURSE_ACQUIRED":
            message = `You acquired course #${event.courseIdentifier}`;
            break;
          case "CERT_CLAIMED":
            message = `You claimed certificate for course #${event.courseIdentifier}`;
            break;
          case "COURSE_REPLACED":
            message = `You updated course #${event.courseIdentifier}`;
            break;
          case "ADMIN_TRANSFERRED":
            message = `You became an admin`;
            break;
          case "COURSE_APPROVED":
            message = `Course #${event.courseIdentifier} was approved`;
            break;
          case "COURSE_UNAPPROVED":
            message = `Course #${event.courseIdentifier} was unapproved`;
            break;
          case "COURSE_REMOVED":
            message = `Course #${event.courseIdentifier} was removed`;
            break;
          default:
            message = `${event.type || "Unknown"} event`;
        }

        return {
          id,
          type: event.type || "unknown",
          eventType: event.eventType || event.type || "unknown",
          message,
          timestamp: event.timestamp,
          blockNumber: event.blockNumber,
          courseIdentifier: event.courseIdentifier,
          courseCreator: event.courseCreator,
          owner: event.owner,
          candidate: event.candidate,
          newAdmin: event.newAdmin,
          name: event.name,
          isRead,
        };
      });

      // Sort by block number (newest first)
      processedNotifications.sort((a, b) => b.blockNumber - a.blockNumber);

      setNotifications(processedNotifications);

      // Filter unread notifications
      const unread = processedNotifications.filter(
        (notification) => !notification.isRead,
      );
      setUnreadNotifications(unread);

      console.log("Processed notifications:", processedNotifications.length);
      console.log("Unread notifications:", unread.length);
    }
  }, [allNotificationsData, readStatusData]);

  const markAsRead = async (notificationIds?: string[]) => {
    await markAsReadMutation.mutateAsync(notificationIds);
  };

  const markAllAsRead = async () => {
    await markAsReadMutation.mutateAsync();
  };

  const value: NotificationContextType = {
    notifications,
    unreadNotifications,
    unreadCount: unreadNotifications.length,
    markAsRead,
    markAllAsRead,
    isLoading: isLoadingAll || isLoadingReadStatus,
    isError: isErrorAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
