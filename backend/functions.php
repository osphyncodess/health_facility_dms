<?php
function get_db_rows($conn, $sql)
{
    $result = $conn->query($sql);

    if (!$result) {
        die("SQL Error: " . $conn->error);
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function buildPieChart($data){
  $count = count($data);

  $ageband = [];

  if( $count == 2){
    $ageband = [
      ["name"=>"Over 5", "value"=> $data[0]["count"]],
      ["name"=>"Less 5", "value"=> $data[1]["count"]]
    ];
  }else if($count == 0){
    $ageband = [
      ["name"=>"Over 5", "value"=> 0],
      ["name"=>"Less 5", "value"=> 0]
    ];
  }else {
    if($data[0]["is_less_5"] == 0){
      $ageband = [
        ["name"=>"Over 5", "value"=> $data[0]["count"]],
        ["name"=>"Less 5", "value"=> 0]
      ];
    }else {
      $ageband = [
        ["name"=>"Over 5", "value"=> 0],
        ["name"=>"Less 5", "value"=> $data[1]["count"]]
      ];
    }
  }
  
  return $ageband;
}

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
?>