<?php
//require_once $_SERVER["DOCUMENT_ROOT"] . "/middleware/secure_api.php";
include "../config/db.php";

$sql = "SELECT * FROM villages ORDER BY village";

$stmt = $conn->prepare($sql);
$stmt->execute();

$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
?>
