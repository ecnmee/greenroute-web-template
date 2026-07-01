/* GreenRoute — form.js
   Contact form validation. Uses grValidation() from i18n.js for bilingual messages.
   Include after i18n.js. */

(function () {
  const form   = document.querySelector('.contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');

  function msg() {
    return (typeof window.grValidation === 'function')
      ? window.grValidation()
      : { required:'Required.', email:'Invalid email.', minName:'Min 2 chars.',
          minSubject:'Min 3 chars.', minMsg:'Min 20 chars.',
          success:'Sent!', error:'Error.' };
  }

  function setError(field, text) {
    const err = field.closest('label')?.querySelector('.error');
    if (err) { err.textContent = text; }
    field.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    const err = field.closest('label')?.querySelector('.error');
    if (err) { err.textContent = ''; }
    field.removeAttribute('aria-invalid');
  }

  function validateField(field) {
    const v = field.value.trim();
    const m = msg();
    clearError(field);

    if (field.required && !v) { setError(field, m.required); return false; }

    if (field.type === 'email' && v) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setError(field, m.email); return false; }
    }
    if (field.name === 'name'    && v.length < 2)  { setError(field, m.minName);    return false; }
    if (field.name === 'subject' && v.length < 3)  { setError(field, m.minSubject); return false; }
    if (field.name === 'message' && v.length < 20) { setError(field, m.minMsg);     return false; }

    return true;
  }

  /* Live validation on blur */
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid')) validateField(field);
    });
  });

  /* Re-validate error messages when language changes */
  document.addEventListener('gr:langChange', () => {
    form.querySelectorAll('input[aria-invalid], textarea[aria-invalid]').forEach(field => {
      validateField(field);
    });
    /* Update status message if visible */
    if (status && status.dataset.state) {
      const m = msg();
      status.textContent = status.dataset.state === 'success' ? m.success : m.error;
    }
  });

  /* Submit */
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input, textarea')];
    const valid  = fields.map(validateField).every(Boolean);
    if (!valid) return;

    const m = msg();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;

    /* Simulate send — replace with real endpoint */
    setTimeout(() => {
      status.textContent   = m.success;
      status.dataset.state = 'success';
      btn.disabled = false;
      form.reset();
      fields.forEach(clearError);
    }, 800);
  });
})();
