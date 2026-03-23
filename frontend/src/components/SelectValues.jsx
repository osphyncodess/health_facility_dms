const SelectValues = ({ value, setValue, values }) => {
    const handleClick = value => {
        setValue(value);
    };
    return (
        <div className="date-container select-values">
            {values.map(val => (
                <button
                    className={val.value === value ? "selected-val" : ""}
                    key={val.value}
                    onClick = {()=>handleClick(val.value)}
                >
                    {val.label}
                </button>
            ))}
        </div>
    );
};

export default SelectValues;
