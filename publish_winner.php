<?php
include "db.php";
header('Content-Type: application/json');

$number = intval($_POST['number'] ?? 0);

if ($number < 1 || $number > 100) {
    echo json_encode(["status" => "error", "message" => "Invalid number"]);
    exit;
}

// Find who booked this number
$res = $conn->query("SELECT username FROM tickets WHERE number='$number'");
$row = $res->fetch_assoc();
$winnerName = $row ? $row['username'] : "No booked player";

// Count total tickets
$countRes = $conn->query("SELECT COUNT(*) as c FROM tickets");
$count = $countRes->fetch_assoc()['c'];

// Save to winners table
$conn->query("INSERT INTO winners (win_number, winner_name, draw_date, ticket_count) 
              VALUES ('$number', '$winnerName', CURDATE(), '$count')");

// Reset all tickets for new day
$conn->query("DELETE FROM tickets");

echo json_encode([
    "status" => "success",
    "message" => "Winner published successfully",
    "number" => $number,
    "winner" => $winnerName,
    "ticketCount" => $count
]);
?>