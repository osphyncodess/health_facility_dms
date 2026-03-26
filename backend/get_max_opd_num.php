<?php
include "header_info.php";
include "db.php";
include "functions.php";

$sql = "SELECT MAX(serialNumber) as last_opd from patients";

$max_opd_num = get_db_rows($conn, $sql);

echo json_encode($max_opd_num[0]);
?>

