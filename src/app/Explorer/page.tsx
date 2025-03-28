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

const query = gql`
  {
    myEntities(first: 5) {
      id
    }
    organizationProfiles(first: 5) {
      id
      org_name
      org_ipfs_uri
    }
  }
`;
const url =
  "https://api.studio.thegraph.com/query/107628/orgsubgraph/version/latest";
const headers = { Authorization: "Bearer {api-key}" };

const Index = () => {
  const [status, setStatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const queryClient = new QueryClient();

  const handlesub = async () => {
    await queryClient.prefetchQuery({
      queryKey: ["data"],
      async queryFn() {
        return await request(url, query, {}, headers);
      },
    });
  };

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setStatus(false);
  };

  useEffect(() => {
    handlesub();
  }, [queryClient]);

  return (
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

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExplorePage />
      </HydrationBoundary>
    </div>
  );
};

export default Index;
