import { Scanner } from "@yudiel/react-qr-scanner"
import { useRouter } from "next/navigation"

const QrScannerComponent = ({ eventId }: { eventId: string }) => {
  const router = useRouter()
  const handleScan = (data: string | null) => {
    if (data) {
      console.log("Scanned QR Code:", data)

      router.push("/")
    }
  }

  const handleError = (error: unknown) => {
    console.error("QR Scan Error:", error)
  }

  return (
    <div className="flex justify-center  h-screen">
      <Scanner
        // @ts-ignore
        onScan={handleScan}
        onError={handleError}
        classNames={{
          video: "absolute top-0 left-0 w-full h-full object-cover",
        }}
        videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  )
}

export default QrScannerComponent
