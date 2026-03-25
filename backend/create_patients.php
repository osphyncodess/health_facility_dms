<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO patients (serialNumber, date, name, age, gender, hiv_status, village)
VALUES (?, ?, ?, ?, ?, ?, ?)");

$p = $data["p"];
$d = $data["d"];

$stmt->bind_param(
  "sssisss",
  $p["serialNumber"],
  $p["date"],
  $p["name"],
  $p["age"],
  $p["gender"],
  $p["hiv_status"],
  $p["village"]
);

try {
  $result = $stmt->execute();
  $id = $conn->insert_id;

  $stmt2 = $conn->prepare("INSERT INTO conditions (patientID, test, result, diagnosis, code, treatment)
VALUES (?, ?, ?, ?, ?, ?)");

  foreach ($d as $c) {
    $diagnosis = join(",", $c["diagnosis"]);
    $treatment = join(",", $c["treatment"]);
    $stmt2->bind_param(
      "isssss",
      $id,
      $c["test"],
      $c["result"],
      $diagnosis,
      $c["code"],
      $treatment
    );

    $stmt2->execute();
  }

  echo json_encode([
    "message" => "Patient created",
    "status" => $result,
    "record_id" => $id,
    "type" => "info",
  ]);
} catch (Exception $error) {
  echo json_encode([
    "message" => $error->getMessage(),
    "status" => false,
    "type" => "error",
    "d" => $d,
  ]);
}

print_r($conn)
?>
