<?php
/**
 * =============================================================================
 * RUNA MORAIRA APART & SPA — Cierre Seguro de Sesión
 * =============================================================================
 */

define('AUTH_EXEC', true);
$config = require __DIR__ . '/config.php';
session_name($config['security']['session_name']);
session_start();

// Destruir todas las variables de sesión
$_SESSION = [];

// Borrar la cookie de sesión si existe
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destruir sesión
session_destroy();

// Redirigir al inicio de sesión
header('Location: index.php');
exit;
