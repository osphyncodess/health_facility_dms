import { useState } from "react";
import "../alpha.css"; // custom styles
import { Proper } from "../api";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ALPHANUMERIC_KEYS = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Back"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", "'"],
    ["Space"]
];

const AlphanumericInput = ({
    value,
    setValue,
    placeholder = "Enter text..."
}) => {
    const handleKeyClick = key => {
        if (key === "Back") {
            setValue(value.slice(0, -1));
        } else if (key === "Space") {
            setValue(value + " ");
        } else {
            setValue(Proper(value + key));
        }
    };

    return (
        <div className="alpha-container date-container">
            <div className="alpha-keys">
                {ALPHANUMERIC_KEYS.map((row, i) => (
                    <div key={i} className="alpha-row">
                        {row.map(key => (
                            <button
                                key={key}
                                className={
                                    key === "Space"
                                        ? "alpha-key space"
                                        : "alpha-key"
                                }
                                onClick={() => handleKeyClick(key)}
                            >
                                {key === "Space" ? "␣" : key}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlphanumericInput;
