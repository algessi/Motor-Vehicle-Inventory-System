<?php
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = strtolower($_POST['email']);
    $confirmEmail = strtolower($_POST['confirmEmail']);
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    // Validate input
    if (empty($firstName) || empty($lastName) || empty($email) || empty($password)) {
        echo json_encode(["error" => "All fields are required"]);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["error" => "Invalid email format"]);
        exit;
    }

    // Check if emails match
    if ($email !== $confirmEmail) {
        echo json_encode(["error" => "Emails do not match"]);
        exit;
    }

    // Check if passwords match
    if ($password !== $confirmPassword) {
        echo json_encode(["error" => "Passwords do not match"]);
        exit;
    }

    // Password validation
    if (strlen($password) < 8 || 
        !preg_match('/[A-Z]/', $password) || 
        !preg_match('/[a-z]/', $password) || 
        !preg_match('/[0-9]/', $password) || 
        !preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
        echo json_encode(["error" => "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters"]);
        exit;
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["error" => "Email already registered"]);
        $stmt->close();
        exit;
    }

    // Generate verification token
    $verificationToken = bin2hex(random_bytes(32));
    $tokenExpiry = date('Y-m-d H:i:s', strtotime('+24 hours'));
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password, verification_token, token_expiry, is_verified) VALUES (?, ?, ?, ?, ?, ?, 0)");
    $stmt->bind_param("ssssss", $firstName, $lastName, $email, $hashedPassword, $verificationToken, $tokenExpiry);

    if ($stmt->execute()) {
        // Send verification email
        $verificationLink = "http://" . $_SERVER['HTTP_HOST'] . "/verify_email.php?token=" . $verificationToken;
        $to = $email;
        $subject = "Verify Your Email";
        $message = "Dear $firstName $lastName,\n\n";
        $message .= "Thank you for registering. Please click the link below to verify your email:\n\n";
        $message .= $verificationLink . "\n\n";
        $message .= "This link will expire in 24 hours.\n\n";
        $message .= "Best regards,\nMotor Vehicle Inventory System";
        $headers = "From: noreply@mvis.com";

        if (mail($to, $subject, $message, $headers)) {
            echo json_encode(["success" => true, "message" => "Registration successful! Please check your email to verify your account."]);
        } else {
            echo json_encode(["error" => "Failed to send verification email"]);
        }
    } else {
        echo json_encode(["error" => "Registration failed"]);
    }

    $stmt->close();
}

$conn->close();
?>