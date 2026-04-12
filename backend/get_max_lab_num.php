<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/middleware/secure_api.php";
include $_SERVER["DOCUMENT_ROOT"] . "/config/db.php";
include "functions.php";

$sql = "SELECT MAX(serialNumber) as last_opd from lab_register";

$max_opd_num = get_db_rows($conn, $sql);

echo json_encode($max_opd_num[0]);
?>