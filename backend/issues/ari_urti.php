<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/config/db.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/functions.php";

$Data = [];

$type = $_GET["type"] ?? null;

if (!$type) {
  $sql =
    "SELECT COUNT(*) AS count FROM conditions_with_disease_name WHERE diseaseName = 'ARI' and age >= ?";
  $query_result = fetchAllSafe($conn, $sql, [5], "i")[0];
  $Data["ari_over_five"] = $query_result["count"];

  $sql =
    "SELECT COUNT(*) AS count FROM conditions_with_disease_name WHERE diseaseName = 'URTI' and age < ?";
  $query_result = fetchAllSafe($conn, $sql, [5], "i")[0];
  $Data["urti_less_five"] = $query_result["count"];
} elseif ($type === "list") {
  $sql = "SELECT c.*, p.serialNumber FROM conditions_with_disease_name c,
    patients p WHERE c.diseaseName = 'ARI' and c.age >= ? and c.patientID=p.patientID";
  $query_result = fetchAllSafe($conn, $sql, [5], "i");
  $Data["ari_over_five"] = $query_result;

  $sql = "SELECT c.*, p.serialNumber FROM conditions_with_disease_name c,
    patients p WHERE c.diseaseName = 'URTI' and c.age < ? and c.patientID=p.patientID";
  $query_result = fetchAllSafe($conn, $sql, [5], "i");
  $Data["urti_less_five"] = $query_result;
}

echo json_encode($Data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
