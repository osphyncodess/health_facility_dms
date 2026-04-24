import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from "react-bootstrap";

export default function MyForm() {
  const { handleSubmit, control } = useForm({});

  const options = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
  ];

  const onSubmit = (data) => {
    console.log("Submit:", data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400 }}>
      {/* Single Select */}
      <label>Single Select</label>
      <Controller
        name="singleSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isSearchable
            placeholder="Select one..."
          />
        )}
      />

      <br />

      {/* Multi Select */}
      <label>Multi Select</label>
      <Controller
        name="multiSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isMulti
            isSearchable
            placeholder="Select multiple..."
          />
        )}
      />

      <Form.Label>First Name</Form.Label>
      <Controller
        name="fullName"
        control={control}
        render={({ field }) => <Form.Control {...field} type="text" />}
      />

      <br />

      {/* Date Picker */}
      <Form.Label>Date</Form.Label>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={field.onChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            className="form-control"
          />
        )}
      />

      <br />
      <br />

      <button type="submit">Submit</button>
    </Form>
  );
}
