<?php 
function get_db_rows($conn, $sql)
{
  $stmt = $conn->prepare($sql);
  $stmt->execute();
  $result = $stmt->get_result();
  $data = [];

  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }

  return $data;
}
?>