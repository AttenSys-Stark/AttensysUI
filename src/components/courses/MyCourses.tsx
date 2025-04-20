import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { coursesDetails, learningDetails } from "@/constants/data";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Contract } from "starknet";
import { connect } from "starknetkit";
import CoursesCreated from "./CoursesCreated";
import CreateACourse from "./CreateACourse";
import LearningJourney from "./LearningJourney";
import Notification from "./Notification";
import UserSideBar from "./UserSideBar";
import { useAccount } from "@starknet-react/core";

interface CourseType {
  data: any;
  owner: string;
  course_identifier: number;
  accessment: boolean;
  uri: Uri;
  course_ipfs_uri: string;
  is_suspended: boolean;
}

interface Uri {
  first: string;
  second: string;
}

const MyCourses = (props: any) => {
  const [selected, setSelected] = useState("");
  const [page, setPage] = useState("");
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseData, setCourseData] = useState<CourseType[]>([]);
  const [takenCourses, setTakenCourses] = useState<CourseType[]>([]);
  const [takenCoursesData, setTakenCoursesData] = useState<CourseType[]>([]);
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();
  const { account, address } = useAccount();

  const courseContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    provider,
  );

  const getAllUserCreatedCourses = async () => {
    if (account == undefined) return;
    const res: CourseType[] =
      await courseContract?.get_all_creator_courses(address);

    const secondRes: CourseType[] =
      await courseContract?.get_all_taken_courses(address);

    // console.log("all courses", res);
    // console.log("all taken courses", secondRes);

    setCourses(res);
    setTakenCourses(secondRes);
  };

  const getSingleCourse = async () => {
    if (!courses.length) return; // Prevent running on empty `courses`
    if (!takenCourses.length) return; // Prevent running on empty `courses`

    const resolvedCourses = await Promise.all(
      courses.map(async (course: CourseType) => {
        if (!course.course_ipfs_uri) {
          return null; // Skip invalid URLs
        }

        try {
          return await fetchCIDContent(course.course_ipfs_uri);
        } catch (error) {
          console.error("Error fetching from IPFS:", error);
          return null; // Skip on failure
        }
      }),
    );
    const resolvedTakenCourses = await Promise.all(
      takenCourses.map(async (course: CourseType) => {
        if (!course.course_ipfs_uri) {
          return null; // Skip invalid URLs
        }

        try {
          return await fetchCIDContent(course.course_ipfs_uri);
        } catch (error) {
          console.error("Error fetching from IPFS:", error);
          return null; // Skip on failure
        }
      }),
    );

    // Filter out null values before updating state
    const validCourses = resolvedCourses.filter(
      (course): course is any => course !== null,
    );
    // Filter out null values before updating state
    const validTakenCourses = resolvedTakenCourses.filter(
      (course): course is any => course !== null,
    );

    // Remove duplicates before updating state
    setCourseData((prevCourses) => {
      const uniqueCourses = [
        ...prevCourses,
        ...validCourses.filter(
          (newCourse) =>
            !prevCourses.some(
              (prev) => prev.data.courseName === newCourse.data.courseName,
            ),
        ),
      ];
      return uniqueCourses;
    });

    // Remove duplicates before updating state
    setTakenCoursesData((prevCourses) => {
      const uniqueCourses = [
        ...prevCourses,
        ...validTakenCourses.filter(
          (newCourse) =>
            !prevCourses.some(
              (prev) => prev.data.courseName === newCourse.data.courseName,
            ),
        ),
      ];
      return uniqueCourses;
    });
  };

  useEffect(() => {
    getAllUserCreatedCourses(); // Fetch courses when the wallet address changes
    getSingleCourse();
    // console.log("data here",courseData)
  }, [account]);

  useEffect(() => {
    setPage("myCourse");
  }, [page, account, courseData]);

  return (
    <div className="block lg:flex lg:mx-10 mb-8 pb-24 max-w-screen-2xl xl:mx-auto">
      <UserSideBar
        wallet={account}
        courseData={courseData}
        takenCoursesData={takenCoursesData}
        page={page}
        selected={selected}
        setSelected={setSelected}
      />

      <div className="flex-auto ml-0 lg:ml-5 px-4 my-12 lg:my-0 lg:px-0 hidden sm:block">
        {coursesDetails.map((item, i) =>
          item && item.tag == selected ? (
            <CoursesCreated
              courseData={courseData}
              item={item}
              selected={selected}
              key={i}
            />
          ) : null,
        )}

        <div className={`${selected ? "0" : "mt-12"}`}>
          {/* Learning journey */}
          {learningDetails.map((item, i) =>
            item && item.tag == selected ? (
              <LearningJourney
                item={item}
                selected={selected}
                key={i}
                takenCoursesData={takenCoursesData}
              />
            ) : null,
          )}
        </div>

        <div>{selected == "Create a course" ? <CreateACourse /> : null}</div>

        <div>
          {selected == "" || selected == "Notification" ? (
            <Notification wallet={account} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
