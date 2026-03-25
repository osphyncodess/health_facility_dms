import "../../assets/css/home.css";
import api from "../../api";
import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import ClipLoader from "react-spinners/SyncLoader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loader = () => (
    <tbody>
        {" "}
        <tr>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
        </tr>
        <tr>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
        </tr>
        <tr>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
        </tr>
        <tr>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
        </tr>
        <tr>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
            <td>
                <Skeleton height={20} width={"100%"} />
            </td>
        </tr>
    </tbody>
);

const HomePage = () => {
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            api.get("/get_patients.php")
                .then(res => {
                    console.log(res.data);
                    setPatients(res.data);
                    setLoadingPatients(false);
                })
                .catch(err => console.log(err));
        }, 10);
    }, []);

    function handleViewPatient(patientID) {
        navigate(`/patients/${patientID}/`);
    }

    const navigate = useNavigate();

    function handleLink(e) {
        e.preventDefault();

        navigate("/patients/create/");
    }

    return (
        <div className="review-container">
            <h1>Welcome to OPR System</h1>
            <p>
                Use this system to keep records from OPR Register. If you want
                you can also enter other important information and store them
                here for your own use.
            </p>

            <a onClick={handleLink}>Click here to start collecting</a>
            <br />
            <br />
            <table>
                <thead>
                    <tr>
                        <th>OPD Number</th>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Village</th>
                        <th>Sex</th>
                        <th>Age</th>
                        <th>Conditions</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                {loadingPatients && <Loader />}

                {patients.length > 0 && (
                    <tbody>
                        {patients.map(patient => {
                            const conditions = patient.conditions.map(
                                cond => cond.diseaseName
                            );

                            return (
                                <tr key={patient.id}>
                                    <td>{patient.serialNumber}</td>
                                    <td>{patient.date}</td>
                                    <td>{patient.name}</td>
                                    <td>{patient.village}</td>
                                    <td>{patient.gender}</td>
                                    <td>{patient.age}</td>
                                    <td>{conditions.join(", ")}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleViewPatient(
                                                    patient.patientID
                                                )
                                            }
                                            className="btn btn-primary"
                                        >
                                            <FaEye />
                                        </button>
                                        <button className="btn btn-danger">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                )}
            </table>
        </div>
    );
};

export default HomePage;
