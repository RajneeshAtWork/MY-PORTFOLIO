<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$config = require 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate and sanitize inputs
    $fullname = trim(htmlspecialchars($_POST['fullname'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $message = trim(htmlspecialchars($_POST['message'] ?? ''));

    // Validation
    if (empty($fullname) || !$email || empty($message)) {
        http_response_code(400);
        echo "❌ Please fill all fields correctly!";
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = $config['smtp_host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['email'];
        $mail->Password   = $config['password'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $config['smtp_port'];

        // Recipients
        $mail->setFrom($config['email'], 'Your Project Name');  // Use your authenticated email
        $mail->addAddress('your-email@example.com');            // Your receiving address
        $mail->addReplyTo($email, $fullname);                   // Set reply-to address

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Message from $fullname - Project Contact Form";
        
        // Structured HTML email template
        $mail->Body = "
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; }
                    .header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                    .content { margin: 15px 0; }
                    .footer { color: #666; font-size: 0.9em; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>New Contact Form Submission</h2>
                    </div>
                    <div class='content'>
                        <p><strong>Name:</strong> $fullname</p>
                        <p><strong>Email:</strong> <a href='mailto:$email'>$email</a></p>
                        <p><strong>Message:</strong></p>
                        <p>$message</p>
                    </div>
                    <div class='footer'>
                        <p>This message was sent from your project contact form</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        // Plain-text alternative
        $mail->AltBody = "Name: $fullname\nEmail: $email\nMessage:\n$message";

        $mail->send();
        header("Location: thank-you.html");
        exit();

    } catch (Exception $e) {
        http_response_code(500);
        error_log('Mailer Error: ' . $mail->ErrorInfo);
        echo "❌ Oops! Something went wrong. Please try again later.";
    }
} else {
    http_response_code(405);
    echo "❌ Method not allowed!";
}