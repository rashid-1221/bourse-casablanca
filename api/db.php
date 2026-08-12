<?php
// api/db.php — SQLite local

function _useSQLite(): PDO {
    $pdo = new PDO('sqlite:' . __DIR__ . '/bourse.db', null, null, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec("PRAGMA journal_mode=WAL");
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        prenom        TEXT NOT NULL,
        nom           TEXT NOT NULL,
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at    TEXT DEFAULT (datetime('now')),
        last_login    TEXT NULL
    )");
    $pdo->exec("CREATE TABLE IF NOT EXISTS tokens (
        token      TEXT NOT NULL PRIMARY KEY,
        user_id    INTEGER NOT NULL,
        expires_at TEXT NOT NULL
    )");
    $pdo->exec("CREATE TABLE IF NOT EXISTS portfolios (
        user_id    INTEGER NOT NULL PRIMARY KEY,
        data       TEXT NOT NULL,
        updated_at TEXT DEFAULT (datetime('now'))
    )");
    if (!defined('DB_TYPE')) define('DB_TYPE', 'sqlite');
    return $pdo;
}

function getDB(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $pdo = _useSQLite();
    return $pdo;
}

// ── Helpers token ──────────────────────────────────────────────────────────
function createToken(PDO $db, int $userId): string {
    $token  = bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', strtotime('+365 days'));
    $db->prepare("INSERT INTO tokens (token, user_id, expires_at) VALUES (?,?,?)")
       ->execute([$token, $userId, $expiry]);
    return $token;
}

function getUserByToken(PDO $db, string $token): ?array {
    if (!$token) return null;
    $now  = date('Y-m-d H:i:s');
    $stmt = $db->prepare(
        "SELECT u.id, u.prenom, u.nom, u.email
           FROM tokens t JOIN users u ON u.id = t.user_id
          WHERE t.token = ? AND t.expires_at > ?"
    );
    $stmt->execute([$token, $now]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function deleteToken(PDO $db, string $token): void {
    $db->prepare("DELETE FROM tokens WHERE token = ?")->execute([$token]);
}
?>
