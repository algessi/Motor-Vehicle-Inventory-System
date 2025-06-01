<?php
require 'db.php';

if (isset($_GET['token'])) {
    $token = $_GET['token'];
    
    // Check if token exists and is valid
    $stmt = $conn->prepare("SELECT id, token_expiry FROM users WHERE verification_token = ? AND is_verified = 0");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Check if token has expired
        if (strtotime($user['token_expiry']) < time()) {
            echo "Verification link has expired. Please register again.";
            exit;
        }
        
        // Update user as verified
        $updateStmt = $conn->prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?");
        $updateStmt->bind_param("i", $user['id']);
        
        if ($updateStmt->execute()) {
            echo "Email verified successfully! You can now login.";
            header("refresh:3;url=/index.html");
        } else {
            echo "Verification failed. Please try again.";
        }
        
        $updateStmt->close();
    } else {
        echo "Invalid verification token.";
    }
    
    $stmt->close();
} else {
    echo "No verification token provided.";
}

$conn->close();
?>