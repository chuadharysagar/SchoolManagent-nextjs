'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';



type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


const EventCalander = () => {
    const [value, onChange] = useState<Value>(new Date());

    const router = useRouter();
    useEffect(() => {

        if (value instanceof Date) {
            router.push(`?date=${value.toLocaleDateString("en-us")}`);
        }
    }, [value, router])



    return (
        <Calendar onChange={onChange} value={value} />
    )
}

export default EventCalander