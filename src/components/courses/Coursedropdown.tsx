import React, { useState, useEffect } from "react";
import { coursestatusAtom } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { VscNewFile } from "react-icons/vsc";
import { courseQuestions } from "@/constants/data";
import { useRouter } from "next/navigation";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAccount } from "@starknet-react/core";
import { getUserProfile } from "@/lib/userutils";
import { auth } from "@/lib/firebase/client";
import { decryptPrivateKey } from "@/helpers/encrypt";
import { Account } from "starknet";
import { provider } from "@/constants";
import { useAuth } from "@/context/AuthContext";

const Coursedropdown = () => {
  const [status, setcourseStatus] = useAtom(coursestatusAtom);
  const router = useRouter();
  const [wallet] = useAtom(walletStarknetkit);
  const [account, setAccount] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    setcourseStatus(false);
    router.push(path);
  };

  const [visible, setVisible] = useState(false);

  // animation controlled here
  useEffect(() => {
    if (status) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [status]);

  useEffect(() => {
    const logStarknetCredentials = async () => {
      try {
        if (user && user.uid) {
          const profile = await getUserProfile(user.uid);
          const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
          if (profile) {
            const decryptedPrivateKey = decryptPrivateKey(
              profile.starknetPrivateKey,
              encryptionSecret,
            );
            const userAccount = new Account(
              provider,
              profile.starknetAddress,
              decryptedPrivateKey,
            );
            setAccount(userAccount);
            setAddress(profile.starknetAddress);
          } else {
            setAccount(undefined);
            setAddress("");
            console.log("No user profile found in Firestore.");
          }
        } else {
          setAccount(undefined);
          setAddress("");
        }
      } catch (err) {
        setAccount(undefined);
        setAddress("");
        console.error("Error fetching user profile:", err);
      }
    };
    logStarknetCredentials();
  }, [user]);

  return (
    <>
      {status && (
        <div
          className={`bg-[#FFFFFF] h-[157px] w-[100%] absolute z-50 shadow-2xl transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex justify-between mx-auto w-[80%] h-[90%] items-center">
            <div className="space-y-4 w-[337px] text-[16px]">
              <a
                onClick={() => handleNavigation("/Course")}
                className=" cursor-pointer"
              >
                <div className="flex space-x-3 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-[#9747FF] w-[20px] h-[20px] my-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>

                  <h1 className="text-[16px] font-bold cursor-pointer">
                    Explore Courses
                  </h1>
                </div>
                <p className="text-[13px] ml-8 text-[#2D3A4B] cursor-pointer ">
                  Access and manage all your course completion certificates in
                  one place.
                </p>
              </a>
              {/* <a
                //@todo replace sample profile with user profile id
                onClick={() => {
                  if (!user) {
                    alert("Login");
                  } else {
                    handleNavigation(`/mycoursepage/${address}`);
                  }
                }}
                className=" cursor-pointer"
              >
                <div className="flex space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-[#9747FF] w-[20px] h-[20px] my-auto"
                  >
                    <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                    <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                    <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
                  </svg>

                  <h1 className="text-[16px] font-bold cursor-pointer">
                    Account Center
                  </h1>
                </div>
              </a> */}
            </div>
            <div className="w-[1px] h-[80%] bg-[#B8B9BA]"></div>
            <div className="space-y-2 w-[337px]">
              <a
                onClick={() => handleNavigation(`/Certifications/${address}`)}
                className="cursor-pointer"
              >
                <div className="flex space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-[#9747FF] w-[20px] h-[20px] my-auto"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h1 className="text-[16px] font-bold cursor-pointer">
                    My Certifications
                  </h1>
                </div>
              </a>
              <p className="text-[13px] ml-8 text-[#2D3A4B] cursor-pointer ">
                Access and manage all your course completion certificates in one
                place.
              </p>
            </div>
            <div className="w-[1px] h-[80%] bg-[#B8B9BA]"></div>

            <div className="space-y-2 w-[350px]">
              <a
                onClick={() =>
                  handleNavigation(
                    `/Course/CreateACourse/${courseQuestions[0]}`,
                  )
                }
              >
                <div className="flex space-x-3">
                  <VscNewFile className="size-6 text-[#9747FF] w-[20px] h-[20px] my-auto" />

                  <h1 className="text-[16px] font-bold cursor-pointer">
                    Create a course
                  </h1>
                </div>
                <p className="text-[13px] cursor-pointer">
                  Start building your course by organizing your content into
                  structured sections and engaging video lessons.
                </p>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Coursedropdown;
