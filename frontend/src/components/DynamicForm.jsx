import { Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "recharts";
import { useState, useEffect } from "react";
import api from "../api";

const DynamicForm = ({
  data = [
    {
      type: "date",
      key: "visit_date",
      tableName: "patients",
      label: "Visit Date",
    },
    {
      type: "number",
      key: "serialNumber",
      tableName: "patients",
      label: "OPD Number",
    },
    {
      type: "text",
      key: "name",
      tableName: "patients",
      label: "Name",
    },

    {
      type: "select-many",
      key: "gender",
      tableName: "patients",
      options: [
        { value: "Male", label: "Male" },
        { value: "Positive, Female", label: "Positive, Female" },
      ],
      label: "Gender",
    },

    {
      type: "number",
      key: "age",
      tableName: "patients",
      label: "Age",
    },

    {
      type: "select-one",
      key: "village",
      tableName: "patients",
      options: [
        { value: "Male", label: "Male" },
        { value: "Positive, Female", label: "Positive, Female" },
      ],
      label: "Village",
    },
  ],
  onSubmit,
}) => {
  const { handleSubmit, control } = useForm({});
  const [patient, setPatient] = useState({});

  useEffect(() => {
    setTimeout(() => {
      api
        .get(`/patients/get_all.php?id=${1550}`)
        .then((res) => {
          const patient = res.data[0];
          setPatient(patient);

          console.log(patient["serialNumber"]);
        })
        .catch((err) => console.log(err));
    }, 1);
  }, []);

  const submit = (data) => {
    console.log(data);
  };
  return (
    <div className="p-4">
      <Form onSubmit={handleSubmit(submit)}>
        {data.map((d) => {

          const defaultValue = patient[d.key]

          return (
            <div key={d.key}>
              {(d.type === "text" ||
                d.type === "number" ||
                d.type === "date") && (
                <Form.Group>
                  <Form.Label>{d.label}</Form.Label>
                  <Controller
                    name={d.key}
                    control={control}
                    defaultValue={defaultValue}
                    render={({ field }) => (
                      <Form.Control {...field} type={d.type} />
                    )}
                  />
                </Form.Group>
              )}

              {d.type === "select-one" && (
                <Form.Group>
                  <Form.Label>{d.label}</Form.Label>
                  <Controller
                    name="singleSelect"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={d.options}
                        isSearchable
                        placeholder="Select one..."
                      />
                    )}
                  />
                </Form.Group>
              )}

              {d.type === "select-many" && (
                <Form.Group>
                  <Form.Label>{d.label}</Form.Label>
                  <Controller
                    name="singleSelect"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={d.options}
                        isMulti
                        isSearchable
                        placeholder="Select one..."
                      />
                    )}
                  />
                </Form.Group>
              )}
            </div>
          );
        })}
      </Form>
    </div>
  );
};

export default DynamicForm;
