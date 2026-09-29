/**
 * =============================================================================
 * RUNA MORAIRA APART & SPA — Panel de Ingreso Seguro (Client JS)
 * Gestión de Flujo 2FA, Temporizador OTP y Seguridad en Front-end
 * =============================================================================
 */

(function () {
  'use strict';

  // Elementos DOM
  const formLogin = document.getElementById('form-login');
  const formOtp = document.getElementById('form-otp');
  const stepLogin = document.getElementById('step-login');
  const stepOtp = document.getElementById('step-otp');
  const alertBox = document.getElementById('auth-alert');
  
  const btnLogin = document.getElementById('btn-login');
  const btnVerify = document.getElementById('btn-verify');
  const btnResend = document.getElementById('btn-resend');
  const btnBack = document.getElementById('btn-back');
  const togglePwd = document.getElementById('toggle-pwd');
  const pwdInput = document.getElementById('password');
  
  const otpDigits = document.querySelectorAll('.otp-digit');
  const otpTimerDisplay = document.getElementById('otp-timer-display');
  const maskedEmailDisplay = document.getElementById('masked-email');

  let countdownInterval = null;
  let remainingSeconds = 300;

  // 1. Mostrar / Ocultar Contraseña
  if (togglePwd && pwdInput) {
    togglePwd.addEventListener('click', function () {
      const isPwd = pwdInput.type === 'password';
      pwdInput.type = isPwd ? 'text' : 'password';
      togglePwd.innerHTML = isPwd
        ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
        : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    });
  }

  // 2. Utilidades de Notificación
  function showAlert(msg, type = 'error') {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = 'auth-alert ' + type;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert() {
    if (!alertBox) return;
    alertBox.className = 'auth-alert';
    alertBox.textContent = '';
  }

  function setButtonLoading(btn, isLoading, originalText = '') {
    if (!btn) return;
    const spinner = btn.querySelector('.spinner');
    const label = btn.querySelector('.btn-label');
    if (isLoading) {
      btn.disabled = true;
      if (spinner) spinner.style.display = 'inline-block';
      if (label) label.textContent = 'Procesando...';
    } else {
      btn.disabled = false;
      if (spinner) spinner.style.display = 'none';
      if (label) label.textContent = originalText;
    }
  }

  // 3. Temporizador de Expiración OTP
  function startOtpCountdown(seconds = 300) {
    clearInterval(countdownInterval);
    remainingSeconds = seconds;
    updateTimerText();

    countdownInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerText();

      if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
        if (otpTimerDisplay) otpTimerDisplay.textContent = 'Expirado';
        showAlert('El código de verificación ha expirado. Haga clic en "Reenviar código".', 'error');
        if (btnVerify) btnVerify.disabled = true;
      }
    }, 1000);
  }

  function updateTimerText() {
    if (!otpTimerDisplay) return;
    const m = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const s = (remainingSeconds % 60).toString().padStart(2, '0');
    otpTimerDisplay.textContent = `${m}:${s}`;
  }

  // 4. Paso 1: Enviar Credenciales de Usuario y Clave
  if (formLogin) {
    formLogin.addEventListener('submit', async function (e) {
      e.preventDefault();
      hideAlert();

      const username = document.getElementById('username').value.trim();
      const password = pwdInput.value;
      const csrfToken = document.getElementById('csrf_token').value;

      if (!username || !password) {
        showAlert('Por favor complete todos los campos.', 'error');
        return;
      }

      setButtonLoading(btnLogin, true, 'Ingresar al Panel');

      try {
        const formData = new FormData();
        formData.append('action', 'login');
        formData.append('username', username);
        formData.append('password', password);
        formData.append('csrf_token', csrfToken);

        const res = await fetch('api/auth.php', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (data.success && data.step === 'otp_required') {
          // Transición a Paso 2 (OTP)
          if (maskedEmailDisplay) maskedEmailDisplay.textContent = data.email_masked;
          stepLogin.classList.remove('active');
          stepLogin.classList.add('hidden');
          stepOtp.classList.remove('hidden');
          stepOtp.classList.add('active');

          startOtpCountdown(data.expires_in || 300);
          if (btnVerify) btnVerify.disabled = false;

          // Enfocar primer dígito
          setTimeout(() => {
            if (otpDigits[0]) otpDigits[0].focus();
          }, 200);

          showAlert('Código de seguridad enviado a su correo institucional.', 'success');
        } else {
          showAlert(data.message || 'Error en las credenciales proporcionadas.', 'error');
        }
      } catch (err) {
        showAlert('Error de conexión con el servidor de autenticación.', 'error');
      } finally {
        setButtonLoading(btnLogin, false, 'Ingresar al Panel');
      }
    });
  }

  // 5. UX de Inputs de 6 Dígitos OTP (Auto-advance & Paste)
  otpDigits.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val ? val[val.length - 1] : '';

      if (e.target.value && index < otpDigits.length - 1) {
        otpDigits[index + 1].focus();
      }

      // Si todos los dígitos están completos, enviar automáticamente
      checkAndAutoSubmitOtp();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        otpDigits[index - 1].focus();
      }
    });

    // Soporte para Pegar (Paste) los 6 dígitos juntos
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
      if (!pasteData) return;

      pasteData.split('').forEach((char, i) => {
        if (otpDigits[i]) otpDigits[i].value = char;
      });

      if (pasteData.length < 6 && otpDigits[pasteData.length]) {
        otpDigits[pasteData.length].focus();
      } else if (pasteData.length === 6) {
        otpDigits[5].focus();
        checkAndAutoSubmitOtp();
      }
    });
  });

  function getCombinedOtp() {
    let code = '';
    otpDigits.forEach(d => { code += d.value; });
    return code;
  }

  function checkAndAutoSubmitOtp() {
    const code = getCombinedOtp();
    if (code.length === 6) {
      submitOtpVerification(code);
    }
  }

  // 6. Paso 2: Verificar Código OTP
  async function submitOtpVerification(code) {
    if (!code || code.length !== 6) {
      showAlert('Ingrese el código completo de 6 dígitos.', 'error');
      return;
    }

    hideAlert();
    setButtonLoading(btnVerify, true, 'Verificar y Acceder');

    try {
      const csrfToken = document.getElementById('csrf_token').value;
      const formData = new FormData();
      formData.append('action', 'verify_otp');
      formData.append('code', code);
      formData.append('csrf_token', csrfToken);

      const res = await fetch('api/auth.php', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        clearInterval(countdownInterval);
        showAlert('¡Acceso verificado! Redirigiendo...', 'success');
        setTimeout(() => {
          window.location.href = data.redirect || 'dashboard.php';
        }, 800);
      } else {
        showAlert(data.message || 'Código de verificación incorrecto.', 'error');
        // Limpiar inputs y enfocar el primero
        otpDigits.forEach(d => { d.value = ''; });
        if (otpDigits[0]) otpDigits[0].focus();
      }
    } catch (err) {
      showAlert('Error al procesar la verificación.', 'error');
    } finally {
      setButtonLoading(btnVerify, false, 'Verificar y Acceder');
    }
  }

  if (formOtp) {
    formOtp.addEventListener('submit', function (e) {
      e.preventDefault();
      submitOtpVerification(getCombinedOtp());
    });
  }

  // 7. Reenviar Código OTP
  if (btnResend) {
    btnResend.addEventListener('click', async function () {
      hideAlert();
      btnResend.disabled = true;
      const originalText = btnResend.textContent;
      btnResend.textContent = 'Enviando...';

      try {
        const csrfToken = document.getElementById('csrf_token').value;
        const formData = new FormData();
        formData.append('action', 'resend_otp');
        formData.append('csrf_token', csrfToken);

        const res = await fetch('api/auth.php', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (data.success) {
          startOtpCountdown(data.expires_in || 300);
          otpDigits.forEach(d => { d.value = ''; });
          if (otpDigits[0]) otpDigits[0].focus();
          if (btnVerify) btnVerify.disabled = false;
          showAlert(data.message, 'success');
        } else {
          showAlert(data.message, 'error');
        }
      } catch (err) {
        showAlert('No se pudo reenviar el código. Intente en instantes.', 'error');
      } finally {
        setTimeout(() => {
          btnResend.disabled = false;
          btnResend.textContent = originalText;
        }, 15000); // 15s de cooldown en el botón
      }
    });
  }

  // 8. Volver a Paso 1
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      clearInterval(countdownInterval);
      hideAlert();
      stepOtp.classList.remove('active');
      stepOtp.classList.add('hidden');
      stepLogin.classList.remove('hidden');
      stepLogin.classList.add('active');
      otpDigits.forEach(d => { d.value = ''; });
    });
  }

})();
