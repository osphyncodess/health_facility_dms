<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/middleware/secure_api.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/functions.php";
include "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$arr = [];

$user = $data['user'];
$datas = $data['data'];

function get_id($tableName, $columnName, $conn, $value)
{
    return get_db_rows($conn, "SELECT id FROM " . $tableName . " WHERE " . $columnName . "='" . $value . "'")[0]['id'];
}

//foreach ($datas as $data) {
    $response = [
        "message" => "Something went wrong",
        "status" => false,
        "type" => "error",
    ];

    try {
        // 🔥 START TRANSACTION
        $conn->begin_transaction();

        foreach ($datas as $data){
            
            // 👉 Insert Patient
            $stmt = $conn->prepare("
                INSERT INTO lab_register 
                (serialNumber, date, name, age, gender, result, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");

            $name = trim($data["name"]);

            $stmt->bind_param(
                "ississi",
                $data["lab_number"],
                $data["date"],
                $name,
                $data["age"],
                $data["gender"],
                $data["result"],
                $user
            );

            $stmt->execute();
        }

        // ✅ COMMIT if everything succeeded
        $conn->commit();

        $response = [
            "message" => "Records Created Successfully",
            "status" => true,
            "type" => "success",
        ];
    } catch (Exception $e) {
        // ❌ ROLLBACK everything on error
        $conn->rollback();

        $response["message"] = $e->getMessage();
    }
//}

echo json_encode($response);
