<?php
session_start();
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT id, password, fullname FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['isLoggedIn'] = true;
            $_SESSION['userId'] = $row['id'];
            $_SESSION['userEmail'] = $email;
            $_SESSION['fullname'] = $row['fullname'];
            echo "success";
        } else {
            echo "Incorrect password!";
        }
    } else {
        echo "Email not found!";
    }
    $stmt->close();
} else {
    echo "Invalid request method";
}

$conn->close();
?>