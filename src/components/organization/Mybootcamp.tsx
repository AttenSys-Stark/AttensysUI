import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Mybootcampcarousel from "./Mybootcampcarousel";
import { caroselldata } from "@/constants/data";
import { useRouter } from "next/navigation";
import {
  currentID,
  orgowneraddress,
} from "@/state/connectedWalletStarknetkitNext";
import { useSetAtom } from "jotai";
import MobileBootcampCard from "./MobileBootcampCard";

const Mybootcamp = (props: any) => {
  const router = useRouter();
  const setCurrentID = useSetAtom(currentID);
  const setOwnerAddress = useSetAtom(orgowneraddress);

  const handlebootcamproute = (
    props: string,
    id: any,
    org_owner_address: any,
  ) => {
    setCurrentID(id);
    setOwnerAddress(org_owner_address);
    router.push(
      `/Bootcamp/${props}/Outline/?id=${id}&org=${org_owner_address}`,
    );
  };
  console.log("dataa heerr", props.bootcampInfo);
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1440 },
      items: 4,
    },
    desktop_: {
      breakpoint: { max: 1440, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="h-auto w-full flex flex-col items-center bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-b-xl py-8">
      <div className="w-[100%] mx-auto md:flex flex-col items-center -z-0 hidden">
        <Carousel
          responsive={responsive}
          centerMode={false}
          containerClass="container"
          renderArrowsWhenDisabled={false}
          additionalTransfrom={0}
          arrows
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          autoPlay={false} // Enables auto-scrolling
          autoPlaySpeed={3000}
        >
          {props.bootcampInfo.map((data: any, index: any) => (
            <Mybootcampcarousel
              key={index}
              name={data.bootcamp_name}
              action="Ongoing"
              height="200px"
              width="200px"
              uri={data.bootcamp_ipfs_uri}
              onClick={() =>
                handlebootcamproute(
                  data.bootcamp_name,
                  Number(data.bootcamp_id),
                  data.address_of_org,
                )
              }
            />
          ))}
        </Carousel>
      </div>
      <div className="flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-4 justify-start px-3 py-5 items-start md:hidden">
        {props.bootcampInfo.slice(0, 3).map((data: any, index: any) => (
          <div
            className={`flex flex-col ${index === 2 && "hidden"} items-center gap-2`}
            key={index}
          >
            <MobileBootcampCard
              key={index}
              name={data.bootcamp_name}
              action="Ongoing"
              height="200px"
              width="200px"
              uri={data.bootcamp_ipfs_uri}
              onClick={() =>
                handlebootcamproute(
                  data.bootcamp_name,
                  Number(data.bootcamp_id),
                  data.address_of_org,
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mybootcamp;
