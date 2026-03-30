import "../../assets/css/home.css";
import api from "../../api";
import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Loader component remains same
const Loader = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, idx) => (
      <tr key={idx}>
        {Array.from({ length: 8 }).map((_, i) => (
          <td key={i}>
            <Skeleton height={20} width="100%" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const HomePage = () => {
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10; // Change as needed

  const navigate = useNavigate();

  useEffect(() => {
    api.get("patients/get_all.php")
      .then(res => {
        setPatients(res.data);
        setLoadingPatients(false);
      })
      .catch(err => console.log(err));
  }, []);

  function handleViewPatient(patientID) {
    navigate(`/patients/${patientID}/`);
  }

  function handleLink(e) {
    e.preventDefault();
    navigate("/patients/create/");
  }

  // Pagination calculations
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  function paginate(pageNumber) {
    setCurrentPage(pageNumber);
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
      <br /><br />

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

        {!loadingPatients && (
          <tbody>
            {currentPatients.map(patient => {
              const conditions = patient.conditions.map(c => c.diseaseName);

              return (
                <tr key={patient.patientID}>
                  <td>{patient.serialNumber}</td>
                  <td>{patient.date}</td>
                  <td>{patient.name}</td>
                  <td>{patient.village}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.age}</td>
                  <td>{conditions.join(", ")}</td>
                  <td>
                    <button
                      onClick={() => handleViewPatient(patient.patientID)}
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

      {/* Pagination Controls */}
      {!loadingPatients && totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => paginate(idx + 1)}
              className={currentPage === idx + 1 ? "active" : ""}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;