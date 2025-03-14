import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUserGraduate } from "@react-icons/all-files/fa/FaUserGraduate";
import Switch from "react-switch";
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar";
import { HiBadgeCheck } from "@react-icons/all-files/hi/HiBadgeCheck";
import { FaPlay } from "@react-icons/all-files/fa/FaPlay";
import { GrDiamond } from "@react-icons/all-files/gr/GrDiamond";

import ProgressBar from "@ramonak/react-progress-bar";
import Notification from "./Notification";
import CreateACourse from "./CreateACourse";
import UserSideBar from "./UserSideBar";
import { handleMyCourseSubComp } from "@/utils/helpers";
import { coursesDetails, learningDetails } from "@/constants/data";
import LearningJourney from "./LearningJourney";
import CoursesCreated from "./CoursesCreated";
import { useAtom } from "jotai";
import { connect } from "starknetkit";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { pinata } from "../../../utils/config";
import { attensysCourseAddress } from "@/deployments/contracts";
import { attensysCourseAbi } from "@/deployments/abi";
import { Contract } from "starknet";

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

  const courseContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    wallet?.account,
  );

  const getAllUserCreatedCourses = async () => {
    if (wallet == undefined) return;
    const res: CourseType[] = await courseContract?.get_all_creator_courses(
      wallet?.selectedAddress,
    );

    const secondRes: CourseType[] = await courseContract?.get_all_taken_courses(
      wallet?.selectedAddress,
    );

    setCourses(res);
    setTakenCourses(secondRes);
  };

  const getPubIpfs = async (CID: string) => {
    try {
      //@ts-ignore
      const data = await pinata.gateways.get(CID);
      return data;
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
    }
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
          return await getPubIpfs(course.course_ipfs_uri);
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
          return await getPubIpfs(course.course_ipfs_uri);
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
  }, [wallet, courses]);

  useEffect(() => {
    setPage("myCourse");

    const autoConnect = async () => {
      try {
        const { wallet: connectedWallet, connector } = await connect({
          //@ts-ignore
          provider,
          modalMode: "neverAsk",
          webWalletUrl: ARGENT_WEBWALLET_URL,
          argentMobileOptions: {
            dappName: "Attensys",
            url: window.location.hostname,
            chainId: CHAIN_ID,
            icons: [],
          },
        });

        // console.log(connector.wallet.account )
        // setConnectorDataAccount(connector.wallet.account);
        setWallet(connectedWallet);
      } catch (e) {
        console.error(e);
        // alert((e as any).message)
      }
    };
    if (!wallet) {
      autoConnect();
    }
  }, [page, wallet]);

  return (
    <div className="block lg:flex lg:mx-10 mb-8 pb-24 max-w-screen-2xl xl:mx-auto">
      <UserSideBar
        wallet={wallet}
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
            <Notification />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
