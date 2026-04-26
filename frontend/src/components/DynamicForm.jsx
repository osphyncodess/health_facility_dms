const DynamicForm = ({ schema, form, setForm, onSubmit }) => {
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Form onSubmit={onSubmit} className="m-3">
      {schema.map((field) => {
        if (field.type === "select") {
          return (
            <Form.Group key={field.key}>
              <Form.Label>{field.label || field.key}</Form.Label>

              <Select
                options={field.options}
                value={field.options.find((o) => o.value === form[field.key])}
                onChange={(option) => handleChange(field.key, option.value)}
              />
            </Form.Group>
          );
        }

        return (
          <Form.Group key={field.key}>
            <Form.Label>{field.label || field.key}</Form.Label>

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
  );
};
