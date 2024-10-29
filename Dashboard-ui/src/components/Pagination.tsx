'use client'
import { ITEM_PERR_PAGE } from '@/lib/settings'
import { useRouter } from 'next/navigation'
import React from 'react'

const Pagination = ({ page, count }: { page: number, count: number }) => {
    const router = useRouter();

    const hasPrev = ITEM_PERR_PAGE*(page-1)>0;
    const hasNext = ITEM_PERR_PAGE *(page - 1)+ITEM_PERR_PAGE<count;

    //function for the changing the page
    const changePage = (newPage:number)=>{
        const params = new URLSearchParams(window.location.search);
        params.set("page",newPage.toString());
        router.push(`${window.location.pathname}?${params}`)
    }

    return (
        <div className='p-4 flex items-center justify-between text-gray-500'>
            <button className='py-4 px-4 rounded-md bg-slate-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed'
            disabled ={!hasPrev}
            onClick={()=> changePage(page -1)}
            >Prev</button>
            {/* PAGINATION BUTTON  */}
            <div className='flex items-center justify-center text-sm gap-2'>
                {Array.from({ length: Math.ceil(count / ITEM_PERR_PAGE) }, (_, index) => {
                    const pageIndex = index + 1;
                    return <button key={pageIndex}
                        className={`px-2 rounded-sm ${page === pageIndex ? "bg-sky" : ""}`}
                        onClick={()=>changePage(pageIndex)}
                    >{pageIndex}</button>
                })}
            </div>
            <button className='py-4 px-4 rounded-md bg-slate-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed'
             disabled={!hasNext}
            onClick={()=> changePage(page+1)}
            >Next</button>
        </div>
    )
}

export default Pagination