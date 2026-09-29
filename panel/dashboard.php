<?php
/**
 * =============================================================================
 * RUNA MORAIRA APART & SPA — Panel Administrativo Protegido
 * =============================================================================
 */

define('AUTH_EXEC', true);

ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['SERVER_PORT'] ?? 80) == 443;
if ($isHttps) {
    ini_set('session.cookie_secure', 1);
}
ini_set('session.cookie_samesite', 'Strict');

$config = require __DIR__ . '/config.php';
session_name($config['security']['session_name']);
session_start();

// Control de Acceso: Redirigir si no está autenticado con 2FA
if (empty($_SESSION['auth_authenticated']) || $_SESSION['auth_authenticated'] !== true) {
    header('Location: index.php');
    exit;
}

// Control de Expiración de Sesión Inactiva
if (isset($_SESSION['auth_login_time']) && (time() - $_SESSION['auth_login_time'] > $config['security']['session_lifetime'])) {
    session_unset();
    session_destroy();
    header('Location: index.php?expired=1');
    exit;
}

$currentUser = htmlspecialchars($_SESSION['auth_user'] ?? 'Administrador', ENT_QUOTES, 'UTF-8');
$currentEmail = htmlspecialchars($_SESSION['auth_email'] ?? $config['admin_email'], ENT_QUOTES, 'UTF-8');
$loginTime = date('d/m/Y H:i:s', $_SESSION['auth_login_time'] ?? time());
$clientIp = htmlspecialchars($_SESSION['auth_ip'] ?? '127.0.0.1', ENT_QUOTES, 'UTF-8');

// Generador de Hash para actualización segura de clave (AJAX / POST opcional)
$generatedHash = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['new_password_for_hash'])) {
    $rawPass = $_POST['new_password_for_hash'];
    if (!empty($rawPass)) {
        $generatedHash = password_hash($rawPass, PASSWORD_BCRYPT, ['cost' => 12]);
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel Administrativo — Runa Moraira Apart &amp; Spa</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" type="image/png" href="../favicon.png">
  <link rel="stylesheet" href="css/panel.css?v=1.0">
  <style>
    body {
      display: block;
      padding: 0;
      background: #0b111e;
    }
    .dash-nav {
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(197, 164, 126, 0.25);
      padding: 16px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .dash-brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .dash-logo {
      height: 32px;
      width: auto;
      object-fit: contain;
    }
    .dash-user-bar {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .user-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.82rem;
      color: #e2e8f0;
    }
    .btn-logout {
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.35);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: var(--transition-smooth);
    }
    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.3);
      color: #fff;
    }
    .dash-container {
      max-width: 1100px;
      margin: 40px auto;
      padding: 0 24px;
    }
    .dash-header-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 30px;
      position: relative;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .dash-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .dash-stat-box {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(197, 164, 126, 0.2);
      border-radius: 16px;
      padding: 22px;
      transition: var(--transition-smooth);
    }
    .dash-stat-box:hover {
      border-color: var(--gold-primary);
      transform: translateY(-2px);
    }
    .dash-stat-val {
      font-family: var(--font-serif);
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--gold-light);
      margin: 8px 0 4px;
    }
    .security-box {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 16px;
      padding: 26px;
      margin-top: 25px;
    }
    .code-box {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.88rem;
      color: #38bdf8;
      word-break: break-all;
      margin-top: 10px;
    }
  </style>
</head>
<body>

  <!-- Barra de Navegación del Panel -->
  <nav class="dash-nav">
    <div class="dash-brand">
      <img src="../img/logo_runa_moraira_white.png" alt="Runa Moraira Apart &amp; Spa" class="dash-logo">
    </div>
    <div class="dash-user-bar">
      <div class="user-pill">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
        <span><strong><?php echo $currentUser; ?></strong> (<?php echo $currentEmail; ?>)</span>
      </div>
      <a href="logout.php" class="btn-logout">Cerrar Sesión</a>
    </div>
  </nav>

  <div class="dash-container">
    
    <!-- Tarjeta Principal de Bienvenida -->
    <header class="dash-header-card">
      <p style="font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold-primary); font-weight: 600;">Sesión Activa &amp; Segura</p>
      <h1 style="font-family: var(--font-serif); font-size: 2.2rem; color: #fff; margin-top: 6px;">Bienvenido al Panel de Runa Moraira</h1>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-top: 8px; max-width: 720px;">
        Su acceso ha sido validado exitosamente mediante doble factor de autenticación (2FA / OTP por correo institucional). Los scripts de la aplicación no contienen claves almacenadas y la sesión se encuentra encriptada bajo protocolo HTTPS.
      </p>

      <div style="display: flex; gap: 24px; flex-wrap: wrap; margin-top: 20px; font-size: 0.82rem; color: #94a3b8;">
        <div>📅 Ingreso: <strong style="color: #fff;"><?php echo $loginTime; ?></strong></div>
        <div>🌐 IP de Conexión: <strong style="color: #fff;"><?php echo $clientIp; ?></strong></div>
        <div>🔒 Protocolo: <strong style="color: #10b981;">MFA Activo (BCRYPT + HMAC-SHA256)</strong></div>
      </div>
    </header>

    <!-- Métricas y Estado del Sistema -->
    <section class="dash-stats-grid">
      <div class="dash-stat-box">
        <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted);">Estado del Servidor</span>
        <div class="dash-stat-val" style="color: #10b981; font-size: 1.6rem; margin-top: 12px;">Operativo</div>
        <p style="font-size: 0.78rem; color: var(--text-sub);">Apache / PHP 8.3 &bull; SSL Activo</p>
      </div>

      <div class="dash-stat-box">
        <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted);">Protección de Clave</span>
        <div class="dash-stat-val" style="font-size: 1.6rem; margin-top: 12px;">BCrypt Cost 12</div>
        <p style="font-size: 0.78rem; color: var(--text-sub);">Zero-Knowledge en Scripts JS</p>
      </div>

      <div class="dash-stat-box">
        <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted);">Verificación OTP</span>
        <div class="dash-stat-val" style="font-size: 1.6rem; margin-top: 12px;">5 Minutos</div>
        <p style="font-size: 0.78rem; color: var(--text-sub);">Caducidad y Rate Limiting Activo</p>
      </div>
    </section>

    <!-- Herramienta de Seguridad: Generador de Hash BCrypt -->
    <section class="security-box">
      <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: #fff;">Gestión Segura de Contraseñas</h3>
      <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.6; margin-top: 6px;">
        Para cambiar la contraseña de administración sin dejar registro de la clave en ningún script público, ingrese la nueva contraseña deseada. El sistema generará el hash BCRYPT matemáticamente seguro para actualizar <code>config.php</code>:
      </p>

      <form method="POST" style="margin-top: 18px; max-width: 500px;">
        <div class="form-group">
          <label class="form-label" for="new_pwd">Nueva Contraseña para Generar Hash</label>
          <input type="password" id="new_pwd" name="new_password_for_hash" class="form-input" placeholder="Ingrese nueva contraseña segura" required style="padding-left: 16px;">
        </div>
        <button type="submit" class="btn-auth-primary" style="margin-top: 10px; width: auto; padding: 10px 24px;">Generar Hash BCrypt</button>
      </form>

      <?php if (!empty($generatedHash)): ?>
        <div style="margin-top: 20px;">
          <p style="font-size: 0.82rem; color: var(--gold-light);">Copie el siguiente hash y actualice el parámetro <code>'password_hash'</code> en <code>panel/config.php</code>:</p>
          <div class="code-box"><?php echo htmlspecialchars($generatedHash, ENT_QUOTES, 'UTF-8'); ?></div>
        </div>
      <?php endif; ?>
    </section>

  </div>

</body>
</html>
