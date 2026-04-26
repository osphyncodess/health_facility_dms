import { useEffect, useState } from "react";
import api from "../../api";
import DynamicForm from "../../components/DynamicForm";

const PatientEditForm = ({ patientID = 1550 }) => {
  const [form, setForm] = useState({});
  const [villages, setVillages] = useState([]);

  const schema = [
    { key: "visit_date", type: "date" },
    { key: "serialNumber", type: "number" },
    { key: "name", type: "text" },
    {
      key: "villageID",
      type: "select",
      options: villages
    },
    {
      key: "gender",
      type: "select",
      options: [
        { value: "Male", label: "Male" },
        { value: "Negative, Female", label: "Negative, Female" },
        { value: "Positive, Female", label: "Positive, Female" },
      ],
    },
  ];

  // useEffect(() => {
  //   console.log(form);
  //   console.log(villages)
  // }, [form, villages]);

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
          return { value: village.id, label: village.village };
        });
        setVillages(villageOptions);
      })
      .catch((e) => console.log(e));
  }, [patientID]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);
  };

  return (
    <DynamicForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      schema={schema}
    />
  );
};

export default PatientEditForm;
