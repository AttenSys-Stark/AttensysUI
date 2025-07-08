/* eslint-disable react-hooks/rules-of-hooks */
import podcast from "@/assets/Podcast.svg";
import rich from "@/assets/Richin2024.svg";
import attensys_logo from "@/assets/attensys_logo.svg";
import graduate from "@/assets/grad.svg";
import profile_pic from "@/assets/profile_pic.png";
import youtube from "@/assets/youtube.svg";
import { provider } from "@/constants";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { getAllCoursesInfo, shortHex } from "@/utils/helpers";
import { GrDiamond } from "@react-icons/all-files/gr/GrDiamond";
import { HiBadgeCheck } from "@react-icons/all-files/hi/HiBadgeCheck";
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { LuBadgeCheck } from "react-icons/lu";
import ReactPlayer from "react-player/lazy";

import { Account, Contract } from "starknet";
import StarRating from "../bootcamp/StarRating";
import LoadingSpinner from "../ui/LoadingSpinner";
import { CardWithLink } from "./Cards";
import { useAccount, useConnect, useExplorer } from "@starknet-react/core";
import { usePinataAccess } from "@/hooks/usePinataAccess";
import { PinataSDK } from "pinata";
import { RatingDisplay } from "@/components/RatingDisplay";
import {
  getReviewsForVideo,
  getAverageRatingForVideo,
  submitReview,
  hasUserReviewed,
} from "@/lib/services/reviewService";
import { useParams, useSearchParams } from "next/navigation";
import { ReviewsList } from "@/components/ReviewsList";
import { ReviewForm } from "@/components/ReviewForm";
import { auth } from "@/lib/firebase/client";
import { getCurrentUser, signInUser } from "@/lib/services/authService";
import ControllerConnector from "@cartridge/connector/controller";
import { Erc20Abi } from "@/deployments/erc20abi";
import { STRK_ADDRESS } from "@/deployments/erc20Contract";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Dialog, DialogBackdrop, DialogPanel, Button } from "@headlessui/react";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "@/lib/userutils";
import { decryptPrivateKey } from "@/helpers/encrypt";
import { executeCalls } from "@avnu/gasless-sdk";
import { ShareButton, ShareModal, ShareData } from "@/components/sharing";
import AuthRequiredModal from "../auth/AuthRequiredModal";
import { useRouter } from "next/navigation";
import { generateShareableUrl } from "@/utils/sharing";
import { markLectureAsWatched, generateCourseId } from "@/utils/courseProgress";

interface CourseType {
  data: any;
  owner: string;
  course_identifier: number;
  accessment: boolean;
  uri: Uri;
  course_ipfs_uri: string;
  is_suspended: boolean;
  is_approved: boolean;
}

interface Uri {
  first: string;
  second: string;
}

const LecturePage = (props: any) => {
  const params = useParams();
  const details = params.details;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseData, setCourseData] = useState<CourseType[]>([]);
  const [durations, setDurations] = useState<{ [key: number]: number }>({});
  const [courseId, setCourseId] = useState<number>();
  const [isTakingCourse, setIsTakingCourse] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCertified, setIsCertified] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedLectureName, setSelectedLectureName] = useState<string>("");
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();
  // const { account, address } = useAccount();
  const explorer = useExplorer();
  const [txnHash, setTxnHash] = useState<string>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [isTargetExpanded, setIsTargetExpanded] = useState(false);
  const [showTargetSeeMore, setShowTargetSeeMore] = useState(false);
  const { createAccessLink, url, loading, error } = usePinataAccess();
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [courseaveragerate, setcourseaveragerate] = useState<any>(null);
  const [coursereview, setcoursereview] = useState<any>(null);
  const [hasReviewed, setHasReviewed] = useState<boolean | null>(null);
  const { connect, connectors } = useConnect();
  const controller = connectors[0] as ControllerConnector;
  const [username, setUsername] = useState<string>();
  const [coursePrice, setCoursePrice] = useState<number>(0);
  const [paymentValue, setPaymentValue] = useState<number>(0);
  const [isConfirmModalOpen, setisConfirmModalOpen] = useState(false);
  const [account, setAccount] = useState<any>();
  const [address, setAddress] = useState<any>();

  // Sharing functionality
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareData>({
    title: "",
    description: "",
    url: "",
    courseId: "",
  });

  const searchParams = useSearchParams();
  const ultimate_id = searchParams.get("id");

  const courseContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    provider,
  );

  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [courseApproved, setCourseApproved] = useState<boolean | null>(null);
  const router = useRouter ? useRouter() : null;

  // Fetch reviews and average rating in parallel, sends empty string if undefined
  const fetchReviewsAndRating = async () => {
    const [reviews, averageRating] = await Promise.all([
      getReviewsForVideo(
        props?.data?.courseName?.toString() + ultimate_id || "",
      ),
      getAverageRatingForVideo(
        props?.data?.courseName?.toString() + ultimate_id || "",
      ),
    ]);
    setcourseaveragerate(averageRating);
    setcoursereview(reviews);
  };

  // console.log("uploading:", isUploading);
  // console.log("taken:", isTakingCourse);
  // console.log("Certified:", isCertified);

  const handleDuration = (id: number, duration: number) => {
    // Set the duration for the specific video ID
    setDurations((prevDurations) => ({
      ...prevDurations,
      [id]: duration,
    }));
  };

  const handleRatingSubmit = async () => {
    const courseContract = new Contract(
      attensysCourseAbi,
      attensysCourseAddress,
      account,
    );
    const course_review_calldata = await courseContract.populate("review", [
      Number(ultimate_id),
    ]);
    const callCourseContract = await account?.execute([
      {
        contractAddress: attensysCourseAddress,
        entrypoint: "review",
        calldata: course_review_calldata.calldata,
      },
    ]);
  };
  // Get all courses with CourseType from contract
  const getAllCourses = async () => {
    const res: CourseType[] = await getAllCoursesInfo();
    setCourses(res);
  };

  // Extract courses and informmation
  const getCourse = async () => {
    const resolvedCourses = await Promise.all(
      courses.map(async (course: CourseType) => {
        if (!course.course_ipfs_uri) {
          console.warn(`Skipping invalid IPFS URL: ${course.course_ipfs_uri}`);
          return null;
        }
        if (course.is_approved) {
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
          return null;
        }
      }),
    );

    // Filter out null values
    const validCourses = resolvedCourses.filter(
      (course): course is CourseType => course !== null && course !== undefined,
    );

    // Remove duplicates before updating state
    setCourseData((prevCourses) => {
      const uniqueCourses = [
        ...prevCourses,
        ...validCourses.filter(
          (newCourse) =>
            !prevCourses.some(
              (prev) => prev.data.courseName === newCourse.data.courseName,
            ),
        ),
      ];
      return uniqueCourses;
    });
  };

  // Find and set the course taken, in order to certify
  const find = async () => {
    try {
      if (!address) {
        console.log("No address available");
        setShowOverlay(true);
        setIsTakingCourse(false);
        return;
      }

      const taken_courses = await courseContract?.is_user_taking_course(
        address,
        ultimate_id,
      );
      // console.log("taken_courses result:", taken_courses);
      setIsTakingCourse(taken_courses);

      const certfified_courses =
        await courseContract?.is_user_certified_for_course(
          address,
          ultimate_id,
        );

      // console.log("certfified_courses result:", certfified_courses);
      setIsCertified(certfified_courses);

      const get_course_data = await courseContract?.get_course_infos([
        ultimate_id,
      ]);

      const decimals = 18;
      const currentPrice = await courseContract?.get_price_of_strk_usd();
      const formattedPrice = Number(currentPrice) / 100000000;
      setCoursePrice(Number(get_course_data[0].price));

      setPaymentValue(
        Math.round(
          (Number(get_course_data[0].price) / formattedPrice + 10) *
            10 ** decimals,
        ),
      );
      // console.log("get_course_data result:", Number(get_course_data[0].price));
      console.log(
        "formatted strk:",
        Math.round(Number(get_course_data[0].price) / formattedPrice + 1),
      );
    } catch (err) {
      console.error("Error in find:", err);
    }
  };

  // Check if the current course is approved
  const checkCourseApproval = () => {
    if (!ultimate_id || courses.length === 0) return;
    console.log("here as props", props?.data);
    if (!props?.data?.courseImage) return;

    const foundCourse = courses.find((course, index) => {
      return props?.data?.courseImage === courseData[index]?.data?.courseImage;
    });

    if (foundCourse && foundCourse.course_identifier !== courseId) {
      setCourseId(foundCourse.course_identifier);
    }

    const course = courses.find(
      (c) => Number(c.course_identifier) === Number(ultimate_id),
    );
    console.log("course", course);
    if (course) {
      setCourseApproved(course.is_approved);
      console.log("Course approval status:", course.is_approved);
    } else {
      setCourseApproved(false);
      console.log("Course not found or not approved");
    }
  };

  const handleconfirmation = () => {
    setisConfirmModalOpen(true);
  };
  const handleconfirmationcancel = () => {
    setisConfirmModalOpen(false);
  };

  // handle take a course after the course identifier is known
  const handleTakeCourse = async () => {
    setisConfirmModalOpen(false);
    if (!address) {
      toast.error("Login to proceed", {
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
    const erc20ContractBal = new Contract(Erc20Abi, STRK_ADDRESS, provider);

    const walletBalance = await erc20ContractBal?.balance_of(address);
    console.log("wallet balance", walletBalance);
    let formattedPricing = coursePrice * 10 ** 18;
    console.log("payment value", formattedPricing);
    if (walletBalance < formattedPricing) {
      toast.error("Insufficient balance, go to Account center to fund wallet", {
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

    try {
      setIsUploading(true);

      const erc20Contract = new Contract(Erc20Abi, STRK_ADDRESS, account);

      const approve_calldata = await erc20Contract.populate("approve", [
        attensysCourseAddress,
        paymentValue,
      ]);

      const courseContract = new Contract(
        attensysCourseAbi,
        attensysCourseAddress,
        account,
      );

      const take_course_calldata = await courseContract.populate(
        "acquire_a_course",
        [Number(ultimate_id)],
      );

      const avnuApiKey = process.env.NEXT_PUBLIC_AVNU_API_KEY;
      if (!avnuApiKey) {
        throw new Error("Missing AVNU API key in environment variables");
      }

      const callCourseContract = await executeCalls(
        account,
        [
          {
            contractAddress: STRK_ADDRESS,
            entrypoint: "approve",
            calldata: approve_calldata.calldata,
          },
          {
            contractAddress: attensysCourseAddress,
            entrypoint: "acquire_a_course",
            calldata: take_course_calldata.calldata,
          },
        ],
        {
          gasTokenAddress: STRK_ADDRESS,
        },
        {
          apiKey: avnuApiKey,
          baseUrl: "https://sepolia.api.avnu.fi",
        },
      );

      console.log("call returns", callCourseContract);
      let tx = await provider.waitForTransaction(
        callCourseContract.transactionHash,
      );

      setTxnHash(callCourseContract?.transactionHash);
      //@ts-ignore
      if (
        ((tx as any)?.finality_status === "ACCEPTED_ON_L2" ||
          (tx as any)?.finality_status === "ACCEPTED_ON_L1") &&
        (tx as any)?.execution_status === "SUCCEEDED"
      ) {
        // Send purchase notification
        try {
          const user = auth.currentUser;
          if (user) {
            const userProfile = await getUserProfile(user.uid);
            if (userProfile) {
              await fetch(
                "https://attensys-1a184d8bebe7.herokuapp.com/api/course-purchase-notification",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: user.email,
                    username: userProfile.displayName,
                    courseName: props?.data?.courseName,
                    price: coursePrice,
                  }),
                },
              );
            }
          }
        } catch (notificationError) {
          console.warn(
            "Error sending purchase notification:",
            notificationError,
          );
          // Don't fail the purchase process if notification fails
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
        setIsTakingCourse(true);
        setShowOverlay(false);
        setIsUploading(false);
        toast.success(
          <div>
            Purchase successful!
            <br />
            Transaction hash:{" "}
            <a
              href={`${explorer.transaction(callCourseContract?.transactionHash)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {callCourseContract?.transactionHash
                ? `${callCourseContract.transactionHash.slice(0, 6)}...${callCourseContract.transactionHash.slice(-4)}`
                : ""}
            </a>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          },
        );
        return;
      } else {
        setIsTakingCourse(false);
        setShowOverlay(true);
        setIsUploading(false);
        toast.error("Purchase failed", {
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
    } catch (error) {
      setIsUploading(false);
      toast.error("Purchase failed, reload & try again", {
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

  const handleFinishCourseClaimCertfificate = async () => {
    if (!address) {
      console.log("No address available");
      return;
    }

    setIsUploading(true);

    const courseContract = new Contract(
      attensysCourseAbi,
      attensysCourseAddress,
      account,
    );
    const course_certificate_calldata = await courseContract.populate(
      "finish_course_claim_certification",
      [Number(ultimate_id)],
    );

    const avnuApiKey = process.env.NEXT_PUBLIC_AVNU_API_KEY;
    if (!avnuApiKey) {
      throw new Error("Missing AVNU API key in environment variables");
    }

    const callCourseContract = await executeCalls(
      account,
      [
        {
          contractAddress: attensysCourseAddress,
          entrypoint: "finish_course_claim_certification",
          calldata: course_certificate_calldata.calldata,
        },
      ],
      {
        gasTokenAddress: STRK_ADDRESS,
      },
      {
        apiKey: avnuApiKey,
        baseUrl: "https://sepolia.api.avnu.fi",
      },
    );
    let tx = await provider.waitForTransaction(
      callCourseContract.transactionHash,
    );

    setTxnHash(callCourseContract?.transactionHash);
    //@ts-ignore
    if (
      ((tx as any)?.finality_status === "ACCEPTED_ON_L2" ||
        (tx as any)?.finality_status === "ACCEPTED_ON_L1") &&
      (tx as any)?.execution_status === "SUCCEEDED"
    ) {
      toast.success(
        <div>
          Congratulations, you&apos;re certified!
          <br />
          Transaction hash:{" "}
          <a
            href={`${explorer.transaction(callCourseContract?.transactionHash)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {callCourseContract?.transactionHash
              ? `${callCourseContract.transactionHash.slice(0, 6)}...${callCourseContract.transactionHash.slice(-4)}`
              : ""}
          </a>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        },
      );
      setIsCertified(true);
      setIsUploading(false);
      return;
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < props?.data?.courseCurriculum?.length - 1 ? prevIndex + 1 : 0,
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : props?.data?.courseCurriculum?.length - 1,
    );
  };

  const handleVideoClick = (item: any, name: any) => {
    setSelectedVideo(item);
    setSelectedLectureName(name);

    // Always use the accurate course_identifier from props.course
    const dataWithId = {
      ...props.data,
      course_identifier: props.course?.course_identifier,
    };
    markLectureAsWatched(dataWithId, name);
  };
  console.log("props?.data to watch", props?.data);

  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
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
      const accessUrl = await pinata.gateways.private.createAccessLink({
        cid: formattedCid,
        expires,
      });
      return accessUrl;
    } catch (err) {
      console.error("Error creating access link:", err);
    }
  };

  useEffect(() => {
    if (!provider) return;

    getAllCourses();
  }, [provider]);
  useEffect(() => {
    if (courses.length === 0) return;
    console.log("props data", props?.data);
    getCourse();
  }, [courses]);

  useEffect(() => {
    if (courses.length > 0 && ultimate_id) {
      checkCourseApproval();
    }
  }, [courses, ultimate_id]);

  useEffect(() => {
    if (ultimate_id && ultimate_id !== undefined) {
      // Then check blockchain if we have an address
      if (address) {
        find();
      }
    }
    console.log("course id here", ultimate_id);
  }, [courseId, address]);

  // ⛳ Set the first video on page load
  useEffect(() => {
    if (props?.data) {
      fetchReviewsAndRating();
    }
    let isMounted = true;
    if (props?.data?.courseCurriculum?.length > 0) {
      createAccess(
        props?.data?.courseCurriculum[props?.data?.courseCurriculum?.length - 1]
          ?.video,
      ).then((url) => {
        if (isMounted) setSelectedVideo(url ?? "");
      });
      setSelectedLectureName(
        props?.data?.courseCurriculum[props?.data?.courseCurriculum?.length - 1]
          ?.name,
      );
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(
        "Auth state changed - user:",
        user?.uid,
        "emailVerified:",
        user?.emailVerified,
        "showAuthModal before:",
        showAuthModal,
      );
      if (!user) {
        setShowAuthModal(true);
        setAuthChecked(true);
      } else {
        // Check if user has both email verification AND Starknet address before considering them fully authenticated
        try {
          const profile = await getUserProfile(user.uid);
          // Check both Firebase user emailVerified and profile emailVerified as fallback
          const isEmailVerified = user.emailVerified || profile?.emailVerified;

          console.log("Auth state check:", {
            userId: user.uid,
            hasProfile: !!profile,
            hasStarknetAddress: !!profile?.starknetAddress,
            userEmailVerified: user.emailVerified,
            profileEmailVerified: profile?.emailVerified,
            isEmailVerified: isEmailVerified,
            completeSetup: Boolean(
              profile && profile.starknetAddress && isEmailVerified,
            ),
          });

          if (profile && profile.starknetAddress && isEmailVerified) {
            // User has complete account setup
            const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
            const decryptedPrivateKey = decryptPrivateKey(
              profile.starknetPrivateKey,
              encryptionSecret,
            );
            if (!decryptedPrivateKey) {
              console.error("Failed to decrypt private key");
              setAccount(undefined);
              setAuthChecked(true);
              setShowAuthModal(true);
              return;
            }
            const userAccount = new Account(
              provider,
              profile.starknetAddress,
              decryptedPrivateKey,
            );
            setAccount(userAccount);
            setAddress(profile.starknetAddress);
            setAuthChecked(true);
            setShowAuthModal(false);
          } else {
            // User is authenticated but doesn't have complete setup yet (still in signup process)
            console.log(
              "User authenticated but account setup not complete yet",
            );
            if (!isEmailVerified) {
              console.log("Email not verified yet");
            }
            if (!profile?.starknetAddress) {
              console.log("Starknet address not created yet");
            }
            setAccount(undefined);
            setAddress(undefined);
            setShowAuthModal(true);
            // Don't set authChecked to true yet - keep showing loading

            // Start polling for complete account setup (email verification + Starknet address)
            const checkCompleteAccountSetup = async () => {
              try {
                // Reload user to get latest email verification status
                await user.reload();
                const updatedUser = auth.currentUser;

                const currentProfile = await getUserProfile(user.uid);
                console.log("Polling check:", {
                  hasProfile: !!currentProfile,
                  hasStarknetAddress: !!currentProfile?.starknetAddress,
                  emailVerified: updatedUser?.emailVerified,
                  profileEmailVerified: currentProfile?.emailVerified,
                  userId: user.uid,
                });

                // Check both Firebase user emailVerified and profile emailVerified as fallback
                const isEmailVerified =
                  updatedUser?.emailVerified || currentProfile?.emailVerified;

                if (
                  currentProfile &&
                  currentProfile.starknetAddress &&
                  isEmailVerified
                ) {
                  console.log(
                    "Complete account setup detected - email verified and Starknet address created",
                  );
                  const encryptionSecret =
                    process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
                  const decryptedPrivateKey = decryptPrivateKey(
                    currentProfile.starknetPrivateKey,
                    encryptionSecret,
                  );
                  if (decryptedPrivateKey) {
                    const userAccount = new Account(
                      provider,
                      currentProfile.starknetAddress,
                      decryptedPrivateKey,
                    );
                    setAccount(userAccount);
                    setAddress(currentProfile.starknetAddress);
                    setAuthChecked(true);
                    setShowAuthModal(false);
                    setAuthLoading(false);
                    return true;
                  }
                }
                return false;
              } catch (error) {
                console.error(
                  "Error checking for complete account setup:",
                  error,
                );
                return false;
              }
            };

            // Poll every 3 seconds for up to 60 seconds (longer duration for email verification)
            const pollInterval = setInterval(async () => {
              const isComplete = await checkCompleteAccountSetup();
              if (isComplete) {
                clearInterval(pollInterval);
              }
            }, 3000);

            // Stop polling after 60 seconds and show auth modal
            setTimeout(() => {
              clearInterval(pollInterval);
              if (!authChecked) {
                setAuthChecked(true);
                setShowAuthModal(true);
              }
            }, 60000);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setAccount(undefined);
          setAuthChecked(true);
          setShowAuthModal(true);
        }
      }
    });
    // Fallback: if authChecked is not set after 1s, show modal
    const fallback = setTimeout(() => {
      if (!authChecked) {
        setShowAuthModal(true);
        setAuthChecked(true);
      }
    }, 1000);
    return () => {
      unsubscribe();
      clearTimeout(fallback);
    };
  }, []);

  // Additional check for already authenticated users on component mount
  useEffect(() => {
    const checkCurrentAuthState = async () => {
      // Add a small delay to ensure auth state is properly determined
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const currentUser = auth.currentUser;
      console.log(
        "Component mount check - currentUser:",
        currentUser?.uid,
        "emailVerified:",
        currentUser?.emailVerified,
      );

      // If we already have an address, user is authenticated - close modal immediately
      if (address) {
        console.log("Address already exists, closing modal immediately");
        setShowAuthModal(false);
        setAuthChecked(true);
        setAuthLoading(false);
        return;
      }

      if (currentUser) {
        // Manually trigger the auth state check for already authenticated users
        try {
          const profile = await getUserProfile(currentUser.uid);
          const isEmailVerified =
            currentUser.emailVerified || profile?.emailVerified;

          console.log("Manual auth check:", {
            hasProfile: !!profile,
            hasStarknetAddress: !!profile?.starknetAddress,
            isEmailVerified: isEmailVerified,
          });

          if (profile && profile.starknetAddress && isEmailVerified) {
            const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
            const decryptedPrivateKey = decryptPrivateKey(
              profile.starknetPrivateKey,
              encryptionSecret,
            );
            if (decryptedPrivateKey) {
              const userAccount = new Account(
                provider,
                profile.starknetAddress,
                decryptedPrivateKey,
              );
              setAccount(userAccount);
              setAddress(profile.starknetAddress);
              setAuthChecked(true);
              setShowAuthModal(false);
              setAuthLoading(false);
              console.log("Manual auth check - modal closed");
              return; // Exit early to prevent further processing
            }
          }
          // If we reach here, user is not fully authenticated
          setAuthChecked(true);
          setAuthLoading(false);
          // Keep showAuthModal as true (already set in initial state)
        } catch (error) {
          console.error("Error in manual auth check:", error);
          // Keep showAuthModal as true (already set in initial state)
          setAuthChecked(true);
          setAuthLoading(false);
        }
      } else {
        // No user - show modal
        setAuthChecked(true);
        setAuthLoading(false);
        // Keep showAuthModal as true (already set in initial state)
      }
    };

    checkCurrentAuthState();
  }, [address]); // Run on mount and when address changes

  useEffect(() => {
    const checkReview = async () => {
      if (address) {
        const exists = await courseContract?.get_review_status(
          ultimate_id,
          address,
        );
        setHasReviewed(exists);
      }
    };
    checkReview();
  }, [
    address,
    `${props?.data?.courseName?.toString() ?? ""}${ultimate_id ?? ""}`,
  ]);

  useEffect(() => {
    const checkContentHeight = () => {
      if (props?.data?.courseDescription?.length > 200) {
        setShowSeeMore(true);
      } else {
        setShowSeeMore(false);
      }

      if (props?.data?.targetAudienceDesc?.length > 200) {
        setShowTargetSeeMore(true);
      } else {
        setShowTargetSeeMore(false);
      }
    };

    checkContentHeight();
    window.addEventListener("resize", checkContentHeight);

    return () => {
      window.removeEventListener("resize", checkContentHeight);
    };
  }, [props?.data?.courseDescription, props?.data?.targetAudienceDesc]);

  // useEffect(() => {
  //   if (!address) return;
  //   controller.username()?.then((n) => setUsername(n));
  //   console.log(address, "address");
  // }, [address, controller]);

  // Store average ratings for each course by identifier
  const [averageRatings, setAverageRatings] = useState<{ [key: string]: any }>(
    {},
  );

  useEffect(() => {
    // Fetch average ratings for all currentItems when courseData or currentPage changes
    const fetchAllRatings = async () => {
      const ratings: { [key: string]: any } = {};
      if (Array.isArray(courseData)) {
        await Promise.all(
          courseData.map(async (course: any) => {
            const identifier = course?.course_identifier;
            if (identifier && !(identifier in ratings)) {
              const avg = await getAverageRatingForVideo(
                (course?.data?.courseName?.toString() ?? "") + identifier,
              );
              ratings[identifier] = avg;
            }
          }),
        );
      }
      setAverageRatings(ratings);
    };
    fetchAllRatings();
  }, [courseData]);

  // Sharing handlers
  const handleShareClick = () => {
    if (props?.data && ultimate_id) {
      // Generate a professional shareable URL instead of using current page URL
      const shareableUrl = generateShareableUrl(
        ultimate_id,
        props.data.courseName,
      );

      setShareData({
        title: props.data.courseName || "Course",
        description:
          props.data.courseDescription || "Check out this amazing course!",
        url: shareableUrl,
        courseId: ultimate_id,
      });
      setIsShareModalOpen(true);
    }
  };

  const handleShareModalClose = () => {
    setIsShareModalOpen(false);
  };

  const handleShareSuccess = (platform: string) => {
    toast.success(`Shared on ${platform}!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  // Add this near other useState hooks
  const [accessUrls, setAccessUrls] = useState<(string | undefined)[]>([]);

  // Fetch all access URLs when courseCurriculum changes
  useEffect(() => {
    async function fetchAccessUrls() {
      if (!props?.data?.courseCurriculum) return;
      const urls = await Promise.all(
        props?.data?.courseCurriculum?.map((lecture: any) =>
          createAccess(lecture.video),
        ),
      );
      setAccessUrls(urls);
    }
    fetchAccessUrls();
  }, [props?.data?.courseCurriculum]);

  // Add debugging for props.data structure
  useEffect(() => {
    console.log("LecturePage - props.data:", props?.data);
    console.log(
      "LecturePage - courseCurriculum exists:",
      !!props?.data?.courseCurriculum,
    );
    console.log(
      "LecturePage - courseCurriculum type:",
      typeof props?.data?.courseCurriculum,
    );
    console.log(
      "LecturePage - courseCurriculum length:",
      props?.data?.courseCurriculum?.length,
    );
    console.log(
      "LecturePage - courseCurriculum content:",
      props?.data?.courseCurriculum,
    );
  }, [props?.data]);

  if (authLoading) {
    return (
      <div className="pt-6 pb-36 w-full">
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" colorVariant="primary" />
        </div>
      </div>
    );
  }

  // Check if course is approved - if not, show error message
  if (courseApproved === false) {
    return (
      <div className="pt-6 pb-36 w-full">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#2D3A4B] mb-4">
              Course Not Available
            </h2>
            <p className="text-[#2D3A4B] mb-6">
              This course is currently pending approval and is not available for
              viewing.
            </p>
            <button
              onClick={() => router?.push("/Home")}
              className="bg-[#9b51e0] px-7 py-2 rounded text-[#fff] font-bold hover:bg-[#8a4ad0] transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if course data is available
  if (!props?.data) {
    return (
      <div className="pt-6 pb-36 w-full">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#2D3A4B] mb-4">
              Course Data Not Available
            </h2>
            <p className="text-[#2D3A4B] mb-6">
              Unable to load course information. Please try accessing the course
              from the main page.
            </p>
            <button
              onClick={() => router?.push("/Home")}
              className="bg-[#9b51e0] px-7 py-2 rounded text-[#fff] font-bold hover:bg-[#8a4ad0] transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log(
    "Rendering LecturePage - showAuthModal:",
    showAuthModal,
    "authChecked:",
    authChecked,
    "address:",
    address,
  );

  return (
    <>
      {!authLoading && authChecked && showAuthModal && (
        <AuthRequiredModal
          open={showAuthModal}
          coursePath={
            typeof window !== "undefined"
              ? window.location.pathname + window.location.search
              : ""
          }
        />
      )}
      <div className="pt-6  pb-36 w-full">
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
        {/* Video and Title */}
        <div className="flex flex-none w-full text-sm space-x-3 items-center px-6 sm:px-12">
          <div className="flex flex-none space-x-2 items-center">
            <Image
              src={graduate}
              className="h-[25px] w-[25px]"
              alt="stream_video"
            />
            <p className="text-[16px] text-[#2D3A4B] font-semibold">
              My Courses
            </p>
          </div>
          <span className="text-[#9B51E0]">|</span>{" "}
          <p className="w-full truncate text-[16px] text-[#2D3A4B] font-semibold">
            {props?.data?.courseName}
          </p>
        </div>

        {/* ReactPlayer & lecture*/}
        <div className="w-[100%]  mx-auto flex justify-between items-center px-6 sm:px-12 mt-5">
          <div className="w-full xl:w-[67%] h-[33vh] xl:h-[543px] rounded-xl overflow-hidden relative">
            {selectedVideo && (
              <>
                <div
                  className="absolute inset-0 overflow-hidden"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <ReactPlayer
                    url={selectedVideo}
                    width="100%"
                    height="100%"
                    className="rounded-xl"
                    controls
                    playing={!showOverlay}
                    onPlay={() => {
                      // Always use the accurate course_identifier from props.course
                      const dataWithId = {
                        ...props.data,
                        course_identifier: props.course?.course_identifier,
                      };
                      markLectureAsWatched(dataWithId, selectedLectureName);
                    }}
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload",
                        },
                      },
                    }}
                  />
                </div>
                {showOverlay && !isTakingCourse && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-xl">
                    <div className="text-white text-center p-6">
                      <h2 className="text-2xl font-bold mb-4">Course Locked</h2>
                      <p className="mb-6">Take this course to start learning</p>
                      <button
                        className={`bg-[#9b51e0] px-7 py-2 rounded text-[#fff] font-bold`}
                        onClick={handleconfirmation}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" colorVariant="white" />
                            Processing...
                          </div>
                        ) : isConfirmModalOpen ? (
                          "Waiting for confirmation"
                        ) : (
                          `Buy Course ${coursePrice === 0 ? "(Free)" : `($${coursePrice})`}`
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="hidden xl:block w-[30%] h-[543px] space-y-4">
            <div className="flex space-x-2  justify-center bg-gradient-to-r from-[#5801a9] to-[#4a90e2] text-white items-center text-sm py-3 px-7 rounded-xl">
              <HiBadgeCheck color="#fff" />
              <p>Attensys Certified Course</p>
            </div>
            <h1 className="text-[16px] text-[#2D3A4B] leading-[22px] font-semibold">
              Lecture ({props?.data?.courseCurriculum?.length || 0})
            </h1>

            <div className="h-[440px] w-[100%] bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl overflow-scroll scrollbar-hide">
              {props?.data?.courseCurriculum &&
              props?.data?.courseCurriculum?.length > 0 ? (
                props?.data?.courseCurriculum
                  ?.slice()
                  .reverse()
                  .map((item: any, i: any) => {
                    // Calculate the correct index for accessUrls (since we reversed the array)
                    const accessUrl =
                      accessUrls[props?.data?.courseCurriculum?.length - 1 - i];
                    return (
                      <div
                        key={i}
                        className="flex w-full items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          if (window.innerWidth < 1024)
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          handleVideoClick(accessUrl, item.name);
                        }}
                      >
                        <div className="w-8 flex-shrink-0">
                          <p className="font-bold text-[#5801a9]">{i + 1}</p>
                        </div>
                        <div
                          className="w-[145px] h-[94px] rounded-xl border-4 border flex-shrink-0 overflow-hidden"
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          {accessUrl ? (
                            <ReactPlayer
                              url={accessUrl}
                              controls={false}
                              playing={false}
                              width="100%"
                              height="100%"
                              playIcon={<></>}
                              onDuration={(duration) =>
                                handleDuration(i, duration)
                              }
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <LoadingSpinner
                                size="sm"
                                colorVariant="primary"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow ml-6">
                          <p className="text-[14px] font-semibold leading-[30px] text-[#333333]">
                            {item.name}
                          </p>
                          <h1 className="text-[8px] text-[#333333] leading-[14px] font-medium">
                            Creator address
                          </h1>
                          <div className="rounded-lg bg-[#9B51E052] w-[60%] flex items-center justify-center">
                            <p className="text-xs px-7 py-1">
                              {durations[i]
                                ? formatDuration(durations[i])
                                : "0:00:00"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">
                    No lectures available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-[100%] mx-auto flex justify-between items-center sm:px-12 px-6 mt-5">
          <div className="w-full xl:w-[67%]">
            {/* Course Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Left Side - Course Title and Creator */}
              <div className="flex-1 sm:space-y-3 space-y-1">
                {selectedLectureName && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#2D3A4B] leading-tight">
                      {selectedLectureName}
                    </h1>
                    {/* Difficulty Level - Desktop */}
                    <div className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 rounded-lg border border-gray-200 w-fit">
                      <GrDiamond className="h-3 w-3 text-[#2D3A4B]" />
                      <span className="text-xs font-medium text-[#2D3A4B]">
                        {props?.data?.difficultyLevel}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-[#2D3A4B] mb-0">
                  <span className="font-medium">Created by</span>
                  <span className="text-[#5801A9] font-semibold underline hover:text-[#9B51E0] transition-colors cursor-pointer">
                    {props?.data?.courseCreator}
                  </span>
                </div>
              </div>

              {/* Right Side - Action Buttons and Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
                {/* Share Button - Desktop */}
                <div className="hidden lg:flex">
                  <ShareButton
                    onClick={handleShareClick}
                    variant="outline"
                    size="md"
                  >
                    Share Course
                  </ShareButton>
                </div>

                {/* Certificate/Get Certificate Button - Desktop Only */}
                <div className="hidden lg:flex items-center">
                  {isCertified ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                      <LuBadgeCheck className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Certified
                      </span>
                    </div>
                  ) : isTakingCourse ? (
                    <button
                      className="bg-gradient-to-r from-[#9B51E0] to-[#5801A9] hover:from-[#5801A9] hover:to-[#9B51E0] text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#9B51E0] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      onClick={handleFinishCourseClaimCertfificate}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" colorVariant="white" />
                          <span>Claiming...</span>
                        </div>
                      ) : (
                        "Get Certificate"
                      )}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Mobile Actions Row - All on same line */}
            <div className="lg:hidden flex items-center justify-between gap-3 border-t border-gray-100">
              {/* Difficulty Level - Mobile */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <GrDiamond className="h-4 w-4 text-[#2D3A4B]" />
                <span className="text-sm font-medium text-[#2D3A4B]">
                  {props?.data?.difficultyLevel}
                </span>
              </div>

              {/* Mobile Certificate Button */}
              <div className="flex items-center">
                {isCertified ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                    <LuBadgeCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Certified
                    </span>
                  </div>
                ) : isTakingCourse ? (
                  <button
                    className="bg-gradient-to-r from-[#9B51E0] to-[#5801A9] hover:from-[#5801A9] hover:to-[#9B51E0] text-white font-semibold px-3 py-2 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#9B51E0] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleFinishCourseClaimCertfificate}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-1">
                        <LoadingSpinner size="sm" colorVariant="white" />
                        <span>Claiming</span>
                      </div>
                    ) : (
                      "Get Certificate"
                    )}
                  </button>
                ) : null}
              </div>

              {/* Share Button - Mobile */}
              <ShareButton
                onClick={handleShareClick}
                variant="outline"
                size="md"
              >
                Share
              </ShareButton>
            </div>
          </div>

          <div className="bg-[url('/hero_asset.png')] text-white p-10 rounded-xl w-[30%] hidden xl:flex items-center justify-center h-[85px]">
            <Image src={attensys_logo} alt="logo" />
          </div>
        </div>

        <div className="w-[100%] mx-auto flex justify-between px-6 xl:px-12 mt-5">
          <div className="w-full xl:w-[67%] h-auto space-y-12">
            <div className="h-auto w-full rounded-xl xl:bg-[#FFFFFF] xl:border-[1px] xl:border-[#D9D9D9] xl:p-10">
              <div className="pb-4">
                <p className="font-bold py-2 text-[14px] text-[#333333] leading-[22px]">
                  About this course
                </p>
                <div className="relative">
                  <div
                    className="text-[14px] text-[#333333] leading-[22px] font-light"
                    dangerouslySetInnerHTML={{
                      __html: isExpanded
                        ? props?.data?.courseDescription
                        : props?.data?.courseDescription?.slice(0, 200) +
                          (showSeeMore ? "..." : ""),
                    }}
                  />
                  {showSeeMore && !isExpanded && (
                    <span
                      className="text-blue-600 cursor-pointer hover:underline ml-1"
                      onClick={() => setIsExpanded(true)}
                    >
                      see more
                    </span>
                  )}
                  {showSeeMore && isExpanded && (
                    <span
                      className="text-blue-600 cursor-pointer hover:underline ml-1"
                      onClick={() => setIsExpanded(false)}
                    >
                      see less
                    </span>
                  )}
                </div>
              </div>
              <div className="py-4">
                <p className="font-bold py-2 text-[14px] text-[#333333] leading-[22px]">
                  {" "}
                  Student Requirements
                </p>
                <ul className="text-[14px] text-[#333333] leading-[22px] font-light list-disc">
                  {props?.data?.studentRequirements}
                </ul>
              </div>
              <div className="py-4">
                <p className="font-bold py-2 text-[14px] text-[#333333] leading-[22px]">
                  Target Audience
                </p>
                <div className="text-[#333333] text-[14px] font-light leading-[22px]">
                  <p>
                    {isTargetExpanded
                      ? props?.data?.targetAudienceDesc
                      : props?.data?.targetAudienceDesc?.slice(0, 200) +
                        (showTargetSeeMore ? "..." : "")}
                    {showTargetSeeMore && !isTargetExpanded && (
                      <span
                        className="text-blue-600 cursor-pointer hover:underline ml-1"
                        onClick={() => setIsTargetExpanded(true)}
                      >
                        see more
                      </span>
                    )}
                    {showTargetSeeMore && isTargetExpanded && (
                      <span
                        className="text-blue-600 cursor-pointer hover:underline ml-1"
                        onClick={() => setIsTargetExpanded(false)}
                      >
                        see less
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Lectures */}
            <div className="flex xl:hidden flex-col">
              <p className=" font-semibold">
                Lectures({props?.data?.courseCurriculum?.length || 0})
              </p>
              <div className=" w-[100%] bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl overflow-scroll scrollbar-hide">
                {props?.data?.courseCurriculum &&
                props?.data?.courseCurriculum?.length > 0 ? (
                  props?.data?.courseCurriculum
                    ?.slice()
                    .reverse()
                    .map((item: any, i: any) => {
                      const accessUrl =
                        accessUrls[
                          props?.data?.courseCurriculum?.length - 1 - i
                        ];
                      return (
                        <div
                          key={i}
                          className="flex w-full items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            if (window.innerWidth < 1024)
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            handleVideoClick(accessUrl, item.name);
                          }}
                        >
                          <div className="w-8 flex-shrink-0">
                            <p className="font-bold text-[#5801a9]">{i + 1}</p>
                          </div>
                          <div
                            className="w-[150px] h-[97px] rounded-xl border-4 border flex-shrink-0"
                            onContextMenu={(e) => e.preventDefault()}
                          >
                            {accessUrl ? (
                              <ReactPlayer
                                url={accessUrl}
                                controls={false}
                                playing={false}
                                width="100%"
                                height="100%"
                                playIcon={<></>}
                                onDuration={(duration) =>
                                  handleDuration(i, duration)
                                }
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                <LoadingSpinner
                                  size="sm"
                                  colorVariant="primary"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow ml-6">
                            <p className="text-[14px] font-semibold leading-[30px] text-[#333333]">
                              {item.name}
                            </p>
                            <div className="rounded-lg bg-[#9B51E052] w-[60%] flex items-center justify-center">
                              <p className="text-xs px-7 py-1">
                                {durations[i]
                                  ? formatDuration(durations[i])
                                  : "0:00:00"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex items-center justify-center h-full p-4">
                    <p className="text-gray-500 text-center">
                      No lectures available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-4 hidden xl:flex flex-col">
              <h1 className="text-[16px] font-bold text-[#2D3A4B] leading-[22px]">
                Leave a review
              </h1>
              <div className="h-auto pb-10 w-full rounded-xl bg-[#FFFFFF] border-[1px] border-[#D9D9D9]">
                <div className="flex justify-between items-center h-[100px] w-full border-b-[1px] border-b-[#EBECEE] px-10">
                  <div className="h-full w-[30%] flex items-center justify-center border-r-[1px] border-r-[#EBECEE]">
                    <div className="flex items-center w-full space-x-3">
                      <Image src={profile_pic} alt="pic" width={60} />
                      <div className="space-y-1">
                        <h4 className="text-[16px] text-[#333333] leading-[22px] font-semibold">
                          {username}
                        </h4>
                        <p className="text-[#9b51e0] text-[12px] font-medium leading-[14px]">
                          {!!address &&
                          typeof address === "string" &&
                          address.trim() !== ""
                            ? shortHex(address)
                            : "Login"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-[30%] space-x-3 flex items-center border-r-[1px] border-r-[#EBECEE]">
                    <h1 className="text-[14px] text-[#333333] leading-[16px] font-medium">
                      {courseaveragerate?.count} students reviewed this course
                    </h1>
                  </div>
                  <div className="h-full w-[30%] flex items-center space-x-3">
                    <RatingDisplay rating={courseaveragerate} size="sm" />
                  </div>
                </div>
                {/* <div className="px-10 mt-8 flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="What do you think about this course?"
                    className="w-[75%] h-[45px] border shadow-dm p-6 rounded-xl text-[14px] font-medium leading-[16px]"
                  />

                  <button className="hidden sm:block bg-[#9b51e0] px-7 py-2 rounded text-[#fff] font-bold">
                    Send review
                  </button>
                </div>   */}
                <div>
                  {!hasReviewed && isTakingCourse && (
                    <ReviewForm
                      videoId={
                        props?.data?.courseName?.toString() + ultimate_id
                      }
                      userId={address?.toString() || ""}
                      onSubmit={async (review) => {
                        let user = getCurrentUser();
                        if (!user) {
                          user = await signInUser();
                        }
                        await submitReview({
                          ...review,
                          userId: auth.currentUser!.uid,
                          videoId: `${props?.data?.courseName?.toString() ?? ""}${ultimate_id ?? ""}`,
                        });
                        handleRatingSubmit();
                        fetchReviewsAndRating();
                        setHasReviewed(true);
                      }}
                    />
                  )}
                </div>

                <div className="px-10 mt-10 space-y-10 h-[380px] overflow-y-scroll pb-10 ">
                  {/* <div className="space-y-6">
                    <div className="flex space-x-3 items-center">
                      <div className="h-[64px] w-[64px] bg-[#9B51E01A] text-[20px] text-[#101928] leading-[24px] rounded-full flex items-center justify-center">
                        OM
                      </div>
                      <div className="space-y-1">
                        <h1 className="text-[14px] text-[#333333] font-semibold leading-[22px]">
                          Olivia
                        </h1>
                        <StarRating totalStars={5} starnumber={4} />
                      </div>
                    </div>
                    <p className="w-[730px] text-[14px] text-[#333333] font-medium leading-[22px]">
                      Halfway through the course and lots of information given in
                      every chapter. Concise and easy to understand, very useful
                      to apply to any Web design journey!
                    </p>
                  </div>

                  <div className="space-y-6 w-full">
                    <div className="flex space-x-3 items-center">
                      <div className="h-[64px] w-[64px] bg-[#9B51E01A] text-[20px] text-[#101928] leading-[24px] rounded-full flex items-center justify-center">
                        OM
                      </div>
                      <div className="space-y-1">
                        <h1 className="text-[14px] text-[#333333] font-semibold leading-[22px]">
                          Olivia
                        </h1>
                        <StarRating totalStars={5} starnumber={4} />
                      </div>
                    </div>
                    <p className="w-[730px] text-[14px] text-[#333333] font-medium leading-[22px]">
                      Halfway through the course and lots of information given in
                      every chapter. Concise and easy to understand, very useful
                      to apply to any Web design journey!
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex space-x-3 items-center">
                      <div className="h-[64px] w-[64px] bg-[#9B51E01A] text-[20px] text-[#101928] leading-[24px] rounded-full flex items-center justify-center">
                        OM
                      </div>
                      <div className="space-y-1">
                        <h1 className="text-[14px] text-[#333333] font-semibold leading-[22px]">
                          Olivia
                        </h1>
                        <StarRating totalStars={5} starnumber={4} />
                      </div>
                    </div>
                    <p className="w-[730px] text-[14px] text-[#333333] font-medium leading-[22px]">
                      Halfway through the course and lots of information given in
                      every chapter. Concise and easy to understand, very useful
                      to apply to any Web design journey!
                    </p>
                  </div>
                 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="md:col-span-2">
                      <ReviewsList reviews={coursereview} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses you might like - Mobile */}
            <div className="block xl:hidden mt-0 sm:mt-8">
              <h1 className="text-[16px] font-semibold mb-4">
                Courses you might like
              </h1>
              <div className="space-y-4 overflow-x-auto">
                {courseData
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 2)
                  .map((item: any, id: any) => {
                    console.log("courseData[id]", courseData[id]);
                    return (
                      <div key={id}>
                        <CardWithLink
                          wallet={account}
                          data={item}
                          rating={averageRatings}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="block xl:hidden">
              <div className="border-b-[1px] border-b-[#949494] justify-center xl:mx-48 flex space-x-2 items-center h-[50px]">
                <div className="h-full w-[100%] flex items-center space-x-3">
                  <RatingDisplay rating={courseaveragerate} size="sm" />
                </div>
              </div>

              {/* comments */}
              <div className="block xl:hidden py-12 sm:mx-48 items-center content-center justify-around text-sm">
                <div className="md:col-span-2">
                  <ReviewsList reviews={coursereview} />
                </div>

                <div className="border-[1px] border-[#B8B9BA] h-28 hidden xl:block"></div>
              </div>

              {!hasReviewed && isTakingCourse && (
                <div className="flex xl:hidden flex-col">
                  <p className="mt-3 font-semibold">Leave a review</p>
                  <div className=" w-[100%] gap-6 bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl overflow-scroll scrollbar-hide p-4 flex flex-col ">
                    <div className="flex items-center w-full space-x-3">
                      <Image src={profile_pic} alt="pic" width={48} />
                      <div className="space-y-1">
                        <h4 className="text-[16px] text-[#333333] leading-[22px] font-semibold">
                          {username}
                        </h4>
                        <p className="text-[#9b51e0] text-[12px] font-medium leading-[14px]">
                          {!!address &&
                          typeof address === "string" &&
                          address.trim() !== ""
                            ? shortHex(address)
                            : "Login"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <ReviewForm
                        videoId={
                          props?.data?.courseName?.toString() + ultimate_id
                        }
                        userId={address?.toString() || ""}
                        onSubmit={async (review) => {
                          let user = getCurrentUser();
                          if (!user) {
                            user = await signInUser();
                          }
                          await submitReview({
                            ...review,
                            userId: auth.currentUser!.uid,
                            videoId: `${props?.data?.courseName?.toString() ?? ""}${ultimate_id ?? ""}`,
                          });
                          handleRatingSubmit();
                          fetchReviewsAndRating();
                          setHasReviewed(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Courses you might like - Desktop */}
          <div className="hidden xl:block w-[30%] h-[1020px]">
            <h1>Courses you might like</h1>
            <div className="space-y-10 overflow-x-auto max-h-[1020px] overflow-y-auto">
              {courseData.map((item: any, id: any) => {
                console.log("courseData[id]", courseData[id]);
                return (
                  <div key={id}>
                    <CardWithLink
                      wallet={account}
                      data={item}
                      rating={averageRatings}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={isConfirmModalOpen}
        onClose={() => {
          setisConfirmModalOpen(false);
        }}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-[#0F0E0E82] transition-opacity"
        />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white py-8 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-6 py-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Confirm Purchase
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {`Are you sure you want to purchase this course for ${coursePrice === 0 ? "free" : `$${coursePrice}`}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    onClick={handleTakeCourse}
                    // type="button"
                    className=" cursor-pointer inline-flex w-full justify-center rounded-md border border-transparent bg-[#9B51E0] px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                  >
                    Proceed
                  </Button>
                  <Button
                    // type="button"
                    onClick={handleconfirmationcancel}
                    className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleShareModalClose}
        shareData={shareData}
        onShare={handleShareSuccess}
      />
    </>
  );
};

export default LecturePage;
