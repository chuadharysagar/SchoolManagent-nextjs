import TableSearch from '@/components/TableSearch';
import React from 'react'
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import FormModal from '@/components/FormModal';
import { Parent, Prisma, Student } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PERR_PAGE } from '@/lib/settings';
import { auth } from '@clerk/nextjs/server';


type ParentList = Parent & { students: Student[] };


const ParentListPage = async ({ searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  //  ALL THE COLUMNS 
  const columns = [
    {
      header: 'Info',
      accessor: "info"
    },
    {
      header: 'Student Names',
      accessor: "studentName",
      className: 'hidden md:table-cell'
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
    ...(role === "admin" ? [{
      header: 'Actions',
      accessor: "action"
    }] : [])
  ];


  // render row function
  const renderRow = (item: ParentList) => (
    <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
      <td className='flex items-center gap-4 p-4'>
        <div className='flex flex-col'>
          <h3 className='font-semibold'>{item.name}</h3>
          <p className='text-xs text-gray-500'>{item?.email}</p>
        </div>
      </td>
      <td className='hidden md:table-cell'>{item.students.map(student => student.name).join(",")}</td>
      <td className='hidden md:table-cell'>{item.phone}</td>
      <td className='hidden md:table-cell'>{item.address}</td>

      <td>
        <div className=' flex items-center gap-2'>
          {role === "admin" && (
            //   <button className='w-7 h-7 flex items-center justify-center 
            // rounded-full bg-purple'>
            //   <Image src='/delete.png' alt='view butto' height={16} width={16} />
            // </button>
            <>
              <FormModal table='parent' type='update' data={item} />
              <FormModal table='parent' type='delete' id={item.id} />
            </>
          )}

        </div>

      </td>
    </tr>
  )


  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION  input as parent
  const query: Prisma.ParentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value != undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }


  // FETCH THE DATA FROM THE DB 
  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      take: ITEM_PERR_PAGE,
      skip: ITEM_PERR_PAGE * (p - 1),
    }),
    prisma.parent.count({ where: query }),
  ])

  return (
    <div className='bg-white p-4  rounded-md flex-1 m-4 mt-0'>
      {/* TOP SECTION  */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Parents</h1>

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
              <Image src='/sort.png' alt='filter button' width={14} height={14} />
            </button>

            {role === 'admin' && (
              //   <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              //   <Image src='/plus.png' alt='filter button' width={14} height={14} />
              // </button>
              <FormModal table='parent' type='create' />
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

export default ParentListPage;