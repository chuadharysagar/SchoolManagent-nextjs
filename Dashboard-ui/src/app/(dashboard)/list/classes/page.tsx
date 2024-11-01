import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import FormModal from '@/components/FormModal';
import { Class, Prisma, Teacher } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PERR_PAGE } from '@/lib/settings';
import { auth } from '@clerk/nextjs/server';


type ClassList = Class & { supervisor: Teacher }






const ClassListPage = async ({ searchParams
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    // FETCH THE USER ROLE AND THE OHTER USE INFO 
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    // COLUMNS 
    const columns = [
        {
            header: 'Class Name',
            accessor: "name",
        },
        {
            header: 'Capacity',
            accessor: "capacity",
            className: "hidden lg:table-cell"

        },
        {
            header: "Grade",
            accessor: "grade",
            className: "hidden lg:table-cell"
        },
        {
            header: "Supervisor",
            accessor: "supervisor",
            className: "hidden lg:table-cell"
        },
        ...(role === "admin" ? [{
            header: 'Actions',
            accessor: "action"
        }] : [])
    ];


    //  RENDER ROW FUNCTION 

    const renderRow = (item: ClassList) => (
        <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
            <td className='flex items-center gap-4 p-4'>{item.name}</td>
            <td className='hidden md:table-cell'>{item.capacity}</td>
            <td className='hidden md:table-cell'>{item.name[0]}</td>
            <td className='hidden md:table-cell'>{item.supervisor.name + " " + item.supervisor.surname}</td>


            <div className=' flex items-center gap-2'>
                {role === "admin" && (
                    <>
                        <FormModal table='class' type='update' data={item} />
                        <FormModal table='class' type='delete' id={item.id} />
                    </>

                )}

            </div>
        </tr>
    )

    // data query form the backend database

    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1

    const query: Prisma.ClassWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case "supervisorId":
                        query.supervisorId = value;
                        break;
                    case "search":
                        query.name = { contains: value, mode: "insensitive" };
                        break;
                    default:
                        break;
                }
            }

        }
    }


    //Fetch data Database

    const [data, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: query,
            include: {
                supervisor: true,
            },
            take: ITEM_PERR_PAGE,
            skip: ITEM_PERR_PAGE * (p - 1),
        }),
        prisma.class.count({ where: query })
    ])

    return (
        <div className='bg-white p-4  rounded-md flex-1 m-4 mt-0'>
            {/* TOP SECTION  */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Classes</h1>

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
                            <FormModal table='class' type='create' />
                        )}
                    </div>
                </div>
            </div>
            {/* LIST  */}
            <div className=''>
                <Table columns={columns} renderRow={renderRow} data={data} />
            </div>
            {/* PAGINATION  */}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default ClassListPage;