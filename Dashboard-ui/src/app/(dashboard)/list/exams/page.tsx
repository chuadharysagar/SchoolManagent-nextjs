import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import { examsData, role } from '@/lib/data';
import FormModal from '@/components/FormModal';
import { string } from 'zod';
import { Class, Exam, Prisma, Subject, Teacher } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PERR_PAGE } from '@/lib/settings';



type ExamList = Exam & {
    lesson: {
        subject: Subject,
        class: Class,
        teacher: Teacher,
    }
}


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
        header: "Date",
        accessor: "date",
        className: "hidden lg:table-cell"
    },
    {
        header: 'Actions',
        accessor: "action"
    }
];


const renderRow = (item: ExamList) => (
    <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
        <td className='flex items-center gap-4 p-4'>{item.lesson.subject.name}</td>
        <td>{item.lesson.class.name}</td>
        <td className='hidden md:table-cell'>{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
        <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-us").format(item.startTime)}</td>


        <div className=' flex items-center gap-2'>
            {role === "admin" && (
                <>
                    <FormModal table='exam' type='update' data={item} />
                    <FormModal table='exam' type='delete' id={item.id} />
                </>
            )}

        </div>
    </tr>
)

const ExamListPage = async ({ searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const { page, ...queryParmas } = searchParams;

    const p = page ? parseInt(page) : 1;

    // to limit the query within the exam table
    const query: Prisma.ExamWhereInput = {};

    if (queryParmas) {
        for (const [key, value] of Object.entries(queryParmas)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        query.lesson = { classId: parseInt(value) };
                        break;
                    case "teacherId":
                        query.lesson = { teacherId: value };
                        break;

                    case "search":
                        query.lesson = {
                            subject: {
                                name: { contains: value, mode: "insensitive" }
                            }
                        };
                        break;
                    default:
                        break;
                }
            }
        }
    }



    // data fetchig 
    const [data, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } },
                        class: { select: { name: true } },
                    },
                },
            },
            take: ITEM_PERR_PAGE,
            skip: ITEM_PERR_PAGE * (p - 1),
        }),

        prisma.exam.count({ where: query })
    ])


    return (
        <div className='bg-white p-4  rounded-md flex-1 m-4 mt-0'>
            {/* TOP SECTION  */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Exams</h1>

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
                            <FormModal table='exam' type='create' />
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

export default ExamListPage;
