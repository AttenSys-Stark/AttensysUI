"use client";

import React, { useState } from "react";
import { guestdata, registereddata } from "@/constants/data";
import regavatar from "@/assets/regavatar.svg";
import Image from "next/image";

const Registered = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(guestdata.length / itemsPerPage);

  // Get current page items
  const currentItems = guestdata.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
  const goToPage = (page: any) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-auto w-full flex flex-col items-center px-0 bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-b-xl pt-3">
      <div className="hidden lg:block px-0 mx-0 w-[100%] h-[100%]">
        <table className="w-full border-collapse">
          <thead className="">
            <tr className="border-b border-gray-300 h-[40px] w-fit">
              <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">
                Email
              </th>
              <th className="text-left  px-4 text-[14px] leading-[22px] font-bold text-[#333333]">
                Wallet Address
              </th>
              <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">
                {" "}
                Registered bootcamps
              </th>
              <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">
                Certifications
              </th>
              <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {registereddata.map((data, index) => {
              return (
                <tr key={index} className="border-b border-gray-300 h-[70px]">
                  <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#333333]">
                    {data.email}
                  </td>
                  <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#9B51E0]">
                    {data.address}
                  </td>
                  <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#333333]">
                    {data.registeredbootcamp} bootcamps
                  </td>
                  <td className="py-3 px-4">
                    {" "}
                    <div className="flex items-center space-x-2">
                      <h1 className="text-[14px] leading-[22px] font-medium underline text-[#9B51E0]">
                        ({data.certifications})View certifications
                      </h1>
                      <Image src={regavatar} alt="avatar" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#9B51E0]">
                    {data.joined} mos ago
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <table className="lg:hidden w-full border-collapse text-[12px] text-[#A666E3]">
        <thead>
          <tr>
            <th className="text-left px-4 text-[12px] leading-[22px]">Name</th>
            <th className="text-left px-4 text-[12px] leading-[22px]">
              Wallet Address
            </th>
            <th className="text-left px-4 text-[12px] leading-[22px]">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((data, index) => {
            return (
              <tr key={index}>
                <td className="py-3 px-4">{data.name}</td>
                <td className="py-3 px-4">{data.address}</td>
                <td className="py-3 px-4">
                  <div className="bg-[#C4FFA2] px-2 py-1 rounded-lg text-green-500 w-fit text-center">
                    {data.status}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="flex justify-center space-x-2 pb-4 pt-10">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-1.5 border-[#D0D5DD] border-[1px] rounded disabled:opacity-50"
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
              className={`px-4 py-1.5 rounded text-[14px] ${currentPage == page ? "bg-none text-[#000000] border-[#9B51E0] border-[1px]" : "bg-none text-[#000000]"}`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-1.5 border-[#D0D5DD] border-[1px] text-sm rounded disabled:opacity-50"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Registered;

// import React from 'react'
// import { registereddata } from '@/constants/data'
// import regavatar from '@/assets/regavatar.svg'
// import Image from 'next/image'

// const Registered = () => {
//   return (
//     <div className='h-auto w-full flex flex-col items-center bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-b-xl pt-3'>
//     <table className="w-full border-collapse">
//     <thead className=''>
//           <tr className="border-b border-gray-300 h-[40px]">
//             <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">Email</th>
//             <th className="text-left  px-4 text-[14px] leading-[22px] font-bold text-[#333333]">Wallet Address</th>
//             <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">  Registered bootcamps</th>
//             <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">Certifications</th>
//             <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">Joined</th>
//           </tr>
//         </thead>
//       <tbody>
//       {registereddata.map((data, index)=>{
//           return  <tr key={index} className="border-b border-gray-300 h-[70px]">
//                         <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#333333]">{data.email}</td>
//             <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#9B51E0]">{data.address}</td>
//             <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#333333]">{data.registeredbootcamp} bootcamps</td>
//             <td className="py-3 px-4"> <div className='flex items-center space-x-2'>
//                 <h1 className='text-[14px] leading-[22px] font-medium underline text-[#9B51E0]'>({data.certifications})View certifications</h1>
//                 <Image src={regavatar} alt='avatar' />
//                 </div>
//             </td>
//             <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#9B51E0]">{data.joined} mos ago</td>
//           </tr>
//             })}
//       </tbody>
//     </table>
//   </div>
//   )
// }

// export default Registered
