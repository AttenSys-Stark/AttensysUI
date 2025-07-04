"use client";
import React, { useEffect, useState } from "react";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useAtom } from "jotai";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";
import ExplorePage from "@/components/explorer/ExplorePage";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { loginorsignup } from "@/state/connectedWalletStarknetkitNext";
import CourseNews from "@/components/courses/CourseNews";

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
const orgurl =
  "https://api.studio.thegraph.com/query/107628/orgsubgraph/version/latest";
const headers = { Authorization: "Bearer {api-key}" };

const courseurl =
  "https://api.studio.thegraph.com/query/107628/coursesubgraph/version/latest";

const eventurl =
  "https://api.studio.thegraph.com/query/107628/eventsubgraph/version/latest";

const Index = () => {
  const [status, setStatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const queryClient = new QueryClient();
  const otherqueryClient = new QueryClient();
  const eventqueryClient = new QueryClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginorsignupstat, setLoginorsignupstat] = useAtom(loginorsignup);

  const handlesub = async () => {
    await queryClient.prefetchQuery({
      queryKey: ["data"],
      async queryFn() {
        return await request(orgurl, orgquery, {}, headers);
      },
    });
  };

  const handleothersub = async () => {
    await otherqueryClient.prefetchQuery({
      queryKey: ["data"],
      async queryFn() {
        return await request(courseurl, coursequery, {}, headers);
      },
    });
  };
  const handleeventsub = async () => {
    await eventqueryClient.prefetchQuery({
      queryKey: ["data"],
      async queryFn() {
        return await request(eventurl, eventquery, {}, headers);
      },
    });
  };
  const handlePageClick = () => {
    setbootcampdropstat(false);
    setStatus(false);
  };

  useEffect(() => {
    handlesub();
    handleothersub();
    handleeventsub();
  }, [queryClient, otherqueryClient, eventqueryClient]);

  useEffect(() => {
    // Use a local variable to track the mounted state
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isMounted) return;

      if (!user) {
        router.push("/");
      } else {
        setIsAuthenticated(true);
        setLoading(false);
        setLoginorsignupstat(false);
      }
      if (user) {
        console.log("user Data", user);
      }
    });

    // Add a timeout to ensure we don't show loader indefinitely
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
      }
    }, 2000); // 2 seconds timeout

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // or a redirect message
  }

  return (
    <>
      <Header />
      <div onClick={handlePageClick}>
        {status && (
          <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm "></div>
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
        <div className="mb-0">
          <CourseNews />
        </div>
        <HydrationBoundary state={dehydrate(eventqueryClient)}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <HydrationBoundary state={dehydrate(otherqueryClient)}>
              <ExplorePage />
            </HydrationBoundary>
          </HydrationBoundary>
        </HydrationBoundary>
      </div>
      <Footer />
    </>
  );
};

export default Index;
