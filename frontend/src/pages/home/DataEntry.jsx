import { useEffect, useState } from "react";
import FormDynamic from "../../components/FormDynamic";
import { createPatient, getLabelID, makeFormValues } from "../../api";
import { MdArrowBack, MdCancel, MdOutlineCancel } from "react-icons/md";
import {
    FaArrowLeft,
    FaArrowRight,
    FaEdit,
    FaPlusCircle,
    FaTrash
} from "react-icons/fa";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import api from "../../api";


function DataEntry() {
    const initialState = {
        villages: [],
        diseases: [],
        treatments: [],

        patientData: null,
        diagnosisData: null,
        diagnosisArray: [],

        isPatientData: true,
        submit: false,
        step: 0,
        currentText: "Patient Details",

        reviewClicked: false,
        addNewClicked: false,
        isDiagnosisEdit: false,
        editIndex: null,

        isLoading: false,
        loadingMessage: "",

        submitNow: false,
        sync: false,

        isAlert: false,
        alertMessage: "",
        alertType: "error",

        lastOpd: null
    };
    const [villages, setVillages] = useState([]);
    const [diseases, setDiseases] = useState([]);
    const [treatments, setTreatments] = useState([]);
    // defining form data for patient details and diagnosis and treatment
    const formPatientData = [
        {
            type: "number",
            name: "serialNumber",
            label: "Serial Number",
            placeholder: "Enter Serial Number",
            required: true
        },
        {
            type: "date",
            name: "date",
            label: "Date",
            required: true
        },
        {
            type: "text",
            name: "name",
            label: "Name",
            placeholder: "Enter your name"
        },
        {
            type: "select-many",
            name: "village",
            label: "Village",
            options: villages,
            default: "",
            required: true
        },
        {
            type: "number",
            name: "age",
            label: "Age",
            placeholder: "Enter Age",
            required: true
        },
        {
            type: "select",
            name: "gender",
            label: "Sex and Pregnancy Status",
            options: [
                { value: "FP", label: "FP" },
                { value: "FNP", label: "FNP" },
                { value: "FU", label: "FU" },
                { value: "Male", label: "Male" }
            ],
            default: "FNP",
            require: true
        },
        {
            type: "select",
            name: "hiv_status",
            label: "HIV Test / ART Status",
            options: [
                { value: "prev_pos_no_art", label: "Previous Pos, not on ART" },
                { value: "prev_pos_art", label: "Previous Pos, on ART" },
                { value: "new_neg", label: "New Negative" },
                { value: "new_pos", label: "New Positive" },
                { value: "not_done", label: "Not Done" }
            ],
            default: "not_done",
            required: true
        }
    ];

    const formDiagnosisData = [
        {
            type: "select",
            name: "test",
            label: "Test Conducted",
            options: [{ value: "MRDT", label: "MRDT" }],
            default: ""
        },
        {
            type: "select",
            name: "result",
            label: "Test Result",
            options: [
                { value: "Negative", label: "Negative" },
                { value: "Positive", label: "Positive" }
            ],
            default: ""
        },
        {
            type: "select-many",
            name: "diagnosis",
            label: "Diagnosis(Code)",
            options: diseases,
            default: "",
            required: true
        },

        {
            type: "select-many",
            name: "treatment",
            label: "Treatment",
            placeholder: "Search treatments/medications given.",
            options: treatments,
            default: "",
            required: true,
            multiSelect: true
        }
    ];

    //here we difine state values for managing our forms
    const [patientData, setPatientData] = useState(null);
    const [diagnosisData, setDiagnosisData] = useState(null);
    const [isPatientData, setIsPatientData] = useState(true);
    const [submit, setSubmit] = useState(false);
    const [currentText, setCurrentText] = useState("Patient Details");
    const [step, setStep] = useState(0);
    const [reviewClicked, setReviewClicked] = useState(false);
    const [addNewClicked, setAddNewClicked] = useState(false);
    const [diagnosisArray, setDiagnosisArray] = useState([]);
    const [isDiagnosisEdit, setIsDiagnosisEdit] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [submitNow, setSubmitNow] = useState(false);
    const [sync, setSync] = useState(false);
    const [alertType, setAlertType] = useState("error");
    const [lastOpd, setLastOpd] = useState(null);
    const [currObj, setCurrObj] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            api.get("/get_villages_treatments_diseases.php")
                .then(res => {
                    console.log(res.data);
                    const villages = res.data.villages.map(village => ({
                        value: village.id,
                        label: village.village
                    }));
                    setVillages(villages);

                    const diseases = res.data.diseases.map(disease => ({
                        value: disease.id,
                        label:
                            disease.diseaseName +
                            "(" +
                            disease.diseaseCode +
                            ")",
                        code: disease.diseaseCode
                    }));
                    setDiseases(diseases);

                    const treatments = res.data.treatments.map(treatment => ({
                        value: treatment.id,
                        label: treatment.treatment
                    }));
                    setTreatments(treatments);
                })
                .catch(err => console.log(err));
        }, 0);
    }, []);

    useEffect(() => {
        api.get("/get_max_opd_num.php")
            .then(res => {
                console.log(res.data.last_opd);
                console.log(initialPatentData);
                if (res.data.last_opd) {
                    initialPatentData["serialNumber"] = res.data.last_opd + 1;
                }
            })
            .catch(err => console.log(err));
    }, []);

    const initialPatentData = patientData || makeFormValues(formPatientData);
    const initialDiagnosisData =
        diagnosisData || makeFormValues(formDiagnosisData);
    const [isAlert, setIsAlert] = useState(false);

    const [alertMessage, setAlertMessage] = useState(
        "This is an alert message"
    );
    const navigate = useNavigate();

    const handleSubmit = form => {
        if (isPatientData) {
            setPatientData(form);
            setIsPatientData(false);
            setCurrentText("Diagnosis and Treatment");
            setStep(0);
            // handleAddNew();
        } else {
            handleAddNew();
            setDiagnosisData(form);

            if (isDiagnosisEdit) {
                var newDiagnosisArray = diagnosisArray;
                newDiagnosisArray[editIndex] = form;

                setDiagnosisArray(newDiagnosisArray);
            } else {
                diagnosisArray.push(form);
            }

            // console.log(diagnosisArray);
            // setIsPatientData(false);
            // setCurrentText("Review & Submit");
            // setSubmit(true);
        }
    };

    const handleReview = (form, formId) => {
        if (formId == "formPatient") {
            setPatientData(form);
        } else if (formId === "formDiagnosis") {
            setDiagnosisData(form);
        }

        setIsPatientData(false);
        setCurrentText("Review & Submit");
        setSubmit(true);
    };

    //clicking review patient details paragraph
    const handlePatientReviewClick = index => {
        setReviewClicked(true);
        setStep(index);
        setSubmit(false);
        setCurrentText("Patient Details");
        setIsPatientData(true);
    };

    //clicking Diagnosis details paragraph
    const handleDiagnosisReviewClick = index => {
        setReviewClicked(true);
        setStep(index);
        setSubmit(false);
        setCurrentText("Diagnosis and Treatment");
        setIsPatientData(false);
    };

    const handleAddNew = (resetStep = false) => {
        setAddNewClicked(!addNewClicked);
        setIsDiagnosisEdit(false);

        if (resetStep) {
            setStep(0);

            setDiagnosisData(makeFormValues(formDiagnosisData));
        }
    };

    //clicking Diagnosis details paragraph
    const handleReviewBackButtonClick = () => {
        setStep(formDiagnosisData.length - 1);
        setSubmit(false);
        setCurrentText("Diagnosis and Treatment");
        setIsPatientData(false);
    };

    //clicking Diagnosis details paragraph
    const handleNotFirstBackArrow = () => {
        setStep(formPatientData.length - 1);
        setSubmit(false);
        setCurrentText("Patient Details");
        setIsPatientData(true);
    };

    const handleEdit = index => {
        setStep(0);
        setEditIndex(index);
        setIsDiagnosisEdit(true);
        setDiagnosisData(diagnosisArray[index]);
        setAddNewClicked(true);
    };

    const handleDelete = index => {
        setDiagnosisArray(
            diagnosisArray.filter((val, i) => {
                return index !== i;
            })
        );
    };

    const showAlert = (alertMessage, seconds = 3000, type = "error") => {
        setAlertMessage(alertMessage);
        setAlertType(type);
        setIsAlert(true);

        setTimeout(() => {
            setIsAlert(false);
        }, seconds);
    };

    const handleSubmitToDatabase = () => {
        setSubmitNow(true);

        formPatientData.forEach(d => {
            if (d.required == true && !patientData[d.name]) {
                showAlert(d.label + " is a mandatory field");
                setSubmitNow(false);
                return;
            }
        });

        //validating age field
        const age = Number(patientData["age"]);

        if (age < 0 || age > 90) {
            showAlert("Age should be between 0 and 90");
            setSubmitNow(false);
            return;
        }

        if (diagnosisArray.length === 0) {
            showAlert("Please Add atleast 1 diagnosis" + (index + 1));
            setSubmitNow(false);
            return;
        }

        //validating diagnosis and treatment
        diagnosisArray.forEach((arr, index) => {
            formDiagnosisData.forEach(d => {
                if (
                    d.required == true &&
                    (!arr[d.name] || arr[d.name].length == 0)
                ) {
                    showAlert(
                        d.label +
                            " is a mandatory field, check 'Diagnosis and Treatment Table' row # =>" +
                            (index + 1)
                    );
                    setSubmitNow(false);
                    return;
                }
            });

            // validating multiple selected diagnosis
            if (arr["diagnosis"].length > 1) {
                showAlert(
                    "Multilple diagnosis detected on row #" + (index + 1)
                );
                setSubmitNow(false);
                return;
            }

            //validating lab

            if (arr["result"] && !arr["test"]) {
                showAlert(
                    "Result without test, Please make corrections row #" +
                        (index + 1)
                );

                setSubmitNow(false);
                return;
            }

            if (!arr["result"] && arr["test"]) {
                showAlert(
                    "Test without Result, Please make corrections row #" +
                        (index + 1)
                );

                setSubmitNow(false);
                return;
            }

            if (
                arr["result"] == "Positive" &&
                !String(arr["diagnosis"][0]).includes("Malaria")
            ) {
                showAlert(
                    "MRDT Result is Positive and Diagnosis should be Malaria, Please make corrections row #" +
                        (index + 1)
                );

                setSubmitNow(false);
                return;
            }

            if (
                arr["result"] == "Negative" &&
                String(arr["diagnosis"][0]).includes("Malaria")
            ) {
                showAlert(
                    "MRDT Result is Negative and Diagnosis should not be Malaria, Please make corrections row #" +
                        (index + 1)
                );

                setSubmitNow(false);
                return;
            }

            var condArr = [];

            diagnosisArray.forEach(d => {
                var exists = false;

                if (condArr.includes(d.diagnosis[0])) {
                    showAlert("Dublicate Conditions detected.");
                    setSubmitNow(false);
                    return;
                }

                condArr.push(d.diagnosis[0]);
            });
        });

        setSync(!sync);
        return;
    };

    useEffect(() => {
        if (submitNow) {
            setLoadingMessage("Saving...");
            setIsLoading(false);

            const data = {
                p: patientData,
                d: diagnosisArray
            };

            console.log(data);

            try {
                const response = createPatient(data, true);

                response.then(datas => {
                    console.log(datas);

                    setTimeout(() => {
                        setIsLoading(false);
                        showAlert(datas["message"], 3000, datas["type"]);
                    }, 500);

                    patientData["serialNumber"] =
                        Number(patientData["serialNumber"]) + 1;
                    patientData["gender"] = "";
                    patientData["village"] = [];
                    patientData["age"] = "";
                    setDiagnosisArray([]);
                    navigate("/patients/create");
                });
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        }

        setSubmitNow(false);
    }, [submitNow, sync]);

    return (
        <div>
            <div className="buttonss">
                <button onClick={() => navigate("/")}>Back</button>
            </div>

            <div className="review-container" container>
                {isAlert && <Alert message={alertMessage} type={alertType} />}
                <h2>{currentText}</h2>
                {isLoading && <Spinner Message={loadingMessage} />}
                {/* </a> */}
                {!submit && !isPatientData && (
                    <div className="review-container">
                        <div className="diagnosisData">
                            <DiagnosisTable
                                formDiagnosisData={formDiagnosisData}
                                diagnosisArray={diagnosisArray}
                                handleDelete={handleDelete}
                                handleEdit={handleEdit}
                                showDeleteEdit={true}
                            />
                        </div>
                        <div className="buttons">
                            <button onClick={handleNotFirstBackArrow}>
                                <FaArrowLeft />
                            </button>
                            <button onClick={() => handleAddNew(true)}>
                                <FaPlusCircle size={30} />
                            </button>
                            <button onClick={handleReview}>
                                <FaArrowRight />
                            </button>
                        </div>

                        {addNewClicked && (
                            <div className="modals">
                                <MdOutlineCancel
                                    className="modals-close"
                                    onClick={handleAddNew}
                                    color="red"
                                    size={40}
                                />
                                <FormDynamic
                                    formData={formDiagnosisData}
                                    handleSubmit={handleSubmit}
                                    formValues={initialDiagnosisData}
                                    step={step}
                                    setStep={setStep}
                                    backArrow={handleNotFirstBackArrow}
                                    handleReview={handleReview}
                                    formId={"formDiagnosis"}
                                    reviewClicked={reviewClicked}
                                />
                            </div>
                        )}
                    </div>
                )}

                {!submit && isPatientData && (
                    <FormDynamic
                        formData={formPatientData}
                        handleSubmit={handleSubmit}
                        formValues={initialPatentData}
                        step={step}
                        setStep={setStep}
                        backArrow={handleNotFirstBackArrow}
                        handleReview={handleReview}
                        formId={"formPatient"}
                        reviewClicked={reviewClicked}
                    />
                )}

                {submit && (
                    <div className="review-container">
                        <h3>Patient Data</h3>
                        <div className="review-values">
                            {formPatientData.map((d, index) => {
                                return (
                                    <p
                                        key={index}
                                        onClick={() =>
                                            handlePatientReviewClick(index)
                                        }
                                    >
                                        {d.label}:{" "}
                                        <span className="review-span">
                                            {d.name === "village"
                                                ? getLabelID(
                                                      patientData[d.name],
                                                      true
                                                  )
                                                : patientData[d.name]}
                                        </span>
                                    </p>
                                );
                            })}
                        </div>

                        <hr />
                        <br />

                        <h3>Diagnosis & Treatment</h3>
                        <DiagnosisTable
                            formDiagnosisData={formDiagnosisData}
                            diagnosisArray={diagnosisArray}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                            showDeleteEdit={false}
                        />
                        <br />
                        <hr />

                        <div className="buttons">
                            <button onClick={handleReviewBackButtonClick}>
                                Back
                            </button>
                            <button onClick={handleSubmitToDatabase}>
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const DiagnosisTable = ({
    formDiagnosisData,
    diagnosisArray,
    handleEdit,
    handleDelete,
    showDeleteEdit = false
}) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    {formDiagnosisData.map(d => (
                        <th key={d.name}>{d.label}</th>
                    ))}
                    {showDeleteEdit && <th>Action</th>}
                </tr>
            </thead>
            <tbody>
                {diagnosisArray.map((d, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{d.test ? d.test : "Not Done"}</td>
                        <td>{d.result ? d.result : "N/A"}</td>
                        <td>{getLabelID(d.diagnosis, true)}</td>
                        <td>
                            <ul>
                                {d.treatment.map(val => (
                                    <li key={val}>{getLabelID(val, true)}</li>
                                ))}
                            </ul>
                        </td>

                        {showDeleteEdit && (
                            <td className="action-buttons">
                                <button onClick={() => handleEdit(index)}>
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(index)}>
                                    <FaTrash />
                                </button>
                            </td>
                        )}
                    </tr>
                ))}

                {diagnosisArray.length === 0 && (
                    <tr>
                        <td colSpan={5}>
                            <p>
                                No "Diagnosis and Treatment" Data recorded yet!
                            </p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DataEntry;
