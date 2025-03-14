import React, { useState, useRef, useEffect } from "react";
import upload_other from "@/assets/upload_other.svg";
import tick_circle from "@/assets/tick-circle.svg";
import trash from "@/assets/trash.svg";
import film from "@/assets/film.svg";
import { Button } from "@headlessui/react";
import Image from "next/image";
import axios from "axios";

interface Lecture {
  name: string;
  description: string;
  video: string;
  fileProp: File | null;
}

interface CourseData {
  courseCurriculum: Lecture[];
}

interface LectureProps {
  courseData: CourseData;
  setCourseData: any;
  handleCourseCurriculumChange: (newLecture: any) => void;
}

interface FormData {
  topic: string;
  description: string;
  assignment: string;
  videoUrl: string;
  thumbnailUrl: string;
}

interface UploadStatus {
  success: boolean;
  error: string | null;
  showMessage: boolean;
  progress: number;
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
    video: "",
    fileProp: null,
  });
  const [uploadStatus, setUploadStatus] = useState({
    video: {
      success: false,
      error: null,
      showMessage: false,
      progress: 0,
    } as UploadStatus,
    thumbnail: {
      success: false,
      error: null,
      showMessage: false,
      progress: 0,
    } as UploadStatus,
  });
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    description: "",
    assignment: "",
    videoUrl: "",
    thumbnailUrl: "",
  });
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [uploadhash, setUploadHash] = useState("");

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

  // Handler to add new lecture to the array
  const handleAddLecture = (event: React.MouseEvent) => {
    event.preventDefault();
    if (newLecture.name.trim() === "") {
      return;
    }
    setLectures([newLecture, ...lectures]);

    handleCourseCurriculumChange(newLecture);
    setNewLecture({ name: "", description: "", video: "", fileProp: null });
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

  const handleFileUpload = async (file: File, type: "video" | "thumbnail") => {
    if (!file) return;

    try {
      setUploadStatus((prev) => ({
        ...prev,
        [type]: { ...prev[type], progress: 0 },
      }));

      setNewLecture((prev) => ({
        ...prev,
        fileProp: file,
      }));

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded / progressEvent.total) * 100)
              : 0;
            setUploadStatus((prev) => ({
              ...prev,
              [type]: { ...prev[type], progress },
            }));
          },
        },
      );

      const ipfsHash = response.data.IpfsHash;
      const url = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`;

      setUploadStatus((prev) => ({
        ...prev,
        [type]: {
          success: true,
          error: null,
          showMessage: true,
          progress: 100,
        },
      }));

      // setFormData((prev) => ({
      //   ...prev,
      //   [type === "video" ? "videoUrl" : "thumbnailUrl"]: url,
      // }));

      setNewLecture((prev) => ({
        ...prev,
        [type === "video" ? "video" : "thumbnail"]: url,
      }));

      setTimeout(() => {
        setUploadStatus((prev) => ({
          ...prev,
          [type]: { ...prev[type], showMessage: false },
        }));
      }, 5000);

      if (ipfsHash) {
        console.info(ipfsHash);
        setUploadHash(ipfsHash);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadStatus((prev) => ({
        ...prev,
        [type]: {
          success: false,
          error: error.message,
          showMessage: true,
          progress: 0,
        },
      }));

      setTimeout(() => {
        setUploadStatus((prev) => ({
          ...prev,
          [type]: { ...prev[type], showMessage: false },
        }));
      }, 5000);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "video" | "thumbnail") => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (type === "video" && !file.type.includes("video")) {
      alert("Please upload a valid video file");
      return;
    }
    if (type === "thumbnail" && !file.type.includes("image")) {
      alert("Please upload a valid image file");
      return;
    }
    handleFileUpload(file, type);
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "video" | "thumbnail",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, type);
    }
  };

  useEffect(() => {}, [newLecture]);

  return (
    <div>
      <div className="my-12">
        <Button
          className="rounded-xl bg-[#9b51e052] px-12 py-4  text-[#2d3a4b]"
          onClick={handleAddLecture}
          disabled={
            uploadStatus.video.progress > 0 && uploadStatus.video.progress < 100
          }
        >
          {uploadStatus.video.progress > 0 && uploadStatus.video.progress < 100
            ? `Uploading (${uploadStatus.video.progress}%)`
            : " + Add New Lecture"}
        </Button>

        <div>
          {uploadStatus.video.progress > 0 &&
            uploadStatus.video.progress < 100 && (
              <div className="w-[90%]  bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{
                    width: `${uploadStatus.video.progress}%`,
                  }}
                ></div>
              </div>
            )}
        </div>

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
              maxLength={70}
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
              maxLength={200}
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
                onDrop={(e) => handleDrop(e, "video")}
                onDragOver={(e) => e.preventDefault()}
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
                onChange={(e) => handleFileSelect(e, "video")}
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
                          {lecture.fileProp.name}
                        </p>
                        <p className="text-[11px] font-normal text-[#353535] leading-[20px]">
                          {`${Math.round(lecture.fileProp.size / 1024)} KB`}
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
