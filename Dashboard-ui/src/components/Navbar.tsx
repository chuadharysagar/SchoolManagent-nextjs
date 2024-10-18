import React from 'react'
import Image from 'next/image';

const Navbar = () => {
  return (
    <div className='flex  items-center justify-between p-4'>

        {/* search bar hodden at begging  */}
     <div className='hidden md:flex'>
         <Image src="/search.png" alt = 'search icon' width={14} height={14}/>
         <input type="text" placeholder='Search ...' />
     </div>

     {/* user icons */}
     <div className='flex items-center gap-6'>

        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
           <Image src="/message.png" alt ="message icons" width={20} height={20} />
        </div>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
           <Image src="/announcement.png" alt ="message icons" width={20} height={20} />
        </div>
       {/* for the profile icon  */}
       < div className='flex flex-col'>
       <span className='text-xs leading-3 font-medium'>John Doe</span>
       <span className='text-[10px] text-gray-500 text-right'>Admin</span>
       </div>
       <Image src="/avatar.png" width={36} height={36} alt='Avtar icon' className='rounded-full'/>
     </div>
    </div>
  )
}

export default Navbar;