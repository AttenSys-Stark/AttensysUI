"use client"
import React from 'react'
import { coursestatusAtom,bootcampdropdownstatus } from "@/state/connectedWalletStarknetkitNext"
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown"
import { useAtom, useSetAtom } from "jotai"
import Coursedropdown from '@/components/courses/Coursedropdown'
import { useParams } from 'next/navigation'

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom); 
  const [bootcampdropstat, setbootcampdropstat] = useAtom(bootcampdropdownstatus)
    const params = useParams();
    const details = params.orgname;

    const handlePageClick = () => {
      setbootcampdropstat(false);
      setstatus(false);
  };
  
  return (
    <div onClick={handlePageClick}>
         {status && (<div className='fixed inset-0 bg-black opacity-5 backdrop-blur-sm'></div>)}
         {bootcampdropstat && (<div className='fixed inset-0 bg-black opacity-5 backdrop-blur-sm'></div>)}
       <div onClick={(e) => e.stopPropagation()} >
        <Coursedropdown />
        </div>
        <div onClick={(e) => e.stopPropagation()} > 
        <Bootcampdropdown />
        </div>
       
        <h1>{details}</h1>
        </div>
  )
}

export default Index