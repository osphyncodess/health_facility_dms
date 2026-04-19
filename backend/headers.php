<?php
$allowed_origins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "http://10.65.247.19:5000",
  "http://10.65.247.19:5173",
];

// Check if the request's Origin is in the allowed list
if (
  isset($_SERVER["HTTP_ORIGIN"]) &&
  in_array($_SERVER["HTTP_ORIGIN"], $allowed_origins)
) {
  header("Access-Control-Allow-Origin: {$_SERVER["HTTP_ORIGIN"]}");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Handle preflight requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit();
}
