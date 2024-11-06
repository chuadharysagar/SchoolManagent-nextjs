import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const Annoucement = async () => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    const roleConditions = {
        teacher: { lessons: { some: { teacherId: userId! } } },
        student: { students: { some: { id: userId! } } },
        parent: { students: { some: { parentId: userId! } } },
    };


    const data = await prisma.announcement.findMany({
        take: 3,
        orderBy: { date: "desc" },
        where: {
          ...(role !== "admin" && {
            OR: [
              { classId: null },
              { class: roleConditions[role as keyof typeof roleConditions] || {} },
            ],
          }),
        },
      });

return (
    <div className='bg-white rounded-md p-4'>
        <div className='flex justify-between items-center'>
            <h1 className='text-xl font-semibold'>Annoucements</h1>
            <span className='text-xs text-gray-400'>View All</span>
        </div>
        {data[0] && <div className='flex flex-col gap-4 mt-4'>
            <div className='bg-sky rounded-md p-4'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-medium'>{data[0].title}</h1>
                    <span className='text-sm text-gray-400 bg-white rounded-md py-1 px-1'>{new Intl.DateTimeFormat("en-us").format(data[0].date)}</span>
                </div>
                <p className='text-sm text-gray-400 mt-1'>{data[0].description}</p>
            </div>
        </div>}
        {data[1] && <div className='flex flex-col gap-4 mt-4'>
            <div className='bg-purpleLight rounded-md p-4'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-medium'>{data[1].title}</h1>
                    <span className='text-sm text-gray-400 bg-white rounded-md py-1 px-1'>{new Intl.DateTimeFormat("en-us").format(data[1].date)}</span>
                </div>
                <p className='text-sm text-gray-400 mt-1'>{data[1].description}</p>
            </div>
        </div>}
        {data[2] && <div className='flex flex-col gap-4 mt-4'>
            <div className='bg-yellowLight rounded-md p-4'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-medium'>{data[2].title}</h1>
                    <span className='text-sm text-gray-400 bg-white rounded-md py-1 px-1'>{new Intl.DateTimeFormat("en-us").format(data[2].date)}</span>
                </div>
                <p className='text-sm text-gray-400 mt-1'>{data[2].description}</p>
            </div>
        </div>}
    </div>
)
}

export default Annoucement