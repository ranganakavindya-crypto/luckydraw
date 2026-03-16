<?php
include "db.php";
header('Content-Type: application/json');

$username = $conn->real_escape_string($_POST['username'] ?? '');

if (empty($username)) {
    echo json_encode(["status" => "error", "message" => "No username"]);
    exit;
}

$res = $conn->query("SELECT username, coins, role FROM users WHERE username='$username'");
if ($res->num_rows > 0) {
    $user = $res->fetch_assoc();
    echo json_encode(["status" => "success", "user" => $user]);
} else {
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
?>