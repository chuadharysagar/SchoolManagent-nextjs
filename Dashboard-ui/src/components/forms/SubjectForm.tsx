'use client'
import React, { Dispatch, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InputFeild from '../InputFeild'
import { subjectSchema, SubjectSchema } from '@/lib/formValidationSchema'
import { createSubject, updateSubject } from '@/lib/actions'
import { useFormState } from 'react-dom'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const SubjectForm = ({ 
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<React.SetStateAction<boolean>>;
    relatedData?: any;
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema),
    });

    // for the form submission state
    const [state, fromAction] = useFormState(type==="create"? createSubject : updateSubject,
        { success: false, error: false });

    const onSubmit = handleSubmit(data => {
        fromAction(data);
    })


    const router = useRouter();
    // show the toastify notification of the from actions
    useEffect(() => {
        if (state.success) {
            toast(`Subject has been added ${type === "create" ? "created" : "updated"}!`);
            //if success refresh the page
            setOpen(false);
            router.refresh();
        }

    }, [state]);


    const { teachers } = relatedData;
    console.log("teachers data");

    return (
        <form className='flex flex-col gap-8' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>{
                type === "create" ? "Create a new Subject" : "Update the subject"}</h1>

            <div className='flex justify-between flex-wrap gap-4'>
                <InputFeild label='Subject Name'
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />

                {data && (<InputFeild label='Id'
                    name="id"
                    defaultValue={data?.id}
                    register={register}
                    error={errors?.id}
                    hidden
                />)}

                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Teachers</label>
                    <select
                        multiple
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
                        {...register("teachers")} defaultValue={data?.teachers} >
                        {teachers.map((teacher: { id: string, name: string, surname: string }) => (

                            <option value={teacher.id} key={teacher.id}>
                                {teacher.name + " " + teacher.surname}
                            </option>
                        ))}
                    </select>
                    {errors.teachers?.message &&
                        <p className='text-xs text-red-400'> {errors.teachers.message.toString()}</p>}
                </div>

            </div>
            {state.error && <span className='text-red-400'>Something went wrong</span>}
            <button className='bg-blue-400 text-white p-2 rounded-md'>
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    )
}

export default SubjectForm;