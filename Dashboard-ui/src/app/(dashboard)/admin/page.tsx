import React from 'react'
import UserCard from '@/components/UserCard';
import CountChart from '@/components/CountChart';
import AttendenceChart from '@/components/AttendenceChart';
import FinanceChart from '@/components/FinanceChart';
import EventCalander from '@/components/EventCalander';
import Annoucement from '@/components/Annoucement';


const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* left menu  */}
      <div className='w-full lg:w-2/3 flex-col gap-8'>
        {/* user card  */}
        {/* top chart  */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type='student' />
          <UserCard type='teacher' />
          <UserCard type='parent' />
          <UserCard type='staff' />
        </div>

        {/* Midddle charts */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          {/* count chart */}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChart />
          </div>


          {/* attendecne chart */}
          <div className='w-full lg:w-2/3 h-[450px]'>
            <AttendenceChart />
          </div>

        </div>

        {/* bottom chart finace chart  */}
        <div className='w-full h-[500px]'>
          <FinanceChart />
        </div>
      </div>



      {/* right menu  */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        {/* calander part  */}
        <EventCalander />
        <Annoucement />
      </div>

    </div>
  )
}

export default AdminPage;