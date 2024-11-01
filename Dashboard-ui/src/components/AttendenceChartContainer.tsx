import React from 'react'
import Image from 'next/image'
import AttendenceChart from './AttendenceChart'
import prisma from '@/lib/prisma'

const AttendenceChartContainer = async () => {
    //  fetch the latest data based the current date 
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daySinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daySinceMonday);

    const resData = await prisma.attendence.findMany({
        where: {
            date: {
                gte: lastMonday,
            },
        },
        select: {
            date: true,
            present: true,
        }
    });

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    const attendenMap: { [key: string]: { present: number, absent: number } } = {
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        Thu: { present: 0, absent: 0 },
        Fri: { present: 0, absent: 0 },
    }

    resData.forEach(item => {
        const itemDate = new Date(item.date);

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const dayName = daysOfWeek[dayOfWeek - 1];

            if (item.present) {
                attendenMap[dayName].present += 1;
            } else {
                attendenMap[dayName].absent += 1;
            }
        }
    })


    const data = daysOfWeek.map((day) => (
        {
            name: day,
            present: attendenMap[day].present,
            absent: attendenMap[day].absent,
        }
    ))

    return (
        <div className='bg-white rounded-lg p-4 h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold'>Attendence</h1>
                <Image src='/moreDark.png' alt='more options' width={20} height={20} />
            </div>
            <AttendenceChart data ={data} />
        </div>
    )
}

export default AttendenceChartContainer;