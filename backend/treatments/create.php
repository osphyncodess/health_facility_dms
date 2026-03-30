<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/middleware/secure_api.php";
include "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO treatments (treatment, created_by)
VALUES (?, ?)");

$treatment = trim($data["treatment"]);

$stmt->bind_param("si", $treatment, $data["user"]);

try {
  $result = $stmt->execute();
  $id = $conn->insert_id;

$conn->query("DELETE FROM treatments WHERE treatment=''");
  echo json_encode([
    "message" => "Treatment sucessfully created",
    "status" => $result,
    "record_id" => $id,
    "type" => "info",
  ]);
} catch (Exception $error) {
  echo json_encode([
    "message" => trim($data["treatment"]) . " already exists!;",
    "status" => false,
    "type" => "error",
  ]);
}
?>
