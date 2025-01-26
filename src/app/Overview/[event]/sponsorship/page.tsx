"use client"
import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const SponsorshipPage = () => {
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
             <div className="w-8 h-8 rounded-full bg-gray-200" />
           </div>
         </div>
       </div>
     </nav>

     <div className="bg-gray-100 border-b">
       <div className="max-w-[1200px] mx-auto px-6">
         <div className="flex overflow-x-auto whitespace-nowrap">
           <Link 
             href={`/Overview/${params.event}/insight`}
             className={getLinkStyle(`/Overview/${params.event}/insight`)}
           >
             Insights
           </Link>
           <Link 
             href={`/Overview/${params.event}/guestlist`}
             className={getLinkStyle(`/Overview/${params.event}/guestlist`)}
           >
             Guests list
           </Link>
           <Link 
             href={`/Overview/${params.event}/attendance`}
             className={getLinkStyle(`/Overview/${params.event}/attendance`)}
           >
             Attendance
           </Link>
           <Link 
             href={`/Overview/${params.event}/sponsorship`}
             className={`${getLinkStyle(`/Overview/${params.event}/sponsorship`)} flex items-center`}
           >
             Sponsorship
             <span className="ml-1 text-red-500">•</span>
           </Link>
         </div>
       </div>
     </div>

     <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
       <div className="bg-white rounded-lg border">
         <h2 className="p-4 text-lg font-medium">Sponsorships</h2>

         <div className="overflow-x-auto">
           <table className="w-full">
             <thead>
               <tr className="bg-gray-50 border-y">
                 <th className="px-4 py-3 text-sm text-left">Sponsors</th>
                 <th className="px-4 py-3 text-sm text-left">Amount</th>
                 <th className="px-4 py-3 text-sm text-left">Wallet address</th>
                 <th className="px-4 py-3 text-sm text-left">Time stamp</th>
                 <th className="px-4 py-3 text-sm text-left">Contact</th>
               </tr>
             </thead>
             <tbody>
               <tr className="border-b">
                 <td className="px-4 py-3">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                       Cr
                     </div>
                     <span className="text-sm">Cryptotesters</span>
                   </div>
                 </td>
                 <td className="px-4 py-3 text-sm">$1,000 USDT</td>
                 <td className="px-4 py-3 text-sm text-purple-600">0x5c956e61...de5232dc11</td>
                 <td className="px-4 py-3 text-sm">11 OCT, 2024 | 10:25 PM</td>
                 <td className="px-4 py-3"></td>
               </tr>
               <tr className="border-b">
                 <td className="px-4 py-3">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                       Ra
                     </div>
                     <span className="text-sm">Ramp</span>
                   </div>
                 </td>
                 <td className="px-4 py-3 text-sm">$1,000 USDT</td>
                 <td className="px-4 py-3 text-sm text-purple-600">0x5c956e61...de5232dc11</td>
                 <td className="px-4 py-3 text-sm">11 OCT, 2024 | 10:25 PM</td>
                 <td className="px-4 py-3"></td>
               </tr>
             </tbody>
           </table>
         </div>

         <div className="mt-8">
           <h3 className="px-4 py-2 text-sm font-medium text-red-500">Pending</h3>
           <table className="w-full">
             <thead>
               <tr className="bg-gray-50 border-y">
                 <th className="px-4 py-3 text-sm text-left text-red-500">Amount</th>
                 <th className="px-4 py-3 text-sm text-left text-red-500">Wallet address</th>
                 <th className="px-4 py-3 text-sm text-left text-red-500">Time stamp</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td className="px-4 py-3">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                       Ba
                     </div>
                     <span className="text-sm">$1,000 USDT</span>
                   </div>
                 </td>
                 <td className="px-4 py-3 text-sm text-purple-600">0x5c956e61...de5232dc11</td>
                 <td className="px-4 py-3 text-sm">11 OCT, 2024 | 10:25 PM</td>
               </tr>
             </tbody>
           </table>
         </div>
       </div>
     </main>
   </div>
 );
};

export default SponsorshipPage;