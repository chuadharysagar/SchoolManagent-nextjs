import React from 'react'
import UserCard from '@/components/UserCard';
import CountChartContainer from '@/components/CountChartContainer';
import AttendenceChartContainer from '@/components/AttendenceChartContainer';
import FinanceChart from '@/components/FinanceChart';
import Annoucement from '@/components/Annoucement';
import EventCalenderContainer from '@/components/EventCalenderContainer';

const AdminPage = ({ searchParams
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {


  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* left menu  */}
      <div className='w-full lg:w-2/3 flex-col gap-8'>
        {/* user card  */}
        {/* top chart  */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type='admin' />
          <UserCard type='student' />
          <UserCard type='teacher' />
          <UserCard type='parent' />
        </div>

        {/* Midddle charts */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          {/* count chart */}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChartContainer />
          </div>


          {/* attendecne chart */}
          <div className='w-full lg:w-2/3 h-[450px]'>
            <AttendenceChartContainer />
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
        <EventCalenderContainer searchParams={searchParams} />
        <Annoucement />
      </div>

    </div>
  )
}

export default AdminPage;