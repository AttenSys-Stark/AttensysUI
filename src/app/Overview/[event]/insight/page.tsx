"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import nftImage from '../img/nft.png';
import jackImage from '@/app/overview/[event]/img/jack.png';

import { useParams, usePathname} from 'next/navigation';

const InsightPage = () => {
    const params = useParams();
    const event = params.event;
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
      {/* Navigation */}
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

      {/* Tabs */}
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

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Event Profile */}
        <div className="mb-8">
        <Image 
          src={jackImage} 
          alt="Event"  
          // className="w-19 h-16 md:w-19 md:h-19 rounded-lg bg-yellow-100"
          width={196}
          height={184}
          className="w-[196px] h-[184px] rounded-tl-[15px] rounded-tr-none rounded-br-none rounded-bl-none object-cover"
        />

          <h1 className="text-3xl font-bold mt-7 text-gray-300">Event Name</h1>
          <p className="text-gray-900 text-lg mt-7 mb-2">Event Registration</p>
        </div>

        <div className="justify-end flex mt-0 mb-3">
            <button className="px-3 py-1.5 bg-gray-300 rounded text-sm text-gray-800 hover:bg-gray-200">
            Past Week ▾
            </button>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="md:col-span-2 bg-white rounded-xl border p-6">
            <div className="h-[200px] md:h-[300px] bg-white"> 
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <path
                  d="M 50 180 L 150 180 L 250 180 L 350 40"
                  stroke="#6B46C1"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="50" cy="180" r="4" fill="#6B46C1"/>
                <circle cx="150" cy="180" r="4" fill="#6B46C1"/>
                <circle cx="250" cy="180" r="4" fill="#6B46C1"/>
                <circle cx="350" cy="40" r="4" fill="#6B46C1"/>
              </svg>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-900 rounded-xl p-6 text-white">
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm">Total Registration</p>
                <p className="text-2xl mt-1">36</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Highest Daily Reg</p>
                <p className="text-2xl mt-1">Saturday</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Event Managers/hosts</p>
                <p className="text-2xl mt-1">5</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Approvals Granted</p>
                <p className="text-2xl mt-1">31</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Disapprovals</p>
                <p className="text-2xl mt-1">3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 mb-5">

            {/* Registration URL */}
            <div className="mb-8 pt-10 px-4 md:pl-10 md:pr-10 md:mr-20">
                <h3 className="text-sm font-medium mb-4">Event Registration URL</h3>
                <div className="flex rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    <input 
                        type="text" 
                        value="https://attensys.io" 
                        readOnly
                        className="flex-1 px-4 py-3 bg-transparent outline-none"
                    />
                    <button className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2">
                        Share Link <span className="transform rotate-45">↗</span>
                    </button>
                </div>
            </div>

            {/* Assigned Managers */}
            <div className="mb-8 pt-10 px-4 md:pl-10 md:pr-10 md:pb-11">
                <h3 className="text-sm font-medium mb-4">Assigned Managers</h3>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="w-full md:flex-1 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            <div className="px-3 py-2 bg-gray-200 rounded-md flex items-center gap-2">
                                gracy@gmail.com
                                <button className="w-5 h-5 rounded-full bg-black text-gray-400 flex items-center justify-center text-sm">×</button>
                            </div>
                            <div className="px-3 py-2 bg-gray-200 rounded-md flex items-center gap-2">
                                gracy@gmail.com
                                <button className="w-5 h-5 rounded-full bg-black text-gray-400 flex items-center justify-center text-sm">×</button>
                            </div>
                        </div>
                    </div>
                    <button className="w-full md:w-auto px-4 py-2 bg-blue-50 text-purple-600 rounded-lg flex items-center gap-2 justify-center md:justify-start">
                    <span>+</span> Assign manager
                    </button>
                </div>
            </div>

        </div>

        {/* Cancel Event */}
        <div className="flex justify-end">
          <button className="px-4 py-2 mb-11 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center gap-2">
            🗑 Cancel Event
          </button>
        </div>
      </main>
    </div>
  );
};

export default InsightPage;