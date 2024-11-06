import prisma from '@/lib/prisma';
import React from 'react'
import BigCalendar from './Bigcalender';
import { adjustShecduleToCurrentWeek } from '@/lib/utils';

const BigCalenderContainer = async ({ type, id, }: {
    type: "teacherId" | "classId";
    id: string | number;
}) => {
    // FETCH ALL THE DATA FROM THE DB 
    const resData = await prisma.lesson.findMany({
        where: {
            ...(type === "teacherId" ? { teacherId: id as string } : { classId: id as number }),
        },
    })

    // formate response data 
    const data = resData.map(lesson => ({
        title: lesson.name,
        start: lesson.startTime,
        end: lesson.endTime,
    }))
    

    const schedule = adjustShecduleToCurrentWeek(data);

    return (
        <div>
            <BigCalendar data ={schedule} />
        </div>
    )
}

export default BigCalenderContainer