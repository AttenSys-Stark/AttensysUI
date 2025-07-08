import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { learningDetails } from "@/constants/data";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { useEffect, useState } from "react";
import { Contract, Account } from "starknet";
import CoursesCreated from "./CoursesCreated";
import CreateACourse from "./CreateACourse";
import LearningJourney from "./LearningJourney";
import Notification from "./Notification";
import UserSideBar from "./UserSideBar";
import { useAccount } from "@starknet-react/core";
import { useSearchParams } from "next/navigation";
import { MoonLoader } from "react-spinners";
import { getUserProfile } from "@/lib/userutils";
import { auth } from "@/lib/firebase/client";
import { decryptPrivateKey } from "@/helpers/encrypt";

interface CourseType {
  accessment: boolean;
  course_identifier: number;
  course_ipfs_uri: string;
  is_approved: boolean;
  is_suspended: boolean;
  owner: string;
  price: number;
  uri: string;
}

const MyCourses = (props: any) => {
  const [selected, setSelected] = useState("");
  const [page, setPage] = useState("");
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseData, setCourseData] = useState<CourseType[]>([]);
  const [takenCourses, setTakenCourses] = useState<CourseType[]>([]);
  const [takenCoursesData, setTakenCoursesData] = useState<CourseType[]>([]);
  const [load, setLoad] = useState(false);
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();
  // const { account, address } = useAccount();
  const searchParams = useSearchParams();
  const routeid = searchParams.get("id");
  const [account, setAccount] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const [username, setUsername] = useState<string>("");

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

    const courseIdentifiers = secondRes.map((data) =>
      Number(data.course_identifier),
    );
    const courseInfos =
      await courseContract?.get_course_infos(courseIdentifiers);

    setCourses(res);
    setTakenCourses(courseInfos);
  };

  const getSingleCourse = async () => {
    setLoad(true);
    const resolvedCourses = await Promise.all(
      courses.map(async (course: CourseType) => {
        if (!course.course_ipfs_uri) {
          return null; // Skip invalid URLs
        }

        try {
          const content = await fetchCIDContent(course.course_ipfs_uri);
          if (content) {
            return {
              ...content,
              course_identifier: course.course_identifier,
              owner: course.owner,
              course_ipfs_uri: course.course_ipfs_uri,
              is_suspended: course.is_suspended,
            };
          }
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
          const content = await fetchCIDContent(course.course_ipfs_uri);
          if (content) {
            return {
              ...content,
              course_identifier: course.course_identifier,
              owner: course.owner,
              course_ipfs_uri: course.course_ipfs_uri,
              is_suspended: course.is_suspended,
            };
          }
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

    // Update state with new data
    setCourseData(validCourses);
    setTakenCoursesData(validTakenCourses);
    setLoad(false);
  };

  useEffect(() => {
    getAllUserCreatedCourses(); // Fetch courses when the wallet address changes
  }, [account]);

  useEffect(() => {
    setPage("myCourse");
    if (courses.length > 0 || takenCourses.length > 0) {
      getSingleCourse();
    }
  }, [page, account, courses, takenCourses]);

  useEffect(() => {
    if (routeid == "created") {
      setSelected("Courses created");
    } else {
      // Default to Notification section when page loads
      setSelected("Notification");
    }
  }, [routeid]);

  useEffect(() => {
    const logStarknetCredentials = async () => {
      try {
        const user = auth.currentUser;
        if (user && user.uid) {
          const profile = await getUserProfile(user.uid);
          const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
          if (profile) {
            const decryptedPrivateKey = decryptPrivateKey(
              profile.starknetPrivateKey,
              encryptionSecret,
            );
            const userAccount = new Account(
              provider,
              profile.starknetAddress,
              decryptedPrivateKey,
            );
            console.log("userAccount:", userAccount);
            setAccount(userAccount);
            setAddress(profile.starknetAddress);
            console.log(
              "Setting address from profile:",
              profile.starknetAddress,
            );
            setUsername(profile.displayName);
          } else {
            console.log("No user profile found in Firestore.");
          }
        } else {
          console.log("No authenticated user found.");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    logStarknetCredentials();
  }, []); // Only on mount

  return (
    <div className="block lg:flex lg:mx-10 mb-8 pb-24 max-w-screen-2xl xl:mx-auto">
      <UserSideBar
        wallet={account}
        courses={courses}
        courseData={courseData}
        takenCoursesData={takenCoursesData}
        validCertificates={[]}
        page={page}
        selected={selected}
        setSelected={setSelected}
        refreshCourses={getAllUserCreatedCourses}
        username={username}
        address={address}
      />

      <div className="flex-auto ml-0 lg:ml-5 px-4 my-12 lg:my-0 lg:px-0 hidden sm:block">
        {"Courses created" == selected &&
          (load ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // Full page height
              }}
            >
              <MoonLoader color="#9B51E0" size={40} />
            </div>
          ) : (
            <CoursesCreated
              courseData={courseData}
              item={{ courses }}
              selected={selected}
              key={courses[0]?.course_identifier || "no-courses"}
              refreshCourses={getAllUserCreatedCourses}
            />
          ))}

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
          {selected === "Notification" ? (
            <Notification wallet={account} address={address} />
          ) : null}

          {selected === "" && routeid == "created" ? (
            <Notification wallet={account} address={address} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
