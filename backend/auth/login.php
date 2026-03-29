<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

require_once "../config/db.php";
require_once "../config/jwt.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
$stmt->bind_param("s", $data["email"]);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user || !password_verify($data["password"], $user["password"])) {
  die(json_encode(["error" => "Invalid credentials", "success" => false]));
}

$tokens = generateTokens($user);

// Store refresh token
$conn->query("INSERT INTO refresh_tokens (user_id, token, expires_at)
VALUES ({$user["id"]}, '{$tokens["refresh"]}', DATE_ADD(NOW(), INTERVAL 7 DAY))");

setcookie(
  "refresh_token",
  $tokens["refresh"],
  time() + 604800,
  "/",
  "",
  false,
  true
);

echo json_encode([
  "success" => true,
  "access_token" => $tokens["access"],
  "user" => $user,
]);
