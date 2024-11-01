import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import FormModal from '@/components/FormModal';
import { Class, Event, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PERR_PAGE } from '@/lib/settings';
import { auth, currentUser } from '@clerk/nextjs/server';



type EventList = Event & { class: Class };



const EventListPage = async ({ searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    // FETCH THE USER ROLE AND ID 
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;
    // COLUMNS 
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

        ...(role === "admin" ? [{
            header: 'Actions',
            accessor: "action"
        }] : [])
    ];

    // RENDER ROW FRUNTION 
    const renderRow = (item: EventList) => (
        <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
            <td className='flex items-center gap-4 p-4'>{item.title}</td>
            <td>{item.class?.name || "-"}</td>
            <td className='hidden md:table-cell'>{Intl.DateTimeFormat("en-us").format(item.startTime)}</td>
            <td className='hidden md:table-cell'>{item.startTime.toLocaleTimeString("en-us", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }
            )}</td>
            <td className='hidden md:table-cell'>{item.endTime.toLocaleTimeString("en-us", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }
            )}</td>

            <div className=' flex items-center gap-2'>

                {role === "admin" && (
                    <>
                        <FormModal table='event' type='update' data={item} />
                        <FormModal table='event' type='delete' id={item.id} />
                    </>
                )}

            </div>
        </tr>
    )

    // DATA QUERIES 
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.EventWhereInput = {};

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


    //  ROLE CONDITIONS 
    const roleConditions = {
        teacher: { lessons: { some: { teacherId: currentUserId! } } },
        student: { students: { some: { id: currentUserId! } } },
        parent: { students: { some: { parentId: currentUserId! } } }
    }
    
    if (role !== "admin") {
        query.OR = [
            { classId: null },
            { class: roleConditions[role as keyof typeof roleConditions] || {} }
        ]
    }
    // data fetching for the the events
    const [data, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: query,
            include: {
                class: true,
            },
            take: ITEM_PERR_PAGE,
            skip: ITEM_PERR_PAGE * (p - 1),
        }),
        prisma.event.count({ where: query })
    ])


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

                        {role === 'admin' && (
                            <FormModal table='event' type='create' />
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

export default EventListPage;