"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QrScannerComponentProps {
  eventId: string;
}

const Scanner = ({ eventId }: QrScannerComponentProps) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Extract session ID and WebSocket URL from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("sessionId");
    const wsUrl = urlParams.get("wsUrl");

    if (!sessionId || !wsUrl) {
      console.error("Session ID or WebSocket URL is missing");
      return;
    }

    // Connect to the WebSocket server
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // Register the phone with the session ID
      ws.send(JSON.stringify({ type: "register-phone", sessionId }));
    };

    // Initialize the QR code scanner
    const html5QrCodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
        //@ts-ignore
        facingMode: "environment", // Use the rear camera
      },
      false, // Verbose mode (set to true for debugging)
    );

    scannerRef.current = html5QrCodeScanner;

    html5QrCodeScanner.render(
      (scannedData: string) => {
        // Send scanned data to the server
        ws.send(JSON.stringify({ type: "scan", sessionId, scannedData }));
        // alert(`Scanned data: ${scannedData}`);
      },
      (error: string) => {
        console.error("QR code scan error:", error);
      },
    );

    // Clean up the scanner on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [eventId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Scan a QR Code</h1>
      <div
        id="qr-reader"
        style={{
          width: "400px",
          height: "400px",
          border: "2px solid #4A90E2",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#ffffff",
        }}
      ></div>
    </div>
  );
};

export default Scanner;
