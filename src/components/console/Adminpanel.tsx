import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
// import { useFetchCID } from "@/hooks/useFetchCID";
import { MoonLoader } from "react-spinners";
import { pinata } from "../../../utils/config";
import { usePinataAccess } from "@/hooks/usePinataAccess";
import { PinataSDK } from "pinata";
import LoadingSpinner from "../ui/LoadingSpinner";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { Account, Contract } from "starknet";
import { auth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/userutils";
import { decryptPrivateKey } from "@/helpers/encrypt";
import { provider } from "@/constants";
import { executeCalls } from "@avnu/gasless-sdk";
import { STRK_ADDRESS } from "@/deployments/erc20Contract";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";

const pinataFetch = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
});

const Adminpanel = (props: any) => {
  //   const { fetchCIDContent, getError, isLoading } = useFetchCID();
  const [cidData, setCidData] = useState<any>({});
  const [curriculumUrls, setCurriculumUrls] = useState<{
    [courseId: string]: { [video: string]: string | null };
  }>({});
  const [loading, setLoading] = useState(false);
  const [playerErrors, setPlayerErrors] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [videoError, setVideoError] = useState<{
    [key: string]: { [video: string]: boolean };
  }>({});
  const {
    createAccessLink,
    url,
    loading: isLoading,
    error,
  } = usePinataAccess();
  const [videoUrls, setVideoUrls] = useState<{ [key: string]: string }>({});
  const [account, setAccount] = useState<any>();
  const [approving, setApproving] = useState(false);
  const [disapproving, setDispproving] = useState(false);

  // Sort courses: non-approved first, then unsuspended first
  const sortedCourses = [...props.courseData]
    .filter((course: any) => course.course_identifier != 0)
    .sort((a, b) => {
      // Non-approved courses first
      if (a.is_approved === b.is_approved) {
        // If both are the same approval status, sort by suspension status (unsuspended first)
        return Number(a.is_suspended) - Number(b.is_suspended);
      }
      return Number(a.is_approved) - Number(b.is_approved); // false (0) before true (1)
    });

  function extractCIDFromUrl(ipfsUrl: string): string {
    // Split the URL by '/' and get the last part
    const parts = ipfsUrl.split("/");
    const cid = parts[parts.length - 1];
    return cid.split("?")[0].split(".")[0];
  }

  const createAccess = async (cid: string, expires: number = 86400) => {
    try {
      let formattedCid = extractCIDFromUrl(cid);
      const accessUrl = await pinataFetch.gateways.private.createAccessLink({
        cid: formattedCid,
        expires,
      });
      if (accessUrl) {
        return accessUrl;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error creating access link:", err);
    }
  };

  useEffect(() => {
    const fetchAllCidData = async () => {
      //   setLoading(true);
      const data: any = {};
      const videoUrlMap: any = {};
      const curriculumUrlsMap: {
        [courseId: string]: { [video: string]: string | null };
      } = {};

      // Use Promise.allSettled instead of Promise.all to handle individual failures
      const results = await Promise.allSettled(
        sortedCourses.map(async (course: any) => {
          if (!course.course_ipfs_uri) {
            data[course.course_identifier] = null;
            setLoading(false);
            return;
          }

          //   try {
          let cidContent = await pinata.gateways.get(course.course_ipfs_uri);
          if (cidContent) {
            try {
              if (typeof cidContent === "string") {
                cidContent = JSON.parse(cidContent);
              } else if (cidContent instanceof Blob) {
                cidContent = JSON.parse(await cidContent.text());
              }
            } catch (parseErr) {
              console.error(
                `Failed to parse CID content for course ${course.course_identifier}:`,
                parseErr,
              );
              data[course.course_identifier] = null;
              return;
            }

            data[course.course_identifier] = cidContent;

            // Try to get video URL from CID content
            let videoUrl: string | undefined;
            if (
              cidContent &&
              typeof cidContent === "object" &&
              "data" in cidContent
            ) {
              // @ts-ignore
              videoUrl = cidContent.data?.courseData?.videoUrl;
            }

            if (videoUrl) {
              videoUrlMap[course.course_identifier] = videoUrl;
            }
            // Precompute curriculum access URLs
            let courseCurriculum: any[] = [];
            if (
              cidContent &&
              typeof cidContent === "object" &&
              "data" in cidContent &&
              cidContent.data &&
              typeof cidContent.data === "object" &&
              "courseCurriculum" in cidContent.data &&
              Array.isArray(cidContent.data.courseCurriculum)
            ) {
              courseCurriculum = cidContent.data.courseCurriculum;
            }
            curriculumUrlsMap[course.course_identifier] = {};
            await Promise.all(
              courseCurriculum.map(async (item: any) => {
                if (item?.video) {
                  try {
                    const url = await createAccess(item.video);
                    curriculumUrlsMap[course.course_identifier][item.video] =
                      url ?? null;
                  } catch {
                    const url = await createAccess(item.video);
                    curriculumUrlsMap[course.course_identifier][item.video] =
                      url ?? null;
                  }
                }
              }),
            );
            setCidData(data);
            setVideoUrls(videoUrlMap);
            setLoading(false);
            setCurriculumUrls(curriculumUrlsMap);
          } else {
            data[course.course_identifier] = null;
            setLoading(false);

            return;
          }
        }),
      );
    };

    fetchAllCidData();
  }, [props.courseData]);

  // Approve/disapprove handlers (to be implemented)
  const handleApprove = async (
    course: any,
    email_creator: string,
    courseName_: string,
    courseCreator_: string,
  ) => {
    if (!account || !account.address) {
      toast.error("Wallet/account not loaded. Please wait or re-login.", {
        /* ... */
      });
      return;
    }
    setApproving(true);
    // TODO: Call contract or API to approve
    const courseContract = new Contract(
      attensysCourseAbi,
      attensysCourseAddress,
      account,
    );

    try {
      const approve_calldata = await courseContract.populate(
        "toggle_course_approval",
        [course.course_identifier, true],
      );
      // Prepare the call for AVNU Gasless SDK
      const calls = [
        {
          contractAddress: attensysCourseAddress,
          entrypoint: "toggle_course_approval",
          calldata: approve_calldata.calldata,
        },
      ];
      // Use AVNU Gasless SDK
      const avnuApiKey = process.env.NEXT_PUBLIC_AVNU_API_KEY;
      if (!avnuApiKey) {
        throw new Error("Missing AVNU API key in environment variables");
      }
      const response = await executeCalls(
        account,
        calls,
        {
          gasTokenAddress: STRK_ADDRESS,
        },
        {
          apiKey: avnuApiKey,
          baseUrl: "https://sepolia.api.avnu.fi",
        },
      );
      // Wait for transaction confirmation
      let tx = await provider.waitForTransaction(response.transactionHash);
      if (
        ((tx as any)?.finality_status === "ACCEPTED_ON_L2" ||
          (tx as any)?.finality_status === "ACCEPTED_ON_L1") &&
        (tx as any)?.execution_status === "SUCCEEDED"
      ) {
        // Send approval notification
        try {
          await fetch(
            "https://attensys-1a184d8bebe7.herokuapp.com/api/course-approval-notification",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email_creator,
                username: courseCreator_,
                courseName: courseName_,
              }),
            },
          );
        } catch (notificationError) {
          console.warn(
            "Error sending approval notification:",
            notificationError,
          );
          // Don't fail the approval process if notification fails
        }

        setApproving(false);
        toast.success("Course approved successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      } else {
        setApproving(false);
        toast.error("Course approval failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }
    } catch (err) {
      setApproving(false);
      toast.error("Course approval failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };
  const handleDisapprove = async (
    course: any,
    email_creator: string,
    courseName_: string,
    courseCreator_: string,
  ) => {
    if (!account || !account.address) {
      toast.error("Wallet/account not loaded. Please wait or re-login.", {
        /* ... */
      });
      return;
    }
    setDispproving(true);
    // TODO: Call contract or API to approve
    const courseContract = new Contract(
      attensysCourseAbi,
      attensysCourseAddress,
      account,
    );

    try {
      const approve_calldata = await courseContract.populate(
        "toggle_course_approval",
        [course.course_identifier, false],
      );
      // Prepare the call for AVNU Gasless SDK
      const calls = [
        {
          contractAddress: attensysCourseAddress,
          entrypoint: "toggle_course_approval",
          calldata: approve_calldata.calldata,
        },
      ];
      // Use AVNU Gasless SDK
      const avnuApiKey = process.env.NEXT_PUBLIC_AVNU_API_KEY;
      if (!avnuApiKey) {
        throw new Error("Missing AVNU API key in environment variables");
      }
      const response = await executeCalls(
        account,
        calls,
        {
          gasTokenAddress: STRK_ADDRESS,
        },
        {
          apiKey: avnuApiKey,
          baseUrl: "https://sepolia.api.avnu.fi",
        },
      );
      // Wait for transaction confirmation
      let tx = await provider.waitForTransaction(response.transactionHash);
      if (
        ((tx as any)?.finality_status === "ACCEPTED_ON_L2" ||
          (tx as any)?.finality_status === "ACCEPTED_ON_L1") &&
        (tx as any)?.execution_status === "SUCCEEDED"
      ) {
        // Send disapproval notification
        try {
          await fetch(
            "https://attensys-1a184d8bebe7.herokuapp.com/api/course-disapproval-notification",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email_creator,
                username: courseCreator_,
                courseName: courseName_,
                reason:
                  "Course content does not meet our quality standards. Please review and make necessary improvements.",
              }),
            },
          );
        } catch (notificationError) {
          console.warn(
            "Error sending disapproval notification:",
            notificationError,
          );
          // Don't fail the disapproval process if notification fails
        }

        setDispproving(false);
        toast.success("Course disapproved successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      } else {
        setDispproving(false);
        toast.error("Course disapproval failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }
    } catch (err) {
      setDispproving(false);
      toast.error("Course disapproval failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.uid) {
        try {
          const profile = await getUserProfile(user.uid);
          const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
          if (profile) {
            const decryptedPrivateKey = decryptPrivateKey(
              profile.starknetPrivateKey,
              encryptionSecret,
            );
            if (!decryptedPrivateKey) {
              console.error("Failed to decrypt private key");
              setAccount(undefined);
              return;
            }
            const userAccount = new Account(
              provider,
              profile.starknetAddress,
              decryptedPrivateKey,
            );
            setAccount(userAccount);
          } else {
            setAccount(undefined);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setAccount(undefined);
        }
      } else {
        setAccount(undefined);
      }
    });
    return () => unsubscribe();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <MoonLoader color="#9B51E0" size={40} />
      </div>
    );
  }
  return (
    <div
      className="admin-panel-root"
      style={{ background: "#f7f8fa", padding: 24 }}
    >
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
        transition={Bounce}
      />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <MoonLoader color="#9B51E0" size={40} />
        </div>
      ) : (
        sortedCourses.map((course: any, index: number) => {
          const cid = cidData[course.course_identifier];
          const curriculum =
            cid &&
            typeof cid.data === "object" &&
            Array.isArray(cid.data.courseCurriculum)
              ? cid.data.courseCurriculum
              : [];
          const curriculumVideoUrls =
            curriculumUrls[course.course_identifier] || {};
          return (
            <div
              key={index}
              className="admin-course-card"
              style={{
                border: "1px solid #e0e0e0",
                margin: "32px 0",
                padding: "24px",
                borderRadius: "16px",
                background: course.is_suspended ? "#f8d7da" : "#fff",
                boxShadow: "0 2px 12px rgba(80,80,120,0.06)",
                transition: "box-shadow 0.2s",
              }}
            >
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 320 }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <strong>Course ID:</strong> {course.course_identifier}
                    <span
                      title="Unique identifier for this course."
                      style={{
                        color: "#888",
                        cursor: "help",
                        fontSize: 14,
                        marginLeft: 4,
                      }}
                    >
                      ⓘ
                    </span>
                  </div>
                  <div>
                    <strong>Owner:</strong> {course.owner}
                  </div>
                  <div>
                    <strong>Price:</strong> {course.price}
                  </div>
                  <div>
                    <strong>Assessment:</strong> {String(course.accessment)}
                  </div>
                  <div>
                    <strong>Approved:</strong>{" "}
                    <span
                      style={{
                        color: course.is_approved ? "#28a745" : "#dc3545",
                        fontWeight: 600,
                      }}
                    >
                      {String(course.is_approved)}
                    </span>
                  </div>
                  <div>
                    <strong>Suspended:</strong> {String(course.is_suspended)}
                  </div>
                  <div>
                    <strong>IPFS URI:</strong> {course.course_ipfs_uri}
                  </div>
                  {/* CID Content */}
                  <div style={{ marginTop: 12 }}>
                    <strong>CID Content:</strong>
                    {cid ? (
                      <pre
                        style={{
                          fontSize: 12,
                          background: "#f6f8fa",
                          padding: 8,
                          borderRadius: 4,
                          maxWidth: 1200,
                          overflowX: "auto",
                        }}
                      >
                        {JSON.stringify(
                          cid.data?.courseData || cid.data || cid,
                          null,
                          2,
                        )}
                      </pre>
                    ) : (
                      <span style={{ color: "#dc3545" }}>
                        Unable to fetch CID content
                      </span>
                    )}
                  </div>
                </div>
                {/* Curriculum Preview */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 320,
                    maxWidth: 480,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      marginBottom: 12,
                      color: "#5801A9",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    Curriculum Preview
                    <span
                      title="Preview all lectures in this course."
                      style={{
                        color: "#888",
                        cursor: "help",
                        fontSize: 14,
                        marginLeft: 4,
                      }}
                    >
                      ⓘ
                    </span>
                  </div>
                  <div className="h-[440px] w-[100%] bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl overflow-scroll scrollbar-hide">
                    {curriculum.length === 0 && (
                      <div style={{ color: "#888", fontSize: 14 }}>
                        No curriculum found.
                      </div>
                    )}
                    {curriculum
                      ?.slice()
                      .reverse()
                      .map((item: any, i: number) => {
                        const accessUrl = curriculumVideoUrls[item.video];
                        return (
                          <div
                            key={i}
                            className="flex w-full items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <div className="w-8 flex-shrink-0">
                              <p className="font-bold text-[#5801a9]">
                                {i + 1}
                              </p>
                            </div>
                            <div className="w-[145px] h-[94px] rounded-xl border-4 border flex-shrink-0 overflow-hidden">
                              {accessUrl === undefined ? (
                                <div className="flex items-center justify-center w-full h-full">
                                  <LoadingSpinner
                                    size="sm"
                                    colorVariant="primary"
                                  />
                                </div>
                              ) : accessUrl ? (
                                <ReactPlayer
                                  url={accessUrl}
                                  controls
                                  playing={false}
                                  width="100%"
                                  height="100%"
                                  playIcon={<></>}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-xs text-red-500">
                                  Video not available
                                </div>
                              )}
                            </div>
                            <div className="flex-grow ml-6">
                              <p className="text-[14px] font-semibold leading-[30px] text-[#333333]">
                                {item.name || `Lecture ${i + 1}`}
                              </p>
                              <h1 className="text-[8px] text-[#333333] leading-[14px] font-medium">
                                Creator address
                              </h1>
                              <div className="rounded-lg bg-[#9B51E052] w-[60%] flex items-center justify-center">
                                <p className="text-xs px-7 py-1">0:00:00</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {/* Approve/Disapprove Buttons */}
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      gap: 12,
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleApprove(
                          course,
                          cid.data.creatorEmail,
                          cid.data.courseName,
                          cid.data.courseCreator,
                        )
                      }
                      style={{
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                    >
                      {approving ? (
                        <MoonLoader
                          color="#000000"
                          size={16}
                          className="text-white"
                        />
                      ) : (
                        "Approve"
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleDisapprove(
                          course,
                          cid.data.creatorEmail,
                          cid.data.courseName,
                          cid.data.courseCreator,
                        )
                      }
                      style={{
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                    >
                      {disapproving ? (
                        <MoonLoader
                          color="#000000"
                          size={16}
                          className="text-white"
                        />
                      ) : (
                        "Disapprove"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Adminpanel;
