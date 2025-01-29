<?php
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

return [
    'smtp_host' => $_ENV['SMTP_HOST'],
    'smtp_port' => $_ENV['SMTP_PORT'],
    'email'     => $_ENV['EMAIL'],
    'password'  => $_ENV['EMAIL_PASSWORD'],
];
