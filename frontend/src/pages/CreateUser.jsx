import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

export default function CreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor",
  });

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/auth/register.php", form);
    nav("/");
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Control
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="form-control"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option>admin</option>
          <option>doctor</option>
          <option>nurse</option>
          <option>receptionist</option>
        </select>

        <Button>Create</Button>
      </Form>
    </Container>
  );
}
