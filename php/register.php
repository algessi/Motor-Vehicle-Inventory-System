<?php
require 'db.php';

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Get form data
  $fullname = $_POST['fullname'];
  $email = $_POST['email'];
  $username = $_POST['username'];
  $password = $_POST['password'];

  // Validate input
  if (empty($fullname) || empty($email) || empty($username) || empty($password)) {
    echo "All fields are required";
    exit;
  }

  // Validate email
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email format";
    exit;
  }

  // Password validation (at least 8 chars with uppercase, lowercase, number, and special char)
  if (strlen($password) < 8 || 
      !preg_match('/[A-Z]/', $password) || 
      !preg_match('/[a-z]/', $password) || 
      !preg_match('/[0-9]/', $password) || 
      !preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
    echo "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters";
    exit;
  }

  // Check if username or email already exists
  $stmt = $conn->prepare("SELECT id FROM users WHERE username=? OR email=?");
  $stmt->bind_param("ss", $username, $email);
  $stmt->execute();
  $stmt->store_result();

  if ($stmt->num_rows > 0) {
    echo "User already exists with this username or email";
    $stmt->close();
  } else {
    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $insert_stmt = $conn->prepare("INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)");
    $insert_stmt->bind_param("ssss", $fullname, $email, $username, $hashed_password);
    
    if ($insert_stmt->execute()) {
      echo "success";
    } else {
      echo "Error: " . $insert_stmt->error;
    }
    
    $insert_stmt->close();
  }
} else {
  echo "Invalid request method";
}

$conn->close();
?>