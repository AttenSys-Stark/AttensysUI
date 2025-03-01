"use client";
import React, { useEffect } from "react";
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
import CourseEvents from "./data/CourseEvents";
const query = gql`
  {
    CourseCreated(first: 100) {
      course_identifier
      owner_
      accessment_
      base_uri
      name_
      symbol
      course_ipfs_uri
    }
  }
`;

const url = process.env.NEXT_PUBLIC_COURSE_SUBGRAPH_URL ?? "";

const Index = () => {
  const [status, setStatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setStatus(false);
  };

  const queryClient = new QueryClient();
  const prefetchData = async () => {
    try {
      await queryClient.prefetchQuery({
        queryKey: ["data"],
        async queryFn() {
          return await request(url, query);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  prefetchData();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CourseEvents />
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

        <ExplorePage />
      </div>
    </HydrationBoundary>
  );
};

export default Index;
