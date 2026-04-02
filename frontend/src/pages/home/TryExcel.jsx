import ExcelTable from "../../components/ExcelTable";

const TryExcel = () => {
    const columns = [
        { key: "product", label: "Product", type: "text" },
        { key: "qty", label: "Quantity", type: "number" },
        { key: "price", label: "Price", type: "number" },
        {
            key: "category",
            label: "Category",
            type: "select",
            options: ["Clothes", "Shoes", "Accessories"]
        }
    ];

    const handleSubmit = data => {
        console.log("Submitted Data:", data);
        // send to backend
    };

    return (
        <div className="p-3">
            <ExcelTable columns={columns} onSubmit={handleSubmit} />
        </div>
    );
};

export default TryExcel;
