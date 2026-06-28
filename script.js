const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
const glow = document.querySelector('.cursor-glow');

const closeMenu = () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('menu-open');
};

toggle.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', open);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 24), { passive: true });

if (window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min((index % 4) * 80, 240)}ms`;
  observer.observe(el);
});

document.querySelectorAll('.file-upload input[type="file"]').forEach(input => {
  const fileNameLabel = input.closest('.file-upload')?.querySelector('[data-file-name]');
  const defaultText = fileNameLabel?.textContent || 'No file selected';

  input.addEventListener('change', () => {
    if (!fileNameLabel) return;
    fileNameLabel.textContent = input.files?.[0]?.name || defaultText;
  });
});

document.querySelectorAll('form[data-form-endpoint]').forEach(form => {
  const formStatus = form.querySelector('.form-status');
  const formButton = form.querySelector('button[type="submit"]');
  const emailField = form.querySelector('input[name="email"]');
  const replyToField = form.querySelector('input[name="_replyto"]');
  const fileInputs = [...form.querySelectorAll('input[type="file"]')];
  const defaultLabel = formButton.innerHTML;
  const loadingLabel = form.dataset.loadingLabel || 'Sending... <span>↗</span>';
  const successMessage = form.dataset.successMessage || 'Sent successfully.';
  const endpoint = form.dataset.formEndpoint;

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (replyToField && emailField) {
      replyToField.value = emailField.value.trim();
    }

    const oversizedFile = fileInputs
      .map(input => input.files?.[0])
      .find(file => file && file.size > 10 * 1024 * 1024);

    if (oversizedFile) {
      formStatus.textContent = 'The uploaded file must be smaller than 10 MB.';
      formStatus.classList.remove('is-success');
      formStatus.classList.add('is-error');
      return;
    }

    const payload = new FormData(form);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    formButton.disabled = true;
    formButton.innerHTML = loadingLabel;
    formStatus.textContent = loadingLabel.replace(/<[^>]+>/g, '');
    formStatus.classList.remove('is-error', 'is-success');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: payload,
        signal: controller.signal
      });

      const result = await response.json().catch(() => ({ success: 'false', message: 'Message could not be sent.' }));

      if (!response.ok || String(result.success) !== 'true') {
        throw new Error(result.message || 'Message could not be sent.');
      }

      form.reset();
      fileInputs.forEach(input => {
        const fileNameLabel = input.closest('.file-upload')?.querySelector('[data-file-name]');
        if (fileNameLabel) fileNameLabel.textContent = 'No file selected';
      });
      formStatus.textContent = successMessage;
      formStatus.classList.add('is-success');
    } catch (error) {
      formStatus.textContent = error.name === 'AbortError'
        ? 'Message request timed out. Please try again in a moment.'
        : error.message || 'Message could not be sent right now.';
      formStatus.classList.add('is-error');
    } finally {
      window.clearTimeout(timeoutId);
      formButton.disabled = false;
      formButton.innerHTML = defaultLabel;
    }
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
