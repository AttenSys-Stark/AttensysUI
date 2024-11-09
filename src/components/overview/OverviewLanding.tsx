import React from 'react'
import OverviewDiscover from './OverviewDiscover'
import Tab from './Tab'
import Content from './Content'
const OverviewLanding = (props : any) => {
 
    return (
    <div className='h-auto w-full bg-[#F5F7FA]'>
        <OverviewDiscover eventsname={props.eventname} />
        <Tab />
        <Content />
    </div>
  )
}

export default OverviewLanding