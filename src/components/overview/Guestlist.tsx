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
    <div className="h-auto w-full pb-4 sm:pb-6 md:pb-10">
      {/* Stats section */}
      <div className="h-auto sm:h-[150px] w-[95%] md:w-[80%] mx-auto bg-[#FFFFFF] rounded-lg overflow-x-auto">
        <div className="flex min-w-[800px] sm:min-w-0 justify-between items-center px-4 sm:px-8 md:px-16 py-4 sm:py-0">
          <div className="text-center sm:text-left">
            <p className="text-[#2D3A4B] text-[14px] sm:text-[16px] font-medium leading-[18px]">
              Your Guests
            </p>
            <h1 className="text-[#9B51E0] text-[24px] sm:text-[29.7px] font-bold leading-[40px] sm:leading-[68.91px] opacity-40">
              39
            </h1>
          </div>
          <div className="w-[1px] h-[80%] bg-[#9696966E]"></div>
          <div>
            <p className="text-[#2D3A4B] text-[14px] sm:text-[16px] font-medium leading-[18px]">
              Approved attendance
            </p>
            <h1 className="text-[#9B51E0] text-[24px] sm:text-[29.7px] font-bold leading-[40px] sm:leading-[68.91px] opacity-40">
              31
            </h1>
          </div>
          <div className="w-[1px] h-[80%] bg-[#9696966E]"></div>
          <div>
            <p className="text-[#2D3A4B] text-[14px] sm:text-[16px] font-medium leading-[18px]">
              Disapproved attendance
            </p>
            <h1 className="text-[#9B51E0] text-[24px] sm:text-[29.7px] font-bold leading-[40px] sm:leading-[68.91px] opacity-40">
              3
            </h1>
          </div>
          <div className="w-[1px] h-[80%] bg-[#9696966E]"></div>
          <div>
            <p className="text-[#2D3A4B] text-[14px] sm:text-[16px] font-medium leading-[18px]">
              Pending Attendance
            </p>
            <h1 className="text-[#9B51E0] text-[24px] sm:text-[29.7px] font-bold leading-[40px] sm:leading-[68.91px] opacity-40">
              10
            </h1>
          </div>
        </div>
      </div>

      <div className="min-h-screen sm:h-[930px] w-[95%] md:w-[80%] mx-auto bg-[#FFFFFF] mt-4 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between px-4 sm:px-8 md:px-16 pt-6 sm:pt-10 gap-4">
          <h1 className="text-[16px] sm:text-[18px] font-medium leading-[22px] text-[#333333]">
            Guest list
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:space-x-8">
            <div className="relative w-full sm:w-[380px] md:w-[550px]">
              <Input
                name="search by address"
                type="text"
                placeholder="Search guest, wallet address, role..."
                value={searchValue}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl"
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
            <div className="flex gap-2">
              <Button className="flex-1 sm:flex rounded-lg bg-[#4A90E21F] py-2 px-4 h-[42px] items-center justify-center">
                <div className="flex items-center gap-2">
                  <Image src={downlaod} alt="download" className="w-4 h-4" />
                  <span className="text-[11px] text-[#5801A9]">Download</span>
                </div>
              </Button>
              <Button className="flex-1 sm:flex rounded-lg bg-[#4A90E21F] py-2 px-4 h-[42px] items-center justify-center">
                <div className="flex items-center gap-2">
                  <Image src={filter} alt="filter" className="w-4 h-4" />
                  <span className="text-[11px] text-[#5801A9]">Filter</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[95%] sm:w-[92%] mx-auto mt-6 overflow-x-auto">
          <table className="w-full min-w-[800px] border-separate border-spacing-y-3">
            <thead>
              <tr className="h-[46px] sm:h-[56px] text-[12px] sm:text-[14px] bg-[#9B51E052] font-normal text-[#5801A9] leading-[19.79px]">
                <th className="w-[50px] px-4 rounded-tl-xl rounded-bl-xl">
                  <Image src={check} alt="check" />
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

        <div className="flex justify-center space-x-1 sm:space-x-2 mt-4 px-2 sm:px-4 overflow-x-auto">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-2 sm:px-4 py-2 border-[#D0D5DD] border-[1px] rounded disabled:opacity-50"
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
                className={`px-2 sm:px-4 py-2 rounded text-[14px] ${
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
            className="px-2 sm:px-4 py-2 border-[#D0D5DD] border-[1px] rounded disabled:opacity-50"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Guestlist
