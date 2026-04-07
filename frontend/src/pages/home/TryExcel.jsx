import { useState, useEffect, useContext } from "react";
import ExcelTable from "../../components/ExcelTable";
import api from "../../api";
import { AuthContext } from "../../auth/AuthContext";
import { Modal } from "react-bootstrap";
import VillageForm from "../../components/VillageForm";
import ConditionForm from "../../components/ConditionForm";
import TreatmentForm from "../../components/TreatmentForm";

const TryExcel = () => {
  const [villages, setVillages] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState(null);
  const [what, setWhat] = useState("");

  const columns = [
    { key: "opd_number", label: "OPD Number", type: "number", required: true },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "name", label: "Name", type: "text", required: false },
    {
      key: "village",
      label: "Village",
      type: "select",
      options: villages.map((village) => village.village),
      required: true,
    },
    {
      key: "gender",
      label: "Gender",
      type: "select",
      options: ["Female", "Male"],
      required: true,
    },
    { key: "age", label: "Age", type: "number", required: true },
    {
      key: "hiv_status",
      label: "HIV Status",
      type: "select",
      options: ["New Positive", "New Negative", "Not Done"],
      required: true,
    },

    {
      key: "pairs",

      label: "Condition & Treatment",
      type: "pair",
      required: true,
      options: {
        conditions: conditions.map((c) => c.diseaseName),
        treatments: treatments.map((t) => t.treatment),
      },
    },
  ];

  useEffect(() => {
    api
      .get("/villages/get_all.php")
      .then((res) => setVillages(res.data))
      .catch((error) => console.log(error));

    api
      .get("/diseases/get_all.php")
      .then((res) => setConditions(res.data))
      .catch((error) => console.log(error));

    api
      .get("/treatments/get_all.php")
      .then((res) => setTreatments(res.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    console.log(response);

    if (response && response.status && what === "Village") {
      api
        .get("/villages/get_all.php")
        .then((res) => setVillages(res.data))
        .catch((error) => console.log(error));
    }
    if (response && response.status && what === "Condition") {
      api
        .get("/diseases/get_all.php")
        .then((res) => setConditions(res.data))
        .catch((error) => console.log(error));
    }
    if (response && response.status && what === "Treatment") {
      api
        .get("/treatments/get_all.php")
        .then((res) => setTreatments(res.data))
        .catch((error) => console.log(error));
    }
  }, [response, what]);

  const handleSubmit = (data) => {
    const datas = {
      data: data,
      user: user.id,
    };

    console.log("Creating records...", datas);

    api
      .post("/patients/create_batch.php", datas)
      .then((res) => alert(res.data.message))
      .catch((err) => console.log(err));

      
    // send to backend
  };

  return (
    <div className="p-3">
      <ExcelTable
        columns={columns}
        showVillageForm={showModal}
        setShowVillageForm={setShowModal}
        onSubmit={handleSubmit}
        setWhat={setWhat}
      />

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(!showModal);
          setResponse(null);
        }}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add {what}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {what.toLowerCase() === "village" && (
            <VillageForm
              setResponse={setResponse}
              setShowVillageForm={setShowModal}
            />
          )}
          {what.toLowerCase() === "condition" && (
            <ConditionForm
              setResponse={setResponse}
              setShowModal={setShowModal}
            />
          )}
          {what.toLowerCase() === "treatment" && (
            <TreatmentForm
              setResponse={setResponse}
              setShowModal={setShowModal}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TryExcel;
