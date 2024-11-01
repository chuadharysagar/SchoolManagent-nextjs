import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import FormModal from '@/components/FormModal';
import { ITEM_PERR_PAGE } from '@/lib/settings';
import { Class, Lesson, Prisma, Subject, Teacher } from '@prisma/client';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';



type LessonList = Lesson & { subject: Subject } & { class: Class } & { teacher: Teacher }



const LessonListPage = async ({ searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    // FETCH USER DATA 
    const { userId, sessionClaims } = await auth();
    const role = (searchParams?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    // ALL THE COLUMNS HEADER 
    const columns = [
        {
            header: 'Subject Name',
            accessor: "name",
        },
        {
            header: 'Class',
            accessor: "class",

        },
        {
            header: "Teacher",
            accessor: "teacher",
            className: "hidden lg:table-cell"
        },
        ...(role === "admin"?[{
            header: 'Actions',
            accessor: "action"
        }]:[])
    ];


    // Render Row Functions 
    const renderRow = (item: LessonList) => (
        <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
            <td className='flex items-center gap-4 p-4'>{item.subject.name}</td>
            <td>{item.class.name}</td>
            <td className='hidden md:table-cell'>{item.teacher.name + " " + item.teacher.surname}</td>

            <div className=' flex items-center gap-2'>

                {role === "admin" && (
                    <>
                        <FormModal table='lesson' type='update' data={item} />
                        <FormModal table='lesson' type='delete' id={item.id} />
                    </>

                )}

            </div>
        </tr>
    )

    // QUERY PARAMS 

    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1

    const query: Prisma.LessonWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case "classId":
                        query.classId = parseInt(value);
                        break;
                    case "teacherId":
                        query.teacherId = value;
                        break;
                    case "search":
                        query.OR = [
                            { subject: { name: { contains: value, mode: "insensitive" } } },
                            { teacher: { name: { contains: value, mode: 'insensitive' } } },
                        ];
                        break;
                    default:
                        break;
                }
            }

        }
    }


    //fetch data 

    const [data, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            include: {
                subject: { select: { name: true } },
                class: { select: { name: true } },
                teacher: {
                    select: { name: true, surname: true },
                }
            },
            take: ITEM_PERR_PAGE,
            skip: ITEM_PERR_PAGE * (p - 1),
        }),
        prisma.lesson.count({ where: query })
    ])



    return (
        <div className='bg-white p-4  rounded-md flex-1 m-4 mt-0'>
            {/* TOP SECTION  */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Lessons</h1>

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
                            <Image src='/filter.png' alt='filter button' width={14} height={14} />
                        </button>

                        {role === 'admin' && (
                            <FormModal table='lesson' type='create' />

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

export default LessonListPage;