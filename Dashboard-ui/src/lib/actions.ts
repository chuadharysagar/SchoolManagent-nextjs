"use server"
import { subjectSchema, SubjectSchema } from "./formValidationSchema";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

// create subject
export const createSubject = async (
    currentState: CurrentState,
    data: SubjectSchema) => {

    // add the data to the server 
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                teachers:{
                    connect:data.teachers.map(teacherId=>({id:teacherId}))
                }
            }
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
}


//Update subject Function
export const updateSubject = async (
    currentState: CurrentState,
    data: SubjectSchema,
) => {
    try {
        await prisma.subject.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                teachers:{
                    set:data.teachers.map(teacherId =>({id:teacherId}))
                }
            }
        })

        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { suceess: false, error: true }
    }
}

// delete subject 
export const deleteSubject = async (
    currentState: CurrentState,
    data: FormData) => {

    const id = data.get("id") as string;
    try {
        await prisma.subject.delete({
            where:{
                id:parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
}