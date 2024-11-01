import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import FormModal from '@/components/FormModal';
import { Assignment, Class, Prisma, Subject, Teacher } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PERR_PAGE } from '@/lib/settings';
import { auth } from '@clerk/nextjs/server';



type AssignmentList = Assignment & {
    lesson: {
        class: Class,
        subject: Subject,
        teacher: Teacher,
    }
}


const AssignmentListPage = async ({ searchParams
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    // FETCH THE USER ROLE 
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const curretUserId = userId;
    // All the columns 
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
        {
            header: "Due Date",
            accessor: "due date",
            className: "hidden lg:table-cell"
        },
        ...((role === "admin" || role === "teacher") ? [{
            header: 'Actions',
            accessor: "action"
        }] : [])
    ];

    // render Row Funtion

    const renderRow = (item: AssignmentList) => (
        <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
            <td className='flex items-center gap-4 p-4'>{item.lesson.subject.name}</td>
            <td>{item.lesson.class.name}</td>
            <td className='hidden md:table-cell'>{item.lesson.teacher.name + " " + item.lesson.teacher.name}</td>
            <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-us").format(item.dueDate)}</td>


            <div className=' flex items-center gap-2'>

                {(role === "admin" || role === "teacher") && (
                    <>
                        <FormModal table='assignment' type='update' data={item} />
                        <FormModal table='assignment' type='delete' id={item.id} />
                    </>
                )}

            </div>
        </tr>
    )


    // Fetch the data 
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.AssignmentWhereInput = {};

    // DEFINE LESSON QUERY TYPES
    query.lesson = {};

    //  URL PARAMS CONDIIONS 
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case "classId":
                        query.lesson.classId = parseInt(value);
                        break;

                    case "teacherId":
                        query.lesson.teacherId = value;
                        break;

                    case "search":
                        query.OR = [
                            {
                                lesson: {
                                    subject: {
                                        name: { contains: value, mode: "insensitive" }
                                    }
                                }
                            },
                            {
                                lesson: {
                                    teacher: {
                                        name: { contains: value, mode: 'insensitive' }
                                    }
                                }
                            }
                        ];
                        break;

                    default:
                        break;
                }
            }
        }
    }

    // ROLE CONDITIONS
    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.lesson.teacherId = curretUserId!;
            break;

        case "student":
            query.lesson.class = {
                students: {
                    some: {
                        id: curretUserId!,
                    }
                }
            }
            break;

        case "parent":
            query.lesson.class = {
                students: {
                    some: {
                        parentId: curretUserId!,
                    }
                }
            }
            break;

        default:
            break;

    }

    const [data, count] = await prisma.$transaction([
        prisma.assignment.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        class: { select: { name: true } },
                        teacher: { select: { name: true } },
                    },
                },
            },
            take: ITEM_PERR_PAGE,
            skip: ITEM_PERR_PAGE * (p - 1),
        }),
        prisma.assignment.count({ where: query })
    ])


    return (
        <div className='bg-white p-4  rounded-md flex-1 m-4 mt-0'>
            {/* TOP SECTION  */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Assignment</h1>

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
                            <FormModal table='assignment' type='create' />
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

export default AssignmentListPage;