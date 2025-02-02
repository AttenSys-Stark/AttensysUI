
import React, { useState } from 'react'
import story from '@/assets/story.svg'
import Image from 'next/image'
import { Button } from '@headlessui/react'
import drop from '@/assets/drop.svg'
import Emailinput from './Emailinput'
import cross from '@/assets/cross.svg'
import share from '@/assets/share.svg'
import del from '@/assets/delete.svg'
import ChartData from './ChartData'

const Insight = () => {
    const [emailList, setEmailList] = useState<string[]>([]);

    const handleEmailsChange = (emails: string[]) => {
      setEmailList(emails);
    };

  return (
    <div className='h-auto pb-8 sm:pb-16 md:pb-32'>
        <div className='w-full px-5 sm:px-0 sm:w-[95%] md:w-[992px] h-[100%] mx-auto'>
            {/* Image container with responsive positioning */}
            <div className='w-[196px] h-[184px] rounded-lg overflow-hidden relative 
                          mx-auto sm:mx-0 md:mx-0
                          sm:mt-0 md:mt-0 mt-[380px]
                          sm:ml-0 md:ml-0 ml-[24px]'>
                <Image src={story} alt="story" objectFit="cover" layout='fill' />
            </div>

            {/* Event Name with responsive styles */}
            <h1 className='mt-3 font-bold leading-[68.91px] opacity-[0.43]
                          text-center sm:text-left md:text-left
                          text-[29.7px] sm:text-[29.7px] md:text-[29.7px]
                          text-[#A666E3] sm:text-[#ABADBA] md:text-[#ABADBA]'>
                Event Name
            </h1>

            <div>
                {/* Event Registration header and Past Week button */}
                <div className='flex flex-col sm:flex-row md:flex-row justify-between items-center gap-4 sm:gap-0 md:gap-0'>
                    <h1 className='font-medium text-[14px] sm:text-[16px] md:text-[16px] text-[#2D3A4B] 
                                  leading-[11.01px] sm:leading-[18.15px] md:leading-[18.15px]
                                  text-center sm:text-left md:text-left'>
                        Event Registration
                    </h1>
                    {/* Past Week button with mobile-specific positioning */}
                    <div className='w-full sm:w-auto md:w-auto order-1 sm:order-none md:order-none'>
                        <Button className='w-full sm:w-[154.14px] md:w-[154.14px] bg-[#2D3A4B91] text-[#FFFFFF] 
                                         font-light text-[14px] rounded-lg h-[39.39px] items-center flex justify-center
                                         px-[27px] py-[8.25px] gap-[8.25px]'>
                            <Image src={drop} alt='drop' className='mr-2'/>
                            Past Week
                        </Button>
                    </div>
                </div>

                {/* Charts and Stats section */}
                <div className='flex flex-col sm:flex-row md:flex-row justify-between mt-3 gap-4'>
                    {/* Chart container */}
                    <div className='w-full max-w-[353px] sm:max-w-none md:max-w-none sm:w-[582px] md:w-[582px] 
                                  h-[164.98px] sm:h-[272px] md:h-[272px] 
                                  bg-[#FFFFFF] rounded-lg mx-auto sm:mx-0 md:mx-0'>
                        <ChartData />
                    </div>
                    
                    {/* Stats card */}
                    <div className='w-full max-w-[364.52px] sm:max-w-none md:max-w-none sm:w-[396px] md:w-[396px] 
                                  h-[297px] sm:h-[272px] md:h-[272px] 
                                  bg-[#2D3A4B] rounded-lg shadow-sm mx-auto sm:mx-0 md:mx-0'>                 
                        <div className='flex flex-col sm:flex-row md:flex-row justify-between px-6 sm:px-14 md:px-14 pt-6 sm:pt-10 md:pt-10 pb-6'>
                            <div className='space-y-3 text-center sm:text-left md:text-left'>
                                <h1 className='text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]'>Total Registration</h1>
                                <h1 className='text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]'>36</h1>
                            </div>
                            <div className='space-y-3 text-center sm:text-left md:text-left mt-4 sm:mt-0 md:mt-0'>
                                <h1 className='text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]'>Highest Daily Reg</h1>
                                <h1 className='text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]'>Saturday</h1>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row md:flex-row justify-between px-6 sm:px-14 md:px-14 pb-6'>
                            <div className='space-y-3 text-center sm:text-left md:text-left'>
                                <h1 className='text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]'>Event Managers/hosts</h1>
                                <h1 className='text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]'>5</h1>
                            </div>
                            <div className='space-y-3 text-center sm:text-left md:text-left mt-4 sm:mt-0 md:mt-0'>
                                <h1 className='text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]'>Approvals Granted</h1>
                                <h1 className='text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]'>31</h1>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row md:flex-row justify-between px-6 sm:px-14 md:px-14 pb-4'>
                            <div className='space-y-3 text-center sm:text-left md:text-left'>
                                <h1 className='text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]'>Disapprovals</h1>
                                <h1 className='text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]'>3</h1>
                            </div>
                            <div className='space-y-3'></div>
                        </div>
                    </div>
                </div>

                {/* URL and Managers section */}
                <div className='w-full max-w-[396px] sm:max-w-none md:max-w-none sm:w-[992px] md:w-[992px] 
                              h-[382px] sm:h-[362px] md:h-[362px] 
                              bg-[#FFFFFF] rounded-lg mt-4 shadow-sm mx-auto sm:mx-0 md:mx-0'>
                    <div className='w-[90%] sm:w-[80%] md:w-[80%] mx-auto pt-6 sm:pt-12 md:pt-12'>
                        <h1 className='text-center sm:text-left md:text-left'>Event Registration URL</h1>
                        <div className='w-full max-w-[357.06px] sm:max-w-[626px] md:max-w-[626px] h-[60px] 
                                      border-[2px] rounded-2xl mt-5 mx-auto sm:mx-0 md:mx-0'>
                            <div className='flex flex-col sm:flex-row md:flex-row items-center justify-between p-4 sm:px-5 md:px-5 gap-4'>
                                <h1 className='sm:border-r-[2px] md:border-r-[2px] sm:h-[60px] md:h-[60px] 
                                             flex items-center sm:pr-4 md:pr-4 text-center sm:text-left md:text-left'>
                                    https://attensys.io
                                </h1>
                                <Button className='w-[142px] sm:w-[130px] md:w-[130px] bg-[#53545C45] text-[#333333] 
                                               font-semibold text-[12px] rounded-lg h-[42.93px] sm:h-[36px] md:h-[36px] 
                                               items-center flex justify-center'>
                                    Share Link
                                    <Image src={share} alt='share' className='ml-2'/>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className='w-[90%] sm:w-[80%] md:w-[80%] mx-auto pt-6 sm:pt-12 md:pt-12'>
                        <h1 className='text-center sm:text-left md:text-left'>Assigned Managers</h1>
                        <div className='flex flex-col sm:flex-row md:flex-row gap-3 items-center'>
                            <div className='w-full sm:w-[590px] md:w-[590px] h-[60px] border-[2px] rounded-2xl mt-5'>
                                <Emailinput onEmailsChange={handleEmailsChange} />
                            </div>
                            <Button className='w-full sm:w-[155px] md:w-[155px] bg-[#4A90E21F] text-[#5801A9] 
                                           font-normal text-[14px] rounded-lg h-[48px] items-center flex justify-center mt-5
                                           border sm:border-none md:border-none border-[#5801A9]'>
                                <Image src={cross} alt='cross' className='mr-2'/>
                                Assign manager
                            </Button>   
                        </div>
                    </div>
                </div>

                {/* Cancel Event button */}
                <div className='flex justify-center sm:justify-end md:justify-end mt-5'>
                    <Button className='w-[165px] bg-[#E0515152] text-[#730404] font-normal text-[14px] rounded-lg h-[48px] 
                                     items-center flex justify-center px-5 py-2.5 gap-2.5'>
                        <Image src={del} alt='delete' className='mr-2'/>
                        Cancel Event
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Insight