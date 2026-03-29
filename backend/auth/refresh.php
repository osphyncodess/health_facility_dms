<?php
require_once "../config/db.php";
require_once "../config/jwt.php";

$refresh = $_COOKIE["refresh_token"] ?? "";

if (!$refresh) die("No token");

$result = $conn->query("SELECT * FROM refresh_tokens WHERE token='$refresh'");
if (!$result->num_rows) die("Invalid");

$data = Firebase\JWT\JWT::decode($refresh, new Firebase\JWT\Key($secret_key, 'HS256'));

$user = $conn->query("SELECT * FROM users WHERE id={$data->user_id}")->fetch_assoc();

$new = generateTokens($user);

echo json_encode(["access_token" => $new["access"]]);