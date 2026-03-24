<?php
include "header_info.php";
include "db.php";

$sql = "
SELECT p.*, c.*
FROM patients p
RIGHT JOIN conditions c ON p.patientID = c.patientID
";
$sql = "SELECT 
    p.*,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', c.id,
            'test', c.test,
            'result', c.result,
            'diagnosis', c.diagnosis,
            'code', c.code,
            'treatment', c.treatment
        )
    ) AS conditions
FROM patients p
LEFT JOIN conditions c 
    ON p.patientId = c.patientID
GROUP BY p.patientId ORDER BY p.date DESC";

$stmt = $conn->prepare($sql);
$stmt->execute();

$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
?>
