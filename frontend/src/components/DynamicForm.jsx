import { Form } from "react-bootstrap";
import Select from "react-select";
import "../../src/assets/css/futuristic-form.css";

const DynamicForm = ({ schema, form, setForm, onSubmit }) => {
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      background: "rgba(255,255,255,0.07)",
      borderColor: "rgba(255,255,255,0.1)",
      color: "rgb(176, 176, 176)",
      borderRadius: "10px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#22d3ee",
      },
    }),
    menu: (base) => ({
      ...base,
      background: "#0f172a",
      color: "rgb(176, 176, 176)",
    }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused ? "#22d3ee" : "#0f172a",
      color: "white",
    }),
    singleValue: (base) => ({
      ...base,
      color: "rgb(176, 176, 176)",
    }),
  };

  return (
    <div className="futuristic-wrapper">
      <Form onSubmit={onSubmit} className="m-3 futuristic-form">
        {schema.map((field) => {
          if (field.type === "select") {
            return (
              <Form.Group key={field.key}>
                <Form.Label className="glow-label">{field.label || field.key}</Form.Label>

                <Select
                  styles={selectStyles}
                  options={field.options}
                  value={field.options.find((o) => o.value == form[field.key])}
                  onChange={(option) => handleChange(field.key, option.value)}
                />
              </Form.Group>
            );
          }

          return (
            <Form.Group key={field.key}>
              <Form.Label className="glow-label">{field.label || field.key}</Form.Label>

              <Form.Control
                type={field.type}
                value={form[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </Form.Group>
          );
        })}

        <Form.Control type="submit" className="btn btn-primary" />
      </Form>
    </div>
  );
};

export default DynamicForm;
