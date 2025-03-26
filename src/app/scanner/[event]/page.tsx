"use client";

import QrScannerComponent from "@/components/eventdetails/QRScanner";
import { useParams } from "next/navigation";
import Scanner from "@/components/eventdetails/Scanner";

const ScannerPage = () => {
  const params = useParams();
  const eventId = params.eventId as string;
  return <QrScannerComponent eventId={eventId} />;
  // return <Scanner eventId={eventId} />;
};

export default ScannerPage;
