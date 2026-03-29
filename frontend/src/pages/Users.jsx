import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get("/users/get_all.php");
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await api.post("/users/delete.php", { id });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Link to="/create">Create User</Link>

      {users.map(u => (
        <div key={u.id}>
          {u.name} ({u.role})
          <Link to={`/edit/${u.id}`}>Edit</Link>
          <button onClick={() => deleteUser(u.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}