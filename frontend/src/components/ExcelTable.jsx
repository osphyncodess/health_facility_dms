import { useState, useRef } from "react";
import { Table, Form, Button } from "react-bootstrap";

const ExcelTable = ({ columns, onSubmit }) => {
    const [data, setData] = useState([{}]);
    const refs = useRef({});

    const getCellKey = (row, col) => `${row}-${col}`;

    const handleChange = (rowIndex, key, value) => {
        const updated = [...data];
        updated[rowIndex][key] = value;
        setData(updated);
    };

    const focusCell = (row, col) => {
        const refKey = getCellKey(row, col);
        refs.current[refKey]?.focus();
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        const lastRow = data.length - 1;
        const lastCol = columns.length - 1;

        switch (e.key) {
            case "Enter":
                e.preventDefault();
                if (rowIndex === lastRow) addRow();
                focusCell(rowIndex + 1, colIndex);
                break;

            case "Tab":
                e.preventDefault();
                if (colIndex === lastCol) {
                    if (rowIndex === lastRow) addRow();
                    focusCell(rowIndex + 1, 0);
                } else {
                    focusCell(rowIndex, colIndex + 1);
                }
                break;

            case "ArrowRight":
                e.preventDefault();
                if (colIndex < lastCol) focusCell(rowIndex, colIndex + 1);
                break;

            case "ArrowLeft":
                e.preventDefault();
                if (colIndex > 0) focusCell(rowIndex, colIndex - 1);
                break;

            case "ArrowDown":
                e.preventDefault();
                if (rowIndex === lastRow) addRow();
                focusCell(rowIndex + 1, colIndex);
                break;

            case "ArrowUp":
                e.preventDefault();
                if (rowIndex > 0) focusCell(rowIndex - 1, colIndex);
                break;

            default:
                break;
        }
    };

    const addRow = () => {
        setData(prev => [...prev, {}]);
    };

    const handleSubmit = () => {
        const cleanData = data.filter(row =>
            Object.values(row).some(val => val !== undefined && val !== "")
        );
        onSubmit(cleanData);
    };

    return (
        <>
            <Table bordered hover>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col, colIndex) => {
                                const refKey = getCellKey(rowIndex, colIndex);

                                return (
                                    <td key={col.key}>
                                        {col.type === "select" ? (
                                            <Form.Select
                                                ref={el =>
                                                    (refs.current[refKey] = el)
                                                }
                                                value={row[col.key] || ""}
                                                onChange={e =>
                                                    handleChange(
                                                        rowIndex,
                                                        col.key,
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={e =>
                                                    handleKeyDown(
                                                        e,
                                                        rowIndex,
                                                        colIndex
                                                    )
                                                }
                                            >
                                                <option value="">Select</option>
                                                {col.options.map(opt => (
                                                    <option
                                                        key={opt}
                                                        value={opt}
                                                    >
                                                        {opt}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        ) : (
                                            <Form.Control
                                                type={col.type || "text"}
                                                ref={el =>
                                                    (refs.current[refKey] = el)
                                                }
                                                value={row[col.key] || ""}
                                                onChange={e =>
                                                    handleChange(
                                                        rowIndex,
                                                        col.key,
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={e =>
                                                    handleKeyDown(
                                                        e,
                                                        rowIndex,
                                                        colIndex
                                                    )
                                                }
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Button onClick={addRow} className="me-2">
                + Add Row
            </Button>

            <Button variant="success" onClick={handleSubmit}>
                Submit
            </Button>
        </>
    );
};

export default ExcelTable;
