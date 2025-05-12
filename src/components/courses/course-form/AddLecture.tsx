import React, { useState, useRef, useEffect } from "react";
import upload_other from "@/assets/upload_other.svg";
import tick_circle from "@/assets/tick-circle.svg";
import trash from "@/assets/trash.svg";
import film from "@/assets/film.svg";
import { Button } from "@headlessui/react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

interface Lecture {
  name: string;
  description: string;
  video: string;
  fileName: string;
  fileSize: number;
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
    fileName: "",
    fileSize: 0,
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

  const [lectureType, setLectureType] = useState("video"); // "video" or "text"

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

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLecture, setEditLecture] = useState<Lecture>({
    name: "",
    description: "",
    video: "",
    fileName: "",
    fileSize: 0,
  });

  console.log(lectures);

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
    if (newLecture.name.trim() === "" || newLecture.description.trim() === "") {
      toast.error("Please fill in all required fields");
      return;
    }
    setLectures([newLecture, ...lectures]);

    handleCourseCurriculumChange(newLecture);
    setNewLecture({
      name: "",
      description: "",
      video: "",
      fileName: "",
      fileSize: 0,
    });
  };

  // Handler to remove a lecture
  const handleRemoveLecture = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
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

      const formData = new FormData();
      formData.append("file", file);
      formData.append("network", "private");

      const response = await axios.post(
        "https://uploads.pinata.cloud/v3/files",
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

      const ipfsHash = response.data.data.cid;
      // console.log("IPFS Hash:", );
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

      const updatedLecture = {
        ...newLecture,
        [type === "video" ? "video" : "thumbnail"]: url,
        fileName: file.name,
        fileSize: file.size,
      };

      setNewLecture(updatedLecture);

      // Automatically add the lecture when upload completes
      if (type === "video") {
        handleCourseCurriculumChange(updatedLecture);
        setNewLecture({
          name: "",
          description: "",
          video: "",
          fileName: "",
          fileSize: 0,
        });
      }

      setTimeout(() => {
        setUploadStatus((prev) => ({
          ...prev,
          [type]: { ...prev[type], showMessage: false },
        }));
      }, 5000);

      if (ipfsHash) {
        setUploadHash(ipfsHash);
      }
    } catch (error: any) {
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

  const handleEditLecture = (index: number) => {
    // Calculate the actual index in the original array
    const actualIndex = courseData.courseCurriculum.length - 1 - index;
    setEditingIndex(actualIndex);
    setEditLecture(courseData.courseCurriculum[actualIndex]);
  };

  const handleSaveEdit = (index: number) => {
    // Calculate the actual index in the original array
    const actualIndex = courseData.courseCurriculum.length - 1 - index;
    const updatedCurriculum = [...courseData.courseCurriculum];
    updatedCurriculum[actualIndex] = editLecture;
    setCourseData((prev: any) => ({
      ...prev,
      courseCurriculum: updatedCurriculum,
    }));
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditLecture({
      name: "",
      description: "",
      video: "",
      fileName: "",
      fileSize: 0,
    });
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setEditLecture((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {}, [newLecture]);

  return (
    <div>
      <div className="my-12">
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

        <div className="my-4 bg-[#9b51e01a] p-4 sm:p-12 border rounded-xl">
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
              placeholder="Class description"
              value={newLecture.description}
              onChange={handleChange}
              className="w-[100%]"
              maxLength={500}
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

          {uploadStatus.video.progress > 0 && (
            <div className="flex justify-end mt-10">
              <p className="text-[#353535]">
                Uploading: {uploadStatus.video.progress}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lectures List */}
      <div className="my-12">
        {courseData.courseCurriculum.map((lecture: any, index: number) => (
          <div
            key={index}
            className="my-4 bg-[#9b51e01a] py-12 px-4 border rounded-xl relative"
          >
            {editingIndex === index ? (
              <div className="space-y-4">
                <div className="flex bg-white p-5 rounded-xl">
                  <p className="font-medium mr-3 text-[16px]">Lecture Title:</p>
                  <input
                    name="name"
                    placeholder="Class Title e.g UI/UX Basics"
                    value={editLecture.name}
                    onChange={handleEditChange}
                    className="w-[90%]"
                    maxLength={70}
                  />
                </div>

                <div className="flex bg-white p-5 rounded-xl">
                  <p className="font-medium mr-3 text-[16px]">Description:</p>
                  <textarea
                    name="description"
                    placeholder="Class description"
                    value={editLecture.description}
                    onChange={handleEditChange}
                    className="w-[100%]"
                    maxLength={500}
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleSaveEdit(index)}
                    className="bg-[#4A90E2] text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between bg-white p-5 rounded-xl my-3">
                  <div className="flex items-center">
                    <p className="font-medium mr-3 text-[16px]">
                      Lecture {index + 1}:
                    </p>
                    <p className="text-[16px] font-normal text-[#353535] leading-[31px]">
                      {lecture.name || "Untitled"}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEditLecture(index)}
                      className="text-[#4A90E2]"
                    >
                      Edit
                    </button>
                    <div className="bg-green">
                      <Image src={tick_circle} alt="tick" />
                    </div>
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

                {/* Video details */}
                {lecture.video && (
                  <div className="bg-white p-5 rounded-xl my-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-start space-x-4">
                        <div>
                          <Image src={film} alt="film" />
                        </div>
                        <div className="mx-3">
                          <p className="text-[16px] font-medium text-[#353535] leading-[20px]">
                            {lecture.fileName || "Video file"}
                          </p>
                          <p className="text-[11px] font-normal text-[#353535] leading-[20px]">
                            {lecture.fileSize
                              ? `${Math.round(lecture.fileSize / 1024)} KB`
                              : "Size not available"}
                          </p>
                        </div>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={(e) => handleRemoveLecture(e, index)}
                      >
                        <Image
                          src={trash}
                          alt="delete"
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddLecture;
