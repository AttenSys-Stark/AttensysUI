import React, { useState, useRef } from "react";
import upload_other from "@/assets/upload_other.svg";
import tick_circle from "@/assets/tick-circle.svg";
import trash from "@/assets/trash.svg";
import film from "@/assets/film.svg";
import { Button } from "@headlessui/react";
import Image from "next/image";

interface Lecture {
  name: string;
  description: string;
  video: File | null;
}

interface CourseData {
  courseCurriculum: Lecture[];
}

interface LectureProps {
  courseData: CourseData;
  setCourseData: any;
  handleCourseCurriculumChange: (newLecture: any) => void;
}

const AddLecture: React.FC<LectureProps> = ({
  courseData,
  setCourseData,
  handleCourseCurriculumChange,
}) => {
  const [lectures, setLectures] = useState<Lecture[]>([]); // State to manage lectures
  const [newLecture, setNewLecture] = useState<Lecture>({
    name: "",
    description: "",
    video: null,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleBrowsefiles = () => {
    fileInputRef.current?.click();
  };

  // Handler for input changes in the new lecture form
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setNewLecture((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setNewLecture((prev) => ({
      ...prev,
      video: file,
    }));
  };

  // Handler to add new lecture to the array
  const handleAddLecture = (event: React.MouseEvent) => {
    event.preventDefault();
    if (newLecture.name.trim() === "") {
      return;
    }
    setLectures([newLecture, ...lectures]);

    handleCourseCurriculumChange(newLecture);
    setNewLecture({ name: "", description: "", video: null });
  };

  // Handler to remove a lecture
  const handleRemoveLecture = (
    event: React.MouseEvent<HTMLImageElement>,
    index: number,
  ) => {
    const updatedLectures = lectures.filter((_, i) => i !== index);
    setLectures(updatedLectures);

    // Update the parent state using handleCourseCurriculumChange
    // handleCourseCurriculumChange(updatedLectures);
    // Update parent state with the new array (excluding the removed lecture)
    setCourseData((prevData: CourseData) => ({
      ...prevData,
      courseCurriculum: prevData.courseCurriculum.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <div className="my-12">
        <Button
          className="rounded-xl bg-[#9b51e052] px-12 py-4  text-[#2d3a4b]"
          onClick={handleAddLecture}
        >
          + Add New Lecture
        </Button>

        {/* Render new lecture forms dynamically */}
        {/* {lectures.map((lecture, index) => ( */}
        <div className="my-4 bg-[#9b51e01a] p-12 border rounded-xl">
          <div className="flex bg-white p-5 rounded-xl my-3">
            <p className="font-medium mr-3 text-[16px]">Lecture Title:</p>
            <input
              name="name"
              placeholder="Class Title e.g UI/UX Basics"
              value={newLecture.name}
              onChange={handleChange}
              className="w-[90%]"
            />
          </div>
          <div className="flex bg-white p-5 rounded-xl my-3">
            <p className="font-medium mr-3 text-[16px]">Description:</p>
            <textarea
              name="description"
              placeholder="Class description (optional)"
              value={newLecture.description}
              onChange={handleChange}
              className="w-[100%]"
            ></textarea>
          </div>
          <div className="bg-white p-5 rounded-xl my-3 text-center content-center w-[100%] flex flex-col justify-center">
            <div className="w-[15%] mx-auto flex justify-center">
              <Image src={upload_other} alt="upload" />
            </div>
            <p className="text-[14px] font-normal text-[#353535] leading-[22px]">
              <span
                className="text-[#A020F0] cursor-pointer"
                onClick={handleBrowsefiles}
              >
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-[14px] font-normal text-[#353535] leading-[22px]">
              SVG, PNG, JPG or GIF (max. 500MB)
            </p>

            <div>
              <input
                type="file"
                accept="video/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="mt-3"
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
        {/* ))} */}
      </div>

      {/* Lectures List */}
      <div className="my-12">
        {courseData.courseCurriculum
          .slice()
          .reverse()
          .map((lecture: any, index: number) => (
            <div
              key={index}
              className="my-4 bg-[#9b51e01a] p-12 border rounded-xl"
            >
              <div className="flex justify-between bg-white p-5 rounded-xl my-3">
                <div className="flex items-center">
                  <p className="font-medium mr-3 text-[16px]">
                    Lecture {index + 1}:
                  </p>
                  <p className="text-[16px] font-normal text-[#353535] leading-[31px]">
                    {lecture.name || "Untitled"}
                  </p>
                </div>
                <div className="bg-green">
                  <Image src={tick_circle} alt="tick" />
                </div>
              </div>

              <div className="flex justify-between items-center bg-white p-5 rounded-xl my-3">
                <div className="flex items-center">
                  <p className="font-medium mr-3 text-[16px]">Description:</p>
                  <p className="text-[16px] font-normal text-[#353535] leading-[31px]">
                    {lecture.description || "No description"}
                  </p>
                </div>
                <div className="">
                  <Image src={tick_circle} alt="tick" />
                </div>
              </div>

              {/* File details */}
              {lecture.video && (
                <div className="bg-white p-5 rounded-xl my-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-start space-x-4">
                      <div>
                        <Image src={film} alt="film" />
                      </div>
                      <div className="mx-3">
                        <p className="text-[16px] font-medium text-[#353535] leading-[20px]">
                          {lecture.video.name}
                        </p>
                        <p className="text-[11px] font-normal text-[#353535] leading-[20px]">
                          {`${Math.round(lecture.video.size / 1024)} KB`}
                        </p>
                      </div>
                    </div>
                    <div className="bg-red">
                      <Image
                        src={trash}
                        alt="trash"
                        className="cursor-pointer"
                        onClick={(e) => handleRemoveLecture(e, index)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddLecture;
