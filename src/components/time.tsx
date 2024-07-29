import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import timeStyle from '../../styles/time.module.css';

export default function Time() {
    const [time, setTime] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
        }, 1000); 

        
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={timeStyle.time}>
            <h1>{time}</h1>
        </div>
    );
}
