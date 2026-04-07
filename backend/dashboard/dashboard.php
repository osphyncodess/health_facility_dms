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

$stats = [];
$table_names = [
  "Patients" => "patients",
  "Malaria Patients" => "malaria_patients",
  "MP in La Register" => "malaria_patients_in_la_reg",
  "MP Not in La Register" => "malaria_patients_not_in_la_reg",
];

$response = [];

//patient stats
try {
  foreach ($table_names as $key => $value) {
    $sql = "SELECT COUNT(*) AS v FROM " . $value;

    $dataCount = get_db_rows($conn, $sql);

    $query_data = [];
    $query_data["title"] = $key;
    $query_data["value"] = $dataCount[0]["v"];

    array_push($stats, $query_data);
  }

  //distributed by visit date
  $sql =
    "SELECT date, count(*) as count from patients GROUP BY date ORDER BY date DESC";
  $queried_data = get_db_rows($conn, $sql);

  $distributed_by_visit_date = [];

  foreach ($queried_data as $value) {
    array_push($distributed_by_visit_date, [
      "name" => $value["date"],
      "patients" => $value["count"],
    ]);
  }

  //Conditions
  $sql = 'SELECT
    diseaseName,
    COUNT(*) AS count,
    ROUND(((COUNT(*)/(SELECT COUNT(*) FROM conditions_with_disease_name)) * 100)) as perc
    
FROM
    conditions_with_disease_name
GROUP BY
    diseaseName
ORDER BY
    count
DESC';
  $queried_data_conditions = get_db_rows($conn, $sql);

  $final_data = [
    "stats" => $stats,
    "dateDistribution" => $distributed_by_visit_date,
    "conditions" => $queried_data_conditions,
  ];
  // Output JSON

  $response["status"] = true;
  $response["data"] = $final_data;
} catch (Exception $e) {
  $response["status"] = false;
  $response["data"] = null;
  $response["message"] = $e->getMessage();
}
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
// Get optional patient ID from GET
// $patientID = isset($_GET["id"]) ? intval($_GET["id"]) : null;

// // Base SQL for patients
// $sql = "SELECT p.*, v.village
//         FROM patients p
//         LEFT JOIN villages v ON p.villageID = v.id";

// // Add patient filter if ID is provided
// if ($patientID !== null) {
//     $sql .= " WHERE p.patientID = $patientID";
// }

// // Order by serialNumber if not filtered
// if ($patientID === null) {
//     $sql .= " ORDER BY p.serialNumber";
// }

// Fetch patients
