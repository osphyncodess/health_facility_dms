<?php
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
