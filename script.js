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

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const formButton = form.querySelector('button[type="submit"]');

if (window.location.protocol === 'file:') {
  formButton.disabled = true;
  formStatus.textContent = 'Open this website through http://localhost:3001 for direct email sending.';
  formStatus.classList.add('is-error');
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());

  if (window.location.protocol === 'file:') {
    formStatus.textContent = 'Direct email sending only works on the local server at http://localhost:3001.';
    formStatus.classList.add('is-error');
    return;
  }

  formButton.disabled = true;
  formButton.innerHTML = 'Sending... <span>↗</span>';
  formStatus.textContent = 'Sending your message...';
  formStatus.classList.remove('is-error', 'is-success');

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || 'Message could not be sent.');
    }

    form.reset();
    formStatus.textContent = 'Message sent successfully. We will get back to you soon.';
    formStatus.classList.add('is-success');
  } catch (error) {
    formStatus.textContent = error.message || 'Message could not be sent right now.';
    formStatus.classList.add('is-error');
  } finally {
    formButton.disabled = false;
    formButton.innerHTML = 'Send message <span>↗</span>';
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
