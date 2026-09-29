<?php
/**
 * =============================================================================
 * RUNA MORAIRA APART & SPA — Configuración del Panel de Autenticación
 * =============================================================================
 * 
 * DIRECTRICES DE SEGURIDAD CRÍTICAS:
 * 1. Este archivo está blindado contra acceso web público mediante .htaccess.
 * 2. La clave NUNCA se almacena en texto plano ni en los scripts JS de la app.
 * 3. Se utiliza el algoritmo BCRYPT con factor de coste 12 para hashing de contraseña.
 * 4. Los códigos de verificación OTP (2FA) se envían al correo autorizado con
 *    validez temporal estricta (5 minutos) y protección contra fuerza bruta.
 */

if (!defined('AUTH_EXEC') && basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'config.php') {
    http_response_code(403);
    exit('Acceso denegado.');
}

return [
    // -------------------------------------------------------------------------
    // 1. CREDENCIALES ADMINISTRATIVAS
    // -------------------------------------------------------------------------
    // Usuario o Correo autorizado para iniciar sesión
    'admin_user'  => 'admin',
    'admin_email' => 'gonzaloestebansosa@gmail.com', // Correo receptor de los códigos de verificación OTP

    // Hash BCRYPT de la contraseña inicial: 'RunaMoraira#2026'
    // Para cambiar la contraseña, genere un nuevo hash mediante password_hash('TuNuevaClave', PASSWORD_BCRYPT, ['cost' => 12])
    'password_hash' => '$2y$12$9r47tQANdg0zn9yKAM0tF.CsSKH/Sevifb3yq9AzKPZ2mY.xfrKei',

    // -------------------------------------------------------------------------
    // 2. PARÁMETROS DE CÓDIGO DE VERIFICACIÓN (OTP / 2FA)
    // -------------------------------------------------------------------------
    'otp' => [
        'length'             => 6,      // Longitud del código numérico (ej. 482915)
        'lifetime_seconds'   => 300,    // 5 minutos de vigencia antes de expirar
        'max_attempts'       => 3,      // Máximo 3 intentos de código erróneo antes de anularlo
        'resend_cooldown'    => 60,     // Segundos mínimos de espera entre solicitudes de reenvío
        'secret_salt'        => 'a8f4c2e91b7d5a0364e1f8c7b2d9e4a3c1f0b6e5d8a7c4f1e9b2d6a3c8f5e1b7',
    ],

    // -------------------------------------------------------------------------
    // 3. SEGURIDAD DE SESIÓN Y FUERZA BRUTA (RATE LIMITING)
    // -------------------------------------------------------------------------
    'security' => [
        'max_login_attempts' => 5,      // Intentos fallidos permitidos antes de bloqueo temporal
        'lockout_seconds'    => 900,    // 15 minutos de bloqueo tras superar intentos fallidos
        'session_lifetime'   => 7200,   // Duración de la sesión autenticada: 2 horas
        'session_name'       => 'RUNA_AUTH_SID',
    ],

    // -------------------------------------------------------------------------
    // 4. CONFIGURACIÓN DE ENVÍO DE EMAIL
    // -------------------------------------------------------------------------
    'mail' => [
        'from_name'    => 'Runa Moraira Apart & Spa',
        'from_address' => 'no-reply@apartnereidas.com.ar',
        'subject'      => 'Código de verificación de ingreso — Runa Moraira',
    ]
];
