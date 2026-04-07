import { useState, useContext } from "react";
import { createRecords } from "../api";
import { AuthContext } from "../auth/AuthContext";
const TreatmentForm = ({ setResponse, setShowModal }) => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    treatment: "",
    user: user.id,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form["treatment"]) {
      alert("Please enter treatment");
      return;
    }
    createRecords(form, "treatments/create", false).then((res) => {
      alert(res.message);
      console.log(res);

      if (res.status) {
        setForm({
          treatment: "",
          user: user.id,
        });

        setShowModal(false);
      }

      setResponse(res);
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="treatment">Treatment</label>
        <input
          id="treatment"
          name="treatment"
          placeholder="Enter Treatment"
          onChange={handleChange}
          value={form["treatment"]}
        />
      </div>

      <div className="buttons">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default TreatmentForm;
