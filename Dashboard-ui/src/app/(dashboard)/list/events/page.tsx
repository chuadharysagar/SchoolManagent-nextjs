import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import Link from 'next/link';
import {eventsData, role } from '@/lib/data';



type Event = {
    id: number;
    title: string;
    class: string;
    teacher: string;
    date: string;
    startTime: number;
    endTime: number;

}


const columns = [
    {
        header: 'Title',
        accessor: "title",
    },
    {
        header: 'Class',
        accessor: "class",

    },
    {
        header: 'Date',
        accessor: "date",
        className: "hidden lg:table-cell"
    },
    {
        header: "Start time",
        accessor: "startTime",
        className: "hidden lg:table-cell"
    },
    {
        header: 'End Time',
        accessor: "ebdTime",
        className: "hidden lg:table-cell",
    },

    {
        header: 'Actions',
        accessor: "action"
    }
];


const EventListPage = () => {

    const renderRow = (item: Event) => (
        <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
            <td className='flex items-center gap-4 p-4'>{item.title}</td>
            <td>{item.class}</td>
            <td className='hidden md:table-cell'>{item.date}</td>
            <td className='hidden md:table-cell'>{item.startTime}</td>
            <td className='hidden md:table-cell'>{item.endTime}</td>
        
            <div className=' flex items-center gap-2'>
                <Link href={`/list/teachers/${item.id}`} >
                    <button className='w-7 h-7 flex items-center justify-center rounded-full bg-sky'>
                        <Image src='/edit.png' alt='view butto' height={16} width={16} />
                    </button>
                </Link>

                {role === "admin" && (<button className='w-7 h-7 flex items-center justify-center 
          rounded-full bg-purple'>
                    <Image src='/delete.png' alt='view butto' height={16} width={16} />
                </button>)
                }

            </div>
        </tr>
    )

    return (
        <div className='bg-white p-4  rounded-md flex-1 m-4 mt-0'>
            {/* TOP SECTION  */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Events</h1>

                {/* SEARCH BAR  */}
                <div className='flex flex-col md:flex-row items-center gap-4  w-full md:w-auto'>
                    {/* SEARCH BAR  */}
                    <TableSearch />

                    {/* BUTTON CONTAINER  */}
                    <div className='flex items-cennter gap-4 self-end'>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
                            <Image src='/filter.png' alt='filter button' width={14} height={14} />
                        </button>

                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
                            <Image src='/search.png' alt='filter button' width={14} height={14} />
                        </button>

                        {role === 'admin' && (<button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
                            <Image src='/plus.png' alt='filter button' width={14} height={14} />
                        </button>)}
                    </div>
                </div>
            </div>
            {/* LIST  */}
            <div className=''>
                <Table columns={columns} renderRow={renderRow} data={eventsData} />
            </div>
            {/* PAGINATION  */}
            <Pagination />
        </div>
    )
}

export default EventListPage;