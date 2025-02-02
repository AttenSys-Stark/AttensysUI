import React from 'react'
import Sponsorlist from './Sponsorlist'
import {approvedsponsors,pendingsponsors} from '@/constants/data'

const Sponsorship = () => {
  return (
    <div className="h-auto w-full pb-6 md:pb-10">
      <h1 className='mb-3 md:mb-5 w-[92%] sm:w-[85%] md:w-[80%] mx-auto font-semibold text-[18px] text-[#333333] px-4 md:px-0'>
        Sponsorship
      </h1>

      <div className='h-[360px] rounded-lg w-[92%] sm:w-[85%] md:w-[80%] mx-auto bg-[#FFFFFF] border-[1px] border-[#DEDEDE] overflow-x-auto overflow-y-auto'>
        <div className="min-w-[800px]">
          <table className="w-full border-spacing-y-3">
            <thead>
              <tr className="h-[56px] text-[14px] border-b-[2px] font-normal leading-[19.79px]">
                <th className="text-center font-light border-r-[2px] border-[#E9EBEC]">Sponsors</th>
                <th className="text-center font-light border-r-[2px] border-[#E9EBEC]">Amount</th>
                <th className="text-center font-light border-r-[2px] border-[#E9EBEC]">Wallet address</th>
                <th className="text-center font-light border-r-[2px] border-[#E9EBEC]">Time stamp</th>
                <th className="text-center font-light">Contact</th>
              </tr>
            </thead>
            <tbody>
              {approvedsponsors.map((data, index) => (
                <Sponsorlist 
                  key={index} 
                  name={data.name} 
                  icon={data.icon} 
                  address={data.address} 
                  amount={data.amount} 
                  time={data.time} 
                />
              ))}
            </tbody>
          </table>

          <table className="w-full border-spacing-y-3 border-b-[2px]">
            <thead>
              <tr className="h-[56px] text-[14px] border-y-[2px] font-normal leading-[19.79px]">
                <th className="text-center font-light text-[#DC1D16]">Pending</th>
                <th className="text-center font-light text-[#DC1D16]">Amount</th>
                <th className="text-center font-light text-[#DC1D16]">Wallet address</th>
                <th className="text-center font-light text-[#DC1D16]">Time stamp</th>
              </tr>
            </thead>
            <tbody>
              {pendingsponsors.map((data, index) => (
                <Sponsorlist 
                  key={index} 
                  name={data.name} 
                  icon={data.icon} 
                  address={data.address} 
                  amount={data.amount} 
                  time={data.time} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Sponsorship