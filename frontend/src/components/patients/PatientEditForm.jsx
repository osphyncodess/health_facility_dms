import { useEffect, useState } from "react";
import api from "../../api";
import { Form } from "react-bootstrap";
import Select from "react-select";

const PatientEditForm = ({ patientID = 1550 }) => {
  const [form, setForm] = useState({});
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    api
      .get(`/patients/get_all.php?id=${patientID}`)
      .then((res) => setForm(res.data[0]))
      .catch((e) => console.log(e));

    api
      .get(`/villages/get_all.php`)
      .then((res) => {
        const villagesArr = res.data;

        const villageOptions = villagesArr.map((village) => {
          return { value: village.village, label: village.village };
        });
        setVillages(villageOptions);
      })
      .catch((e) => console.log(e));
  }, [patientID]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);
  };

  const handleChange = (controlName, value) => {
    setForm({ ...form, [controlName]: value });
  };

  return (
    <Form className="m-3" onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="visit_date">Visit Date</Form.Label>
        <Form.Control
          type="date"
          id="visit_date"
          required
          value={form["visit_date"]}
          onChange={(e) => handleChange("visit_date", e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="serialNumber">OPD Number</Form.Label>
        <Form.Control
          type="number"
          id="serialNumber"
          required
          value={form["serialNumber"]}
          onChange={(e) => handleChange("serialNumber", e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="name">Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          required
          value={form["name"]}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="village">Village</Form.Label>
        <Select
          value={form.village}
          options={villages}
          id="village"
          onChange={(e) => handleChange("village", e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="gender">Gender</Form.Label>
        <Select
          value={form.gender}
          id="gender"
          options={[
            { value: "Male", label: "Male" },
            { value: "Negative, Female", label: "Negative, Female" },
            { value: "Positive, Female", label: "Positive, Female" },
          ]}
          onChange={(e) => handleChange("gender", e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="age">Age</Form.Label>
        <Form.Control
          type="number"
          id="age"
          required
          value={form["age"]}
          onChange={(e) => handleChange("age", e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="hiv_status">HIV Status</Form.Label>
        <Select
          value={form.hiv_status}
          id="hiv_status"
          options={[
            { value: "Male", label: "Male" },
            { value: "Negative, Female", label: "Negative, Female" },
            { value: "Positive, Female", label: "Positive, Female" },
          ]}
          onChange={(e) => handleChange("hiv_status", e.target.value)}
        />
      </Form.Group>

      <Form.Control
        type="submit"
        className="btn btn-primary"
        value={"Submit"}
      />
    </Form>
  );
};

export default PatientEditForm;
