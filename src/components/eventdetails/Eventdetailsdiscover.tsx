import React from 'react'
import Image from 'next/image'
import moon from '@/assets/moon.svg'
import purple from '@/assets/purple.svg'
import top from '@/assets/top.svg'
import { useRouter } from 'next/navigation'



const Eventdetailsdiscover = (props: any) => {
  const router = useRouter();
  

  
  return (
    <div className='h-[100px] clg:h-[80px] lg:[70px] lclg:[60px] flex justify-between w-[90%] mx-auto items-center'>
        <div className='flex w-[400px] clg:w-[380px] lclg:w-[400px] space-x-8 items-center'>
            <div className='flex space-x-3 items-center cursor-pointer'>
            <Image src={moon} alt='moon' />
            <h1>Discover</h1>
            </div>
            <div className="w-[1px] h-[24px] bg-[#9B51E0]"></div>
            <div className='flex space-x-3 items-center cursor-pointer'>
            <Image src={purple} alt='moon' />
            <h1 className='text-[#5801A9]'>{props.name}</h1>
            </div>
        </div>
        <Image src={top} alt='moon' />
    </div>
  )
}

export default Eventdetailsdiscover