import { start } from "repl";
import { lessonsData } from "./data";

const currentWorkWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const startOfWeek = new Date(today);

    if (dayOfWeek === 0) {
        startOfWeek.setDate(today.getDate() + 1);
    }

    if (dayOfWeek === 6) {
        startOfWeek.setDate(today.getDate() + 2);
    } else {
        startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
    }

    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
}

export const adjustShecduleToCurrentWeek = (lessons: { title: string; start: Date; end: Date }[]): ({ title: string; start: Date; end: Date }[]) => {
    const startOfWeek = currentWorkWeek();

    return lessons.map((lesson) => {
        const lessonDayOfWeek = lesson.start.getDay();

        const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

        const abjustedStartDate = new Date(startOfWeek);

        abjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
        const abjustedEndDate = new Date(abjustedStartDate);

        abjustedStartDate.setHours(
            lesson.start.getHours(),
            lesson.start.getMinutes(),
            lesson.start.getSeconds(),
        )

        abjustedEndDate.setHours(
            lesson.end.getHours(),
            lesson.end.getMinutes(),
            lesson.end.getSeconds(),
        )

        return {
            title: lesson.title,
            start: abjustedStartDate,
            end: abjustedEndDate,
        }

    });

}