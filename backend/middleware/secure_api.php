<?php
header("Content-Type: application/json");

require_once $_SERVER["DOCUMENT_ROOT"] . "/middleware/auth.php";

// Protect route, only authenticated users can access
$user = protectRoute(); // Pa
?>
