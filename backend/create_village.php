<?php
include "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO villages (village)
VALUES (?)");

$village = trim($data["village"]);
$stmt->bind_param("s", $village);

try {
  $result = $stmt->execute();
  $id = $conn->insert_id;

  echo json_encode([
    "message" => "village sucessfully created",
    "status" => $result,
    "record_id" => $id,
    "type" => "info",
  ]);
} catch (Exception $error) {
  echo json_encode([
    "message" => trim($data["village"]) . " already exists!;",
    "status" => false,
    "type" => "error",
  ]);
}

?>
