import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import Link from 'next/link';
import { role } from '@/lib/data';
import FormModal from '@/components/FormModal';
import { Class, Prisma, Student } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PERR_PAGE } from '@/lib/settings';


//get the type from the db 
type StudentList = Student & { class: Class }


const columns = [
  {
    header: 'Info',
    accessor: "info"
  },
  {
    header: 'Student ID',
    accessor: "studentId",
    className: 'hidden md:table-cell'
  },
  {
    header: 'Grade',
    accessor: "grade",
    className: "hidden md:table-cell"
  },
  {
    header: 'Phone',
    accessor: "phone",
    className: "hidden lg:table-cell"
  },
  {
    header: 'Address',
    accessor: "address",
    className: "hidden lg:table-cell"
  },
  {
    header: 'Actions',
    accessor: "action"
  }
];


const renderRow = (item: StudentList) => (
  <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
    <td className='flex items-center gap-4 p-4'>
      <Image src={item.img || "/noAvatar.png"}
        width={40} height={40}
        alt='Student profile'
        className='md:hidden xl:block w-10 h-10 rounded-full object-cover' />

      <div className='flex flex-col'>
        <h3 className='font-semibold'>{item.name}</h3>
        <p className='text-xs text-gray-500'>{item?.class.name}</p>
      </div>
    </td>
    <td className='hidden md:table-cell'>{item.username}</td>
    <td className='hidden md:table-cell'>{item.class.name[0]}</td>
    <td className='hidden md:table-cell'>{item.phone}</td>
    <td className='hidden md:table-cell'>{item.address}</td>

    <td>
      <div className=' flex items-center gap-2'>
        <Link href={`/list/students/${item.id}`} >
          <button className='w-7 h-7 flex items-center justify-center rounded-full bg-sky'>
            <Image src='/view.png' alt='view butto' height={16} width={16} />
          </button>
        </Link>

        {role === "admin" && (
          //   <button className='w-7 h-7 flex items-center justify-center 
          // rounded-full bg-purple'>
          //   <Image src='/delete.png' alt='view butto' height={16} width={16} />
          // </button>
          <FormModal table='student' type='delete' id={item.id} />
        )}

      </div>

    </td>
  </tr>
);



const StudentListPage = async ({ searchParams
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

  //taking the page param from seastudentsDatarchparams for pagination
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITION 
  const query: Prisma.StudentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value != undefined) {
        switch (key) {
          case "teacherId": {
            query.class = {
              lessons: {
                some: {
                  teacherId: value,
                },
              },
            }
          };
            break;
          case "search": {
            query.name = { contains: value, mode: 'insensitive' }
          };
            break;
          default:
            break;
        }
      }
    }
  }



  //fetch all the student data from database;
  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PERR_PAGE,
      skip: ITEM_PERR_PAGE * (p - 1),
    }),
    prisma.student.count({ where: query }),
  ])



  return (
    <div className='bg-white p-4  rounded-md flex-1 m-4 mt-0'>
      {/* TOP SECTION  */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Students</h1>

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
              //   <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              //   <Image src='/plus.png' alt='filter button' width={14} height={14} />
              // </button>
              <FormModal table='student' type='create' />
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

export default StudentListPage;