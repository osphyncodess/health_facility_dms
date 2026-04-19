<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/middleware/secure_api.php";
include "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);


$p = $data["p"];
$d = $data["d"];

$villageID = explode(",", $p["village"][0][0])[0];

$response = [
  "message" => "Something went wrong",
  "status" => false,
  "type" => "error",
];

try {
  // 🔥 START TRANSACTION
  $conn->begin_transaction();

  // 👉 Insert Patient
  $stmt = $conn->prepare("
    INSERT INTO patients 
    (serialNumber, visit_date, name, age, gender, hiv_status, villageID, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?,?)
  ");

  $name = trim($p["name"]);

  $stmt->bind_param(
    "sssissii",
    $p["serialNumber"],
    $p["date"],
    $name,
    $p["age"],
    $p["gender"],
    $p["hiv_status"],
    $villageID,
    $data["user"]
  );

  $stmt->execute();
  $patientID = $conn->insert_id;

  // 👉 Prepare reusable statements
  $conditionStmt = $conn->prepare("
    INSERT INTO conditions (patientID, test, result, diseaseID, created_by)
    VALUES (?, ?, ?, ?, ?)
  ");

  $treatmentStmt = $conn->prepare("
    INSERT INTO treatments_given (conditionsID, treatmentID, created_by)
    VALUES (?, ?, ?)
  ");

  // 👉 Insert Diagnoses
  foreach ($d as $diagnosis) {
    $diseaseID = explode(",", $diagnosis["diagnosis"][0])[0];

    $conditionStmt->bind_param(
      "issii",
      $patientID,
      $diagnosis["test"],
      $diagnosis["result"],
      $diseaseID,
      $data["user"]
    );

    $conditionStmt->execute();
    $conditionID = $conn->insert_id;

    // 👉 Insert Treatments
    foreach ($diagnosis["treatment"] as $t) {
      $treatmentID = explode(",", $t)[0];

      $treatmentStmt->bind_param(
        "iii",
        $conditionID,
        $treatmentID,
        $data["user"]
      );

      $treatmentStmt->execute();
    }
  }

  // ✅ COMMIT if everything succeeded
  $conn->commit();

  $response = [
    "message" => "Patient created successfully",
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
?>
