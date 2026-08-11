// ===== FÁBRICA DE SOFTWARE - JAVASCRIPT COMPARTILHADO =====

document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // Mobile menu toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  // Data-href click handler
  document.querySelectorAll('[data-href]').forEach(el => {
    el.addEventListener('click', function(e) {
      if (e.target.closest('a, button, .btn')) return;
      const href = this.dataset.href;
      if (href) window.location.href = href;
    });
  });

  // Theme toggle
  const applyTheme = (isLight) => {
    document.body.classList.toggle('light-theme', isLight);
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
      icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    });
    try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
  };
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') applyTheme(true);
  } catch (e) {}
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(!document.body.classList.contains('light-theme')));
  });

  // Contact Form (WhatsApp Redirect)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();
      if (!name || !email || !message) return;
      let msg = `*Olá! Vim pelo site da Fábrica de Software*%0A%0A`;
      msg += `*Nome:* ${encodeURIComponent(name)}%0A`;
      msg += `*E-mail:* ${encodeURIComponent(email)}%0A`;
      if (phone) msg += `*Telefone:* ${encodeURIComponent(phone)}%0A`;
      if (service) msg += `*Serviço de interesse:* ${encodeURIComponent(service)}%0A`;
      msg += `%0A*Mensagem:*%0A${encodeURIComponent(message)}`;
      window.open(`https://wa.me/5521996936397?text=${msg}`, '_blank');
    });
  }

  // Scroll animation observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .audience-item, .process-step, .diff-item, .depo-card, .plan-card, .seo-benefit').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
});
