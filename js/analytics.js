// ===== FÁBRICA DE SOFTWARE - GOOGLE ANALYTICS 4 EVENT TRACKING =====

document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. TRACK WHATSAPP CLICKS =====
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"], .whatsapp-float').forEach(link => {
    link.addEventListener('click', () => {
      gtag('event', 'whatsapp_click', {
        'event_category': 'conversion',
        'event_label': link.textContent.trim().substring(0, 50) || 'WhatsApp Float',
        'value': 1
      });
    });
  });

  // ===== 2. TRACK CTA CLICKS (Falar com Especialista) =====
  document.querySelectorAll('a.btn-whatsapp, a[href*="wa.me"]').forEach(btn => {
    btn.addEventListener('click', () => {
      gtag('event', 'cta_click', {
        'event_category': 'conversion',
        'event_label': btn.textContent.trim().substring(0, 50),
        'page_location': window.location.href,
        'value': 1
      });
    });
  });

  // ===== 3. TRACK FORM SUBMITS =====
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      gtag('event', 'form_submit', {
        'event_category': 'conversion',
        'event_label': form.id || 'contact_form',
        'page_location': window.location.href,
        'value': 1
      });
    });
  });

  // ===== 4. TRACK SCROLL DEPTH (75%) =====
  let scrollTracked = false;
  window.addEventListener('scroll', () => {
    if (!scrollTracked) {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent >= 75) {
        scrollTracked = true;
        gtag('event', 'scroll', {
          'event_category': 'engagement',
          'event_label': '75% scroll',
          'page_location': window.location.href,
          'scroll_percent': scrollPercent
        });
      }
    }
  }, { passive: true });

  // ===== 5. TRACK OUTBOUND LINKS (non-whatsapp) =====
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    if (!link.href.includes('wa.me') && !link.href.includes('whatsapp')) {
      link.addEventListener('click', () => {
        gtag('event', 'outbound_click', {
          'event_category': 'navigation',
          'event_label': link.href,
          'page_location': window.location.href
        });
      });
    }
  });

  // ===== 6. TRACK FAQ OPEN =====
  document.querySelectorAll('details.faq-item').forEach(faq => {
    faq.addEventListener('toggle', () => {
      if (faq.open) {
        const question = faq.querySelector('.faq-question');
        if (question) {
          gtag('event', 'faq_open', {
            'event_category': 'engagement',
            'event_label': question.textContent.trim().substring(0, 80),
            'page_location': window.location.href
          });
        }
      }
    });
  });

  // ===== 7. TRACK SERVICE CARD CLICKS =====
  document.querySelectorAll('.service-card a, .service-card[data-href]').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.closest('.service-card')?.querySelector('h3')?.textContent || 'Unknown Service';
      gtag('event', 'service_click', {
        'event_category': 'navigation',
        'event_label': title.substring(0, 50),
        'page_location': window.location.href
      });
    });
  });

  // ===== 8. TRACK INTERNAL LINKS =====
  document.querySelectorAll('a[href^="../"], a[href^="./"], a[href^="/"]').forEach(link => {
    link.addEventListener('click', () => {
      gtag('event', 'internal_link_click', {
        'event_category': 'navigation',
        'event_label': link.href,
        'page_location': window.location.href
      });
    });
  });

  // ===== 9. TRACK PAGE ENGAGEMENT TIME =====
  let engagementTime = 0;
  const engagementInterval = setInterval(() => {
    engagementTime += 10;
    if (engagementTime === 30 || engagementTime === 60 || engagementTime === 120) {
      gtag('event', 'engagement_time', {
        'event_category': 'engagement',
        'event_label': engagementTime + ' seconds',
        'page_location': window.location.href,
        'value': engagementTime
      });
    }
  }, 10000);

  // Stop tracking after 5 minutes
  setTimeout(() => clearInterval(engagementInterval), 300000);

});