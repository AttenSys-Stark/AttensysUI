import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

const EventQRCode = ({ eventId }: { eventId: string }) => {
  const [scannerUrl, setScannerUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  // Fetch the master QR code and establish WebSocket connection
  const fetchMasterQRCode = async () => {
    try {
      const response = await fetch(
        "https://attensys-1a184d8bebe7.herokuapp.com/api/generate-master-qr",
      );
      const data = await response.json();
      console.log("check data here", data);
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

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "action") {
          // Trigger action based on scanned data
          console.log("Scanned data:", message.data);
          // alert(`Action triggered with data: ${message.data}`);
        }
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
