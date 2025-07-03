import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import {
  attendancesuccess,
  connectorAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import { Contract } from "starknet";
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";

const EventQRCode = ({ eventId }: { eventId: string }) => {
  const [scannerUrl, setScannerUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [attendanceOverlayStat, setattendanceOverlayStat] =
    useAtom(attendancesuccess);
  const [connector] = useAtom(connectorAtom);

  const [wallet] = useAtom(walletStarknetkit);

  const [connectorDataAccount] = useState<null | any>(
    connector?.wallet.account,
  );

  // Fetch the master QR code and establish WebSocket connection
  const fetchMasterQRCode = async () => {
    try {
      const response = await fetch(
        "https://attensys-1a184d8bebe7.herokuapp.com/api/generate-master-qr",
      );
      const data = await response.json();
      setQrUrl(data.qrCodeDataUrl);

      // Connect to the WebSocket server
      const ws = new WebSocket("wss://attensys-1a184d8bebe7.herokuapp.com");

      ws.onopen = () => {
        // Register the laptop with the session ID
        ws.send(
          JSON.stringify({
            type: "register-laptop",
            sessionId: data.sessionId,
          }),
        );
      };

      ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "action") {
          // Trigger action based on scanned data
          const data = JSON.parse(message.data);
          setattendanceOverlayStat(true);
          const eventContract = new Contract(
            attensysEventAbi,
            attensysEventAddress,
            //@ts-ignore
            wallet?.account,
          );
          const createEventCall = eventContract.populate("mark_attendance", [
            Number(data.eventId),
            data.attendeeaddress,
          ]);
          const result = await eventContract.mark_attendance(
            createEventCall.calldata,
          );
          //@ts-ignore
          wallet?.account?.provider
            .waitForTransaction(result.transaction_hash)
            .then(() => {})
            .catch((e: any) => {
              setattendanceOverlayStat(false);
            })
            .finally(() => {
              setattendanceOverlayStat(false);
            });
          //   // alert(`Action triggered with data: ${message.data}`);
        }
        setattendanceOverlayStat(false);
      };

      // Generate the scanner URL with session ID and WebSocket URL
      const url = new URL(`http://attensys.xyz/scanner/${eventId}`);
      url.searchParams.set("sessionId", data.sessionId);
      url.searchParams.set(
        "wsUrl",
        "wss://attensys-1a184d8bebe7.herokuapp.com",
      );
      setScannerUrl(url.toString());
    } catch (error) {
      console.error("Error fetching master QR code:", error);
    }
  };

  useEffect(() => {
    fetchMasterQRCode();
  }, [eventId]);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-md">
      {/* Display the master QR code */}
      {/* {qrUrl && <img src={qrUrl} alt="Master QR Code" />} */}

      {/* Display the scanner QR code */}
      {scannerUrl && (
        <QRCodeCanvas value={scannerUrl} size={200} fgColor="#4A90E2" />
      )}
    </div>
  );
};

export default EventQRCode;
