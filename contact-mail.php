<?php
// contact-mail.php — Darisham Consulting contact form handler

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Sanitize inputs
function clean($val) {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$phone   = clean($_POST['phone']   ?? '');
$subject = clean($_POST['subject'] ?? '');
$message = clean($_POST['message'] ?? '');

// Basic validation
if (!$name || !$email || !$subject) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email and subject are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
    exit;
}

// Destination
$to      = 'support@darisham.in';
$from    = 'noreply@darisham.in';   // must be a domain you own/host on
$replyTo = $email;

$emailSubject = "Website Enquiry: $subject";

$body  = "You have received a new enquiry from the Darisham website contact form.\n\n";
$body .= "-------------------------------------------\n";
$body .= "Name    : $name\n";
$body .= "Email   : $email\n";
$body .= "Phone   : " . ($phone ?: 'Not provided') . "\n";
$body .= "Subject : $subject\n";
$body .= "-------------------------------------------\n\n";
$body .= "Message:\n$message\n\n";
$body .= "-------------------------------------------\n";
$body .= "Sent from: darisham.in/contact.html\n";

$headers  = "From: Darisham Website <$from>\r\n";
$headers .= "Reply-To: $name <$replyTo>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $emailSubject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Your message has been sent. We\'ll be in touch soon!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mail could not be sent. Please email us directly at support@darisham.in']);
}
?>
