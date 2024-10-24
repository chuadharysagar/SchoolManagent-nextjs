'use client'
import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import Link from 'next/link';
import { role, subjectsData, teachersData } from '@/lib/data';
import FormModal from '@/components/FormModal';


type Subject = {
    id: number;
    name: string;
    teachers: string[];

}


const columns = [
    {
        header: 'Subject Name',
        accessor: "name",
    },
    {
        header: 'Teachers',
        accessor: "teachers",
        className: "hidden lg:table-cell"
    },
    {
        header: 'Actions',
        accessor: "action"
    }
];


const SubjectListPage = () => {

    const renderRow = (item: Subject) => (
        <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
            <td className='flex items-center gap-4 p-4'>{item.name}</td>
            <td className='hidden md:table-cell'>{item.teachers.join(",")}</td>

            <div className=' flex items-center gap-2'>
                {role === "admin" && (
                    <>
                        <FormModal table='subject' type='update' data={item} />
                        <FormModal table='subject' type='delete' id={item.id} />
                    </>
                )}

            </div>
        </tr>
    )

    return (
        <div className='bg-white p-4  rounded-md flex-1 m-4 mt-0'>
            {/* TOP SECTION  */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Subjects</h1>

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

                        {role === 'admin' && (
                            //     <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
                            //     <Image src='/plus.png' alt='filter button' width={14} height={14} />
                            // </button>
                            <FormModal table='subject' type='create' />

                        )}
                    </div>
                </div>
            </div>
            {/* LIST  */}
            <div className=''>
                <Table columns={columns} renderRow={renderRow} data={subjectsData} />
            </div>
            {/* PAGINATION  */}
            <Pagination />
        </div>
    )
}

export default SubjectListPage;