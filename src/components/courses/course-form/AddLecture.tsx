import React, { useState, useRef, useEffect } from "react";
import upload_other from "@/assets/upload_other.svg";
import tick_circle from "@/assets/tick-circle.svg";
import trash from "@/assets/trash.svg";
import film from "@/assets/film.svg";
import { Button } from "@headlessui/react";
import Image from "next/image";
import axios, { CancelTokenSource } from "axios";
import { toast } from "react-toastify";
import { useBackgroundUpload } from "@/hooks/useBackgroundUpload";

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
  isUploading: boolean;
  cancelToken?: CancelTokenSource;
}

interface PendingUpload {
  id: string;
  file: File;
  name: string;
  description: string;
  status: UploadStatus;
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
      isUploading: false,
    } as UploadStatus,
    thumbnail: {
      success: false,
      error: null,
      showMessage: false,
      progress: 0,
      isUploading: false,
    } as UploadStatus,
  });

  // New state for multiple uploads
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [isUploadingMultiple, setIsUploadingMultiple] = useState(false);

  // Background upload functionality
  const {
    isServiceWorkerReady,
    pendingUploads: backgroundUploads,
    addBackgroundUpload,
    triggerBackgroundSync,
    getUploadResult,
    removeUpload,
    isBackgroundSyncSupported,
  } = useBackgroundUpload();

  // Check if background sync is supported
  const backgroundSyncSupported = isBackgroundSyncSupported();

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
    if (newLecture.name.trim() === "") {
      toast.error("Please fill in the lecture title");
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

  // Validate file size (600MB limit)
  const validateFileSize = (file: File): boolean => {
    const maxSize = 600 * 1024 * 1024; // 600MB in bytes
    if (file.size > maxSize) {
      toast.error(
        `File size exceeds 600MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      );
      return false;
    }
    return true;
  };

  // Validate file type
  const validateFileType = (
    file: File,
    type: "video" | "thumbnail",
  ): boolean => {
    if (type === "video") {
      if (!file.type.includes("video")) {
        toast.error("Please upload a valid video file (mov, mp4, mkv)");
        return false;
      }
    } else if (type === "thumbnail") {
      if (!file.type.includes("image")) {
        toast.error("Please upload a valid image file");
        return false;
      }
    }
    return true;
  };

  // Cancel upload
  const cancelUpload = (type: "video" | "thumbnail") => {
    if (uploadStatus[type].cancelToken) {
      uploadStatus[type].cancelToken?.cancel("Upload cancelled by user");
    }

    setUploadStatus((prev) => ({
      ...prev,
      [type]: {
        success: false,
        error: null,
        showMessage: false,
        progress: 0,
        isUploading: false,
      },
    }));

    toast.info("Upload cancelled");
  };

  // Cancel specific pending upload
  const cancelPendingUpload = (uploadId: string) => {
    setPendingUploads((prev) => {
      const upload = prev.find((u) => u.id === uploadId);
      if (upload?.status.cancelToken) {
        upload.status.cancelToken.cancel("Upload cancelled by user");
      }
      return prev.filter((u) => u.id !== uploadId);
    });
    toast.info("Upload cancelled");
  };

  // Retry upload
  const retryUpload = (type: "video" | "thumbnail") => {
    const fileInput =
      type === "video" ? videoInputRef.current : thumbnailInputRef.current;
    if (fileInput) {
      fileInput.click();
    }
  };

  // Retry specific pending upload
  const retryPendingUpload = (uploadId: string) => {
    setPendingUploads((prev) => {
      const upload = prev.find((u) => u.id === uploadId);
      if (upload) {
        return prev.map((u) =>
          u.id === uploadId
            ? {
                ...u,
                status: {
                  ...u.status,
                  error: null,
                  progress: 0,
                  isUploading: true,
                },
              }
            : u,
        );
      }
      return prev;
    });

    // Restart the upload
    const upload = pendingUploads.find((u) => u.id === uploadId);
    if (upload) {
      handleFileUpload(
        upload.file,
        "video",
        upload.name,
        upload.description,
        upload.id,
      );
    }
  };

  const handleFileUpload = async (
    file: File,
    type: "video" | "thumbnail",
    lectureName?: string,
    lectureDescription?: string,
    uploadId?: string,
  ) => {
    if (!file) return;

    // Validate file size and type
    if (!validateFileSize(file) || !validateFileType(file, type)) {
      return;
    }

    // Automatically use background upload if service worker is ready and it's a video
    if (isServiceWorkerReady && type === "video") {
      try {
        const uploadId = await addBackgroundUpload(
          file,
          process.env.NEXT_PUBLIC_PINATA_JWT || "",
          lectureName,
          lectureDescription,
        );

        // Trigger background sync
        await triggerBackgroundSync();

        toast.info(
          `Video "${file.name}" queued for background upload. Upload will continue even if you close the browser.`,
        );

        // Add to pending uploads for UI display
        setPendingUploads((prev) => [
          ...prev,
          {
            id: uploadId,
            file,
            name: lectureName || file.name.replace(/\.[^/.]+$/, ""),
            description: lectureDescription || "",
            status: {
              success: false,
              error: null,
              showMessage: false,
              progress: 0,
              isUploading: false,
            } as UploadStatus,
          },
        ]);

        return;
      } catch (error) {
        console.error("Background upload failed:", error);
        toast.error("Background upload failed, falling back to regular upload");
        // Fall back to regular upload
      }
    }

    // Regular upload logic (existing code)
    const cancelToken = axios.CancelToken.source();

    // If this is a multiple upload, add to pending uploads
    if (uploadId) {
      setPendingUploads((prev) =>
        prev.map((u) =>
          u.id === uploadId
            ? {
                ...u,
                status: {
                  ...u.status,
                  progress: 0,
                  isUploading: true,
                  error: null,
                  success: false,
                  cancelToken,
                },
              }
            : u,
        ),
      );
    } else {
      // Single upload - use existing logic
      setUploadStatus((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          progress: 0,
          isUploading: true,
          error: null,
          success: false,
          cancelToken,
        },
      }));
    }

    // Clear the edit form fields when upload starts
    if (editingIndex !== null) {
      setEditLecture({
        name: "",
        description: "",
        video: "",
        fileName: "",
        fileSize: 0,
      });
    }

    toast.info(`Starting upload of ${file.name}...`);

    try {
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
          cancelToken: cancelToken.token,
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded / progressEvent.total) * 100)
              : 0;

            if (uploadId) {
              // Update progress for specific pending upload
              setPendingUploads((prev) =>
                prev.map((u) =>
                  u.id === uploadId
                    ? { ...u, status: { ...u.status, progress } }
                    : u,
                ),
              );
            } else {
              // Update progress for single upload
              setUploadStatus((prev) => ({
                ...prev,
                [type]: { ...prev[type], progress },
              }));
            }
          },
        },
      );

      const ipfsHash = response.data.data.cid;
      const url = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`;

      if (uploadId) {
        // Handle multiple upload completion
        setPendingUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? {
                  ...u,
                  status: {
                    success: true,
                    error: null,
                    showMessage: true,
                    progress: 100,
                    isUploading: false,
                  },
                }
              : u,
          ),
        );

        // Add to course curriculum
        const completedLecture = {
          name: lectureName || file.name,
          description: lectureDescription || "",
          video: url,
          fileName: file.name,
          fileSize: file.size,
        };

        handleCourseCurriculumChange(completedLecture);
        toast.success(
          `Video "${file.name}" uploaded successfully! Added to playlist.`,
        );

        // Remove from pending uploads after a delay
        setTimeout(() => {
          setPendingUploads((prev) => prev.filter((u) => u.id !== uploadId));
        }, 3000);
      } else {
        // Handle single upload completion
        setUploadStatus((prev) => ({
          ...prev,
          [type]: {
            success: true,
            error: null,
            showMessage: true,
            progress: 100,
            isUploading: false,
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
          // Validate that all required fields are filled before adding to playlist
          if (!updatedLecture.name || updatedLecture.name.trim() === "") {
            toast.error("Please add a lecture title before uploading video");
            setUploadStatus((prev) => ({
              ...prev,
              [type]: {
                success: false,
                error: "Lecture title is required",
                showMessage: true,
                progress: 0,
                isUploading: false,
              },
            }));
            return;
          }

          handleCourseCurriculumChange(updatedLecture);
          setNewLecture({
            name: "",
            description: "",
            video: "",
            fileName: "",
            fileSize: 0,
          });

          toast.success(
            `Video "${file.name}" uploaded successfully! Added to playlist.`,
          );
        }
      }

      setTimeout(() => {
        if (uploadId) {
          setPendingUploads((prev) =>
            prev.map((u) =>
              u.id === uploadId
                ? { ...u, status: { ...u.status, showMessage: false } }
                : u,
            ),
          );
        } else {
          setUploadStatus((prev) => ({
            ...prev,
            [type]: { ...prev[type], showMessage: false },
          }));
        }
      }, 5000);

      if (ipfsHash) {
        setUploadHash(ipfsHash);
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Upload cancelled:", error.message);
        return;
      }

      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Upload failed";

      if (uploadId) {
        // Handle error for multiple upload
        setPendingUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? {
                  ...u,
                  status: {
                    success: false,
                    error: errorMessage,
                    showMessage: true,
                    progress: 0,
                    isUploading: false,
                  },
                }
              : u,
          ),
        );
      } else {
        // Handle error for single upload
        setUploadStatus((prev) => ({
          ...prev,
          [type]: {
            success: false,
            error: errorMessage,
            showMessage: true,
            progress: 0,
            isUploading: false,
          },
        }));
      }

      toast.error(`Upload failed: ${errorMessage}`);

      setTimeout(() => {
        if (uploadId) {
          setPendingUploads((prev) =>
            prev.map((u) =>
              u.id === uploadId
                ? { ...u, status: { ...u.status, showMessage: false } }
                : u,
            ),
          );
        } else {
          setUploadStatus((prev) => ({
            ...prev,
            [type]: { ...prev[type], showMessage: false },
          }));
        }
      }, 8000);
    }
  };

  // Handle multiple file selection
  const handleMultipleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate all files first
    const validFiles = files.filter((file) => {
      if (!validateFileSize(file) || !validateFileType(file, "video")) {
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      toast.error("No valid video files selected");
      return;
    }

    // Create pending uploads for each file
    const newPendingUploads = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for default name
      description: "",
      status: {
        success: false,
        error: null,
        showMessage: false,
        progress: 0,
        isUploading: false,
      } as UploadStatus,
    }));

    setPendingUploads((prev) => [...prev, ...newPendingUploads]);
    setIsUploadingMultiple(true);

    // Start uploading all files
    newPendingUploads.forEach((upload) => {
      handleFileUpload(
        upload.file,
        "video",
        upload.name,
        upload.description,
        upload.id,
      );
    });

    // Reset input
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent, type: "video" | "thumbnail") => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    if (type === "video") {
      // Handle multiple video files
      const videoFiles = files.filter((file) => file.type.includes("video"));
      if (videoFiles.length === 0) {
        toast.error("Please upload valid video files");
        return;
      }

      // Create pending uploads for each file
      const newPendingUploads = videoFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name.replace(/\.[^/.]+$/, ""),
        description: "",
        status: {
          success: false,
          error: null,
          showMessage: false,
          progress: 0,
          isUploading: false,
        } as UploadStatus,
      }));

      setPendingUploads((prev) => [...prev, ...newPendingUploads]);
      setIsUploadingMultiple(true);

      // Start uploading all files
      newPendingUploads.forEach((upload) => {
        handleFileUpload(
          upload.file,
          "video",
          upload.name,
          upload.description,
          upload.id,
        );
      });
    } else {
      // Handle single file for thumbnail
      const file = files[0];
      if (file) {
        handleFileUpload(file, type);
      }
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "video" | "thumbnail",
  ) => {
    if (type === "video") {
      handleMultipleFileSelect(e);
    } else {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file, type);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleEditLecture = (index: number) => {
    setEditingIndex(index);
    setEditLecture(courseData.courseCurriculum[index]);
  };

  const handleSaveEdit = (index: number) => {
    // Validate required fields before saving
    if (!editLecture.name || editLecture.name.trim() === "") {
      toast.error("Lecture title is required");
      return;
    }

    if (!editLecture.video || editLecture.video.trim() === "") {
      toast.error("Video upload is required");
      return;
    }

    const updatedCurriculum = [...courseData.courseCurriculum];
    updatedCurriculum[index] = editLecture;
    setCourseData((prev: any) => ({
      ...prev,
      courseCurriculum: updatedCurriculum,
    }));
    setEditingIndex(null);

    toast.success("Lecture updated successfully!");
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

  // Handle drag and drop reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropReorder = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

    if (dragIndex === dropIndex) return;

    const items = Array.from(courseData.courseCurriculum);
    const [reorderedItem] = items.splice(dragIndex, 1);
    items.splice(dropIndex, 0, reorderedItem);

    // Update the course data with the new order
    setCourseData((prev: any) => ({
      ...prev,
      courseCurriculum: items,
    }));

    toast.success("Lecture order updated!");
  };

  // Check for background upload results
  useEffect(() => {
    const checkBackgroundResults = async () => {
      for (const upload of backgroundUploads) {
        if (upload.status === "completed") {
          const result = await getUploadResult(upload.id);
          if (result) {
            const ipfsHash = result.result.data.cid;
            const url = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`;

            // Add to course curriculum
            const completedLecture = {
              name: upload.lectureName || upload.fileName,
              description: upload.lectureDescription || "",
              video: url,
              fileName: upload.fileName,
              fileSize: 0, // We don't have file size in background upload
            };

            handleCourseCurriculumChange(completedLecture);
            toast.success(
              `Background upload completed: "${upload.fileName}" added to playlist.`,
            );

            // Remove from background uploads
            await removeUpload(upload.id);
          }
        }
      }
    };

    if (backgroundUploads.length > 0) {
      checkBackgroundResults();
    }
  }, [
    backgroundUploads,
    getUploadResult,
    removeUpload,
    handleCourseCurriculumChange,
  ]);

  useEffect(() => {}, [newLecture]);

  return (
    <div>
      <div className="my-12">
        {/* Upload Progress and Status */}
        <div className="mb-4">
          {uploadStatus.video.isUploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm font-medium text-blue-800">
                    Uploading video...
                  </span>
                </div>
                <button
                  onClick={() => cancelUpload("video")}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadStatus.video.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {uploadStatus.video.progress}% complete
              </div>
            </div>
          )}

          {uploadStatus.video.error && uploadStatus.video.showMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-red-800">
                    Upload failed: {uploadStatus.video.error}
                  </span>
                </div>
                <button
                  onClick={() => retryUpload("video")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {uploadStatus.video.success && uploadStatus.video.showMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <Image src={tick_circle} alt="success" width={16} height={16} />
                <span className="text-sm font-medium text-green-800">
                  Video uploaded successfully!
                </span>
              </div>
            </div>
          )}

          {/* Multiple Upload Progress - Updated to include background uploads */}
          {(pendingUploads.length > 0 || backgroundUploads.length > 0) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm font-medium text-blue-800">
                    Uploading {pendingUploads.length + backgroundUploads.length}{" "}
                    video
                    {pendingUploads.length + backgroundUploads.length > 1
                      ? "s"
                      : ""}
                    ...
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {pendingUploads.filter((u) => u.status.success).length +
                    backgroundUploads.filter((u) => u.status === "completed")
                      .length}{" "}
                  of {pendingUploads.length + backgroundUploads.length}{" "}
                  completed
                </span>
              </div>

              {/* Regular uploads */}
              {pendingUploads.map((upload) => (
                <div key={upload.id} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {upload.file.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      {upload.status.isUploading && (
                        <button
                          onClick={() => cancelPendingUpload(upload.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Cancel
                        </button>
                      )}
                      {upload.status.error && (
                        <button
                          onClick={() => retryPendingUpload(upload.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        upload.status.success
                          ? "bg-green-600"
                          : upload.status.error
                            ? "bg-red-600"
                            : "bg-blue-600"
                      }`}
                      style={{ width: `${upload.status.progress}%` }}
                    ></div>
                  </div>

                  {upload.status.error && (
                    <p className="text-xs text-red-600 mt-1">
                      {upload.status.error}
                    </p>
                  )}

                  {upload.status.success && (
                    <p className="text-xs text-green-600 mt-1">
                      Uploaded successfully!
                    </p>
                  )}
                </div>
              ))}

              {/* Background uploads */}
              {backgroundUploads.map((upload) => (
                <div key={upload.id} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {upload.fileName}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          upload.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : upload.status === "uploading"
                              ? "bg-blue-100 text-blue-800"
                              : upload.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {upload.status === "pending"
                          ? "Queued"
                          : upload.status === "uploading"
                            ? "Uploading"
                            : upload.status === "completed"
                              ? "Completed"
                              : "Failed"}
                      </span>
                      {upload.status === "failed" && (
                        <button
                          onClick={() => removeUpload(upload.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        upload.status === "completed"
                          ? "bg-green-600"
                          : upload.status === "failed"
                            ? "bg-red-600"
                            : upload.status === "uploading"
                              ? "bg-blue-600 animate-pulse"
                              : "bg-yellow-600"
                      }`}
                      style={{
                        width:
                          upload.status === "completed"
                            ? "100%"
                            : upload.status === "failed"
                              ? "100%"
                              : upload.status === "uploading"
                                ? "50%"
                                : "0%",
                      }}
                    ></div>
                  </div>

                  {upload.error && (
                    <p className="text-xs text-red-600 mt-1">{upload.error}</p>
                  )}

                  {upload.status === "completed" && (
                    <p className="text-xs text-green-600 mt-1">
                      Background upload completed!
                    </p>
                  )}

                  {upload.status === "pending" && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Queued for background upload
                    </p>
                  )}

                  {upload.status === "uploading" && (
                    <p className="text-xs text-blue-600 mt-1">
                      Uploading in background...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="my-4 bg-[#9b51e01a] p-4 sm:p-12 border rounded-xl">
          {/* Playlist Header */}
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Create Your Video Playlist
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Upload videos one by one or select multiple videos at once to
              build your course playlist. Each video will be automatically added
              to your course as part of the playlist.
            </p>
            <p className="text-xs text-red-600 font-medium">
              * All fields are required to add a lecture to your playlist
            </p>
          </div>

          {/* <div className="flex bg-white p-5 rounded-xl my-3">
            <p className="font-medium mr-3 text-[16px]">
              Lecture Title: <span className="text-red-500">*</span>
            </p>
            <input
              name="name"
              placeholder="Class Title e.g UI/UX Basics"
              value={newLecture.name}
              onChange={handleChange}
              className="w-[90%]"
              maxLength={70}
            />
          </div> */}

          {/* <div className="flex bg-white p-5 rounded-xl my-3">
            <p className="font-medium mr-3 text-[16px]">Description:</p>
            <textarea
              name="description"
              placeholder="Class description (optional)"
              value={newLecture.description}
              onChange={handleChange}
              className="w-[100%]"
              maxLength={500}
            ></textarea>
          </div> */}

          <div className="bg-white p-5 rounded-xl my-3 text-center content-center w-[100%] h-[400px] flex flex-col justify-center">
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
                Click to upload Video(s)
              </span>{" "}
              or drag and drop multiple videos
            </p>
            <p className="text-[14px] font-normal text-[#353535] leading-[22px]">
              mov, mp4, mkv (max. 600MB each) - You can select multiple files
            </p>
            {/* {backgroundSyncSupported && (
              <p className="text-[12px] text-blue-600 mt-2">
                💡 Uploads will continue in the background even if you close the browser
              </p>
            )} */}

            <div>
              <input
                type="file"
                accept="video/*"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e, "video")}
                multiple
                className="mt-3"
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lectures List */}
      <div className="my-12">
        {courseData.courseCurriculum.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Video Playlist ({courseData.courseCurriculum.length} videos)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop to reorder your lectures
            </p>
          </div>
        )}

        {courseData.courseCurriculum.map((lecture: any, index: number) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropReorder(e, index)}
            className="my-4 bg-[#9b51e01a] py-12 px-4 border rounded-xl relative cursor-move hover:shadow-md transition-shadow duration-200"
          >
            {editingIndex === index ? (
              <div className="space-y-4">
                <div className="flex bg-white p-5 rounded-xl">
                  <p className="font-medium mr-3 text-[16px]">
                    Lecture Title: <span className="text-red-500">*</span>
                  </p>
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
                  <p className="font-medium mr-3 text-[16px]">Description</p>
                  <textarea
                    name="description"
                    placeholder="Class description (optional)"
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
                    <Button
                      onClick={() => handleEditLecture(index)}
                      className="text-[#4A90E2]"
                    >
                      Edit
                    </Button>
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
                              ? `${(lecture.fileSize / (1024 * 1024)).toFixed(2)} MB`
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
