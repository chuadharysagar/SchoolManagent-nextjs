'use client'
import Image from 'next/image';
import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
  {
    name: 'Mon',
    present: 40,
    absent: 24,
  },
  {
    name: 'Tue',
    present: 30,
    absent: 13,
  },
  {
    name: 'Web',
    present: 20,
    absent: 55,
  },
  {
    name: 'Thus',
    present: 27,
    absent: 39,
  },
  {
    name: 'Fri',
    present: 18,
    absent: 48,
  }
];


const AttendenceChart = () => {

  return (
    <div className='bg-white rounded-lg p-4 h-full'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Attendence</h1>
        <Image src='/moreDark.png' alt='more options' width={20} height={20} />
      </div>
      {/* chart Attendence */}
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
          <Legend align='left' verticalAlign='top' wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
          <Bar dataKey="present" fill="#FAE27C"
            legendType='circle'
            radius={[10, 10, 0, 0]}
          />
          <Bar dataKey="absent" fill="#C3EBFA"
            legendType='circle'
            radius={[10, 10, 0, 0]}

          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  )
}

export default AttendenceChart