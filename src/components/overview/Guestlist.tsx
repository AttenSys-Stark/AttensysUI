import check from "@/assets/check.svg";
import downlaod from "@/assets/download.svg";
import filter from "@/assets/filter.png";
import { guestdata } from "@/constants/data";
import { useEvents } from "@/hooks/useEvents";
import { useFetchCID } from "@/hooks/useFetchCID";
import {
  decimalToHexAddress,
  downloadCSV,
  formatTruncatedAddress,
} from "@/utils/formatAddress";
import { Button, Input } from "@headlessui/react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import List from "./List";

interface IParticipants {
  guest_name: string;
  guest_email: string;
  guest_address: string;
}
const Guestlist = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setloading] = useState<boolean>(false);
  const [eventParticipants, setEventParticipants] = useState<IParticipants[]>(
    [],
  );
  const { events, getEventsRegiseredUsers } = useEvents();
  const searchParams = useSearchParams();
  const params = useParams();
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();
  const eventName = decodeURIComponent((params.event as string) ?? "");
  const id = searchParams.get("id");
  const itemsPerPage = 10;

  const fetchEventParticipants = async (id: bigint) => {
    setloading(true);
    try {
      const eventParticipantsUriData = await getEventsRegiseredUsers(id);

      let eventParticipantsIpfsData = [];
      for (const participant of eventParticipantsUriData) {
        const userData = await obtainCIDdata(participant.attendee_uri);

        const participantDetails = {
          //@ts-ignore
          ...userData,
          student_address: decimalToHexAddress(participant.attendee_address),
        };
        eventParticipantsIpfsData.push(participantDetails);
      }
      setEventParticipants(
        eventParticipantsIpfsData.map((participant) => {
          return {
            guest_name: participant.student_name,
            guest_email: participant.student_email,
            guest_address: formatTruncatedAddress(participant.student_address),
          };
        }),
      );
    } catch (error) {
      console.error("Error fetching registered users:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchEventParticipants(BigInt(id));
  }, [id]);

  // Calculate total pages
  const totalPages = Math.ceil(eventParticipants.length / itemsPerPage);

  // Get current page items
  const currentItems = guestdata.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToPage = (page: any) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 10;

    // Always show the first page
    if (currentPage > 2) pageNumbers.push(1);

    // Show ellipsis if there are pages between the first page and current page range
    if (currentPage > 3) pageNumbers.push("...");

    // Show the range of pages around the current page
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages);
      i++
    ) {
      pageNumbers.push(i);
    }

    // Show ellipsis if there are pages between the current range and the last page
    if (currentPage < totalPages - 2) pageNumbers.push("...");

    // Always show the last page
    if (currentPage < totalPages - 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  // Handle pagination controls
  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const handleChange = (event: { target: { value: any } }) => {
    setSearchValue(event.target.value);
  };

  const obtainCIDdata = async (CID: string) => {
    try {
      //@ts-ignore
      const data = await fetchCIDContent(CID);

      return data?.data;
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
      throw error;
    }
  };

  /**
   * Exports the list of registered users to a CSV file.
   *
   **/
  const handleExport = () => {
    if (eventParticipants.length === 0) return;
    const csv = Papa.unparse(eventParticipants);
    downloadCSV(csv, `${eventName} participants.csv`);
  };
  return (
    <div className="h-auto w-full md:w-[90%] max-w-[992px] mx-auto pb-10 px-4 lg:px-0">
      <div className="h-auto bg-[#FFFFFF] rounded-lg flex flex-wrap justify-between items-center px-4 md:px-16 py-8 md:py-0 md:h-[150px]">
        <div className="w-[45%] md:w-auto mb-8 md:mb-0">
          <p className="text-[#2D3A4B] text-[16px] font-medium leading-[18px]">
            Your Guests
          </p>
          <h1 className="text-[#9B51E0] text-[29.7px] font-bold leading-[68.91px] opacity-40">
            {eventParticipants.length}
          </h1>
        </div>
        <div className="hidden md:block w-[1px] h-[80%] bg-[#9696966E]"></div>
        <div className="w-[45%] md:w-auto mb-8 md:mb-0">
          <p className="text-[#2D3A4B] text-[16px] font-medium leading-[18px]">
            Approved attendance
          </p>
          <h1 className="text-[#9B51E0] text-[29.7px] font-bold leading-[68.91px] opacity-40">
            31
          </h1>
        </div>
        <div className="hidden md:block w-[1px] h-[80%] bg-[#9696966E]"></div>
        <div className="w-[45%] md:w-auto">
          <p className="text-[#2D3A4B] text-[16px] font-medium leading-[18px]">
            Disapproved attendance
          </p>
          <h1 className="text-[#9B51E0] text-[29.7px] font-bold leading-[68.91px] opacity-40">
            3
          </h1>
        </div>
        <div className="hidden md:block w-[1px] h-[80%] bg-[#9696966E]"></div>
        <div className="w-[45%] md:w-auto">
          <p className="text-[#2D3A4B] text-[16px] font-medium leading-[18px]">
            Pending Attendance
          </p>
          <h1 className="text-[#9B51E0] text-[29.7px] font-bold leading-[68.91px] opacity-40">
            10
          </h1>
        </div>
      </div>

      <div className="p-4 lg:p-16 mx-auto bg-[#FFFFFF] mt-4 rounded-lg">
        <div className="relative">
          {/* Group 1: Header */}
          <div className="flex justify-between items-center h-12 mb-4">
            <h1 className="text-[18px] lg:w-[100px] font-medium leading-[22px] text-[#333333] w-[100px]">
              Guest list
            </h1>
            {/* Group 3: Buttons */}
            <div className="flex justify-between gap-1 md:gap-4 lg:pl-4 lg:w-3/12">
              <Button
                onClick={handleExport}
                className="rounded-lg bg-[#4A90E21F] py-2 px-4 lg:h-[42px] flex space-x-1 md:space-x-4 items-center text-sm text-[#2D3A4B] data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
              >
                <div className="flex space-x-4 items-center font-semibold text-[16px]">
                  <Image src={downlaod} alt="ticket" className="mr-2" />
                </div>
                <div className="text-[11px]">Download</div>
              </Button>

              <Button className="rounded-lg bg-[#4A90E21F] py-2 px-4 lg:h-[42px] flex space-x-1 md:space-x-4 items-center text-sm text-[#2D3A4B] data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
                <div className="font-semibold text-[16px]">
                  <Image src={filter} alt="ticket" className="mr-2" />
                </div>
                <div className="text-[11px]">Filter</div>
              </Button>
            </div>
          </div>

          {/* Group 2: Search Input - Goes to the bottom on mobile */}
          <div className="lg:absolute lg:left-[calc(100%/12*3)] lg:w-6/12 top-1 lg:w-[calc(100% - (100%/12 * 2) - 10px)]">
            <div className="relative">
              <Input
                name="search by address"
                type="text"
                placeholder="Search guest, wallet address, role..."
                value={searchValue}
                onChange={handleChange}
                className="w-full h-10 p-2 pl-8 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
              />
              {!searchValue && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 h-[750px] overflow-y-auto">
          {loading && <LoadingSpinner />}

          {!loading && eventParticipants.length > 0 && (
            <table className="w-full border-separate border-spacing-y-3 ">
              <thead>
                <tr className="h-[56px] text-[14px] bg-[#9B51E052] font-normal text-[#5801A9] leading-[19.79px]">
                  <th className="w-[50px] px-4 rounded-tl-xl rounded-bl-xl">
                    <Image src={check} alt="ticket" />
                  </th>
                  <th className=" text-center font-light">Name</th>
                  <th className=" text-center font-light">Address</th>
                  <th className=" text-center font-light">Status</th>
                  <th className=" text-center font-light">Role</th>
                  <th className="text-center font-light">Reg date</th>
                  <th className="text-center font-light rounded-tr-xl rounded-br-xl">
                    Actions
                  </th>
                </tr>
              </thead>
              {eventParticipants.map((data, index) => {
                return (
                  <List
                    key={index}
                    name={data.guest_name}
                    address={data.guest_address}
                    status="Approved"
                    role="N/A"
                    regdate="12/25/2024"
                  />
                );
              })}
            </table>
          )}

          {!loading && eventParticipants.length === 0 && (
            <div className="flex items-center justify-center">
              No registered users
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border-[#D0D5DD] border-[1px] text-[20px] rounded disabled:opacity-50"
          >
            &lsaquo;
          </button>
          {generatePageNumbers().map((page, index) =>
            page == "..." ? (
              <span key={index} className="px-2 text-base mt-2">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded text-[14px] ${currentPage == page ? "bg-none text-[#000000] border-[#9B51E0] border-[1px]" : "bg-none text-[#000000]"}`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border-[#D0D5DD] border-[1px] text-[20px] rounded disabled:opacity-50"
          >
            &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Guestlist;
