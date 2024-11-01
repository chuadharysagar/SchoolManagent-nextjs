import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import FormModal from '@/components/FormModal';
import prisma from '@/lib/prisma';
import { ITEM_PERR_PAGE } from '@/lib/settings';
import { Prisma } from '@prisma/client';
import { date } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { root } from 'postcss';


// Custum type for the result table

type ResultList = {
    id: number;
    title: string;
    studentName: string;
    studentSurname: string;
    teacherName: string;
    teacherSurname: string;
    score: number;
    className: string;
    startTime: Date;
}



const ResultListPage = async ({ searchParams
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    // ROWS 
    const columns = [
        {
            header: 'Title',
            accessor: "title",
        },
        {
            header: 'Student',
            accessor: "student",

        },
        {
            header: 'Score',
            accessor: "score",
            className: "hidden lg:table-cell"
        },
        {
            header: "Teacher",
            accessor: "teacher",
            className: "hidden lg:table-cell"
        },
        {
            header: 'Class',
            accessor: "class",
            className: "hidden lg:table-cell",
        },
        {
            header: 'Date',
            accessor: "date",
            className: "hidden lg:table-cell",
        },
        ...(role === "admin" ? [{
            header: 'Actions',
            accessor: "action"
        }] : [])
    ];

    // Render row function 
    const renderRow = (item: ResultList) => (
        <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
            <td className='flex items-center gap-4 p-4'>{item.title}</td>
            <td>{item.studentName + " " + item.studentSurname}</td>
            <td className='hidden md:table-cell'>{item.score}</td>
            <td className='hidden md:table-cell'>{item.teacherName + " " + item.teacherSurname}</td>
            <td className='hidden md:table-cell'>{item.className}</td>
            <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-us").format(item.startTime)}</td>


            <div className=' flex items-center gap-2'>

                {(role === "admin" || role === "teacher") && (
                    <>
                        <FormModal table='result' type='update' data={item} />
                        <FormModal table='result' type='delete' id={item.id} />
                    </>
                )}

            </div>
        </tr>)


    //  QUERY 
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.ResultWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case "studentId":
                        query.studentId = value;
                        break;
                    case "search":
                        query.OR = [
                            { exam: { title: { contains: value, mode: "insensitive" } } },
                            { student: { name: { contains: value, mode: "insensitive" } } },
                        ];
                        break;

                    default:
                        break;
                }
            }
        }
    }

    //  ROLE CONDITIONS 
    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.OR = [
                { exam: { lesson: { teacherId: currentUserId! } } },
                { assignment: { lesson: { teacherId: currentUserId! } } }
            ]
            break;

        case "student":
            query.studentId = currentUserId!;
            break;

        case "parent":
            query.student = {
                parentId: currentUserId!,
            }
    }

    const [dataRes, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            include: {
                student: { select: { name: true, surname: true } },
                exam: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } },
                            },
                        },
                    },
                },
                assignment: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } },
                            },
                        },
                    },
                },
            },
            take: ITEM_PERR_PAGE,
            skip: ITEM_PERR_PAGE * (p - 1),
        }),
        prisma.result.count({ where: query })
    ])

    //data response
    const data = dataRes.map(item => {
        const assessment = item.exam || item.assignment

        if (!assessment) return null;

        const isExam = "startTime" in assessment;

        return {
            id: item.id,
            title: assessment.title,
            studentName: item.student.name,
            studentSurname: item.student.surname,
            teacherName: assessment.lesson.teacher.name,
            teacherSurname: assessment.lesson.teacher.surname,
            score: item.score,
            className: assessment.lesson.class.name,
            startTime: isExam ? assessment.startTime : assessment.startDate,
        }
    })

    return (
        <div className='bg-white p-4  rounded-md flex-1 m-4 mt-0'>
            {/* TOP SECTION  */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Results</h1>

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

                        {(role === 'admin' || role === "teacher") && (
                            <FormModal table='result' type='create' />
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

export default ResultListPage;