<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

require_once "../config/db.php";
require_once "../middleware/auth.php";
require_once "../middleware/role.php";

//$user = verifyToken();
//allowRole($user, ["admin"]);

$data = json_decode(file_get_contents("php://input"), true);

$password = password_hash($data["password"], PASSWORD_BCRYPT);

$stmt = $conn->prepare(
  "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)"
);
$stmt->bind_param(
  "ssss",
  $data["name"],
  $data["email"],
  $password,
  $data["role"]
);
$stmt->execute();

echo json_encode(["message" => "User created"]);
