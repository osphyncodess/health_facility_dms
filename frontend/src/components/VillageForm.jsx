import { useState, useContext } from "react";
import { createRecords } from "../api";
import { AuthContext } from "../auth/AuthContext";

const VillageForm = ({ setResponse, setShowVillageForm }) => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    village: "",
    user: user.id,
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

    createRecords(form, "villages/create", false).then((res) => {
      alert(res.message);

      if (res.status) {
        setForm({
          village: "",
          user: user.id,
        });

        setShowVillageForm(false);
      }

      setResponse(res);
    });

    //onSubmit(form);
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
