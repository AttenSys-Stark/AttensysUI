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

const MyCourses = (props: any) => {
  const [selected, setSelected] = useState("");
  const [page, setPage] = useState("");
  const router = useRouter();

  useEffect(() => {
    setPage("myCourse");
    console.log(page);
  }, [page]);

  return (
    <div className="block lg:flex lg:mx-10 mb-8 pb-24 max-w-screen-2xl xl:mx-auto">
      <UserSideBar page={page} selected={selected} setSelected={setSelected} />

      <div className="flex-auto ml-0 lg:ml-5 px-4 my-12 lg:my-0 lg:px-0">
        {coursesDetails.map((item, i) =>
          item && item.tag == selected ? (
            <CoursesCreated item={item} selected={selected} key={i} />
          ) : null,
        )}

        <div className={`${selected ? "0" : "mt-12"}`}>
          {/* Learning journey */}
          {learningDetails.map((item, i) =>
            item && item.tag == selected ? (
              <LearningJourney item={item} selected={selected} key={i} />
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
