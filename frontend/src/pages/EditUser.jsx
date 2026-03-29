import { useState, useEffect } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", role: ""
  });

  useEffect(() => {
    api.get(`/users/get_one.php?id=${id}`)
      .then(res => setForm(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/users/update.php", { id, ...form });
    nav("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.name}
        onChange={e => setForm({...form, name:e.target.value})}/>
      <input value={form.email}
        onChange={e => setForm({...form, email:e.target.value})}/>

      <select value={form.role}
        onChange={e => setForm({...form, role:e.target.value})}>
        <option>admin</option>
        <option>doctor</option>
        <option>nurse</option>
      </select>

      <button>Update</button>
    </form>
  );
}