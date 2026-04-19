import { useEffect, useState } from "react";
import { Col, Row, Card, Button, Modal, Table, Spinner } from "react-bootstrap";
import api from "../../api";
import Alert from "../../components/Alert";
import { useUI } from "../../layouts/UIProvider";

const AlertsPage = () => {
  const [issues, setIssues] = useState({
    ari_over_five: 0,
    urti_less_five: 0,
  });

  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentID, setCurrentID] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const { confirm, toast, alert } = useUI();

  //Alerts states
  const [alertMessage, setAlertMessage] = useState("This is an Alert");
  const [alertType, setAlertType] = useState("error");
  const [showAlerts, setShowAlerts] = useState(false);

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

  const fetchData = () => {
    api
      .get("/issues/ari_urti.php")
      .then((res) => setIssues(res.data))
      .catch((e) => console.log(e));
  };
  const handleClick = (what, handleModal = true) => {
    what === "ario"
      ? setTitle("ARI patients Over 5 Years of Age")
      : setTitle("URTI patients Less Than 5 Years of Age");

    if (handleModal) {
      setShowModal(!showModal);
    }

    setData([]);
    api
      .get("/issues/ari_urti.php?type=list")
      .then((res) =>
        what === "ario"
          ? setData(res.data.ari_over_five)
          : setData(res.data.urti_less_five),
      )
      .catch((e) => console.log(e));
  };

  const handleFix = (conditionID, opdNumber) => {
    setShowModal(false);
    let what = "";

    title === "ARI patients Over 5 Years of Age"
      ? (what = "ario")
      : (what = "urtil");

    confirm({
      title: what === "ario" ? "Fix ARI Issue!" : "Fix URTI Issue!",
      message: `Are you sure you want to perform fix for OPD Number ${opdNumber}?`,
      confirmText: "Fix",
      variant: "danger",
      onConfirm: () => {
        setShowModal(true);

        let data = { id: conditionID, what: what };

        setShowSpinner(true);
        setCurrentID(conditionID);
        api
          .post("/issuess/ari_urti_fix_one.php", data)
          .then((res) => {
            console.log(res.data);
            fetchData();
            handleClick(what, false);
            toast({
              message: "Issue fixed successfully!",
              variant: "success",
            });
          })
          .catch((e) => {
            console.log(e);
            toast({
              message: "Something went Wrong!",
              variant: "danger",
            });
          })
          .finally(() => {
            setShowSpinner(false);
          });
      },
      onClose: async () => {
        setShowModal(true);
      },
    });
  };

  return (
    <div style={{ padding: "10px" }}>
      {showAlerts && <Alert message={alertMessage} type={alertType} />}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(!showModal);
        }}
        size="xl"
      >
        <Modal.Header closeButton>{title}</Modal.Header>
        <Modal.Body style={{ position: "relative", overflow: "auto" }}>
          <Table striped responsive>
            <thead>
              <tr>
                <th>OPD Number</th>
                <th>Age</th>
                <th>Condition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.patientID}>
                  <td>{d.serialNumber}</td>
                  <td>{d.age}</td>
                  <td>{d.diseaseName}</td>
                  <td>
                    <Button
                      disabled={showSpinner}
                      onClick={() => handleFix(d.id, d.serialNumber)}
                    >
                      {showSpinner && d.id === currentID ? <Spinner /> : "Fix"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title>ARI Clients over 5 Years</Card.Title>
            </Card.Header>
            <Card.Body>
              <h2>{issues["ari_over_five"]}</h2>
              <Button onClick={() => handleClick("ario")}>View</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title>URTI Clients Less than 5 Years</Card.Title>
            </Card.Header>
            <Card.Body>
              <h2>{issues["urti_less_five"]}</h2>
              <Button onClick={() => handleClick("urtil")}>View</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AlertsPage;
