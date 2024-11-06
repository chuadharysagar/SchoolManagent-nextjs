import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import FormModal from '@/components/FormModal';
import { Prisma, Subject, Teacher } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PERR_PAGE } from '@/lib/settings';
import { auth } from '@clerk/nextjs/server';
import FormContainer from '@/components/FormContainer';


type SubjectList = Subject & { teachers: Teacher[] };



const SubjectListPage = async ({ searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;


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


    //  RENDER ROW FUNCTIONS 
    const renderRow = (item: SubjectList) => (
        <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
            <td className='flex items-center gap-4 p-4'>{item.name}</td>
            <td className='hidden md:table-cell'>{item.teachers.map(teacher => teacher.name).join(",")}</td>

            <div className=' flex items-center gap-2'>
                {role === "admin" && (
                    <>
                        <FormContainer table='subject' type='update' data={item} />
                        <FormContainer table='subject' type='delete' id={item.id} />
                    </>
                )}

            </div>
        </tr>
    )


    //  QUERY 
    const { page, ...queryParams } = searchParams;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.SubjectWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case "search": query.name = { contains: value, mode: "insensitive" };
                        break;
                    default:
                        break;
                }
            }
        }
    }

    //fetch the data from db
    const [data, count] = await prisma.$transaction([
        prisma.subject.findMany({
            where: query,
            include: {
                teachers: true,
            },
            take: ITEM_PERR_PAGE,
            skip: ITEM_PERR_PAGE * (p - 1),
        }),

        prisma.subject.count({ where: query })
    ])


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
                <Table columns={columns} renderRow={renderRow} data={data} />
            </div>
            {/* PAGINATION  */}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default SubjectListPage;