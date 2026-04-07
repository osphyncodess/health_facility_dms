import { useState, useRef, useEffect } from "react";
import { Table, Form, Button, ButtonGroup } from "react-bootstrap";
import { MdAdd, MdCancel, MdOutlineCancel } from "react-icons/md";
import api, { Left } from "../api";

import { Grid } from "react-loader-spinner";
import { FaPlusCircle } from "react-icons/fa";

const createEmptyRow = () => ({
  opd_number: "",
  date: "",
  name: "",
  village: "",
  gender: "",
  age: "",
  hiv_status: "Not Done",
  pairs: [{ condition: "", treatment: [] }],
});

const ExcelTable = ({
  columns,
  onSubmit,
  showVillageForm,
  setShowVillageForm,
  setWhat,
}) => {
  const [data, setData] = useState(Array.from({ length: 3 }, createEmptyRow));
  const [activeCell, setActiveCell] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const refs = useRef({});

  const getKey = (r, c) => `${r}-${c}`;
  const getPairKey = (r, c, i, type) => `${r}-${c}-${i}-${type}`;

  const focusCell = (r, c) => {
    if (r === data.length) {
      if (c === 6) {
        refs.current[getPairKey(0, c + 1, 0, "condition")]?.focus();
        return;
      }
      refs.current[getKey(0, c + 1)]?.focus();
      return;
    }
    refs.current[getKey(r, c)]?.focus();
  };

  const updateCell = (row, key, value) => {
    const updated = [...data];
    updated[row][key] = value;
    setData(updated);
  };

  const handleDateOpd = (r, c, col) => {
    if (col.key === "opd_number") {
      let val = Number(refs.current[getKey(r, c)]?.value);

      for (let index = r + 1; index < data.length; index++) {
        val > 0 && val++;

        updateCell(index, col.key, String(val));
      }
    }

    if (col.key === "date") {
      let val = refs.current[getKey(r, c)]?.value;

      for (let index = r + 1; index < data.length; index++) {
        updateCell(index, col.key, val);
      }
    }
  };

  useEffect(() => {
    api
      .get("/get_max_opd_num.php")
      .then((res) => {
        console.log(res.data);
        updateCell(0, "opd_number", Number(res.data.last_opd) + 1);

        setTimeout(() => {
          handleDateOpd(0, 0, columns[0]);
        }, 1000);
      })
      .catch((err) => console.log(err));
  }, []);

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

  const removeTag = (row, key, value) => {
    const updated = [...data];
    updated[row][key] = updated[row][key].filter((v) => v !== value);
    setData(updated);
  };

  const removePair = (row, index) => {
    const updated = [...data];
    if (updated[row].pairs.length <= 1) return;
    updated[row].pairs.splice(index, 1);
    setData(updated);
  };

  const getOptionStyle = (idx) => ({
    background: idx === highlightIndex ? "#0d6efd" : "",
    color: idx === highlightIndex ? "white" : "",
    cursor: "pointer",
    padding: "4px 8px",
  });

  const addRow = () => {
    setData((prev) => [...prev, createEmptyRow()]);
  };

  const handleKeyDown = (e, r, c, col, options) => {
    const lastRow = data.length - 1;
    const lastCol = columns.length - 1;

    switch (e.key) {
      case "Enter":
        e.preventDefault();

        if (col.type === "select" || col.type === "select-many") {
          if (!options.length) return;

          if (col.type === "select") {
            const element = refs.current[getKey(r, c)];

            if (element.value) {
              updateCell(r, col.key, options[highlightIndex]);
              setSearchValue("");
              focusCell(r + 1, c);
            }
          }

          if (col.type === "select-many") {
            const arr = data[r][col.key] || [];
            if (!arr.includes(options[highlightIndex])) {
              updateCell(r, col.key, [...arr, options[highlightIndex]]);
            }
            setSearchValue("");
          }
        } else {
          console.log("Zatheka");
          focusCell(r + 1, c);
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

      case "PageUp":
        e.preventDefault();

        focusCell(0, c);

        break;

      case "PageDown":
        e.preventDefault();

        focusCell(data.length - 1, c);

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

  const handlePairKeyDown = (e, row, col, pairIndex, type, options) => {
    console.log(e.key);
    switch (e.key) {
      case "Enter":
        e.preventDefault();

        if (!options.length) {
          if (type === "treatment" && searchValue) {
            addPairTreatment(row, pairIndex, searchValue);
          }
          return;
        }

        if (type === "condition") {
          const condition = refs.current[getPairKey(row, col, pairIndex, type)];

          if (condition.value) {
            updatePair(row, pairIndex, "condition", options[highlightIndex]);
            refs.current[getPairKey(row, col, pairIndex, "treatment")]?.focus();
          }
        }

        if (type === "treatment") {
          const treatment = refs.current[getPairKey(row, col, pairIndex, type)];

          //console.log(refs.current);
          if (treatment.value) {
            addPairTreatment(row, pairIndex, options[highlightIndex]);
            treatment.value = "";
          } else {
            const pairsCount = data[row]["pairs"].length - 1;

            console.log(pairIndex, pairsCount);

            if (pairsCount === pairIndex) {
              refs.current[getPairKey(row + 1, col, 0, "condition")]?.focus();
            } else {
              refs.current[
                getPairKey(row, col, pairIndex + 1, "condition")
              ]?.focus();
            }
          }
        }

        setSearchValue("");
        setHighlightIndex(0);
        break;

      case "Insert":
        e.preventDefault();
        addPair(row);
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

  const handleSubmit = () => {
    const clean = data.filter((row) =>
      Object.values(row).some((v) => v !== ""),
    );

    const errors = {
      required: [],
    };
    columns.forEach((c, colIndex) => {
      const keyObj = {};
      keyObj[c.label] = [];
      data.forEach((d, dIndex) => {
        //=============validating required fields================

        //=============If not pair===============================
        if (c.type !== "pair") {
          if (c.required && !d[c.key]) {
            keyObj[c.label].push(dIndex + 1);
          }
        }
      });

      keyObj[c.label].length > 0 && errors.required.push(keyObj);
    });

    if (errors.required.length > 0) {
      alert(
        "Some required fields are empty! Required fields are OPD Number, Date, Village, Age, Gender, HIV Status, Condition and Treatment.",
      );
      return;
    }
    console.log(errors);

    onSubmit(clean);
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        top: "60px",
        padding: "10px",
        overflow: "auto",
      }}
    >
      <div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "10px",
            background: "rgba(0,0,0, 0.08)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ButtonGroup>
            <Button
              onClick={() => {
                setShowVillageForm(!showVillageForm);
                setWhat("Village");
              }}
            >
              Add Village
            </Button>
            <Button
              onClick={() => {
                setShowVillageForm(!showVillageForm);
                setWhat("Condition");
              }}
              variant="secondary"
            >
              Add Condition
            </Button>
            <Button
              onClick={() => {
                setShowVillageForm(!showVillageForm);
                setWhat("Treatment");
              }}
              variant="danger"
            >
              Add Treatment
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button onClick={addRow}>Add Row +</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </ButtonGroup>
        </div>
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "auto",
          }}
        >
          <Table bordered responsive striped>
            <thead style={{ position: "sticky", top: 0 }}>
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

                    if (col.type === "pair") {
                      const conditionsAll = col.options.conditions;
                      const treatmentsAll = col.options.treatments;

                      return (
                        <td key={col.key}>
                          {row.pairs.map((p, i) => {
                            const conditionKey = getPairKey(
                              r,
                              c,
                              i,
                              "condition",
                            );
                            const treatmentKey = getPairKey(
                              r,
                              c,
                              i,
                              "treatment",
                            );

                            const conditions = conditionsAll.filter((o) => {
                              const leftVal = Left(
                                o.toLowerCase(),
                                searchValue.length,
                              );

                              return leftVal == searchValue.toLowerCase();
                            });

                            const treatments = treatmentsAll.filter((o) => {
                              const leftVal = Left(
                                o.toLowerCase(),
                                searchValue.length,
                              );

                              return leftVal == searchValue.toLowerCase();
                            });

                            return (
                              <div
                                key={i}
                                style={{
                                  marginBottom: 10,
                                  display: "flex",

                                  gap: "10px",
                                }}
                              >
                                <div>
                                  {/* CONDITION */}
                                  <Form.Control
                                    ref={(el) =>
                                      (refs.current[conditionKey] = el)
                                    }
                                    placeholder="Condition"
                                    value={p.condition}
                                    onFocus={(e) => {
                                      setActiveCell(conditionKey);
                                      setSearchValue(e.target.value);
                                      setHighlightIndex(0);
                                    }}
                                    onChange={(e) => {
                                      updatePair(
                                        r,
                                        i,
                                        "condition",
                                        e.target.value,
                                      );
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

                                  {activeCell === conditionKey &&
                                    searchValue && (
                                      <div className="border bg-white">
                                        {conditions.map((opt, idx) => (
                                          <div
                                            key={opt}
                                            onMouseDown={() => {
                                              updatePair(
                                                r,
                                                i,
                                                "condition",
                                                opt,
                                              );
                                              setSearchValue("");
                                            }}
                                            style={{
                                              background:
                                                idx === highlightIndex
                                                  ? "#0d6efd"
                                                  : "",
                                              color:
                                                idx === highlightIndex
                                                  ? "white"
                                                  : "",
                                              cursor: "pointer",
                                            }}
                                          >
                                            {opt}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                                <div>
                                  {/* TREATMENT */}
                                  <Form.Control
                                    placeholder="Add treatment"
                                    ref={(el) =>
                                      (refs.current[treatmentKey] = el)
                                    }
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

                                  {activeCell === treatmentKey &&
                                    searchValue && (
                                      <div className="border bg-white">
                                        {treatments.map((opt, idx) => (
                                          <div
                                            key={opt}
                                            onMouseDown={() => {
                                              addPairTreatment(r, i, opt);
                                              setSearchValue("");
                                            }}
                                            style={{
                                              background:
                                                idx === highlightIndex
                                                  ? "#0d6efd"
                                                  : "",
                                              color:
                                                idx === highlightIndex
                                                  ? "white"
                                                  : "",
                                              cursor: "pointer",
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
                                      <span
                                        key={idx}
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          border: "1px solid grey",
                                          padding: 5,
                                          marginTop: 3,
                                        }}
                                      >
                                        {t}
                                        <MdOutlineCancel
                                          color="red"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            removePairTreatment(r, i, t)
                                          }
                                        />
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <MdCancel
                                  size={30}
                                  style={{ cursor: "pointer" }}
                                  color="red"
                                  onClick={() => removePair(r, i)}
                                />

                                <FaPlusCircle
                                  size={27}
                                  color="darkblue"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => addPair(r)}
                                />
                              </div>
                            );
                          })}
                        </td>
                      );
                    }

                    if (col.type === "select" || col.type === "select-many") {
                      const options = col.options.filter((o) => {
                        const leftVal = Left(
                          o.toLowerCase(),
                          searchValue.length,
                        );

                        return leftVal == searchValue.toLowerCase();
                      });

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
                            onKeyDown={(e) =>
                              handleKeyDown(e, r, c, col, options)
                            }
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
                    return (
                      <td key={col.key}>
                        <Form.Control
                          min={col.key === "opd_number" ? 1 : 0}
                          ref={(el) => (refs.current[key] = el)}
                          id={col.key + "_" + r}
                          type={col.type}
                          value={row[col.key] || ""}
                          onChange={(e) => {
                            updateCell(r, col.key, e.target.value);
                            handleDateOpd(r, c, col);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, r, c, col)}
                        />
                      </td>
                    );
                  })}

                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        setData((prev) => prev.filter((_, i) => i !== r))
                      }
                    >
                      ✕
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ExcelTable;
