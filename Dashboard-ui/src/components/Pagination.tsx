import { ITEM_PERR_PAGE } from '@/lib/settings'
import React from 'react'

const Pagination = ({ page, count }: { page: number, count: number }) => {
    return (
        <div className='p-4 flex items-center justify-between text-gray-500'>
            <button disabled className='py-4 px-4 rounded-md bg-slate-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed'>Prev</button>
            {/* PAGINATION BUTTON  */}
            <div className='flex items-center justify-center text-sm gap-2'>
                {Array.from({ length: Math.ceil(count / ITEM_PERR_PAGE) }, (_, index) => {
                    const pageIndex = index + 1;
                    return <button key={pageIndex} className={`px-2 rounded-sm ${page === pageIndex ? "bg-sky" : ""}`}>{pageIndex}</button>

                })}
            </div>
            <button className='py-4 px-4 rounded-md bg-slate-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed'>Next</button>
        </div>
    )
}

export default Pagination