<?php
// backend-php/config/cors.php

function handleCors()
{
    // Allow from localhost:4200 (Angular) and localhost:8000 (Self)
    $allowed_origins = [
        'http://localhost:4200',
        'https://word-tracker-henna.vercel.app'
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    // If no origin, logic flow continues, but we might want to default for tools like Postman if not strict
    if (in_array($origin, $allowed_origins) || empty($origin)) {
        header("Access-Control-Allow-Origin: " . ($origin ?: '*'));
    } else {
        // Optional: Allow * for development if consistent with security posture
        header("Access-Control-Allow-Origin: *");
    }

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');

    // preflight
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        exit(0);
    }
}
?>