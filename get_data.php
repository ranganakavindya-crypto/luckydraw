<?php
include "db.php";
header('Content-Type: application/json');

// Get all tickets
$tickets = [];
$res = $conn->query("SELECT * FROM tickets");
while ($row = $res->fetch_assoc()) {
    $tickets[] = $row;
}

// Get winner history (last 10)
$history = [];
$res2 = $conn->query("SELECT * FROM winners ORDER BY id DESC LIMIT 10");
while ($row = $res2->fetch_assoc()) {
    $history[] = $row;
}

// Get latest winner for homepage
$latestWinner = null;
$res3 = $conn->query("SELECT * FROM winners ORDER BY id DESC LIMIT 1");
if ($res3->num_rows > 0) {
    $latestWinner = $res3->fetch_assoc();
}

// Get total players count
$playerCount = $conn->query("SELECT COUNT(*) as count FROM users")->fetch_assoc()['count'];

echo json_encode([
    "status" => "success",
    "tickets" => $tickets,
    "history" => $history,
    "todayWinner" => $latestWinner,
    "playerCount" => $playerCount
]);
?>