"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';

const AttendancePage = () => {
 const params = useParams();
 const pathname = usePathname();

 const getLinkStyle = (path: string) => {
   const isActive = pathname === path;
   return `px-8 py-5 text-sm ${
     isActive 
     ? "border-b-2 border-purple-600 text-purple-600" 
     : "hover:text-gray-900"
   }`;
 };

 return (
   <div className="min-h-screen bg-gray-100 mt-14 overflow-x-hidden">
     <nav className="bg-gray-100 border-b top-16 z-40 overflow-x-auto">
       <div className="max-w-[1200px] mx-auto px-6">
         <div className="flex items-center justify-between py-3">
           <div className="flex items-center space-x-2 md:space-x-4">
             <button className="flex items-center gap-2 text-sm hover:text-gray-900">
               <span>◯</span> Discover
             </button>
             <span className="text-gray-300">|</span>
             <button className="flex items-center gap-2 text-sm hover:text-gray-900">
               <span>📁</span> My events
             </button>
             <span className="text-gray-300">|</span>
             <span className="text-sm">Event name</span>
           </div>
           <div className="flex items-center space-x-4">
             <button className="text-purple-600 text-sm flex items-center hover:text-purple-700">
               ✏️ Edit Event
             </button>
             <button className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-sm flex items-center hover:bg-gray-800">
               Event Page ↗
             </button>
             <Image
               src="/Overview/[event]/img/icon.png"
               alt="Event"
               width={49}
               height={49}
               className="w-[49px] h-[49px] rounded-lg"
             />
           </div>
         </div>
       </div>
     </nav>

     <div className="bg-gray-100 border-b">
       <div className="max-w-[1200px] mx-auto px-6">
         <div className="flex overflow-x-auto whitespace-nowrap">
           <Link href={`/Overview/${params.event}/insight`} className={getLinkStyle(`/Overview/${params.event}/insight`)}>
             Insights
           </Link>
           <Link href={`/Overview/${params.event}/guestlist`} className={getLinkStyle(`/Overview/${params.event}/guestlist`)}>
             Guests list
           </Link>
           <Link href={`/Overview/${params.event}/attendance`} className={getLinkStyle(`/Overview/${params.event}/attendance`)}>
             Attendance
           </Link>
           <Link href={`/Overview/${params.event}/sponsorship`} className={`${getLinkStyle(`/Overview/${params.event}/sponsorship`)} flex items-center`}>
             Sponsorship
             <span className="ml-1 text-red-500">•</span>
           </Link>
         </div>
       </div>
     </div>

     <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
       {/* Stats Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
         <div className="bg-white p-4 rounded-lg">
           <p className="text-sm text-gray-600 mb-1">Total scans</p>
           <p className="text-2xl text-purple-600">36</p>
         </div>
         <div className="bg-white p-4 rounded-lg">
           <p className="text-sm text-gray-600 mb-1">Confirmed scans</p>
           <p className="text-2xl text-purple-600">31</p>
         </div>
         <div className="bg-white p-4 rounded-lg">
           <p className="text-sm text-gray-600 mb-1">Error scans</p>
           <p className="text-2xl text-purple-600">3</p>
         </div>
       </div>

       {/* Attendance Section */}
       <div className="bg-white rounded-lg border">
         <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <h2 className="text-lg font-medium">Attendance</h2>
           <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
             <div className="flex-grow">
               <input
                 type="search"
                 placeholder="Search wallet address"
                 className="w-full px-4 py-2 border rounded-lg"
               />
             </div>
             <button className="px-4 py-2 bg-gray-900 text-white rounded-lg">
               Confirm Attendee
             </button>
           </div>
         </div>

         {/* QR Scanner */}
         <div className="flex justify-center py-8">
           <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
             <button className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-2">
               Scan QR Code
             </button>
           </div>
         </div>

         {/* Scan Results */}
         <div className="mt-8">
           <h3 className="px-4 py-2 text-sm font-medium">Scan Results</h3>
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead className="bg-purple-50">
                 <tr>
                   <th className="w-8 px-4 py-3"></th>
                   <th className="px-4 py-3 text-sm text-left">Name</th>
                   <th className="px-4 py-3 text-sm text-left">Wallet address</th>
                   <th className="px-4 py-3 text-sm text-left">Scan status</th>
                   <th className="px-4 py-3 text-sm text-left">Role</th>
                   <th className="px-4 py-3 text-sm text-left">Registration Date</th>
                 </tr>
               </thead>
               <tbody>
                 {[...Array(4)].map((_, index) => (
                   <tr key={index} className="border-t">
                     <td className="px-4 py-3">
                       <div className="w-4 h-4 rounded-full bg-green-500"></div>
                     </td>
                     <td className="px-4 py-3 text-sm text-purple-600">Akinbola Kehinde</td>
                     <td className="px-4 py-3 text-sm">1Lbd7...ZnX71</td>
                     <td className="px-4 py-3">
                       <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                         Confirmed
                       </span>
                     </td>
                     <td className="px-4 py-3 text-sm">N/A</td>
                     <td className="px-4 py-3 text-sm">11 OCT, 2024 | 10:25 PM</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>

           {/* Pagination */}
           <div className="p-4 flex justify-center">
             <div className="flex items-center gap-2">
               <button className="p-2">←</button>
               <button className="p-2">1</button>
               <button className="p-2">2</button>
               <button className="p-2 bg-purple-600 text-white rounded">3</button>
               <button className="p-2">4</button>
               <button className="p-2">5</button>
               <button className="p-2">6</button>
               <button className="p-2">→</button>
             </div>
           </div>
         </div>
       </div>
     </main>
   </div>
 );
};

export default AttendancePage;