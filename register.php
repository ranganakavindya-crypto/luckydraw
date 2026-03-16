<?php
include "db.php";
header('Content-Type: application/json');

$username = $conn->real_escape_string($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Please fill all fields"]);
    exit;
}

if (strlen($username) < 3) {
    echo json_encode(["status" => "error", "message" => "Username must be 3+ characters"]);
    exit;
}

if (strlen($password) < 4) {
    echo json_encode(["status" => "error", "message" => "Password must be 4+ characters"]);
    exit;
}

$check = $conn->query("SELECT * FROM users WHERE username='$username'");

if ($check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Username already exists"]);
} else {
    $conn->query("INSERT INTO users (username, password, coins, role) VALUES ('$username', '$password', 10, 'player')");
    echo json_encode(["status" => "success", "message" => "Account created! Please login."]);
}
?>