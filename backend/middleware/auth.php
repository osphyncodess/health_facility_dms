<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/jwt.php";

/**
 * Middleware to protect routes
 * @param array $roles Optional: only allow specific roles
 * @return array|null User data if authorized
 */
function protectRoute($roles = [])
{
    // Verify access token
    $userData = verifyAccessToken();

    if (!$userData) {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Unauthorized"]);
        exit;
    }

    // Check if user exists in DB
    global $conn;
    $stmt = $conn->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
    $stmt->bind_param("i", $userData["user_id"]);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user) {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "User not found"]);
        exit;
    }

    // Check role if specified
    if (!empty($roles) && !in_array($user["role"], $roles)) {
        http_response_code(403);
        echo json_encode(["success" => false, "error" => "Forbidden"]);
        exit;
    }

    // Return user data for use in route
    return $user;
}