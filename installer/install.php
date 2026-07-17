<?php
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid configuration']);
    exit;
}
$result = ['steps' => []];
try {
    $pg = $input['postgres'];
    $dsn = "pgsql:host={$pg['host']};port={$pg['port']};dbname={$pg['db']}";
    $pdo = new PDO($dsn, $pg['user'], $pg['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $result['steps'][] = ['step' => 'postgres_connection', 'status' => 'ok'];

    $pdo->exec('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    $pdo->exec('CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar UNIQUE NOT NULL,
        password varchar NOT NULL,
        roles text[] DEFAULT \'{}\',
        "createdAt" timestamp DEFAULT now()
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS staff (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        matricule varchar NOT NULL,
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        position varchar,
        department varchar,
        "staffRole" varchar DEFAULT \'agent\',
        status varchar DEFAULT \'active\',
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT uq_staff_user UNIQUE ("userId")
    )');
    $result['steps'][] = ['step' => 'schema_creation', 'status' => 'ok'];

    $admin = $input['admin'];
    $check = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $check->execute([$admin['email']]);
    if ($check->fetch()) {
        $result['steps'][] = ['step' => 'admin_creation', 'status' => 'already_exists'];
    } else {
        $hash = password_hash($admin['pass'], PASSWORD_BCRYPT);
        $stmt = $pdo->prepare('INSERT INTO users (email, password, roles) VALUES (?, ?, ?)');
        $stmt->execute([$admin['email'], $hash, '{admin}']);
        $result['steps'][] = ['step' => 'admin_creation', 'status' => 'ok'];
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}
$result['status'] = 'success';
$result['message'] = 'NovaCore BOS installé avec succès';
echo json_encode($result);
