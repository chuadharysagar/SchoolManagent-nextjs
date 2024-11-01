import React from 'react'
import Image from 'next/image'
import prisma from '@/lib/prisma'

const UserCard = async({type}:{type:"admin" | "teacher" | "student" | "parent"}) => {

  // FETCH THE USER COUNT FOR THE CARDS 
  const modelMap :Record<typeof type,any> ={
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  }

  const data = await modelMap[type].count();

  return (
    <div className='rounded-2xl odd:bg-purple even:bg-yellow p-4 flex-1 min-w-[130px]'>
       <div className='flex justify-between items-center'>
        <span className='text-[10px] bg-white px-2 py-1 rounded-full text-green-500 '>2024/25</span>
        <Image src='/more.png' alt='more option' height={20} width={20}/>
       </div>
       <h1 className='text-2xl my-4 font-semibold'>{data}</h1>
       <h2 className='capitalize text:sm font-medium text-gray-500'>{type}s</h2>
    </div>
  )
}

export default UserCard