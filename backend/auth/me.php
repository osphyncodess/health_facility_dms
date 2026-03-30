<?php


require_once "../config/db.php";
require_once "../config/jwt.php";

// 🔐 Verify access token
$data = verifyAccessToken();

if (!$data) {
    http_response_code(401);
    echo json_encode(["success" => false]);
    exit;
}

try {
    // 🔍 Check user still exists
    $stmt = $conn->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
    $stmt->bind_param("i", $data["user_id"]);
    $stmt->execute();

    $user = $stmt->get_result()->fetch_assoc();

    if (!$user) {
        http_response_code(401);
        echo json_encode(["success" => false]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "user" => $user
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Server error"
    ]);
}