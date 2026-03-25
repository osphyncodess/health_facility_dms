<?php
include "header_info.php";
include "db.php";
include "functions.php";

$patientID = null;
if (isset($_GET["id"])) {
  $patientID = $_GET["id"];
}

$sql = "
SELECT p.*, d.village, c.*
FROM patients p
RIGHT JOIN conditions c ON p.patientID = c.patientID
";

$sql = "SELECT 
    p.*,
    v.village,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', c.id,
            'test', c.test,
            'result', c.result,
            'diagnosis', c.diseaseID
        )
    ) AS conditions
FROM patients p
LEFT JOIN conditions c 
    ON p.patientId = c.patientID
LEFT JOIN villages v ON v.id = p.villageID
GROUP BY p.patientId ORDER BY p.date DESC";

$sql =
  "SELECT * FROM patients p, villages v WHERE p.villageID=v.id AND p.patientID=" .
  $patientID;

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
    array_push($conditions, $condition);
  }

  $patient["conditions"] = $conditions;

  array_push($patients, $patient);
}
echo json_encode($patients[0]);
//echo json_encode($data);
?>
