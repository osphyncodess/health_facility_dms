<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/headers.php";

// ========================
// DB CONNECTION (PDO)
// ========================
$host = "127.0.0.1";
$db = "osphyncodes";
$user = "root";
$pass = "root123";


try {
  $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo json_encode([
    "status" => false,
    "message" => "Database connection failed",
  ]);
  exit();
}

// ========================
// GET FILTERS
// ========================
$filterType = $_GET["filterType"] ?? "";
$date1 = $_GET["date1"] ?? "";
$date2 = $_GET["date2"] ?? "";

// ========================
// VALIDATE DATES
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
// BUILD SAFE WHERE CLAUSE
// ========================
function buildDateFilter($filterType, $date1, $date2, &$params, $column)
{
  

  switch ($filterType) {
    case "previous_month":
      return "WHERE MONTH($column) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
              AND YEAR($column) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)";

    case "specific_date":
      if ($date1) {
        $params[] = $date1;
        return "WHERE DATE($column) = ?";
      }
      break;

    case "between":
      if ($date1 && $date2) {
        $params[] = $date1;
        $params[] = $date2;
        return "WHERE DATE($column) BETWEEN ? AND ?";
      }
      break;

    case "greater":
      if ($date1) {
        $params[] = $date1;
        return "WHERE DATE($column) >= ?";
      }
      break;

    case "less":
      if ($date1) {
        $params[] = $date1;
        return "WHERE DATE($column) <= ?";
      }
      break;
  }

  return "";
}

// ========================
// GENERIC QUERY EXECUTOR
// ========================
function fetchAllSafe($conn, $sql, $params = [])
{
  $stmt = $conn->prepare($sql);
  $stmt->execute($params);
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// ========================
// TABLE CONFIG (IMPORTANT)
// ========================
$table_configs = [
  ["label" => "Patients", "table" => "patients", "date_col" => "date"],
  [
    "label" => "Malaria Patients",
    "table" => "malaria_patients",
    "date_col" => "date",
  ],
  [
    "label" => "MP in La Register",
    "table" => "malaria_patients_in_la_reg",
    "date_col" => "date",
  ],
  [
    "label" => "MP Not in La Register",
    "table" => "malaria_patients_not_in_la_reg",
    "date_col" => "date",
  ],
];

// ========================
// MAIN LOGIC
// ========================
try {
  // ========================
  // 1. STATS
  // ========================
  $stats = [];

  foreach ($table_configs as $t) {
    $params = [];
    $where = buildDateFilter(
      $filterType,
      $date1,
      $date2,
      $params,
      $t["date_col"]
    );

    $sql = "SELECT COUNT(*) AS v FROM {$t["table"]} $where";

    $result = fetchAllSafe($conn, $sql, $params);

    $stats[] = [
      "title" => $t["label"],
      "value" => $result[0]["v"] ?? 0,
    ];
  }

  // ========================
  // 2. DATE DISTRIBUTION
  // ========================
  $params = [];
  $where = buildDateFilter($filterType, $date1, $date2, $params, "date");

  $sql = "SELECT DATE(date) as d, COUNT(*) as count 
          FROM patients
          $where
          GROUP BY d
          ORDER BY d DESC";

  $dateData = fetchAllSafe($conn, $sql, $params);

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
  $where = buildDateFilter($filterType, $date1, $date2, $params, "date");

  // TOTAL (separate params copy)
  $totalParams = $params;

  $totalSql = "SELECT COUNT(*) as total 
               FROM conditions_with_disease_name 
               $where";

  $totalResult = fetchAllSafe($conn, $totalSql, $totalParams);
  $total = $totalResult[0]["total"] ?? 1;

  if ($total == 0) {
    $total = 1;
  } // avoid division by zero

  // MAIN QUERY
  $conditionsSql = "SELECT diseaseName, COUNT(*) AS count
                    FROM conditions_with_disease_name
                    $where
                    GROUP BY diseaseName
                    ORDER BY count DESC";

  $conditionsData = fetchAllSafe($conn, $conditionsSql, $params);

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
  echo json_encode(
    [
      "status" => true,
      "data" => [
        "stats" => $stats,
        "dateDistribution" => $dateDistribution,
        "conditions" => $conditions,
      ],
    ],
    JSON_UNESCAPED_UNICODE
  );
} catch (Exception $e) {
  echo json_encode([
    "status" => false,
    "message" => $e->getMessage(),
  ]);
}
