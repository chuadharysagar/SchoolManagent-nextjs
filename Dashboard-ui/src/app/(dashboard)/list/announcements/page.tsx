import TableSearch from '@/components/TableSearch';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import FormModal from '@/components/FormModal';
import { Announcement, Class, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PERR_PAGE } from '@/lib/settings';
import { auth } from '@clerk/nextjs/server';


type AnnouncemetList = Announcement & { class: Class }



const AnnoucementListPage = async ({ searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    // fetch the user role from the bakcend 
    const { userId,sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    // Columns 
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
        ...(role === "admin" ? [{
            header: 'Actions',
            accessor: "action"
        }] : [])
    ];

    // fetch role data from the usecontext api


    const renderRow = (item: AnnouncemetList) => (
        <tr key={item.title} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
            <td className='flex items-center gap-4 p-4'>{item.title}</td>
            <td>{item.class?.name || "-"}</td>
            <td className='hidden md:table-cell'>{Intl.DateTimeFormat("en-us").format(item.date)}</td>

            <div className=' flex items-center gap-2'>
                {role === "admin" && (
                    <>
                        <FormModal table='announcement' type='update' data={item} />
                        <FormModal table='announcement' type='delete' id={item.id} />
                    </>
                )}

            </div>
        </tr>
    )

    // fetching data for the table

    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.AnnouncementWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case "search": query.title = { contains: value, mode: "insensitive" };
                        break;
                    default:
                        break;
                }
            }
        }
    }


    //ROLE CONDTIONS 
        //  ROLE CONDITIONS 
        const roleConditions = {
            teacher: { lessons: { some: { teacherId: currentUserId! } } },
            student: { students: { some: { id: currentUserId! } } },
            parent: { students: { some: { parentId: currentUserId! } } },
        }

        if (role !== "admin") {
            query.OR = [
                { classId: null },
                { class: roleConditions[role as keyof typeof roleConditions] || {} }
            ];
        }
    // data fetching for the the events
    const [data, count] = await prisma.$transaction([
        prisma.announcement.findMany({
            where: query,
            include: {
                class: true,
            },
            take: ITEM_PERR_PAGE,
            skip: ITEM_PERR_PAGE * (p - 1),
        }),
        prisma.announcement.count({ where: query })
    ])


    // return component
    return (
        <div className='bg-white p-4  rounded-md flex-1 m-4 mt-0'>
            {/* TOP SECTION  */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Aounncemets</h1>

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
                            <FormModal table='announcement' type='create' />

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

export default AnnoucementListPage;