import { useState } from "react";
import CustomKeyboard from "./Keypad";
import AlphanumericInput from "./AlphaNumeric";
import SelectValues from "./SelectValues";
import DateInput from "./DateInput";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdCancel, MdMenu, MdSend } from "react-icons/md";
import "../assets/css/data_entry.css";
import Alert from "./Alert";
import { getLabelID } from "../api";
import { useSwipeable } from "react-swipeable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormDynamic = ({
    formData,
    handleSubmit,
    formValues,
    step,
    setStep,
    backArrow,
    handleReview,
    formId,
    reviewClicked,
    className
}) => {
    // Build initial values

    const [form, setForm] = useState(formValues);
    const [initialSelectManySearchValue, setInitialSelectManySearchValue] =
        useState("");
    const [isAlert, setIsAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(
        "This is an alert message"
    );

    const currentControl = formData[step];

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectSearch = e => {
        setInitialSelectManySearchValue(e.target.value);
    };

    const Submit = e => {
        e.preventDefault();

        handleSubmit(form);
    };

    const Submits = e => {
        e.preventDefault();
    };

    const handleFormClick = e => {
        e.stopPropagation();
    };

    const handleSelectValues = (val, label) => {
        var valArray = form[currentControl.name];

        const value = [val, label].join(",");
        if (currentControl.multiSelect == true) {
            if (!valArray.includes(value)) {
                valArray.push(value);
            }
        } else {
            valArray = [value];
        }

        setForm({
            ...form,
            [currentControl.name]: valArray
        });

        setInitialSelectManySearchValue("");
    };

    const handleNext = () => {
        //validating required fields
        if (
            (!form[currentControl.name] ||
                form[currentControl.name].length === 0) &&
            currentControl.required == true
        ) {
            showAlert(currentControl.label + " is a required field");

            return;
        }
        setStep(step + 1);
    };

    const showAlert = alertMessage => {
        setAlertMessage(alertMessage);
        setIsAlert(true);

        setTimeout(() => {
            setIsAlert(false);
        }, 2000);
    };

    const handleRemoveSelected = val => {
        const valArray = form[currentControl.name];

        const newArray = valArray.filter(v => {
            return val !== v;
        });

        setForm({
            ...form,
            [currentControl.name]: newArray
        });
    };

    const handlers = useSwipeable({
        onSwipedLeft: eventData => {
            eventData.event.stopPropagation();

            if (currentControl.name == formData[formData.length - 1].name) {
                handleSubmit(form);
            }
            handleNext(); // forward
        },
        onSwipedRight: eventData => {
            eventData.event.stopPropagation();

            step === 0 ? backArrow() : setStep(step - 1);
        },
        delta: 50, // 👈 balanced sensitivity
        swipeDuration: 500,
        preventScrollOnSwipe: true,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true // also works on desktop
    });

    return (
        <div {...handlers} style={{ height: "100vh" }}>
            {isAlert && <Alert message={alertMessage} type="error" />}
            <form
                onSubmit={Submits}
                className={`form` + " " + className}
                onClick={handleFormClick}
            >
                {/* Show Only One Field */}
                <div className="form-group">
                    <label htmlFor={currentControl.name}>
                        {currentControl.label}
                        {currentControl.type === "select-many" &&<button className="btn btn-primary">Add New</button>}
                    </label>
                    {currentControl.type === "select-many" && (
                        <div className="select-many-container">
                            <div className="selected-valueso">
                                {currentControl.options
                                    .filter(val => {
                                        return String(val.label)
                                            .toLowerCase()
                                            .includes(
                                                String(
                                                    initialSelectManySearchValue
                                                ).toLowerCase()
                                            );
                                    })
                                    .map(opt => (
                                        <button
                                            onClick={() =>
                                                handleSelectValues(
                                                    opt.value,
                                                    opt.label
                                                )
                                            }
                                            key={opt.value}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                            </div>
                            <div className="selected">
                                {form[currentControl.name].map(val => (
                                    <div key={val}>
                                        <span>{getLabelID(val, true)}</span>{" "}
                                        <MdCancel
                                            onClick={() =>
                                                handleRemoveSelected(val)
                                            }
                                            className="cancel"
                                            size={25}
                                        />
                                    </div>
                                ))}
                            </div>
                            <input
                                name={currentControl.name}
                                id={currentControl.name}
                                type="text"
                                value={initialSelectManySearchValue}
                                onChange={handleSelectSearch}
                                placeholder={currentControl.placeholder}
                                // disables phone keyboard
                            />
                        </div>
                    )}
                    {currentControl.type === "select" && (
                        <>
                            <select
                                name={currentControl.name}
                                id={currentControl.name}
                                value={form[currentControl.name]}
                                onChange={handleChange}
                            >
                                <option value="" selected disabled>
                                    Select {currentControl.label}
                                </option>
                                {currentControl.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {(currentControl.type === "text" ||
                        currentControl.type === "number" ||
                        currentControl.type === "date") && (
                        <input
                            name={currentControl.name}
                            id={currentControl.name}
                            type={currentControl.type}
                            value={form[currentControl.name]}
                            onChange={handleChange}
                            placeholder={currentControl.placeholder}
                            // disables phone keyboard
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="buttons">
                    <button
                        type="button"
                        disabled={step === 0 && formId === "formPatient"}
                        onClick={
                            step === 0 ? backArrow : () => setStep(step - 1)
                        }
                    >
                        <FaArrowLeft />
                    </button>

                    {reviewClicked && (
                        <button onClick={() => handleReview(form, formId)}>
                            Review
                        </button>
                    )}

                    {step < formData.length - 1 ? (
                        <button type="button" onClick={handleNext}>
                            <FaArrowRight />
                        </button>
                    ) : (
                        <button type="button" onClick={Submit}>
                            <MdSend />
                        </button>
                    )}
                </div>

                {currentControl.type === "number" && (
                    <CustomKeyboard
                        value={form[currentControl.name]}
                        setValue={val =>
                            setForm({ ...form, [currentControl.name]: val })
                        }
                    />
                )}
                {currentControl.type === "date" && (
                    <DateInput
                        value={form[currentControl.name]}
                        setValue={val =>
                            setForm({ ...form, [currentControl.name]: val })
                        }
                    />
                )}
                {currentControl.type === "text" && (
                    <AlphanumericInput
                        value={form[currentControl.name]}
                        setValue={val =>
                            setForm({ ...form, [currentControl.name]: val })
                        }
                    />
                )}

                {currentControl.type === "select-many" && (
                    <AlphanumericInput
                        value={initialSelectManySearchValue}
                        setValue={val => setInitialSelectManySearchValue(val)}
                    />
                )}

                {currentControl.type === "select" && (
                    <SelectValues
                        value={form[currentControl.name]}
                        setValue={val =>
                            setForm({ ...form, [currentControl.name]: val })
                        }
                        values={currentControl.options}
                    />
                )}
            </form>
        </div>
    );
};

export default FormDynamic;
