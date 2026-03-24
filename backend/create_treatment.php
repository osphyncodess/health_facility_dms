<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO treatment (treatment)
VALUES (?)");

$stmt->bind_param("s", $data["treatment"]);

try {
  $result = $stmt->execute();
  $id = $conn->insert_id;

  echo json_encode([
    "message" => "Treatment sucessfully created",
    "status" => $result,
    "record_id" => $id,
    "type" => "info",
  ]);
} catch (Exception $error) {
  echo json_encode([
    "message" => $data["treatment"] . " already exists!;",
    "status" => false,
    "type" => "error",
  ]);
}
?>
