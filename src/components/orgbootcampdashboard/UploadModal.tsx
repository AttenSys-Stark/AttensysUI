"use client";
import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import Image from "next/image";
import cancel from "@/assets/cancel.svg";
import { addclassmodal } from "@/state/connectedWalletStarknetkitNext";
import clsx from "clsx";
import { FaPlus } from "react-icons/fa6";
import cloud from "@/assets/cloud.svg";
import dividers from "@/assets/Dividers.svg";
import axios from "axios";
import { Contract } from "starknet";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { pinata } from "../../../utils/config";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useAccount, useConnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
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

export default function UploadModal(prop: any) {
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(prop.status.modalstatus);
  const [addClass, setAddclass] = useAtom(addclassmodal);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
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
  const [orgname, setOrgname] = useState<string>();
  const { account, address } = useFirebaseAuth();
  const { connect, connectors } = useConnect();
  const controller = connectors[0] as ControllerConnector;

  useEffect(() => {
    if (!address) return;
    controller.username()?.then((n) => setOrgname(n));
  }, [address, controller]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

      setFormData((prev) => ({
        ...prev,
        [type === "video" ? "videoUrl" : "thumbnailUrl"]: url,
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
    e: ChangeEvent<HTMLInputElement>,
    type: "video" | "thumbnail",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, type);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const Dataupload = await pinata.upload.json({
        videocid: uploadhash,
        courseData: formData,
      });

      if (Dataupload) {
        const organizationContract = new Contract(
          attensysOrgAbi,
          attensysOrgAddress,
          account,
        );

        const videolink_calldata = organizationContract.populate(
          "add_uploaded_video_link",
          [
            Dataupload.IpfsHash,
            true,
            //@ts-ignore
            address,
            prop.status.idnumber,
          ],
        );

        const callContract = await account?.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "add_uploaded_video_link",
            calldata: videolink_calldata.calldata,
          },
        ]);
        if (!callContract) {
          throw new Error("Transaction not executed");
        }
        await account?.waitForTransaction(callContract?.transaction_hash);
      }
    } catch (error) {
      console.error("Error during save:", error);
    } finally {
      setIsSaving(false); // Ensure loading stops
      setOpen(false);
      setAddclass((prev) => ({ ...prev, modalstatus: false }));
    }
  };

  useEffect(() => {
    if (open) {
      window.scrollTo({
        top: Math.max(0, 130),
        behavior: "smooth",
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[#0F0E0E82] transition-opacity"
      />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
          <DialogPanel className="relative h-[800px] w-[988px] transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8">
            <div className="flex justify-between px-10 pt-10 cursor-pointer">
              <h1 className="text-[22px] font-semibold leading-[31px] text-[#5801A9]">
                Course Outline upload
              </h1>
              <Image
                src={cancel}
                alt="cancel"
                onClick={() => {
                  setOpen(false);
                  setAddclass((prev) => ({ ...prev, modalstatus: false }));
                }}
              />
            </div>

            <div className="w-[90%] mx-auto h-[75%] my-auto border-[1px] bg-[#EFEFEF52] border-[#C2C2C2] rounded-xl mt-7 px-8 py-6 space-y-4 overflow-y-scroll">
              <div className="space-y-2">
                <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
                  Topic:{" "}
                </h1>
                <Field>
                  <Input
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    placeholder="Class title "
                    className={clsx(
                      "h-[55px] border-[2px] border-[#D0D5DD] block md:w-[50%] rounded-lg bg-white/5 py-1.5 px-3 w-full text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
                  Class Description
                </h1>
                <Field>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="A short overview of the class, its focus areas..."
                    className={clsx(
                      "h-[126px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full md:w-[90%] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
                  Assignment
                </h1>
                <Field>
                  <textarea
                    name="assignment"
                    value={formData.assignment}
                    onChange={handleInputChange}
                    placeholder="Assignment description"
                    className={clsx(
                      "h-[126px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full md:w-[90%] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                  />
                </Field>
                <div className="flex space-x-10">
                  <div className="cursor-pointer relative flex items-center space-x-3 w-[130px]">
                    <FaPlus className="text-[#5801A9]" />
                    <h1 className="text-[15px] leading-[18px] font-light text-[#5801A9]">
                      Resources
                    </h1>
                  </div>
                  <div className="cursor-pointer relative flex items-center space-x-3 w-[130px]">
                    <FaPlus className="text-[#5801A9]" />
                    <h1 className="text-[15px] leading-[18px] font-light text-[#5801A9]">
                      Assignment
                    </h1>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h1 className="text-[16px] leading-[23px] font-semibold text-[#2D3A4B]">
                  Upload Recording
                </h1>
                <div className="flex flex-col gap-4 md:flex-row md:gap-0 md:space-x-16">
                  <div
                    className="h-[316px] w-full md:w-[459px] mt-3 rounded-lg  flex flex-col md:flex-row justify-center items-center"
                    onDrop={(e) => handleDrop(e, "video")}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className="h-[246px] w-full md:w-[400px] border-[3px] border-dotted border-[#D0D5DD] bg-[#FFFFFF] rounded-xl space-y-3 flex flex-col items-center justify-center">
                      <Image src={cloud} alt="upload" />
                      <h1 className="text-[14px] text-[#475367] font-light leading-[20px]">
                        <span className="text-[#4A90E2]">Click to upload</span>{" "}
                        or drag and drop
                      </h1>
                      <p className="text-[12px] text-[#475367] font-light leading-[17px]">
                        MP4, WebM, MKV (max size: 2GB)
                      </p>
                      <Image src={dividers} alt="divider" className="mt-7" />
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileSelect(e, "video")}
                        style={{ display: "none" }}
                      />
                      <Button
                        disabled={
                          uploadStatus.video.progress > 0 &&
                          uploadStatus.video.progress < 100
                        }
                        className="h-[36px] w-[118px] flex justify-center items-center bg-[#9B51E0] rounded-xl text-[14px] text-[#FFFFFF] font-light leading-[20px]"
                      >
                        {uploadStatus.video.progress > 0 &&
                        uploadStatus.video.progress < 100
                          ? `Uploading (${uploadStatus.video.progress}%)`
                          : "Browse Files"}
                      </Button>
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
                  </div>
                  {/* Section for Thumbnail Upload  */}
                  <div className="mt-3 space-y-2">
                    <h1 className="w-[254px] text-[14px] font-light text-[#2D3A4B] leading-[21px]">
                      Upload thumbnail
                    </h1>
                    <div
                      className="h-[180px] w-[251px] border-[3px] border-dotted border-[#D0D5DD] bg-[#FFFFFF] rounded-xl space-y-0 flex flex-col gap-1 items-center justify-center relative"
                      onDrop={(e) => handleDrop(e, "thumbnail")}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <Image src={cloud} alt="upload" />
                      <h1 className="text-[8px] text-[#475367] font-light leading-[20px]">
                        <span className="text-[#4A90E2]">Click to upload</span>{" "}
                        or drag and drop
                      </h1>
                      <p className="text-[7.5px] text-[#475367] font-light leading-[17px]">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                      <Image src={dividers} alt="divider" className="mt-7" />
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, "thumbnail")}
                        style={{ display: "none" }}
                      />
                      <Button
                        disabled={
                          uploadStatus.thumbnail.progress > 0 &&
                          uploadStatus.thumbnail.progress < 100
                        }
                        className="h-[23px] w-[74px] flex justify-center items-center  bg-[#9B51E0] rounded-xl text-[8px] text-[#FFFFFF] font-light leading-[20px]"
                      >
                        {uploadStatus.thumbnail.progress > 0 &&
                        uploadStatus.thumbnail.progress < 100
                          ? `Uploading (${uploadStatus.thumbnail.progress}%)`
                          : "Browse Files"}
                      </Button>
                      {uploadStatus.thumbnail.progress > 0 &&
                        uploadStatus.thumbnail.progress < 100 && (
                          <div className="w-[90%]  bg-gray-200 rounded-full h-2.5 ">
                            <div
                              className="bg-green-600 h-2.5  rounded-full"
                              style={{
                                width: `${uploadStatus.thumbnail.progress}%`,
                              }}
                            ></div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-16 my-5">
              <div
                onClick={!isSaving ? handleSave : undefined}
                className={`h-[47px] w-[342px] rounded-xl flex items-center justify-center cursor-pointer ${
                  isSaving ? "bg-[#822DBF]" : "bg-[#9B51E0]"
                }`}
              >
                {isSaving ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <h1 className="text-white text-[14px] font-semibold">
                    Save updates
                  </h1>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
