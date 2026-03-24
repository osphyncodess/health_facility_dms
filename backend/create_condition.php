<?php
include("header_info.php");
include("db.php");

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO diseases (diseaseName, diseaseCode)
VALUES (?, ?)");

$stmt->bind_param("ss", $data["condition"], $data["code"]);

try {
  $result = $stmt->execute();
  $id = $conn->insert_id;

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
  ]);
}
?>
