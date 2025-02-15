"use client";
import React, { useState, useEffect } from "react";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useAtom } from "jotai";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";

import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import MyCertifications from "@/components/certifications/MyCertifications";
import { useRouter, useSearchParams } from "next/navigation";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  const userId = null;
  // const userId = searchParams.get('userId');
  const search = searchParams.get("userId");

  // This will be logged on the server during the initial render
  // and on the client on subsequent navigations.
  console.info(search);

  // Now you can use the userId
  console.info(searchParams);
  // console.log(router)

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  // Simulate fetching user data from a database
  const user = {
    id: userId,
    name: "John Doe",
    email: "john@example.com",
    memberSince: "2021-01-01",
  };

  // Fetch user-specific data when userId changes
  useEffect(() => {
    if (userId) {
      // Simulating an API call to fetch user-specific data
      const fetchUserData = async () => {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUserData(data);
      };

      fetchUserData();
    }
  }, [userId]);

  if (userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#f5f7fa]" onClick={handlePageClick}>
      {status && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      {bootcampdropstat && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      <div onClick={(e) => e.stopPropagation()}>
        <Coursedropdown />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Bootcampdropdown />
      </div>

      <MyCertifications />
    </div>
  );
};

export default Index;
