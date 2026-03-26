<?php
include "../header_info.php";
include "../db.php";
include "../functions.php";

$patientID = null;
if (isset($_GET["id"])) {
  $patientID = $_GET["id"];
}

$sql =
  "SELECT * FROM patients p, villages v WHERE p.villageID=v.id ORDER BY p.serialNumber";

if ($patientID !== null) {
  $sql =
    "SELECT * FROM patients p, villages v WHERE p.villageID=v.id AND p.patientID=" .
    $patientID;
}

$patientData = get_db_rows($conn, $sql);
$patients = [];

foreach ($patientData as $patient) {
  $patientID = $patient["patientID"];

  $conditionsData = get_db_rows(
    $conn,
    "SELECT c.id as conditionID, c.test, c.result, c.diseaseID, d.diseaseName, d.diseaseCode FROM conditions c, diseases d Where c.diseaseID = d.id AND c.patientID=" .
      $patientID
  );

  $conditions = [];

  foreach ($conditionsData as $condition) {
    $treatments = get_db_rows(
      $conn,
      "SELECT a.treatmentID, b.treatment FROM treatments_given a, treatments b WHERE    a.conditionsID = " .
        $condition["conditionID"] .
        " AND a.treatmentID = b.id "
    );

    $condition["treatments"] = $treatments;

    // if condition is malaria
    if ($condition["diseaseName"] === "Malaria") {
      if ($patient["age"] < 5) {
        $condition["diseaseCode"] = "32A";
      } else {
        if ($patient["gender"] === "FP") {
          $condition["diseaseCode"] = "32C";
          $condition["diseaseName"] = "Malaria in Pregnancy";
        } else {
          $condition["diseaseCode"] = "32B";
        }
      }
    }

    // if condition is GE
    if ($condition["diseaseName"] === "GE") {
      if ($patient["age"] < 5) {
        $condition["diseaseCode"] = "14A";
      } else {
        $condition["diseaseCode"] = "14B";
      }
    }
    array_push($conditions, $condition);
  }

  $patient["conditions"] = $conditions;

  array_push($patients, $patient);
}
echo json_encode($patients);
//echo json_encode($data);
?>
