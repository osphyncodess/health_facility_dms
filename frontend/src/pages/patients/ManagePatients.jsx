import { useContext, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../../api";
import { FaEye, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

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

const ManagePatients = () => {
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [searchNumber, setSearchNumber] = useState("");
  const [patients, setPatients] = useState([]);
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoadingPatients(true);
    api
      .get(`/patients/get_all_opd.php?id=${searchNumber}`)
      .then((res) => {
        setPatients(res.data);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoadingPatients(false);
      });
  };

  function handleViewPatient(patientID) {
    navigate(`/patients/${patientID}/`);
  }

  return (
    <div style={{ padding: "10px" }}>
      <Form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <Form.Control
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          type="number"
          placeholder="Search"
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </Form>

      <Card style={{ marginTop: "20px" }}>
        <Card.Header>
          <Card.Title>Search Result Table</Card.Title>
        </Card.Header>
        <Card.Body>
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
                {patients.map((patient) => {
                  const conditions = patient.conditions.map(
                    (c) => c.diseaseName,
                  );

                  return (
                    <tr key={patient.patientID}>
                      <td>{patient.serialNumber}</td>
                      <td>{patient.visit_date}</td>
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
                        {isAdmin && (
                          <button className="btn btn-danger">
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManagePatients;
