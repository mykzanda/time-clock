/* eslint-disable prettier/prettier */
"use client";
import { useEffect, useState } from "react";
type Props = {
    time: number;
};
export default function Time({ time: initial }: Props) {
    const [time, setTime] = useState(new Date(initial));


    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return <div className="text-xs font-bold text-gray-500 tabular-nums">{time.toDateString()} {time.toLocaleTimeString()}</div>;
}
