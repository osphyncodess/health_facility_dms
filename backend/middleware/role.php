<?php
function allowRole($user, $roles = []) {
    if (!in_array($user->role, $roles)) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        exit;
    }
}