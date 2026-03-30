<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/middleware/secure_api.php";
include "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO diseases (diseaseName, diseaseCode, created_by)
VALUES (?, ?, ?)");

$condition = trim($data["condition"]);
$code = trim($data["code"]);

$stmt->bind_param("ssi", $condition, $code, $data["user"]);

try {
  $result = $stmt->execute();
  $id = $conn->insert_id;

  $conn->query("DELETE FROM diseases WHERE diseaseName =''");
  
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
