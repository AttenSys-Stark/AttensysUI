"use client";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
const query = gql`
  {
    courseCreateds(first: 100) {
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
export default function CourseEvents() {
  const { data } = useQuery({
    queryKey: ["data"],
    async queryFn() {
      return await request(url, query);
    },
  });
  return <div>{JSON.stringify(data ?? {})}</div>;
}
