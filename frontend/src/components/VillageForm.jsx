import { useState } from "react";
import { createRecords } from "../api";
const VillageForm = () => {
  const [form, setForm] = useState({
    village: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form["village"]) {
      alert("Please enter village");
      return;
    }
    createRecords(form, "village").then((res) => {
      console.log(res);
      alert(res.message);

      if (res.status) {
        setForm({
          village: "",
        });
      }
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="village">Village</label>
        <input
          id="village"
          name="village"
          placeholder="Enter village"
          onChange={handleChange}
          value={form["village"]}
        />
      </div>

      <div className="buttons">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default VillageForm;
