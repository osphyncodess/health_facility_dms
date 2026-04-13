import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Navbar,
  Form,
  Nav,
  Spinner,
  Modal,
  Button,
  TabContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Legend,
} from "recharts";

import {
  MdDashboard,
  MdPeople,
  MdBarChart,
  MdSettings,
  MdOutlineWifiTetheringError,
} from "react-icons/md";

import { AuthContext } from "../../auth/AuthContext";
import Alert from "../../components/Alert";

import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../api";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaLink,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

const Dashboard = () => {
  const [inm, setInm] = useState("Loading...");
  const [stats, setStats] = useState([
    { title: inm, value: "" },
    { title: inm, value: "" },
    { title: inm, value: "" },
    { title: inm, value: "" },
  ]);

  const [dateDistribution, setDateDistribution] = useState([]);

  //alert message states
  const [alertMessage, setAlertMessage] = useState("This is an Alert");
  const [alertType, setAlertType] = useState("error");
  const [showAlerts, setShowAlerts] = useState(false);

  const [showSubmitSpiner, setShowSubmitSpinner] = useState(false);
  const [conditions, setConditions] = useState([]);
  const { user, isAdmin } = useContext(AuthContext);

  const [showSpinner, setShowSpinner] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLaRegModal, setShowLaRegModal] = useState(false);
  const [what, setWhat] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedOPD, setSelectedOPD] = useState(null);
  const [selectedLa, setSelectedLa] = useState("");
  const [malariaTreatments, setMalariaTreatements] = useState([]);
  // Pagination calculations==================================================================================================
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [change, setChanged] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5; // Change as needed

  const navigate = useNavigate();

  //   useEffect(() => {
  //     api
  //       .get("patients/get_all.php")
  //       .then((res) => {
  //         setPatients(res.data);
  //         setLoadingPatients(false);
  //       })
  //       .catch((err) => console.log(err));
  //   }, []);

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
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient,
  );
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  function paginate(pageNumber) {
    setCurrentPage(pageNumber);
  }

  // Pagination buttons
  const goFirst = () => setCurrentPage(1);
  const goLast = () => setCurrentPage(totalPages);
  const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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

  //==============================================================================================================================
  //==============================================================================================================================

  const fetchData = () => {
    setShowSpinner(true);

    api
      .get("/dashboard/dashboard.php", {
        params: {
          filterType,
          date1,
          date2,
        },
      })
      .then((res) => {
        //return;
        console.log(res.data);
        if (res.data.status) {
          const d = res.data.data;

          setStats(d.stats);
          setDateDistribution(d.dateDistribution);
          setConditions(d.conditions);
        }
        setShowSpinner(false);
        setChanged(false);
      })
      .catch(() => setShowSpinner(false));

    api
      .get("/treatments/get_all.php")
      .then((res) => setMalariaTreatements(res.data))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const AlertThem = (message, type, duration = 3000) => {
    setShowAlerts(true);
    setAlertMessage(message);
    setAlertType(type);

    setTimeout(() => {
      setShowAlerts(false);
    }, duration);
  };

  const handleStatsClick = async (thing) => {
    setCurrentPage(1);
    setShowModal(!showModal);
    setWhat(thing);
    let url = "";

    setLoadingPatients(true);
    switch (thing) {
      case "Patients":
        url = "patients/get_all.php";
        break;
      case "Malaria Patients":
        url = "dashboard/get_malaria_patients.php";
        break;
      case "MP in La Register":
        url = "dashboard/get_mp_in_la_reg.php";
        break;
      case "MP Not in La Register":
        url = "dashboard/get_malaria_patients_not_in_la_reg.php";
        break;

      default:
        break;
    }

    setPatients([]);

    const storedData = JSON.parse(localStorage.getItem(thing));

    if (storedData) {
      setPatients(storedData);
      setLoadingPatients(false);
      return;
    }

    api
      .get(url)
      .then((res) => {
        setPatients(res.data);
        setLoadingPatients(false);
        localStorage.setItem(thing, JSON.stringify(res.data));
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = () => {
    setShowSubmitSpinner(true);
    const data = {
      user: user.id,
      la_given: selectedLa,
      patientID: selectedPatient,
    };

    api.post("/la_register/create.php", data).then((res) => {
      if (res.data.status) {
        AlertThem(res.data.message, res.data.type);
        clearLocalStorage();
        setShowSubmitSpinner(false);
        setChanged(true);
        handleLaModalClose();
      } else {
        AlertThem(res.data.message, res.data.type);
        setShowSubmitSpinner(false);
      }
    });
  };

  useEffect(() => {
    clearLocalStorage(true);
  }, []);

  function clearLocalStorage(All = false) {
    localStorage.removeItem("MP Not in La Register");
    localStorage.removeItem("MP in La Register");

    if (All) {
      localStorage.removeItem("Malaria Patients");
      localStorage.removeItem("Patients");
    }
  }

  function handleLaModalClose() {
    setShowLaRegModal(!showLaRegModal);
    setSelectedLa("");
    handleStatsClick("MP Not in La Register");
  }
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {showAlerts && <Alert message={alertMessage} type={alertType} />}
      {/* MAIN */}
      <div style={{ flex: 1, background: "#f5f6fa" }}>
        {/* TOP NAV */}
        <Navbar bg="white" className="px-3 shadow-sm">
          <Navbar.Brand>Intergrated Dashboard</Navbar.Brand>
          <Form className="d-flex ms-auto">
            <Form.Control placeholder="Search..." />
          </Form>
        </Navbar>

        {/* Client List Modal */}
        <Modal show={showLaRegModal} onHide={handleLaModalClose}>
          <Modal.Header color="rgb(0,0,0)" closeButton>
            <Modal.Title color="black">
              Link OPD #-{selectedOPD} With La Register
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label htmlFor="la_given">Select LA Given</Form.Label>
                <Form.Select
                  value={selectedLa}
                  onChange={(e) => setSelectedLa(e.target.value)}
                  id="la_given"
                >
                  <option value="" selected disabled>
                    Select La
                  </option>
                  {malariaTreatments.map((mt) => (
                    <option key={mt.id} value={mt.id}>
                      {mt.treatment}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <div style={{ width: "100%", display: "flex", gap: "10px" }}>
              <Button
                onClick={handleLaModalClose}
                style={{ width: "50%" }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} style={{ width: "50%" }}>
                {showSubmitSpiner ? <Spinner /> : <span>Submit</span>}
              </Button>
            </div>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(!showModal);

            if (change) {
              fetchData();
            }
          }}
          size="xl"
          backdrop="static"
          style={{ overflowX: "auto" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {what}({patients.length})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                  {currentPatients.map((patient) => {
                    const conditions = patient.conditions.map(
                      (c) => c.diseaseName,
                    );

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
                          {what === "MP Not in La Register" && isAdmin && (
                            <Button
                              variant="secondary"
                              className="me-1"
                              onClick={() => {
                                setSelectedPatient(patient.patientID);
                                setSelectedOPD(patient.serialNumber);
                                setShowLaRegModal(!showLaRegModal);
                                setShowModal(!showModal);
                              }}
                            >
                              <FaLink />
                            </Button>
                          )}

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
          </Modal.Body>
          <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
            {/* Pagination Controls */}
            {!loadingPatients && totalPages > 1 && (
              <nav className="d-flex justify-content-center mt-3">
                <ul className="pagination">
                  {/* First */}
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button className="page-link" onClick={goFirst}>
                      <FaAngleDoubleLeft />
                    </button>
                  </li>

                  {/* Prev */}
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
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
                      <li
                        key={idx}
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ),
                  )}

                  {/* Next */}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button className="page-link" onClick={goNext}>
                      <FaAngleRight />
                    </button>
                  </li>

                  {/* Last */}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button className="page-link" onClick={goLast}>
                      <FaAngleDoubleRight />
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </Modal.Footer>
        </Modal>

        <Card className="shadow-sm mb-3">
          <Card.Body>
            <Row className="align-items-end">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter Type</Form.Label>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="previous_month">Previous Month</option>
                    <option value="specific_date">Specific Date</option>
                    <option value="between">Between Dates</option>
                    <option value="greater">Greater Than</option>
                    <option value="less">Less Than</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {(filterType === "specific_date" ||
                filterType === "greater" ||
                filterType === "less") && (
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              )}

              {filterType === "between" && (
                <>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>From</Form.Label>
                      <Form.Control
                        type="date"
                        value={date1}
                        onChange={(e) => setDate1(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>To</Form.Label>
                      <Form.Control
                        type="date"
                        value={date2}
                        onChange={(e) => setDate2(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </>
              )}

              <Col md={2}>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => fetchData()}
                >
                  Apply
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        {inm === "Something went wrong. Try again later!" && (
          <Container fluid className="p-4">
            <p>{inm}</p>
          </Container>
        )}
        {inm === "Loading..." && (
          <Container fluid className="p-4">
            {/* STATS */}
            <Row>
              {stats.map((s, i) => (
                <Col md={3} key={i}>
                  <Card
                    style={{ cursor: "pointer" }}
                    className="shadow-sm mb-3"
                    onClick={() => {
                      handleStatsClick(s.title);
                    }}
                  >
                    <Card.Body>
                      <h6>{s.title}</h6>
                      {showSpinner ? (
                        <Spinner />
                      ) : (
                        <>
                          <h3
                            style={{
                              color: "blue",
                            }}
                          >
                            {s.value}
                          </h3>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* CHARTS */}
            <Row>
              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h6>Patient Visits</h6>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={dateDistribution}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <legend />

                        <Line
                          type="monotone"
                          dataKey="patients"
                          stroke="#0d6efd"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h6>Patient visits date Distribution</h6>
                    <ResponsiveContainer
                      style={
                        showSpinner && {
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }
                      }
                      width="100%"
                      height={250}
                    >
                      {showSpinner && <Spinner />}
                      {!showSpinner && (
                        <BarChart data={dateDistribution}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="patients" fill="#198754" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* TABLE */}
            <Row className="mt-4">
              <Col>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h6>Conditions</h6>

                    <Table striped hover responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Condition</th>
                          <th>Total</th>
                          <th>Percent of total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conditions.map((c, index) => (
                          <tr key={c.diseaseName}>
                            <td>{index + 1}</td>
                            <td>{c.diseaseName}</td>
                            <td>{c.count}</td>
                            <td>{c.perc}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
