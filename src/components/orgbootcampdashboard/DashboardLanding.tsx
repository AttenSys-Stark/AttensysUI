import {
  addclassmodal,
  createMeeting,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import Image from "next/image";
import Createmeeting from "./Createmeeting";
import DashboardTab from "./DashboardTab";
import Tophero from "./Tophero";
import UploadModal from "./UploadModal";
import DashboardContent from "./DashboardContent";

const DashboardLanding = (props: any) => {
  const [addClass, setAddclass] = useAtom(addclassmodal);
  const [meetingCreation, setMeetingCreation] = useAtom(createMeeting);

  return (
    <div className="bg-[#f4f7f9] w-full h-auto py-10">
      {addClass.modalstatus && <UploadModal status={addClass} />}
      {meetingCreation && <Createmeeting status={meetingCreation} />}
      <div className="w-full h-[220px] -mt-10 lg:hidden ">
        <Image
          alt="cyton"
          src="/cyton-photography.png"
          width={200}
          height={220}
          className="w-full h-full"
        />
      </div>

      <Tophero />

      <DashboardTab bootcampname={props.bootcampname} />
      <DashboardContent tabsection={props.tab} />
    </div>
  );
};

export default DashboardLanding;
