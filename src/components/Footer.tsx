import React from 'react'
import { Button } from '@headlessui/react'
import Image from "next/image"
import Logo from "@/assets/Logo.svg"
import footerDesign from "@/assets/footer_design.svg"
import Link from 'next/link'


const Footer = () => {
  return (
    <div className='flex flex-col max-w-screen-2xl xl:mx-auto md:flex-row space-x-4 justify-between lg:mx-4 py-7 px-4 gap-4 w-full lg:w-[98%]'>
            <div className='bg-[#161313] relative overflow-hidden px-10 py-12 flex flex-col !items-start rounded-[15px] lg:rounded-[20px] w-full lg:w-[40%] lg:h-[380px] lg:flex-col text-white justify-center lg:pt-20'>
                   <div className='lg:h-[300px] space-y-2 lclg:w-[320px] w-full flex gap-4 lg:gap-0 flex-col items-start'>
                   <h1 className='font-semibold text-[25px] tracking-tight lg:tracking- leading-[1.1] lg:text-[34px]  lg:leading-[40px] flex text-left lg:w-[320px]'>Built by Geniuses, for Geniuses.</h1>
                    <p className='font-normal h-[100px] lg:h-full text-sm text-[#E4DBDB] lg:text-[16px] leading-[23px] flex text-left w-full xlg::w-[480px] pb-10'>Join 1000+ designers, innovators, and creators who have embraced excellence, innovation, and creativity.</p>
                    <Button className="lg:flex py-4 !mt-0 px-4 lg:px-2 rounded-lg bg-gradient-to-r from-[#9B51E0] to-[#4A90E2] lg:py-2 lg:h-[56px] items-center lg:w-[154px] text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
                       <div className="flex space-x-2 items-center font-semibold text-[16px]">
                        <div>
                        Get Started             
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                </svg>
                       </div>

                    </Button>
                   </div>
                   <Image src={footerDesign} alt="" width={275} height={276} className='absolute right-[-5%] bottom-[-15%]' />
            </div>

            <div className='bg-[#F4E8FF] !ml-0 lg:!ml-2.5 flex-col justify-between px-10 rounded-[15px] lg:rounded-[20px] w-full lg:w-[60%] h-full lg:h-[380px] lg:flex'>
                        <div className='flex flex-col lg:flex-row justify-between w-full mx-auto py-12'>
                                    <div className='flex flex-col gap-6 lg:gap-6 items-start md:flex-row lg:w-[60%] lg:justify-between'>
                                                <div className='space-y-3 lg:space-y-5'>
                                                    <h1 className='text-[19x] text-[#8D8484] leading-[18px] font-medium'>Product</h1>
                                                    <div className='space-y-2 text-[13px] font-medium leading-[18px]'>
                                                        <h1>Join Attensys</h1>
                                                        <h1>Verify certificates</h1>
                                                        <h1>Events</h1>
                                                        <h1>Certifcations</h1>
                                                    </div>
                                                </div>
                                                <div className='space-y-3 lg:space-y-5'>
                                                    <h1 className='text-[19x] text-[#8D8484] leading-[18px] font-medium'>Community</h1>
                                                    <div className='space-y-2 text-[13px] font-medium leading-[18px]'>
                                                        <h1>Attensys Community</h1>
                                                        <h1>Discord</h1>
                                                        <h1>Organizations</h1>
                                                        <h1>Get Support</h1>
                                                    </div>
                                                </div>
                                                <div className='space-y-3 lg:space-y-5'>
                                                    <h1 className='text-[19x] text-[#8D8484] leading-[18px] font-medium'>Learn</h1>
                                                    <div className='space-y-2 text-[13px] font-medium leading-[18px]'>
                                                        <h1>Courses</h1>
                                                        <h1>Bootcamps</h1>
                                                        <h1>Registeration</h1>
                                                        <h1>Game Design</h1>
                                                    </div>
                                                </div>
                                    </div>
                                    <Link href="/">
                                    <Image
                                            alt="Attensys Company"
                                            src={Logo}
                                            className="h-8 w-auto hidden lg:block"
                                            />
                                            </Link> 
                        </div>
                                
                        <div className='flex flex-col lg:flex-row gap-4 px-12 py-4 lg:pb-0 lg:mb-[70px] lg:px-0 justify-center items-center lg:items-start lg:justify-between w-full font-semibold text-[13px]'>
                                <Link href="/" className="block lg:hidden">
                                    <Image
                                        alt="Attensys Company"
                                        src={Logo}
                                        className="h-8 w-auto block lg:hidden"
                                    />
                                </Link>
                                <div className='flex'>
                                    <p>Privacy Policy</p>
                                    <p className="ml-2 lg:ml-7">Terms of Use</p>
                                </div>
                                {new Date().getFullYear()} with Attensys
                        </div>
            </div>
    </div>
  )
}

export default Footer