import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const QrScannerComponent = ({ eventId }: { eventId: string }) => {
  const router = useRouter();
  const [isScannerLoading, setIsScannerLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleScan = (data: string | null) => {
    if (data) {
      console.info("Scanned QR Code:", data);
      setIsNavigating(true);
      router.push("/");
    }
  };

  const handleError = (error: unknown) => {
    console.error("QR Scan Error:", error);
  };

  useEffect(() => {
    return () => {
      setIsNavigating(false); // Cleanup when leaving the page
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen relative">
      {isScannerLoading && (
        <div className="absolute flex items-center justify-center inset-0 bg-black/50">
          <LoadingSpinner size="lg" colorVariant="white" />
        </div>
      )}

      <Scanner
        //@ts-ignore
        onScan={handleScan}
        onError={handleError}
        classNames={{
          video: "absolute top-0 left-0 w-full h-full object-cover",
        }}
        videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        onLoad={() => setIsScannerLoading(false)}
      />

      {isNavigating && (
        <div className="absolute flex items-center justify-center inset-0 bg-black/50">
          <LoadingSpinner size="lg" colorVariant="white" />
        </div>
      )}
    </div>
  );
};

export default QrScannerComponent;
