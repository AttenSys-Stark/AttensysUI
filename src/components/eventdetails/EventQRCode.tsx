import { QRCodeCanvas } from "qrcode.react";
const EventQRCode = ({ eventId }: { eventId: string }) => {
  const scannerUrl = `${window.location.origin}/scanner/${eventId}`;

  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-md">
      <QRCodeCanvas value={scannerUrl} size={200} fgColor="#4A90E2" />
    </div>
  );
};

export default EventQRCode;
