<?php
include "header_info.php";
include "db.php";

$table_names = ["villages", "treatments", "diseases"];
$table_order = ["village", "treatment", "diseaseName"];

$datas = [];
$i = -1;
foreach ($table_names as $table_name) {
  $i++;

  $sql = "SELECT * FROM " . $table_name . " ORDER BY " . $table_order[$i];

  $stmt = $conn->prepare($sql);
  $stmt->execute();

  $result = $stmt->get_result();
  $data = [];

  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }

  $datas[$table_name] = $data;
}

echo json_encode($datas);
?>
