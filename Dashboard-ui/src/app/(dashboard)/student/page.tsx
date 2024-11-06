import React from 'react'
import EventCalander from '@/components/EventCalander';
import Annoucement from '@/components/Annoucement';
import BigCalenderContainer from '@/components/BigCalenderContainer';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';


const StudentPage = async () => {
  const { userId } = await auth();
  const classItem = await prisma.class.findMany({
    where: {
      students: {
        some: { id: userId! }
      }
    }
  })

  console.log(classItem);

  return (
    <div className='p-4 flex gap-4 flex-col xl:flex-row'>
      {/* left */}
      <div className='w-full xl:w-2/3'>
        <div className='h-full bg-white p-4 rounded-md'>
          <h1 className='text-xl font-semibold'>Schedule({classItem[0].name})</h1>

          {/* big calder to show all the schedules */}
          <BigCalenderContainer type='classId' id={classItem[0].id}/>
        </div>
      </div>
      {/* right  */}
      <div className='w-full xl:w-1/3 flex flex-col gap-8'>
        <EventCalander />
        <Annoucement />
      </div>
    </div>
  )
}

export default StudentPage;