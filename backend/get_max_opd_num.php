<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

include "config/db.php";
include "functions.php";

$sql = "SELECT MAX(serialNumber) as last_opd from patients";

$max_opd_num = get_db_rows($conn, $sql);

echo json_encode($max_opd_num[0]);
?>

