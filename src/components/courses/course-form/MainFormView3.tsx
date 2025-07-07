import React, { useRef, useState } from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import Dropdown from "../Dropdown";
import Image from "next/image";
import upload from "@/assets/upload.svg";
import CourseSideBar from "./SideBar";
import { handleCreateCourse } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";
import Stepper from "@/components/Stepper";
import AddLecture from "./AddLecture";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Lecture {
  id: string;
  title: string;
  description: string;
  file: File | null;
  titleError: string;
  fileError: string;
}

interface ChildComponentProps {
  imageUrl: any;
  courseData: any;
  setCourseData: any;
  handleCourseImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCourseCurriculumChange: (newLecture: any) => void;
}

const MainFormView3: React.FC<ChildComponentProps> = ({
  imageUrl,
  courseData,
  setCourseData,
  handleCourseImageChange,
  handleCourseCurriculumChange,
}) => {
  const router = useRouter();
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureTitleError, setLectureTitleError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        setCourseData((prev: any) => ({
          ...prev,
          courseImage: {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            url: e.target?.result as string,
          },
        }));
      };

      reader.readAsDataURL(file);
    }
    handleCourseImageChange(event);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check if file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setCourseData((prev: any) => ({
            ...prev,
            courseImage: {
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
              url: e.target?.result as string,
            },
          }));
        };

        reader.readAsDataURL(file);

        // Create a proper event object for the parent handler
        const event = {
          target: { files: [file] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleCourseImageChange(event);
      } else {
        toast.error("Please upload an image file (JPEG, PNG, JPG, or GIF)", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setLectureTitleError("");

    let hasError = false;
    let errorMessages: string[] = [];

    // Validate course image
    if (!courseData.courseImage?.url) {
      errorMessages.push("Course image is required");
      hasError = true;
    }

    // Validate course curriculum
    if (
      !courseData.courseCurriculum ||
      courseData.courseCurriculum.length === 0
    ) {
      errorMessages.push("At least one lecture is required");
      hasError = true;
    } else {
      // Validate each lecture in the curriculum
      courseData.courseCurriculum.forEach((lecture: any, index: number) => {
        const lectureNumber = index + 1;

        // Validate lecture title
        if (!lecture.name || lecture.name.trim() === "") {
          errorMessages.push(`Lecture ${lectureNumber}: Title is required`);
          hasError = true;
        }

        // Validate lecture description
        // if (!lecture.description || lecture.description.trim() === "") {
        //   errorMessages.push(`Lecture ${lectureNumber}: Description is required`);
        //   hasError = true;
        // }

        // Validate video upload
        if (!lecture.video || lecture.video.trim() === "") {
          errorMessages.push(
            `Lecture ${lectureNumber}: Video upload is required`,
          );
          hasError = true;
        }
      });
    }

    if (hasError) {
      // Show all validation errors in a single toast
      const errorMessage =
        errorMessages.length > 1
          ? `Please fix the following issues:\n• ${errorMessages.join("\n• ")}`
          : errorMessages[0];

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // Proceed to next step
    handleCreateCourse(e, "courseSetup4", router);
  };
  const handleBrowsefiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-stretch">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="hidden lg:block">
        <CourseSideBar courseData={courseData} />
      </div>

      <div className="flex-1 w-full">
        {/* <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="py-2 text-sm text-center text-white">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div> */}

        <div className="lg:hidden w-full flex justify-center mt-[58px] mb-[79px]">
          <Stepper currentStep={3} />
        </div>
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="block sm:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] px-5 items-center">
            <div className="flex items-center">
              <div className="px-4 border-r border-blue-100 sm:px-8">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer text-[#4A90E2]"
                />
              </div>
              <p className="text-[#4A90E2] text-xl font-bold">
                Course & Curriculum
              </p>
            </div>

            <button className="hidden sm:block bg-[#c5d322] px-7 py-3 rounded text-black">
              Save progress
            </button>
          </div>

          <div className="mx-5 mt-12 md:mx-10">
            <form onSubmit={handleSubmit}>
              <div className="w-full my-12">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Image
                </label>
                <p className="font-normal mt-2 text-[13px]/[145%] md:text-[14px] text-[#2D3A4B] md:leading-[21px]">
                  {`This is the creative section of your course creation. Your course landing page is crucial to your success on Attensys. 
You want to make sure your creative is very catchy.`}
                </p>
                <div className="flex-col items-start block my-4 sm:flex lg:flex-row justify-center">
                  <div className="bg-[#DCDCDC] flex-1 p-4 sm:p-16 rounded-xl max-w-[1000px]">
                    <div
                      className={`bg-white p-2 sm:p-14 text-center border-dotted rounded border-2 content-center text-xs transition-all duration-200 ${
                        isDragOver
                          ? "border-[#4A90E2] bg-blue-50"
                          : "border-[#D0D5DD]"
                      }`}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="mx-auto w-[15%]">
                        <Image src={upload} alt="uplaod" />
                      </div>

                      <div className="my-3 text-base md:text-sm">
                        <p>
                          <span
                            className="text-[#4A90E2] cursor-pointer"
                            onClick={handleBrowsefiles}
                          >
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-[13px] text-[#98A2B3]">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center w-full gap-2">
                          <div className="h-px w-full bg-[#F0F2F5]" />
                          <p className="text-[10.65px] md:text-[8px]">OR</p>
                          <div className="h-px w-full bg-[#F0F2F5]" />
                        </div>

                        <div>
                          <Button
                            className="rounded-[6px] bg-[#9B51E0] px-4 md:px-12 py-2 md:py-3 text-white my-3"
                            onClick={handleBrowsefiles}
                          >
                            Browse Files
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg, image/jpg, image/png"
                            onChange={handleImageChange}
                            style={{ display: "none" }} // Hide the input
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-sm sm:mx-6 flex flex-col items-center">
                    <p className="font-semibold sm:hidden lg:hidden text-[18px] leading-[31px] text-[#333333] mt-[38px] mb-[18px]">
                      Upload thumbnail
                    </p>
                    <div className="bg-white w-[50%] md:w-[450px] flex items-center justify-center p-8 text-center border-dotted rounded-xl border-2 border-[#D0D5DD] flex flex-col justify-center content-center">
                      {!courseData.courseImage?.url ? (
                        <div className="w-[200px] h-[200px] flex items-center justify-center">
                          <p className="text-center">Preview Thumbnail Here</p>
                        </div>
                      ) : (
                        <div className="w-full h-full">
                          <Image
                            src={courseData.courseImage.url}
                            alt="uplaod"
                            width={350}
                            height={350}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-6">
                <div className="flex flex-col md:flex-row space-x-14">
                  <div>
                    <p className="font-semibold text-[18px] leading-[31px] text-[#333333] my-3">
                      Course Curriculum
                    </p>
                    <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px] w-full max-w-[800px]">
                      AttenSys allows you to structure your course with multiple
                      videos under one course. Each section can include several
                      videos, helping you break down complex topics into easily
                      digestible lessons. This makes it simple for students to
                      follow along, step by step, as they progress through your
                      course.
                    </p>
                  </div>
                  <div className="hidden lg:block py-5 w-full sm:w-1/2 lg:w-[450px]">
                    <p className="font-semibold text-[18px] leading-[31px] text-[#333333] py-3">
                      Upload thumbnail
                    </p>
                    <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                      Upload your course image here. It must meet our course
                      image quality standards to be accepted. Important
                      guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no
                      text on the image.
                    </p>
                  </div>
                </div>

                <div className="my-12">
                  <p className="font-semibold text-[18px] leading-[31px] text-[#333333] my-3">
                    Tips
                  </p>
                  <ul className="list-disc text-[14px] text-[#2D3A4B] leading-[21px] w-full max-w-[800px] px-4">
                    <li className="py-2">
                      Aim to keep each video between 5 to 10 minutes. Shorter
                      videos are easier for students to follow and help them
                      stay focused. For complex topics, break the content into
                      multiple shorter videos instead of one long video.
                    </li>
                    <li className="py-3">
                      Start each video with a brief introduction of the key
                      points that will be covered. This helps students know what
                      to expect and primes them for learning.
                    </li>
                    <li className="py-3">
                      Include activities or prompts within your videos, like
                      asking students to pause and think about a question or to
                      try something on their own before moving on to the next
                      video.
                    </li>
                  </ul>
                </div>
              </div>

              <AddLecture
                courseData={courseData}
                setCourseData={setCourseData}
                handleCourseCurriculumChange={handleCourseCurriculumChange}
              />

              <div className="mt-12 mb-5 w-full mx-auto flex justify-center md:justify-start">
                <button
                  className="bg-[#4A90E2] rounded-lg py-[15px] text-white sm:w-full w-[350px]"
                  type="submit"
                >
                  Next
                </button>
              </div>

              <div className="w-full mx-auto flex justify-center pb-[74px] px-4">
                <button
                  type="button"
                  className="block sm:hidden bg-[#c5d322] text-sm px-1 py-[15px] w-full rounded-lg text-black"
                >
                  Save progress
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFormView3;
