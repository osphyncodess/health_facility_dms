import {
  FaArrowLeft,
  FaBackward,
  FaHospital,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import "../../assets/css/patient_details.css";
import { useEffect, useState } from "react";
import api from "../../api";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      api
        .get(`/get_patient.php?id=${id}`)
        .then((res) => {
          setPatient(res.data);
        })
        .catch((err) => console.log(err));
    }, 0);
  }, []);

  return (
    <div className="review-container patient-details">
      <div className="top-section">
        <div className="left">
          <button
            className="btn btn-secondary"
            onClick={() => {
              navigate("/patients");
            }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <span>OPD-{patient.serialNumber}</span>
          </div>
          <div>
            Visit Date: <span>{patient.date}</span>
          </div>
        </div>
        <div className="right">
          <button className="btn btn-danger">
            <FaTrash />
            Void
          </button>
        </div>
      </div>
      <div className="details">
        <div className="patient card">
          <div className="card-title">
            <h3>Patient Details</h3>
          </div>
          <div className="card-body">
            <div className="label-value card" onDoubleClick={() => alert(123)}>
              <div className="label">Name</div>
              <div className="value">
                {patient.name ? patient.name : "None"}
              </div>
            </div>
            <div className="label-value card">
              <div className="label">Sex & Preg Status</div>
              <div className="value">{patient.gender}</div>
            </div>
            <div className="label-value card">
              <div className="label">Age</div>
              <div className="value">{patient.age}</div>
            </div>
            <div className="label-value card">
              <div className="label">Village</div>
              <div className="value">{patient.village}</div>
            </div>
            <div className="label-value card">
              <div className="label">HIV Test/ART Status</div>
              <div className="value">{patient.hiv_status}</div>
            </div>
          </div>
        </div>
        <div className="diagnosis card" style={{ marginTop: "10px" }}>
          <div
            className="card-title"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="title">Diagnosis & Treatment</div>
            <div className="toggle" style={{ display: "flex", gap: "5px" }}>
              <button style={{ width: "90px" }} className="btn btn-secondary">
                1
              </button>
              <button style={{ width: "90px" }} className="btn">
                2
              </button>
              <button style={{ width: "90px" }} className="btn">
                3
              </button>
            </div>
          </div>

          <div className="diagnosis-body">
            <div className="lab">
              <div className="title">Lab Info</div>
              <div className="val-label">
                <div className="label">Test Conducted</div>
                <div className="value">MRDT</div>
              </div>
              <div className="val-label">
                <div className="label">Result</div>
                <div className="value">Negative</div>
              </div>
            </div>
            <div className="condition">
              <div className="title">Disease / Code</div>

              <div className="body">
                <div className="val-label">
                  <div className="label">Condition</div>
                  <div className="value">Malaria In Pregnancy</div>
                </div>
                <div className="val-label">
                  <div className="label">Code</div>
                  <div className="value">32A</div>
                </div>
              </div>
            </div>
            <div className="treatments">
              <div className="title">Treatments</div>
              <div className="values val-label">
                <div className="value">
                  <div className="bullet"></div>
                  <div className="value">Paracetamo 125mg</div>
                </div>
                <div className="value">
                  <div className="bullet"></div>
                  <div className="value">Amoxycillin Lativa 500mg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
