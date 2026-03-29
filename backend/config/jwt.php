<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "aJ3kL9pQ2rW8xZ6vB0tM5sF1yH7dK4nV3";

function generateTokens($user)
{
  global $secret_key;

  $access = [
    "user_id" => $user["id"],
    "role" => $user["role"],
    "exp" => time() + 15 * 60,
  ];

  $refresh = [
    "user_id" => $user["id"],
    "exp" => time() + 7 * 24 * 60 * 60,
  ];

  return [
    "access" => JWT::encode($access, $secret_key, "HS256"),
    "refresh" => JWT::encode($refresh, $secret_key, "HS256"),
  ];
}
