import { useState, useRef } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { MdAdd, MdCancel, MdOutlineCancel } from "react-icons/md";

const createEmptyRow = () => ({
  opd_number: "",
  date: "",
  name: "",
  village: "",
  gender: "",
  age: "",
  hiv_status: "",
  pairs: [{ condition: "", treatment: [] }],
});

const ExcelTable = ({ columns, onSubmit }) => {
  const [data, setData] = useState(Array.from({ length: 10 }, createEmptyRow));
  const [activeCell, setActiveCell] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const refs = useRef({});

  const getKey = (r, c) => `${r}-${c}`;
  const getPairKey = (r, c, i, type) => `${r}-${c}-${i}-${type}`;

  const focusCell = (r, c) => {
    refs.current[getKey(r, c)]?.focus();
  };

  const getOptionStyle = (idx) => ({
    background: idx === highlightIndex ? "#0d6efd" : "",
    color: idx === highlightIndex ? "white" : "",
    cursor: "pointer",
    padding: "4px 8px",
  });

  // ================= BASIC =================
  const updateCell = (row, key, value) => {
    const updated = [...data];
    updated[row][key] = value;
    setData(updated);
  };

  const deleteRow = (index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setData((prev) => [...prev, createEmptyRow()]);
  };

  // ================= SELECT =================
  const handleKeyDown = (e, r, c, col, options) => {
    const lastRow = data.length - 1;
    const lastCol = columns.length - 1;

    switch (e.key) {
      case "Enter":
        e.preventDefault();

        if (!options.length) return;

        if (col.type === "select") {
          updateCell(r, col.key, options[highlightIndex]);
          setSearchValue("");
          focusCell(r + 1, c);
        }

        if (col.type === "select-many") {
          const arr = data[r][col.key] || [];
          if (!arr.includes(options[highlightIndex])) {
            updateCell(r, col.key, [...arr, options[highlightIndex]]);
          }
          setSearchValue("");
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (highlightIndex < options.length - 1) {
          setHighlightIndex((p) => p + 1);
        } else {
          if (r === lastRow) addRow();
          focusCell(r + 1, c);
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (highlightIndex > 0) {
          setHighlightIndex((p) => p - 1);
        } else if (r > 0) {
          focusCell(r - 1, c);
        }
        break;

      case "Tab":
        e.preventDefault();
        if (c === lastCol) {
          if (r === lastRow) addRow();
          focusCell(r + 1, 0);
        } else {
          focusCell(r, c + 1);
        }
        break;
    }
  };

  const removeTag = (row, key, value) => {
    const updated = [...data];
    updated[row][key] = updated[row][key].filter((v) => v !== value);
    setData(updated);
  };

  // ================= PAIRS =================
  const updatePair = (row, i, key, value) => {
    const updated = [...data];
    updated[row].pairs[i][key] = value;
    setData(updated);
  };

  const addPairTreatment = (row, i, value) => {
    const updated = [...data];
    const arr = updated[row].pairs[i].treatment;
    if (!arr.includes(value)) arr.push(value);
    setData(updated);
  };

  const removePairTreatment = (row, i, value) => {
    const updated = [...data];
    updated[row].pairs[i].treatment = updated[row].pairs[i].treatment.filter(
      (t) => t !== value,
    );
    setData(updated);
  };

  const addPair = (row) => {
    const updated = [...data];
    updated[row].pairs.push({ condition: "", treatment: [] });
    setData(updated);
  };

  const removePair = (row, index) => {
    const updated = [...data];
    if (updated[row].pairs.length <= 1) return;
    updated[row].pairs.splice(index, 1);
    setData(updated);
  };

  const handlePairKeyDown = (e, r, c, i, type, options) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();

        if (!options.length) {
          if (type === "treatment" && searchValue) {
            addPairTreatment(r, i, searchValue);
          }
          return;
        }

        if (type === "condition") {
          updatePair(r, i, "condition", options[highlightIndex]);
        }

        if (type === "treatment") {
          addPairTreatment(r, i, options[highlightIndex]);
        }

        setSearchValue("");
        setHighlightIndex(0);
        break;

      case "ArrowDown":
        e.preventDefault();
        if (highlightIndex < options.length - 1) {
          setHighlightIndex((p) => p + 1);
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (highlightIndex > 0) {
          setHighlightIndex((p) => p - 1);
        }
        break;
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    const clean = data.filter((row) =>
      Object.values(row).some((v) => v !== ""),
    );
    onSubmit(clean);
  };

  return (
    <>
      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, r) => (
            <tr key={r}>
              <td>{r + 1}</td>

              {columns.map((col, c) => {
                const key = getKey(r, c);

                // ================= PAIR =================
                if (col.type === "pair") {
                  return (
                    <td key={col.key}>
                      {row.pairs.map((p, i) => {
                        const conditionKey = getPairKey(r, c, i, "condition");
                        const treatmentKey = getPairKey(r, c, i, "treatment");

                        const conditions = col.options.conditions.filter((o) =>
                          o.toLowerCase().includes(searchValue.toLowerCase()),
                        );

                        const treatments = col.options.treatments.filter((o) =>
                          o.toLowerCase().includes(searchValue.toLowerCase()),
                        );

                        return (
                          <div key={i} style={{ marginBottom: 10 }}>
                            {/* CONDITION */}
                            <Form.Control
                              ref={(el) => (refs.current[conditionKey] = el)}
                              value={p.condition}
                              placeholder="Condition"
                              onFocus={(e) => {
                                setActiveCell(conditionKey);
                                setSearchValue(e.target.value);
                                setHighlightIndex(0);
                              }}
                              onChange={(e) => {
                                updatePair(r, i, "condition", e.target.value);
                                setSearchValue(e.target.value);
                                setHighlightIndex(0);
                              }}
                              onKeyDown={(e) =>
                                handlePairKeyDown(
                                  e,
                                  r,
                                  c,
                                  i,
                                  "condition",
                                  conditions,
                                )
                              }
                            />

                            {activeCell === conditionKey && searchValue && (
                              <div className="border bg-white">
                                {conditions.map((opt, idx) => (
                                  <div
                                    key={opt}
                                    style={getOptionStyle(idx)}
                                    onMouseDown={() => {
                                      updatePair(r, i, "condition", opt);
                                      setSearchValue("");
                                    }}
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* TREATMENT */}
                            <Form.Control
                              ref={(el) => (refs.current[treatmentKey] = el)}
                              placeholder="Treatment"
                              onFocus={(e) => {
                                setActiveCell(treatmentKey);
                                setSearchValue(e.target.value);
                                setHighlightIndex(0);
                              }}
                              onChange={(e) => {
                                setSearchValue(e.target.value);
                                setHighlightIndex(0);
                              }}
                              onKeyDown={(e) =>
                                handlePairKeyDown(
                                  e,
                                  r,
                                  c,
                                  i,
                                  "treatment",
                                  treatments,
                                )
                              }
                            />

                            {activeCell === treatmentKey && searchValue && (
                              <div className="border bg-white">
                                {treatments.map((opt, idx) => (
                                  <div
                                    key={opt}
                                    style={getOptionStyle(idx)}
                                    onMouseDown={() => {
                                      addPairTreatment(r, i, opt);
                                      setSearchValue("");
                                    }}
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* TAGS */}
                            <div style={{ marginTop: 5 }}>
                              {p.treatment.map((t, idx) => (
                                <div key={idx}>
                                  {t}
                                  <MdOutlineCancel
                                    style={{ cursor: "pointer", color: "red" }}
                                    onClick={() => removePairTreatment(r, i, t)}
                                  />
                                </div>
                              ))}
                            </div>

                            <button onClick={() => removePair(r, i)}>
                              <MdCancel />
                            </button>
                          </div>
                        );
                      })}

                      <Button size="sm" onClick={() => addPair(r)}>
                        <MdAdd />
                      </Button>
                    </td>
                  );
                }

                // ================= SELECT =================
                if (col.type === "select" || col.type === "select-many") {
                  const options = col.options.filter((o) =>
                    o.toLowerCase().includes(searchValue.toLowerCase()),
                  );

                  return (
                    <td key={col.key}>
                      {col.type === "select-many" &&
                        (row[col.key] || []).map((t, i) => (
                          <span key={i}>
                            {t}
                            <MdOutlineCancel
                              style={{ color: "red", cursor: "pointer" }}
                              onClick={() => removeTag(r, col.key, t)}
                            />
                          </span>
                        ))}

                      <Form.Control
                        ref={(el) => (refs.current[key] = el)}
                        value={row[col.key] || ""}
                        onFocus={(e) => {
                          setActiveCell(key);
                          setSearchValue(e.target.value);
                          setHighlightIndex(0);
                        }}
                        onChange={(e) => {
                          updateCell(r, col.key, e.target.value);
                          setSearchValue(e.target.value);
                          setHighlightIndex(0);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, r, c, col, options)}
                      />

                      {activeCell === key && searchValue && (
                        <div className="border bg-white">
                          {options.map((opt, idx) => (
                            <div
                              key={opt}
                              style={getOptionStyle(idx)}
                              onMouseDown={() => {
                                if (col.type === "select") {
                                  updateCell(r, col.key, opt);
                                } else {
                                  const arr = row[col.key] || [];
                                  if (!arr.includes(opt)) {
                                    updateCell(r, col.key, [...arr, opt]);
                                  }
                                }
                                setSearchValue("");
                              }}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                }

                // ================= NORMAL =================
                return (
                  <td key={col.key}>
                    <Form.Control
                      ref={(el) => (refs.current[key] = el)}
                      value={row[col.key] || ""}
                      onChange={(e) => updateCell(r, col.key, e.target.value)}
                    />
                  </td>
                );
              })}

              <td>
                <Button size="sm" onClick={() => deleteRow(r)}>
                  ✕
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button onClick={addRow}>+ Row</Button>
      <Button onClick={handleSubmit}>Submit</Button>
    </>
  );
};

export default ExcelTable;
