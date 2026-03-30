import { useState, useContext } from "react";
import { createRecords } from "../api";
import { AuthContext } from "../auth/AuthContext";

const ConditionForm = () => {
    const { user } = useContext(AuthContext);
    const [form, setForm] = useState({
        condition: "",
        code: "",
        user: user.id
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form["condition"]) {
            alert("Please enter Condition");
            return;
        }
        createRecords(form, "diseases/create").then(res => {
            alert(res.message);

            if (res.status) {
                setForm({
                    condition: "",
                    code: "",
                    user: user.id
                });
            }
        });
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="condition">Condition</label>
                <input
                    id="condition"
                    name="condition"
                    placeholder="Enter Condition"
                    onChange={handleChange}
                    value={form["condition"]}
                />
            </div>
            <div className="form-group">
                <label htmlFor="code">Disease Code</label>
                <input
                    id="code"
                    name="code"
                    placeholder="Enter Disese Code"
                    onChange={handleChange}
                    value={form["code"]}
                />
            </div>

            <div className="buttons">
                <button type="submit">Submit</button>
            </div>
        </form>
    );
};

export default ConditionForm;
