<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/headers.php";

// ========================
// DB CONNECTION (MySQLi)
// ========================
$host = "127.0.0.1";
$user = "root";
$pass = "root123";
$db = "osphyncodes";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  echo json_encode([
    "status" => false,
    "message" => "Database connection failed",
  ]);
  exit();
}

$sql = "select `c`.`id` AS `id`,`c`.`patientID` AS `patientID`,`p`.`visit_date`
AS `visit_date`,`c`.`test` AS `test`,`c`.`result` AS `result`,`c`.`diseaseID` AS
`diseaseID`,`c`.`created_by` AS `created_by`,`c`.`created_at` AS
`created_at`,`d`.`diseaseName` AS `diseaseName` from (`conditions` `c` join
`diseases` `d`), `patients` `p` where `c`.`diseaseID` = `d`.`id` and
`c`.`patientID` =
`p`.`patientID`";



// ========================
// GET FILTERS
// ========================
$filterType = $_GET["filterType"] ?? "";
$date1 = $_GET["date1"] ?? "";
$date2 = $_GET["date2"] ?? "";

// ========================
// VALIDATE DATE
// ========================
function isValidDate($date)
{
  return preg_match("/^\d{4}-\d{2}-\d{2}$/", $date);
}

if ($date1 && !isValidDate($date1)) {
  $date1 = null;
}
if ($date2 && !isValidDate($date2)) {
  $date2 = null;
}

// ========================
// BUILD WHERE CLAUSE (FIXED)
// ========================
function buildDateFilter(
  $filterType,
  $date1,
  $date2,
  &$params,
  &$types,
  $column
) {
  switch ($filterType) {
    case "previous_month":
      return "WHERE MONTH($column) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
              AND YEAR($column) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)";

    case "specific_date":
      if ($date1) {
        $params[] = $date1 . " 00:00:00";
        $params[] = $date1 . " 23:59:59";
        $types .= "ss";
        return "WHERE $column BETWEEN ? AND ?";
      }
      break;

    case "between":
      if ($date1 && $date2) {
        $params[] = $date1 . " 00:00:00";
        $params[] = $date2 . " 23:59:59";
        $types .= "ss";
        return "WHERE $column BETWEEN ? AND ?";
      }
      break;

    case "greater":
      if ($date1) {
        $params[] = $date1 . " 00:00:00";
        $types .= "s";
        return "WHERE $column >= ?";
      }
      break;

    case "less":
      if ($date1) {
        $params[] = $date1 . " 23:59:59";
        $types .= "s";
        return "WHERE $column <= ?";
      }
      break;
  }

  return "";
}

// ========================
// GENERIC FETCH FUNCTION
// ========================
function fetchAllSafe($conn, $sql, $params = [], $types = "")
{
  $stmt = $conn->prepare($sql);

  if ($params) {
    $stmt->bind_param($types, ...$params);
  }

  $stmt->execute();
  $result = $stmt->get_result();

  $data = [];
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }

  return $data;
}

// ========================
// TABLE CONFIG
// ========================
$table_configs = [
  ["label" => "Patients", "table" => "patients", "date_col" => "visit_date"],
  [
    "label" => "Malaria Patients",
    "table" => "malaria_patients",
    "date_col" => "visit_date",
  ],
  [
    "label" => "MP in La Register",
    "table" => "malaria_patients_in_la_reg",
    "date_col" => "visit_date",
  ],
  [
    "label" => "MP Not in La Register",
    "table" => "malaria_patients_not_in_la_reg",
    "date_col" => "visit_date",
  ],
];

// adjust if needed
$conditions_date_col = "visit_date";
$patients_date_col = "visit_date";

try {
  // ========================
  // 1. STATS
  // ========================
  $stats = [];

  foreach ($table_configs as $t) {
    $params = [];
    $types = "";

    $where = buildDateFilter(
      $filterType,
      $date1,
      $date2,
      $params,
      $types,
      $t["date_col"]
    );

    $sql = "SELECT COUNT(*) AS v FROM {$t["table"]} $where";

    $result = fetchAllSafe($conn, $sql, $params, $types);

    $stats[] = [
      "title" => $t["label"],
      "value" => $result[0]["v"] ?? 0,
    ];
  }

  // ========================
  // 2. DATE DISTRIBUTION
  // ========================
  $params = [];
  $types = "";

  $where = buildDateFilter(
    $filterType,
    $date1,
    $date2,
    $params,
    $types,
    $patients_date_col
  );

  $sql = "SELECT DATE($patients_date_col) as d, COUNT(*) as count
          FROM patients
          $where
          GROUP BY d
          ORDER BY d DESC";

  $dateData = fetchAllSafe($conn, $sql, $params, $types);

  $dateDistribution = [];

  foreach ($dateData as $row) {
    $dateDistribution[] = [
      "name" => $row["d"],
      "patients" => $row["count"],
    ];
  }

  // ========================
  // 3. CONDITIONS
  // ========================
  $params = [];
  $types = "";

  $where = buildDateFilter(
    $filterType,
    $date1,
    $date2,
    $params,
    $types,
    $conditions_date_col
  );

  $totalParams = $params;
  $totalTypes = $types;

  $totalSql = "SELECT COUNT(*) as total FROM conditions_with_disease_name $where";
  $totalResult = fetchAllSafe($conn, $totalSql, $totalParams, $totalTypes);

  $total = $totalResult[0]["total"] ?? 1;
  if ($total == 0) {
    $total = 1;
  }

  $conditionsSql = "SELECT diseaseName, COUNT(*) AS count
                    FROM conditions_with_disease_name
                    $where
                    GROUP BY diseaseName
                    ORDER BY count DESC";

  $conditionsData = fetchAllSafe($conn, $conditionsSql, $params, $types);

  $conditions = [];

  foreach ($conditionsData as $row) {
    $conditions[] = [
      "diseaseName" => $row["diseaseName"],
      "count" => $row["count"],
      "perc" => round(($row["count"] / $total) * 100),
    ];
  }

  // ========================
  // FINAL RESPONSE
  // ========================
  echo json_encode([
    "status" => true,
    "data" => [
      "stats" => $stats,
      "dateDistribution" => $dateDistribution,
      "conditions" => $conditions,
    ],
  ]);
} catch (Exception $e) {
  echo json_encode([
    "status" => false,
    "message" => $e->getMessage(),
  ]);
}
