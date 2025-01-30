import React from 'react'
import { guestdata, registereddata } from '@/constants/data'
import regavatar from '@/assets/regavatar.svg'
import Image from 'next/image'

const Registered = () => {
  return (
    <div className='h-auto w-full flex flex-col items-center bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-b-xl pt-3'>
    <table className="w-full border-collapse hidden md:flex md:flex-col">
        <thead className=''>
          <tr className="border-b border-gray-300 h-[40px] w-fit">
            <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">Email</th>
            <th className="text-left  px-4 text-[14px] leading-[22px] font-bold text-[#333333]">Wallet Address</th>
            <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">  Registered bootcamps</th>
            <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">Certifications</th>
            <th className="text-left px-4 text-[14px] leading-[22px] font-bold text-[#333333]">Joined</th>
          </tr>
        </thead>
      <tbody>
      {registereddata.map((data, index)=>{
          return  <tr key={index} className="border-b border-gray-300 h-[70px] hidden sm:block">
                        <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#333333]">{data.email}</td>
            <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#9B51E0]">{data.address}</td>
            <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#333333]">{data.registeredbootcamp} bootcamps</td>
            <td className="py-3 px-4"> <div className='flex items-center space-x-2'>
                <h1 className='text-[14px] leading-[22px] font-medium underline text-[#9B51E0]'>({data.certifications})View certifications</h1>
                <Image src={regavatar} alt='avatar' />
                </div>
            </td>
            <td className="py-3 px-4 text-[14px] font-medium leading-[22px] text-[#9B51E0]">{data.joined} mos ago</td>
          </tr>
            })}
      </tbody>
    </table>
    
    <table className='md:hidden w-full border-collapse text-[12px] text-[#A666E3]'>
      <thead>
        <tr>
          <th className='text-left px-4 text-[12px] leading-[22px]'>Name</th>
          <th className='text-left px-4 text-[12px] leading-[22px]'>Wallet Address</th>
          <th className='text-left px-4 text-[12px] leading-[22px]'>Status</th>
        </tr>
      </thead>

      <tbody>
      {
              guestdata.slice(0, 10).map((data, index) => {
                return (
                  <tr key={index}>
                    <td className='py-3 px-4'>{data.name}</td>
                    <td className='py-3 px-4'>{data.address}</td>
                    <td className='py-3 px-4'>
                      <div className='bg-[#C4FFA2] px-2 py-1 rounded-lg text-green-500'>
                        {data.status}
                      </div>
                    </td>
                  </tr>
                )
              })
            }
            {/* Include Pagination somewhere in this mapping */}
      </tbody>
    </table>
  </div>
  )
}

export default Registered