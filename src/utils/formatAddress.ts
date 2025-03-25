import { getChecksumAddress } from "starknet";

const normalizeAddress = (address: string) =>
  getChecksumAddress(address) as string;

const formatTruncatedAddress = (address: string) => {
  const normalized = normalizeAddress(address);
  const hex = normalized.slice(0, 2);
  const start = normalized.slice(2, 6);
  const end = normalized.slice(-4);
  return `${hex}${start}…${end}`;
};

const formatFullAddress = (address: string) => {
  const normalized = normalizeAddress(address);
  const hex = normalized.slice(0, 2);
  const rest = normalized.slice(2);
  const parts = rest.match(/.{1,4}/g) || [];
  return `${hex} ${parts.join(" ")}`;
};

function decimalToHexAddress(decimalAddress: any) {
  // Convert decimal address to hex removing any decimal points
  let hexAddress = BigInt(decimalAddress).toString(16);

  //Ensure the address is 64 characters long (32 bytes)
  hexAddress = hexAddress.padStart(64, "0");

  // Add 0x prefix
  return "0x" + hexAddress;
}

function FormatDateFromUnix(date: bigint) {
  // Convert Unix timestamp to JavaScript Date object
  const dateObj = new Date(Number(date) * 1000); // Convert to milliseconds

  // Format date (e.g., "Saturday, October 12")
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long", // Full weekday name (e.g., "Saturday")
    month: "long", // Full month name (e.g., "October")
    day: "numeric", // Day of the month (e.g., "12")
  });

  // Format time (e.g., "8:30 AM")
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Ensure AM/PM format
  });

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  if (link.download !== undefined) {
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(url);
  }
  URL.revokeObjectURL(url);
}

export {
  normalizeAddress,
  formatTruncatedAddress,
  formatFullAddress,
  decimalToHexAddress,
  FormatDateFromUnix,
  downloadCSV,
};
