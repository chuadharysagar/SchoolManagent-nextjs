import React from 'react'
import Image from 'next/image'

const UserCard = ({type}:{type:string}) => {
  return (
    <div className='rounded-2xl odd:bg-purple even:bg-yellow p-4 flex-1 min-w-[130px]'>
       <div className='flex justify-between items-center'>
        <span className='text-[10px] bg-white px-2 py-1 rounded-full text-green-500 '>2024/25</span>
        <Image src='/more.png' alt='more option' height={20} width={20}/>
       </div>
       <h1 className='text-2xl my-4 font-semibold'>1,234</h1>
       <h2 className='capitalize text:sm font-medium text-gray-500'>{type}s</h2>
    </div>
  )
}

export default UserCard