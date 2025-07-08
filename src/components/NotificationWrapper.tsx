import React, { useEffect, useState } from "react";
import { NotificationProvider } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/userutils";

interface NotificationWrapperProps {
  children: React.ReactNode;
}

const NotificationWrapper: React.FC<NotificationWrapperProps> = ({
  children,
}) => {
  const [userAddress, setUserAddress] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    const getAddress = async () => {
      console.log("NotificationWrapper: Getting address from user profile...");
      console.log("User:", user?.uid);

      // Get address from user profile (same approach as MyCourses.tsx)
      if (user?.uid) {
        try {
          console.log("Fetching user profile for:", user.uid);
          const profile = await getUserProfile(user.uid);
          console.log("User profile:", profile);
          if (profile?.starknetAddress) {
            console.log("Using profile address:", profile.starknetAddress);
            setUserAddress(profile.starknetAddress);
          } else {
            console.log("No starknet address in profile");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        console.log("No user UID available");
      }
    };

    getAddress();
  }, [user]);

  return (
    <NotificationProvider address={userAddress}>
      {children}
    </NotificationProvider>
  );
};

export default NotificationWrapper;
