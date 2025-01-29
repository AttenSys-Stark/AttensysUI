import { Button, Input } from "@headlessui/react"
import React, { useState } from "react"
import Image from "next/image"
import downlaod from "@/assets/download.svg"
import filter from "@/assets/filter.png"
import check from "@/assets/check.svg"
import List from "./List"
import { guestdata } from "@/constants/data"

const Guestlist = () => {
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Calculate total pages
  const totalPages = Math.ceil(guestdata.length / itemsPerPage)

  // Get current page items
  const currentItems = guestdata.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const goToPage = (page: any) => {
    setCurrentPage(page)
  }

  const generatePageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 10

    // Always show the first page
    if (currentPage > 2) pageNumbers.push(1)

    // Show ellipsis if there are pages between the first page and current page range
    if (currentPage > 3) pageNumbers.push("...")

    // Show the range of pages around the current page
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages);
      i++
    ) {
      pageNumbers.push(i)
    }

    // Show ellipsis if there are pages between the current range and the last page
    if (currentPage < totalPages - 2) pageNumbers.push("...")

    // Always show the last page
    if (currentPage < totalPages - 1) pageNumbers.push(totalPages)

    return pageNumbers
  }

  // Handle pagination controls
  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }
  const handleChange = (event: { target: { value: any } }) => {
    setSearchValue(event.target.value)
  }

  return (
    <div className="h-auto w-full pb-10">
      {/* Stats section */}
      <div className="h-auto sm:h-[120px] md:h-[150px] w-[92%] sm:w-[85%] md:w-[80%] mx-auto bg-[#FFFFFF] rounded-lg flex flex-col md:flex-row justify-between items-center px-4 md:px-16 py-6 md:py-0 gap-4 md:gap-0">
        <div className="text-center md:text-left">
          <p className="text-[#2D3A4B] text-[16px] font-medium leading-[18px]">
            Your Guests
          </p>
          <h1 className="text-[#9B51E0] text-[29.7px] font-bold leading-[68.91px] opacity-40">
            39
          </h1>
        </div>
        <div className="hidden md:block w-[1px] h-[80%] bg-[#9696966E]"></div>
        <div className="text-center md:text-left">
          <p className="text-[#2D3A4B] text-[16px] font-medium leading-[18px]">
            Approved attendance
          </p>
          <h1 className="text-[#9B51E0] text-[29.7px] font-bold leading-[68.91px] opacity-40">
            31
          </h1>
        </div>
        <div className="hidden md:block w-[1px] h-[80%] bg-[#9696966E]"></div>
        <div className="text-center md:text-left">
          <p className="text-[#2D3A4B] text-[16px] font-medium leading-[18px]">
            Disapproved attendance
          </p>
          <h1 className="text-[#9B51E0] text-[29.7px] font-bold leading-[68.91px] opacity-40">
            3
          </h1>
        </div>
        <div className="hidden md:block w-[1px] h-[80%] bg-[#9696966E]"></div>
        <div className="text-center md:text-left">
          <p className="text-[#2D3A4B] text-[16px] font-medium leading-[18px]">
            Pending Attendance
          </p>
          <h1 className="text-[#9B51E0] text-[29.7px] font-bold leading-[68.91px] opacity-40">
            10
          </h1>
        </div>
      </div>

      <div className="h-[930px] w-[92%] sm:w-[85%] md:w-[80%] mx-auto bg-[#FFFFFF] mt-4 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between px-4 sm:px-8 md:px-16 pt-6 md:pt-10 gap-4 md:gap-0">
          <h1 className="text-[18px] font-medium leading-[22px] text-[#333333] mt-2">
            Guest list
          </h1>
          <div className="flex flex-col md:flex-row gap-4 md:space-x-8">
            <div className="relative w-full md:w-[550px] lclg:w-[380px]">
              <Input
                name="search by address"
                type="text"
                placeholder="        Search guest, wallet address, role..."
                value={searchValue}
                onChange={handleChange}
                className="w-[90%] clg:w-[70%] lclg:w-[90%] p-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
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
            <div className="flex gap-4 md:gap-8">
              <Button className="flex lg:flex rounded-lg bg-[#4A90E21F] py-2 px-4 lg:h-[42px] items-center w-full md:w-[125px] text-sm text-[#5801A9] data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
                <div className="flex space-x-4 items-center font-semibold text-[16px]">
                  <Image src={downlaod} alt="ticket" className="mr-2" />
                </div>
                <div className="text-[11px]">Download</div>
              </Button>

              <Button className="flex lg:flex rounded-lg bg-[#4A90E21F] py-2 px-4 lg:h-[42px] items-center w-full md:w-[90px] text-sm text-[#5801A9] data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
                <div className="flex space-x-4 items-center font-semibold text-[16px]">
                  <Image src={filter} alt="ticket" className="mr-2" />
                </div>
                <div className="text-[11px]">Filter</div>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[92%] mx-auto mt-6 h-[750px] overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3 min-w-[800px]">
            <thead>
              <tr className="h-[56px] text-[14px] bg-[#9B51E052] font-normal text-[#5801A9] leading-[19.79px]">
                <th className="w-[50px] px-4 rounded-tl-xl rounded-bl-xl">
                  <Image src={check} alt="ticket" />
                </th>
                <th className="text-center font-light">Name</th>
                <th className="text-center font-light">Address</th>
                <th className="text-center font-light">Status</th>
                <th className="text-center font-light">Role</th>
                <th className="text-center font-light">Reg date</th>
                <th className="text-center font-light rounded-tr-xl rounded-br-xl">
                  Actions
                </th>
              </tr>
            </thead>
            {currentItems.map((data, index) => {
              return (
                <List
                  key={index}
                  name={data.name}
                  address={data.address}
                  status={data.status}
                  role={data.role}
                  regdate={data.date}
                />
              )
            })}
          </table>
        </div>

        <div className="flex justify-center space-x-2 mt-4 pb-4 md:pb-0 overflow-x-auto px-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border-[#D0D5DD] border-[1px] rounded disabled:opacity-50"
          >
            {"<"}
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
                className={`px-4 py-2 rounded text-[14px] ${
                  currentPage == page
                    ? "bg-none text-[#000000] border-[#F56630] border-[1px]"
                    : "bg-none text-[#000000]"
                }`}
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
            {">"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Guestlist