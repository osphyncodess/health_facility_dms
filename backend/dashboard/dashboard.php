<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/headers.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/functions.php";

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

$table_configs = [
  ["label" => "Patients", "table" => "patients", "date_col" => "visit_date"],
  [
    "label" => "Malaria Patients",
    "table" => "malaria_patients",
    "date_col" => "visit_date",
  ],
  [
    "label" => "MP Linked With LA Register",
    "table" => "malaria_patients_in_la_reg",
    "date_col" => "visit_date",
  ],
  [
    "label" => "MP Not Linked with LA Register",
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

  //==========================================================================================
  //LAB STATS
  //==========================================================================================

  //Total Tests
  $where_or_and = "";

  $where === "" ? $where_or_and = "WHERE" : $where_or_and = "AND";



  $lab_configs = [
    [
      "label" => "Total MRDT Tests",
      "sql" => "SELECT COUNT(*) AS count FROM lab_register $where"
    ],
    [
      "label" => "MRDT Pos",
      "sql" => "SELECT COUNT(*) AS count FROM lab_register $where $where_or_and result = 'Positive'"
    ],
    [
      "label" => "MRDT Pos in OPD Reg",
      "sql" => "SELECT COUNT(*) AS count FROM lab_register $where $where_or_and result = 'Positive' AND patientID IS NOT NULL"
    ],
    [
      "label" => "MRDT Pos not in OPD Reg",
      "sql" => "SELECT COUNT(*) AS count FROM lab_register $where $where_or_and result = 'Positive' AND patientID IS NULL"
    ]
  ];


  $lab_stats = [];

  foreach ($lab_configs as $t) {

    $sql = $t['sql'];

    $result = fetchAllSafe($conn, $sql, $params, $types);

    $lab_stats[] = [
      "title" => $t["label"],
      "value" => $result[0]["count"] ?? 0,
    ];
  }


  // ========================
  // 2. DATE DISTRIBUTION ALL PATIENTS
  // ========================
  

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
  // 2. DATE DISTRIBUTION MALARIA PATIENTS
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
          FROM malaria_patients
          $where
          GROUP BY d
          ORDER BY d DESC";

  $dateData = fetchAllSafe($conn, $sql, $params, $types);

  $dateDistributionMalaria = [];

  foreach ($dateData as $row) {
    $dateDistributionMalaria[] = [
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

  $sql = "SELECT COUNT(*) as c FROM conditions_with_disease_name $where";

  $total_conditions = fetchAllSafe($conn, $sql, $params, $types)[0]["c"];
  //=========================
  // TOTAL PATIENTS AGE BAND
  //=========================

  $sql = "SELECT age < 5 AS is_less_5, COUNT(*) as count FROM patients $where GROUP BY age < 5";

  $total_patients_age = fetchAllSafe($conn, $sql, $params, $types);
  $total_ageband = buildPieChart($total_patients_age);

  //=========================
  // MALARIA PATIENTS AGE BAND
  //=========================

  $sql = "SELECT age < 5 AS is_less_5, COUNT(*) as count FROM malaria_patients $where GROUP BY age < 5";

  $malaria_patients_age = fetchAllSafe($conn, $sql, $params, $types);
  $mp_ageband = buildPieChart($malaria_patients_age);

  // ========================
  // FINAL RESPONSE
  // ========================
  echo json_encode([
    "status" => true,
    "data" => [
      "stats" => $stats,
      "labStats"=> $lab_stats,
      "dateDistribution" => $dateDistribution,
      "dateDistributionMalaria" => $dateDistributionMalaria,
      "conditions" => $conditions,
      "tpAgeBand" => $total_ageband,
      "mpAgeBand" => $mp_ageband,
      "total_conditions" => $total_conditions,
    ],
  ]);
} catch (Exception $e) {
  echo json_encode([
    "status" => false,
    "message" => $e->getMessage(),
  ]);
}
