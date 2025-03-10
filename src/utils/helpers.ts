import { attensysCourseAddress } from "@/deployments/contracts";
import { attensysCourseAbi } from "@/deployments/abi";
import { Contract } from "starknet";
import { provider } from "@/constants";

const courseContract = new Contract(
  attensysCourseAbi,
  attensysCourseAddress,
  provider,
);

export const getAllCoursesInfo = async () => {
  const callCourseContract = await courseContract?.get_all_courses_info();
  return callCourseContract;
};
export const getUserCoursesInfo = async (user: string) => {
  const callCourseContract =
    await courseContract?.get_all_creator_courses(user);
  return callCourseContract;
};

export function shortHex(input?: any) {
  if (!input || typeof input !== "string" || input.length < 6) {
    console.error("Invalid input to shortHex:", input);
    return "Invalid Address";
  }
  return `${input.slice(0, 4)}...${input.slice(-2)}`;
}

export const handleSubmit = (
  event: React.FormEvent<HTMLFormElement>,
  searchValue: any,
  router: any,
) => {
  event.preventDefault();
  if (searchValue.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/Explorer/${searchValue}`);
  }
};

export const handleCourse = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  courseName: any,
  router: any,
) => {
  event.preventDefault();
  if (courseName.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/coursepage/${courseName}`);
  }
};
export const handleCoursehome = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  courseName: any,
  router: any,
) => {
  event.preventDefault();
  if (courseName.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/Course/Coursehome/course-home-landing-page`);
  }
};

export const handleMyCourse = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  section: any,
  router: any,
) => {
  event.preventDefault();
  if (section.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/mycoursepage/${section}`);
  }
};

export const handleMyCourseSubComp = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  section: any,
  router: any,
  sub: any,
) => {
  event.preventDefault();
  sessionStorage.setItem("scrollPosition", `${window.scrollY}`);
  // Redirect to the dynamic page with the user's input
  router.push(`/mycoursepage/${section}/`);
};

export const handleCreateCourse = (
  event: React.FormEvent<HTMLButtonElement | HTMLDivElement | HTMLFormElement>,
  section: any,
  router: any,
) => {
  event.preventDefault();
  if (section.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/Course/CreateACourse/${section}`);
  }
};
