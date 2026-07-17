<?php
// Configuration NovaCore BOS générée par l'installateur
return [
    'app' => [
        'name' => 'NovaCore BOS',
        'version' => '3.0.0',
        'env' => getenv('NODE_ENV') ?: 'production',
    ],
    'postgres' => [
        'host' => getenv('POSTGRES_HOST') ?: 'localhost',
        'port' => getenv('POSTGRES_PORT') ?: 5432,
        'user' => getenv('POSTGRES_USER') ?: 'novacore',
        'password' => getenv('POSTGRES_PASSWORD') ?: 'novacore123',
        'database' => getenv('POSTGRES_DB') ?: 'novacore',
    ],
    'mongodb' => [
        'uri' => getenv('MONGODB_URI') ?: 'mongodb://localhost:27017/novacore',
    ],
    'kernel' => [
        'url' => getenv('KERNEL_URL') ?: 'http://localhost:3000',
    ],
];
