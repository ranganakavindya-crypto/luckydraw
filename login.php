<?php
include "db.php";
header('Content-Type: application/json');

$username = $conn->real_escape_string($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Please fill all fields"]);
    exit;
}

$res = $conn->query("SELECT * FROM users WHERE username='$username' AND password='$password'");

if ($res->num_rows > 0) {
    $row = $res->fetch_assoc();
    unset($row['password']);
    echo json_encode(["status" => "success", "user" => $row]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
}
?>