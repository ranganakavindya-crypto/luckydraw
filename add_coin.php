<?php
include "db.php";
header('Content-Type: application/json');

$username = $conn->real_escape_string($_POST['username'] ?? '');
$coins = intval($_POST['coins'] ?? 0);

if (empty($username) || $coins < 1) {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
    exit;
}

$check = $conn->query("SELECT * FROM users WHERE username='$username'");
if ($check->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$conn->query("UPDATE users SET coins = coins + $coins WHERE username='$username'");
echo json_encode(["status" => "success", "message" => "Added $coins coins to $username"]);
?>