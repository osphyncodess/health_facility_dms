<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/middleware/secure_api.php";
include "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO villages (village, created_by)
VALUES (?,?)");

$village = trim($data["village"]);
$stmt->bind_param("si", $village, $data["user"]);

try {
  $result = $stmt->execute();
  $id = $conn->insert_id;

  $conn->query("DELETE FROM villages Where village =''");

  echo json_encode([
    "message" => "village sucessfully created",
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
