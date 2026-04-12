<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/middleware/secure_api.php";
include "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO la_register (patientID, la_given, created_by)
VALUES (?, ?, ?)");


//validations here
if ($data['patientID'] == '' || $data['la_given'] == '' || $data['user'] == '') {
   echo json_encode([
    "message" => "Make sure the submitted data has Patient ID, LA Given and User ID.",
    "status" => false,
    "type" => "error",
  ]);

  exit;
}


$stmt->bind_param("iii", $data['patientID'], $data["la_given"],  $data["user"]);

try {
  $result = $stmt->execute();
  $id = $conn->insert_id;

$conn->query("DELETE FROM la_register WHERE patientID =''");

  echo json_encode([
    "message" => "Patient Successfully Linked",
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
