import "../../assets/css/home.css";
import api from "../../api";
import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash, FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const patientsPerPage = 5; // Change as needed

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

  // Pagination buttons
  const goFirst = () => setCurrentPage(1);
  const goLast = () => setCurrentPage(totalPages);
  const goPrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Helper to create pagination pages with ellipses
  const getPaginationPages = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); // first page
      let start = Math.max(currentPage - 1, 2);
      let end = Math.min(currentPage + 1, totalPages - 1);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages); // last page
    }
    return pages;
  };

  return (
    <div className="review-container">
      <h1>Welcome to OPR System</h1>
      <p>
        Use this system to keep records from OPR Register. If you want
        you can also enter other important information and store them
        here for your own use.
      </p>

      <a href="#" onClick={handleLink}>Click here to start collecting</a>
      <br /><br />

      <table className="table table-striped">
        <thead className="table-dark">
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
                      className="btn btn-primary me-1"
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
        <nav className="d-flex justify-content-center mt-3">
          <ul className="pagination">

            {/* First */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={goFirst}>
                <FaAngleDoubleLeft />
              </button>
            </li>

            {/* Prev */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={goPrev}>
                <FaAngleLeft />
              </button>
            </li>

            {/* Page numbers */}
            {getPaginationPages().map((page, idx) =>
              page === "..." ? (
                <li key={idx} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              ) : (
                <li key={idx} className={`page-item ${currentPage === page ? "active" : ""}`}>
                  <button className="page-link" onClick={() => paginate(page)}>
                    {page}
                  </button>
                </li>
              )
            )}

            {/* Next */}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={goNext}>
                <FaAngleRight />
              </button>
            </li>

            {/* Last */}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={goLast}>
                <FaAngleDoubleRight />
              </button>
            </li>

          </ul>
        </nav>
      )}
    </div>
  );
};

export default HomePage;