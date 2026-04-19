<?php
//require_once $_SERVER["DOCUMENT_ROOT"] . "/middleware/secure_api.php";
header("Content-Type: application/json");

// Include database and helper functions
include "../config/db.php";

// Utility function to get rows from DB
function get_db_rows($conn, $sql)
{
  $result = $conn->query($sql);
  if (!$result) {
    die(json_encode(["error" => "SQL Error: " . $conn->error]));
  }

  $data = [];
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }

  return $data;
}

// Get optional patient ID from GET
$patientID = isset($_GET["id"]) ? intval($_GET["id"]) : null;

// Base SQL for patients
$sql = "SELECT p.*, v.village 
        FROM patients p 
        LEFT JOIN villages v ON p.villageID = v.id";

// Add patient filter if ID is provided
if ($patientID !== null) {
  $sql .= " WHERE p.serialNumber LIKE '$patientID%'";
}

// Order by serialNumber if not filtered
if ($patientID === null) {
  $sql .= " ORDER BY p.serialNumber";
}

// Fetch patients
$patientData = get_db_rows($conn, $sql);

$patients = [];

foreach ($patientData as $patient) {
  $pid = $patient["patientID"];

  // Fetch conditions with disease info
  $conditionsSQL = "SELECT c.id as conditionID, c.test, c.result, c.diseaseID, d.diseaseName, d.diseaseCode
                      FROM conditions c
                      LEFT JOIN diseases d ON c.diseaseID = d.id
                      WHERE c.patientID = $pid";
  $conditionsData = get_db_rows($conn, $conditionsSQL);

  $conditions = [];
  foreach ($conditionsData as $condition) {
    $condID = $condition["conditionID"];

    // Fetch treatments for each condition
    $treatmentsSQL = "SELECT tg.treatmentID, t.treatment
                          FROM treatments_given tg
                          LEFT JOIN treatments t ON tg.treatmentID = t.id
                          WHERE tg.conditionsID = $condID";
    $treatments = get_db_rows($conn, $treatmentsSQL);

    $condition["treatments"] = $treatments;

    // Custom disease code logic
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

    if ($condition["diseaseName"] === "GE") {
      $condition["diseaseCode"] = $patient["age"] < 5 ? "14A" : "14B";
    }

    $conditions[] = $condition;
  }

  $patient["conditions"] = $conditions;
  $patients[] = $patient;
}

// Output JSON
echo json_encode($patients, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
