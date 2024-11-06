'use client'
import React, { Dispatch, useEffect, useState } from 'react'
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useFormState } from 'react-dom';
import { deleteClass, deleteSubject } from '@/lib/actions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FormContainerProps } from './FormContainer';


const deleteActionMap = {
    subject: deleteSubject,
    class: deleteClass,
    teacher: deleteSubject,
    student: deleteSubject,
    parent: deleteSubject,
    lesson: deleteSubject,
    exam: deleteSubject,
    assignment: deleteSubject,
    result: deleteSubject,
    attendence: deleteSubject,
    event: deleteSubject,
    announcement: deleteSubject,
}

// for dynamic loading lazy loading load it when needed
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
    loading: () => <h1>Loading....</h1>
})

const StudentForm = dynamic(() => import("./forms/StudentFrom"), {
    loading: () => <h1>Loading....</h1>
})

const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
    loading: () => <h1>Loading....</h1>
})

const ClassForm = dynamic(() => import("./forms/ClassForm"), {
    loading: () => <h1>Loading....</h1>
})

// for the conditional rendering
const forms: {
    [key: string]: (
        setOpen: Dispatch<React.SetStateAction<boolean>>,
        type: "create" | "update",
        data?: any,
        relatedData?: any,
    ) =>
        JSX.Element
} = {
    subject: (setOpen, type, data, relatedData) => (
        <SubjectForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    class: (setOpen, type, data, relatedData) => (
        <ClassForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    teacher: (setOpen, type, data, relatedData) => (
        <TeacherForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    // student: (setOpen, type, data, relatedData) => (
    //     <StudentForm
    //         type={type}
    //         data={data}
    //         setOpen={setOpen}
    //         relatedData={relatedData}
    //     />
    // )

};

const FormModal = ({ table, type, data, id, relatedData }:
    FormContainerProps) => {

    const size = type === "create" ? "w-8 h-8" : "w-7 h-7"
    const bgColor =
        type === "create" ? "bg-yellow"
            : type === "update" ? "bg-sky" : "bg-purple";

    const [open, setOpen] = useState(false);

    //for deleeting any item
    const Form = () => {
        const [state, formAction] = useFormState(deleteActionMap[table]
            , { success: false, error: false })

        const router = useRouter();
        useEffect(() => {
            if (state.success) {
                toast(`${table} has been Deleted!`);
                //if success refresh the page
                setOpen(false);
                router.refresh();
            }

        }, [state]);

        return type === "delete" && id ?
            (<form action={formAction} className='p-4 flex flex-col gap-4'>
                <input type="text | number" name="id" value={id} hidden />
                <span className='text-center font-medium'>All data will be lost. Are you sure you want to delete {table}?</span>
                <button className='bg-red-700 text-white py-2 px-4 rounded-md border-none
            w-max self-center
            '>Delete</button>
            </form>) : type === "create" || type === "update" ? (
                forms[table](setOpen, type, data, relatedData)
            ) : ("Form not found !")
    }


    return (
        <>
            <button className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
                onClick={() => setOpen(true)}
            >
                <Image src={`/${type}.png`} alt='custom button' width={16} height={16} />
            </button>

            {/* // the state is open then show the resulting div */}
            {open && <div className='w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 *
             flex items-center justify-center'>
                <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%]
                 2xl:w-[40%]'>
                    <Form />
                    <div className='absolute top-4 right-4 cursor-pointer' onClick={() => setOpen(false)}>
                        <Image src='/close.png' alt='close button' width={14} height={14} />
                    </div>
                </div>
            </div>}
        </>
    );
}

export default FormModal