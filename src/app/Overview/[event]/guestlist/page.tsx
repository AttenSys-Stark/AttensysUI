"use client"
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const GuestListPage = () => {
    const params = useParams();
    const event = params.event;
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
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
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
                    className="px-8 py-5 text-sm hover:text-gray-900" 
                    >
                    Insights
                    </Link>
                    <Link
                    href={`/Overview/${params.event}/guestlist`}
                    className="px-8 py-5 border-b-2 border-purple-600 text-purple-600 text-sm" 
                    >
                    Guests list  
                    </Link>
                    <Link
                    href={`/Overview/${params.event}/attendance`}
                    className="px-8 py-5 text-sm hover:text-gray-900"
                    >
                    Attendance
                    </Link>
                    <Link
                    href={`/Overview/${params.event}/sponsorship`}
                    className="px-8 py-5 text-sm hover:text-gray-900 flex items-center"
                    >
                    Sponsorship
                    <span className="ml-1 text-red-500">•</span>
                    </Link>
                </div>
            </div>
        </div>

      {/* Stats Cards */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Your Guests</p>
            <p className="text-2xl text-purple-600">36</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Approved attendance</p>
            <p className="text-2xl text-purple-600">31</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Disapproved attendance</p>
            <p className="text-2xl text-purple-600">3</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Pending Attendance</p>
            <p className="text-2xl text-purple-600">10</p>
          </div>
        </div>

        {/* Guest List Section */}
        <div className="bg-white rounded-lg border">
          <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-medium">Guest List</h2>
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
              <div className="flex-grow">
                <input
                  type="search"
                  placeholder="Search guest, wallet address, role..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                  <span>⬇️</span> Download
                </button>
                <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                  <span>🔍</span> Filter
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-4 py-3 text-sm text-left">Name</th>
                  <th className="px-4 py-3 text-sm text-left">Wallet address</th>
                  <th className="px-4 py-3 text-sm text-left">Status</th>
                  <th className="px-4 py-3 text-sm text-left">Role</th>
                  <th className="px-4 py-3 text-sm text-left">Registration date</th>
                  <th className="px-4 py-3 text-sm text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-3 text-sm text-purple-600">Akinbola Kehinde</td>
                    <td className="px-4 py-3 text-sm">1Lbd7...ZnX71</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Approved
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">N/A</td>
                    <td className="px-4 py-3 text-sm text-purple-600">12/25/2024</td>
                    <td className="px-4 py-3">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        ℹ️
                      </button>
                    </td>
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
      </main>
    </div>
  );
};

export default GuestListPage;