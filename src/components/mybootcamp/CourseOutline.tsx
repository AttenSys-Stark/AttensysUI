import { provider } from "@/constants";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Contract } from "starknet";
import CourseOutlinecard from "./CourseOutlinecard";

const CourseOutline = () => {
  const [dataStat, setDataStat] = useState(false);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [videoarray, setVideoArray] = useState<any[]>([]);
  const [classidarray, setclassidarray] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const org = searchParams.get("org");
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();

  const orgContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  );

  const getUploadedVideo = async () => {
    let video_data = await orgContract.get_bootcamp_uploaded_video_link(
      org,
      id,
    );

    let classes_id_array = await orgContract.get_all_bootcamp_classes(org, id);

    if (video_data?.length === 0) {
      setDataStat(true);
    } else {
      Promise.all(
        video_data.map(async (item: any) => {
          return await getIPfsVideodata(item);
        }),
      )
        .then((resolvedData) => {
          setVideoArray(resolvedData);
          setclassidarray(classes_id_array);
        })
        .catch((error) => {
          console.error("Error fetching video data:", error);
        });
    }
  };

  const getIPfsVideodata = async (CID: string) => {
    const data = await fetchCIDContent(CID);
    return data;
  };

  useEffect(() => {
    getUploadedVideo();
  }, [wallet]);

  return (
    <div className="w-full max-w-[90%] h-full lg:h-[720px] mt-4 bg-[#FFFFFF] mx-auto rounded-xl border-[#D2D2D2] border-[1px] px-4 lg:px-8 overflow-auto lg:overflow-y-scroll">
      {dataStat && (
        <div className="h-[600px] w-full flex items-center justify-center">
          <h1>No Video upload</h1>
        </div>
      )}
      {!dataStat && (
        <div className="h-[600px] w-full overflow-y-scroll pt-10 px-10">
          {videoarray?.map((data, index) => {
            const matchedClass = classidarray.find(
              (classiddata) => Number(classiddata) == index,
            );
            return (
              <CourseOutlinecard
                key={index}
                videolink={data?.data?.courseData?.videoUrl}
                thumbnail={data?.data?.courseData?.thumbnailUrl}
                description={data?.data?.courseData?.description}
                topic={data?.data?.courseData?.topic}
                assignment={data?.data?.courseData?.assignment}
                status={false}
                classid={matchedClass}
              />
            );
          })}
        </div>
      )}
      <div className="flex items-center justify-center space-x-4 border-b-[1px] mt-2 h-[80px]">
        <h1 className="font-medium text-[16px] leading-[22px] underline">
          {videoarray.length} Lecture(s) available{" "}
        </h1>
      </div>
    </div>
  );
};

export default CourseOutline;
