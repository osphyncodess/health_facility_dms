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

    $response = [
        "message" => "Something went wrong",
        "status" => false,
        "type" => "error",
    ];

    try {
        // 🔥 START TRANSACTION
        $conn->begin_transaction();

        foreach ($datas as $data) {


            // echo json_encode($data);


            $p = [
                'serialNumber' => $data['opd_number'],
                'visit_date' => $data['date'],
                'name' => $data['name'],
                'age' => $data['age'],
                'gender' => $data['gender'],
                'hiv_status' => $data['hiv_status'],
                'village' => get_id('villages', 'village', $conn, $data['village'])
            ];



            $d = $data["pairs"];

            //echo json_encode($d);
            //exit();

           

            $stmt = $conn->prepare("
            INSERT INTO patients 
            (serialNumber, visit_date, name, age, gender, hiv_status, villageID, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?,?)
            ");

            $name = trim($p["name"]);

            $stmt->bind_param(
                "sssissii",
                $p["serialNumber"],
                $p["visit_date"],
                $name,
                $p["age"],
                $p["gender"],
                $p["hiv_status"],
                $p['village'],
                $user
            );

            $stmt->execute();
            $patientID = $conn->insert_id;

            // 👉 Prepare reusable statements
            $conditionStmt = $conn->prepare("
                INSERT INTO conditions (patientID, diseaseID, created_by)
                VALUES (?, ?, ?)
            ");

            $treatmentStmt = $conn->prepare("
                INSERT INTO treatments_given (conditionsID, treatmentID, created_by)
                VALUES (?, ?, ?)
            ");

            // 👉 Insert Diagnoses
            foreach ($d as $diagnosis) {
                $diseaseID = get_id('diseases', 'diseaseName', $conn, $diagnosis['condition']);

                //echo json_encode($diseaseID);

                $conditionStmt->bind_param(
                    "iii",
                    $patientID,
                    $diseaseID,
                    $user
                );

                $conditionStmt->execute();
                $conditionID = $conn->insert_id;

                // 👉 Insert Treatments
                foreach ($diagnosis["treatment"] as $t) {

                    $treatmentID = get_id('treatments', 'treatment', $conn, $t);



                    $treatmentStmt->bind_param(
                        "iii",
                        $conditionID,
                        $treatmentID,
                        $user
                    );

                    $treatmentStmt->execute();
                }
            }
        }
        // 👉 Insert Patient
        

        // ✅ COMMIT if everything succeeded
        $conn->commit();
        

        $response = [
            "message" => "Patients created successfully",
            "status" => true,
            "record_id" => $patientID,
            "type" => "success",
            
        ];
    } catch (Exception $e) {
        // ❌ ROLLBACK everything on error
        $conn->rollback();

        $response["message"] = $e->getMessage();
    }


echo json_encode($response);
