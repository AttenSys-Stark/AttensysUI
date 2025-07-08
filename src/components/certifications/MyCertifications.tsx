import React, { useState, useEffect } from "react";
import UserSideBar from "../courses/UserSideBar";
import Image from "next/image";
import red_love from "@/assets/red_love.svg";
import love from "@/assets/love.svg";
import card from "@/assets/card.svg";
import { useFetchCID } from "@/hooks/useFetchCID";
import { useRouter } from "next/navigation";

const MyCertifications = (props: any) => {
  const [selected, setSelected] = useState("All NFTs");
  const [page, setPage] = useState("");
  const [certificates, setCertificates] = useState<any[]>([]);
  const { fetchCIDContent } = useFetchCID();
  const router = useRouter();

  useEffect(() => {
    setPage("myCertificate");
  }, []);

  useEffect(() => {
    console.log("Props updated:", {
      address: props.address,
      certifiedCourses: props.certifiedCourses,
    });
  }, [props.address, props.certifiedCourses]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (props.certifiedCourses && props.certifiedCourses.length > 0) {
        try {
          console.log(
            "Starting to process certified courses:",
            props.certifiedCourses,
          );

          const transformedCertificates = await Promise.all(
            props.certifiedCourses.map(async (course: any) => {
              try {
                console.log("Processing course:", {
                  identifier: course.course_identifier,
                  ipfsUri: course.course_ipfs_uri,
                });

                const courseData = await fetchCIDContent(
                  course.course_ipfs_uri,
                );
                console.log(
                  "Raw course data from IPFS:",
                  JSON.stringify(courseData, null, 2),
                );

                if (!courseData || !courseData.data) {
                  console.log(
                    "No course data found for course:",
                    course.course_identifier,
                  );
                  return null;
                }

                // Access the nested data structure
                const courseInfo = courseData.data;
                console.log("Course info:", courseInfo);

                // Transform the data using the nested structure
                const certificate = {
                  cert_name: courseInfo.courseName || "Unnamed Course",
                  recipient: props.address || "Unknown",
                  author: courseInfo.courseCreator || "Unknown",
                  nft_description:
                    courseInfo.courseDescription || "No description available",
                  img: courseInfo.courseImage
                    ? `https://gateway.pinata.cloud/ipfs/${courseInfo.courseImage}`
                    : "/default-certificate.png",
                  type: "course", // Add type identifier
                };

                console.log("Created certificate:", certificate);
                return certificate;
              } catch (error) {
                console.error(
                  "Error processing course:",
                  course.course_identifier,
                  error,
                );
                return null;
              }
            }),
          );

          const validCertificates = transformedCertificates.filter(
            (cert): cert is any => cert !== null,
          );

          console.log("Final valid certificates:", validCertificates);
          setCertificates(validCertificates);
        } catch (error) {
          console.error("Error in fetchCourseData:", error);
          setCertificates([]);
        }
      } else {
        console.log("No certified courses to process");
        setCertificates([]);
      }
    };

    fetchCourseData();
  }, [props.certifiedCourses, props.address, fetchCIDContent]);

  // Filter certificates based on selected type
  const filteredCertificates = React.useMemo(() => {
    if (selected === "All NFTs") {
      return certificates;
    } else if (selected === "Course NFTs") {
      return certificates.filter((cert) => cert.type === "course");
    } else {
      // For "Event NFTs" and "Bootcamp NFTs", return empty array
      return [];
    }
  }, [certificates, selected]);

  const renderCertificates = () => {
    if (
      selected === "Event NFTs" ||
      selected === "Bootcamp NFTs" ||
      filteredCertificates.length === 0
    ) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Image
              src={card}
              alt="No certificates"
              width={200}
              height={200}
              className="w-32 h-32"
            />
            <p className="text-gray-500 text-lg">No certificate</p>
            <button
              className="text-white px-6 py-2 rounded-lg transition-colors opacity-50 relative"
              style={{
                background:
                  "linear-gradient(103.42deg, #9B51E0 16.73%, #4A90E2 64.74%)",
              }}
              onClick={() => {
                router.push("/Course");
              }}
            >
              Browse course
              {/* <span className="absolute -top-1.5 -right-10 bg-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap transform rotate-12">
                Coming Soon
              </span> */}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 md:gap-y-8 md:gap-x-3 my-6">
        {filteredCertificates.map((cert, j) => (
          <div
            key={j}
            className="bg-[#FFFFFF] rounded-xl shadow-lg my-4 sm:my-0 w-full"
          >
            <div className="relative">
              <Image
                src={cert.img}
                alt={cert.cert_name}
                width={400}
                height={300}
                className="object-cover w-full h-[200px]"
              />
              <div className="bg-white absolute right-3 top-3 flex py-1 px-2 rounded">
                <Image src={red_love} alt="love" />
                <p className="text-xs ml-3">18k</p>
              </div>
            </div>

            <div className="px-8 py-6">
              <div className="flex justify-between items-center py-1">
                <h4 className="text-[14px] text-[#333333] font-bold leading-[15px]">
                  {cert.cert_name}
                </h4>
                <Image src={love} alt="love" className="h-[12px] w-[13px]" />
              </div>
              <div className="flex justify-between my-3">
                <p className="text-[9px] text-[#333333] font-bold leading-[15px]">
                  Recipient address:
                </p>
                <p className="text-[9px] text-[#A01B9B] font-medium leading-[15px] truncate max-w-[120px]">
                  {cert.recipient}
                </p>
              </div>
              <div className="flex justify-between my-3">
                <p className="text-[9px] text-[#333333] font-bold leading-[15px]">
                  Author:
                </p>
                <p className="text-[9px] text-[#333333] font-medium leading-[15px] truncate max-w-[120px]">
                  {cert.author}
                </p>
              </div>

              <div>
                <p className="text-[9px] lg:text-[10px] text-[#333333] font-medium leading-[15px] line-clamp-2">
                  {cert.nft_description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="block lg:flex lg:mx-10 mb-8 pb-24 max-w-screen-2xl xl:mx-auto">
      <UserSideBar
        wallet={props.wallet}
        courseData={[]}
        takenCoursesData={[]}
        validCertificates={filteredCertificates}
        page={page}
        selected={selected}
        setSelected={setSelected}
        refreshCourses={async () => {}}
        courses={[]}
        username={props.username}
        address={props.address}
      />

      <div className="w-full sm:mx-auto px-4 my-12">
        <div className="bg-white rounded-xl border-[1px] border-[#BCBCBC] min-h-[600px] py-4 px-8">
          <h1 className="text-[#A01B9B] font-bold text-2xl mb-6">
            {selected} Certifications ({filteredCertificates.length})
          </h1>
          {renderCertificates()}
        </div>
      </div>
    </div>
  );
};

export default MyCertifications;
