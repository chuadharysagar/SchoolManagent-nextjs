import React from 'react'

const Annoucement = () => {
    return (
        <div className='bg-white rounded-md p-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-xl font-semibold'>Annoucements</h1>
                <span className='text-xs text-gray-400'>View All</span>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
                <div className='bg-sky rounded-md p-4'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-medium'>Lorem ipsum dolor sit am.</h1>
                        <span className='text-sm text-gray-400 bg-white rounded-md py-1 px-1'>2025-01-01</span>
                    </div>
                    <p className='text-sm text-gray-400 mt-1'>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                </div>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
                <div className='bg-purpleLight rounded-md p-4'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-medium'>Lorem ipsum dolor sit am.</h1>
                        <span className='text-sm text-gray-400 bg-white rounded-md py-1 px-1'>2025-01-01</span>
                    </div>
                    <p className='text-sm text-gray-400 mt-1'>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                </div>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
                <div className='bg-yellowLight rounded-md p-4'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-medium'>Lorem ipsum dolor sit am.</h1>
                        <span className='text-sm text-gray-400 bg-white rounded-md py-1 px-1'>2025-01-01</span>
                    </div>
                    <p className='text-sm text-gray-400 mt-1'>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                </div>
            </div>
        </div>
    )
}

export default Annoucement