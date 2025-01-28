import React, { useState } from 'react'
import threevert from '@/assets/threevert.svg'
import Image from 'next/image'
import gridline from '@/assets/gridicons_create.svg'
import book from '@/assets/bookfall.svg'
import drop from '@/assets/droporg.svg'
import Mybootcamp from './Mybootcamp'
import Permissions from './Permissions'
import Registered from './Registered'
import { FaPlus } from "react-icons/fa6";
import {createbootcampoverlay} from '@/state/connectedWalletStarknetkitNext'
import { useAtom } from 'jotai'



const Organizationtabs = () => {
    const [mybootcampStat, setMyBootcampStat] = useState(true);
    const [PermissionsStat, setPermissionscampStat] = useState(false);
    const [RegisteredStat, setRegisteredStat] = useState(false);
  const [createOverlayStat, setCreateOverlayStat] = useAtom(createbootcampoverlay);



    const handlemybootcamp = () =>{
        setMyBootcampStat(!mybootcampStat)
        // setPermissionscampStat(false);
        // setRegisteredStat(false)
    }

    const handlePermission = () =>{
        // setMyBootcampStat(false)
        setPermissionscampStat(!PermissionsStat);
        // setRegisteredStat(false)
    }

    const handleregistered = () =>{
        // setMyBootcampStat(false)
        // setPermissionscampStat(false);
        setRegisteredStat(!RegisteredStat)
    }
    const handleCreateOverlay = () => {
        setCreateOverlayStat(true);
        setRegisteredStat(false)
        setPermissionscampStat(false);
    }

  return (
    <div className='h-auto w-full md:w-[90%] mx-auto flex mt-8 space-x-10 pb-12'>
        <div className='h-auto w-[30%] space-y-3 hidden sm:block'>
            <div className='h-[62px] bg-[#FFFFFF] rounded-xl flex items-center border-[1px] border-[#BCBCBC] space-x-3 px-10'>
                <Image src={threevert} alt='line' />
                <h1 className='text-[14px] leading-[19px] font-bold text-[#2D3A4B]'>Bootcamps</h1>
            </div>
            <div className='h-[62px] bg-[#FFFFFF] rounded-xl flex items-center border-[1px] border-[#BCBCBC] space-x-3 px-10'>
                <Image src={book} alt='line' />
                <h1 className='text-[14px] leading-[19px] font-bold text-[#2D3A4B]'>Permissions and Access</h1>
            </div>
            <div className='h-[62px] bg-[#FFFFFF] rounded-xl flex items-center border-[1px] border-[#BCBCBC] space-x-3 px-10'>
                <Image src={gridline} alt='line' />
                <h1 className='text-[14px] leading-[19px] font-bold text-[#2D3A4B]'>Registered Students</h1>
            </div>
        </div>

        <div className='h-auto w-full mx-auto md:w-[70%] space-y-3'>
            <div className='-ml-5'>
                <div className='h-[78px] bg-[#FFFFFF] rounded-t-xl flex items-center border-[1px] border-[#BCBCBC] justify-between px-10'>
                    <h1 className='text-[14px] md:text-[18px] leading-[22px] text-[#333333] font-semibold hidden sm:block'>My Bootcamps</h1>
                    <h1 className='text-[14px] md:text-[18px] leading-[22px] text-[#333333] font-semibold sm:hidden'>Bootcamps</h1>
                    <div className='flex space-x-7 items-center'>
                            <div onClick={handleCreateOverlay} className='flex space-x-1 text-[#5801A9] items-center cursor-pointer'>
                                <FaPlus className='h-[14px] w-[14px]' />
                                <h1 className='text-[14px] md:text-[14px] font-medium leading-[19px] underline'>Create bootcamp</h1>
                            </div>
                            <Image src={drop} alt='drop' onClick={handlemybootcamp} className='cursor-pointer hidden sm:block' />
                    </div>
                </div>
                {mybootcampStat && <Mybootcamp />}
            </div>

            <div className='-ml-5'>
                <div onClick={handlePermission} className='h-[78px] sm:bg-[#FFFFFF] rounded-t-xl hidden sm:flex items-center border-[1px] border-[#BCBCBC] justify-between px-10'>
                    <h1 className='text-[18px] leading-[22px] text-[#333333] font-semibold'>Permissions and Access</h1>
                    <Image src={drop} alt='drop' />   
                </div>
                <div className='text-[12px] text-[#5801A9] border-t border-b border-[#5801A9] sm:hidden text-center'>
                    Show More 
                </div>
                   {PermissionsStat && <Permissions />}
            </div>
            <div className='-ml-5'>
                <div onClick={handleregistered} className='h-[78px] bg-[#FFFFFF] rounded-t-xl flex items-center border-[1px] border-[#BCBCBC] justify-between px-10'>
                    <h1 className='text-[18px] leading-[22px] text-[#333333] font-semibold'>Registered students (3789)</h1>
                    <Image src={drop} alt='drop' />
                </div>
                {RegisteredStat && <Registered />}
            </div>
        </div>
    </div>
  )
}

export default Organizationtabs