<?php
include "db.php";
header('Content-Type: application/json');

$username = $conn->real_escape_string($_POST['username'] ?? '');
$number = intval($_POST['number'] ?? 0);

if (empty($username) || $number < 1 || $number > 100) {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
    exit;
}

// Check if already booked
$check = $conn->query("SELECT * FROM tickets WHERE number='$number'");
if ($check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Number already booked"]);
    exit;
}

// Check user coins
$userRes = $conn->query("SELECT coins FROM users WHERE username='$username'");
if ($userRes->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$user = $userRes->fetch_assoc();
if ($user['coins'] < 10) {
    echo json_encode(["status" => "error", "message" => "Not enough coins (need 10)"]);
    exit;
}

// Book ticket & deduct coins
$conn->query("INSERT INTO tickets (number, username) VALUES ('$number', '$username')");
$conn->query("UPDATE users SET coins = coins - 10 WHERE username='$username'");

// Get updated coins
$updated = $conn->query("SELECT coins FROM users WHERE username='$username'")->fetch_assoc();

echo json_encode([
    "status" => "success", 
    "message" => "Ticket booked successfully",
    "newCoins" => $updated['coins']
]);
?>