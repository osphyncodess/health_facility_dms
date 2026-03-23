import { getMonthDayRange, getMonth2Digit } from "../api";
import { useState, useEffect } from "react";
import "../date.css";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const DateInput = ({ value, setValue }) => {
    const initial = getMonthDayRange(
        value || new Date().toISOString().split("T")[0]
    );

    const [year, setYear] = useState(initial.currYear);
    const [month, setMonth] = useState(months[initial.currMonth - 1]);
    const [day, setDay] = useState(initial.currDay);
    const [keys, setKeys] = useState(initial.monthRange);
    const [years] = useState(initial.years);

    const handleYearMonthChange = e => {
        const { name, value } = e.target;

        if (name === "year") {
            setYear(Number(value));
        } else {
            setMonth(value);
        }
    };

    const handlePrev = () => {
        let monthIndex = months.indexOf(month);

        if (monthIndex === 0) {
            setMonth(months[11]);
            setYear(prev => prev - 1);
        } else {
            setMonth(months[monthIndex - 1]);
        }
    };

    const handleNext = () => {
        let monthIndex = months.indexOf(month);

        if (monthIndex === 11) {
            setMonth(months[0]);
            setYear(prev => prev + 1);
        } else {
            setMonth(months[monthIndex + 1]);
        }
    };

    const handleDateClick = d => {
        setDay(d);
    };

    // update date value
    useEffect(() => {
        if (!day) return;

        const formatted = `${year}-${getMonth2Digit(month)}-${getMonth2Digit(day, true)}`;

        setValue(formatted);
    }, [day, month, year]);

    // update month range when month/year changes
    useEffect(() => {
        const monthNum = getMonth2Digit(month);
        const range = getMonthDayRange(`${year}-${monthNum}-01`);

        setKeys(range.monthRange);
    }, [month, year]);

    return (
        <div className="date-container">
            <div className="top-section">
                <button onClick={handlePrev} className="key-date">
                    Prev
                </button>

                <div className="centre">
                    <select
                        name="month"
                        value={month}
                        onChange={handleYearMonthChange}
                    >
                        {months.map(m => (
                            <option key={m}>{m}</option>
                        ))}
                    </select>

                    <select
                        name="year"
                        value={year}
                        onChange={handleYearMonthChange}
                    >
                        {years.map(y => (
                            <option key={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <button onClick={handleNext} className="key-date">Next</button>
            </div>

            <div className="keys-section">
                {keys.map(k => (
                    <button
                        key={k}
                        className={
                            Number(day) === Number(k)
                                ? "key-date current"
                                : "key-date"
                        }
                        onClick={() => handleDateClick(k)}
                    >
                        {k}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DateInput;
