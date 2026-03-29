<?php
require_once "../config/jwt.php";

function verifyToken() {
    global $secret_key;

    $headers = getallheaders();
    $token = str_replace("Bearer ", "", $headers["Authorization"] ?? "");

    try {
        return Firebase\JWT\JWT::decode($token, new Firebase\JWT\Key($secret_key, 'HS256'));
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
}