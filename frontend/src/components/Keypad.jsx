import React from "react";
import "../keyboard.css";

const CustomKeyboard = ({ value, setValue }) => {
  const handleClick = (key) => {
    if (key === "⌫") {
      setValue(value.slice(0, -1));
    } else if (key === "C") {
      setValue("");
    } else {
      setValue(value + key);
    }
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];

  return (
    <div className="keyboard date-container">
      {keys.map((key) => (
        <button key={key} className="key" onClick={() => handleClick(key)}>
          {key}
        </button>
      ))}
    </div>
  );
};

export default CustomKeyboard;
