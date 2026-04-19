import { useState, useEffect, useContext } from "react";
import ExcelTable from "../../components/ExcelTable";
import api from "../../api";
import { AuthContext } from "../../auth/AuthContext";
import { Modal } from "react-bootstrap";

const TryExcel = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState(null);
  const [what, setWhat] = useState("");
  const [serialNumberKey, setSerialNumberKey] = useState("lab_number");
  const [lastSerialUrl, setLastSerialUrl] = useState("/get_max_lab_num.php");

  const columns = [
    {
      key: "lab_number",
      label: "Lab Number",
      type: "number",
      required: true,
    },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "name", label: "Name", type: "text", required: false },

    {
      key: "gender",
      label: "Gender",
      type: "select",
      options: [
        "Positive, Female",
        "Negative, Female",
        "Unknown, Female",
        "Male",
      ],
      required: true,
    },
    { key: "age", label: "Age", type: "number", required: true },
    {
      key: "result",
      label: "Test Result",
      type: "select",
      options: ["Positive", "Negative"],
      required: true,
    },
  ];

  const handleSubmit = (data) => {
    const datas = {
      data: data,
      user: user.id,
    };

    api
      .post("/lab_register/create_batch.php", datas)
      .then((res) => {
        alert(res.data.message)
      })
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
        serialNumberKey={serialNumberKey}
        lastSerialUrl={lastSerialUrl}
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
