import { useState } from "react";
import { createRecords } from "../api";
const TreatmentForm = () => {
  const [form, setForm] = useState({
    treatment: "",
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
    createRecords(form, "treatment", false).then((res) => {
      alert(res.message);
      console.log(res);

      if (res.status) {
        setForm({
          treatment: "",
        });
      }
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
