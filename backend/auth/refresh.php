<?php


require_once "../config/db.php";
require_once "../config/jwt.php";

$refresh = $_COOKIE["refresh_token"] ?? null;

if (!$refresh) {
  http_response_code(401);
  echo json_encode(["success" => false, "error" => "No token"]);
  exit();
}

// 🔍 Check token exists in DB (SAFE)
$stmt = $conn->prepare("SELECT * FROM refresh_tokens WHERE token = ?");
$stmt->bind_param("s", $refresh);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
  http_response_code(401);
  echo json_encode(["success" => false, "error" => "Invalid token"]);
  exit();
}

// 🔐 Decode token
$data = verifyRefreshToken($refresh);

if (!$data) {
  http_response_code(401);
  echo json_encode(["success" => false]);
  exit();
}

// 🔍 Check user still exists
$stmt = $conn->prepare("SELECT id, role FROM users WHERE id = ?");
$stmt->bind_param("i", $data["user_id"]);
$stmt->execute();

$user = $stmt->get_result()->fetch_assoc();

if (!$user) {
  http_response_code(401);
  echo json_encode(["success" => false, "error" => "User deleted"]);
  exit();
}

// 🔁 Generate new access token
$new = generateTokens($user);

echo json_encode([
  "success" => true,
  "access_token" => $new["access"],
]);
