<?php
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    
    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        // Generate reset token
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
        
        // Store reset token in database
        $update_stmt = $conn->prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?");
        $update_stmt->bind_param("sss", $token, $expires, $email);
        
        if ($update_stmt->execute()) {
            // Send reset email
            $reset_link = "http://" . $_SERVER['HTTP_HOST'] . "/reset_password.php?token=" . $token;
            $to = $email;
            $subject = "Password Reset Request";
            $message = "Hello,\n\nYou have requested to reset your password. Click the link below to reset your password:\n\n";
            $message .= $reset_link . "\n\n";
            $message .= "This link will expire in 1 hour.\n\n";
            $message .= "If you did not request this reset, please ignore this email.\n\n";
            $message .= "Best regards,\nMotor Vehicle Inventory System";
            $headers = "From: noreply@mvis.com";
            
            if (mail($to, $subject, $message, $headers)) {
                echo "success";
            } else {
                echo "Failed to send reset email";
            }
        } else {
            echo "Error processing request";
        }
        $update_stmt->close();
    } else {
        echo "Email not found";
    }
    $stmt->close();
} else {
    echo "Invalid request method";
}

$conn->close();
?>