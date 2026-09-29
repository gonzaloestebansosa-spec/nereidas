<?php
/**
 * =============================================================================
 * RUNA MORAIRA APART & SPA — Portal de Ingreso Administrativo Seguro
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

// Si ya está autenticado, redirigir al panel principal
if (!empty($_SESSION['auth_authenticated']) && $_SESSION['auth_authenticated'] === true) {
    header('Location: dashboard.php');
    exit;
}

// Generar Token CSRF si no existe
if (empty($_SESSION['auth_csrf_token'])) {
    $_SESSION['auth_csrf_token'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['auth_csrf_token'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Acceso Seguro — Runa Moraira Apart &amp; Spa</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" type="image/png" href="../favicon.png">
  <link rel="stylesheet" href="css/panel.css?v=1.0">
</head>
<body>

  <!-- Fondo Ambiental con Reflejos Dorados -->
  <div class="ambient-glow" aria-hidden="true"></div>

  <main class="auth-wrapper">
    <div class="auth-card">
      
      <!-- Cabecera con Logo Oficial RUNA MORAIRA APART & SPA -->
      <header class="auth-header">
        <div class="auth-logo-container">
          <picture>
            <source srcset="../img/logo_runa_moraira_white.webp" type="image/webp">
            <img src="../img/logo_runa_moraira_white.png" alt="Runa Moraira Apart &amp; Spa" class="auth-logo-img" width="250" height="40">
          </picture>
        </div>
        <p class="auth-subtitle">Portal de Gestión &amp; Seguridad</p>
      </header>

      <!-- Mensajes de Alerta y Estado -->
      <div id="auth-alert" class="auth-alert" role="alert"></div>

      <!-- Contenedor Deslizable de Pasos -->
      <div class="auth-steps-container">

        <!-- ================================================================
             PASO 1: Ingreso de Usuario y Contraseña
             ================================================================ -->
        <section id="step-login" class="auth-step active" aria-labelledby="login-heading">
          <h2 id="login-heading" class="auth-title">Iniciar Sesión</h2>
          <p class="auth-desc">Ingrese sus credenciales corporativas para continuar con la verificación en dos pasos.</p>

          <form id="form-login" style="margin-top: 24px;" novalidate>
            <input type="hidden" id="csrf_token" value="<?php echo htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8'); ?>">

            <div class="form-group">
              <label for="username" class="form-label">Usuario o Email</label>
              <div class="input-wrapper">
                <input type="text" id="username" class="form-input" placeholder="admin@runamoraira.com.ar" autocomplete="username" required>
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Contraseña</label>
              <div class="input-wrapper">
                <input type="password" id="password" class="form-input" placeholder="••••••••••••" autocomplete="current-password" required>
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <button type="button" id="toggle-pwd" class="toggle-pwd" aria-label="Mostrar u ocultar contraseña">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </div>

            <button type="submit" id="btn-login" class="btn-auth-primary">
              <span class="spinner"></span>
              <span class="btn-label">Ingresar al Panel</span>
            </button>
          </form>
        </section>

        <!-- ================================================================
             PASO 2: Validación 2FA por Código de Correo (OTP)
             ================================================================ -->
        <section id="step-otp" class="auth-step hidden" aria-labelledby="otp-heading">
          <h2 id="otp-heading" class="auth-title">Verificación 2FA</h2>
          <p class="auth-desc">
            Enviamos un código de 6 dígitos a <strong id="masked-email" style="color: var(--gold-light);">su correo</strong>. Ingréselo para autorizar el acceso:
          </p>

          <form id="form-otp" style="margin-top: 10px;" novalidate>
            <!-- 6 Dígitos OTP -->
            <div class="otp-boxes">
              <input type="text" inputmode="numeric" pattern="[0-9]*" class="otp-digit" maxlength="1" autofocus aria-label="Dígito 1">
              <input type="text" inputmode="numeric" pattern="[0-9]*" class="otp-digit" maxlength="1" aria-label="Dígito 2">
              <input type="text" inputmode="numeric" pattern="[0-9]*" class="otp-digit" maxlength="1" aria-label="Dígito 3">
              <input type="text" inputmode="numeric" pattern="[0-9]*" class="otp-digit" maxlength="1" aria-label="Dígito 4">
              <input type="text" inputmode="numeric" pattern="[0-9]*" class="otp-digit" maxlength="1" aria-label="Dígito 5">
              <input type="text" inputmode="numeric" pattern="[0-9]*" class="otp-digit" maxlength="1" aria-label="Dígito 6">
            </div>

            <div class="otp-meta">
              <div class="otp-timer">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span id="otp-timer-display">05:00</span>
              </div>
              <button type="button" id="btn-resend" class="otp-resend-btn">Reenviar código</button>
            </div>

            <button type="submit" id="btn-verify" class="btn-auth-primary">
              <span class="spinner"></span>
              <span class="btn-label">Verificar y Acceder</span>
            </button>

            <div style="text-align: center;">
              <button type="button" id="btn-back" class="otp-back-link">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                <span>Volver al inicio de sesión</span>
              </button>
            </div>
          </form>
        </section>

      </div>

      <!-- Pie Informativo de Seguridad -->
      <footer class="auth-footer">
        🔒 Acceso protegido por autenticación multifactor (MFA/2FA) y encriptación de extremo a extremo.
      </footer>

    </div>
  </main>

  <script src="js/panel.js?v=1.0"></script>
</body>
</html>
