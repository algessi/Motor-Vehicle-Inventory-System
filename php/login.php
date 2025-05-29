<?php
session_start();
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['isLoggedIn'] = true;
            $_SESSION['userId'] = $row['id'];
            $_SESSION['username'] = $username;
            echo "success";
        } else {
            echo "Incorrect password!";
        }
    } else {
        echo "User not found!";
    }
    $stmt->close();
} else {
    echo "Invalid request method";
}

$conn->close();
?>