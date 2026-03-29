$user = verifyToken();

$data = json_decode(file_get_contents("php://input"), true);

$result = $conn->query("SELECT * FROM users WHERE id={$user->user_id}");
$dbUser = $result->fetch_assoc();

if (!password_verify($data["old"], $dbUser["password"])) {
    die("Wrong password");
}

$new = password_hash($data["new"], PASSWORD_BCRYPT);

$conn->query("UPDATE users SET password='$new' WHERE id={$user->user_id}");