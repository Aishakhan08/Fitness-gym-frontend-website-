/* ============================================================
   IRON PULSE GYM — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR ─────────────────────────────────────── */
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scrolled class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open');
  });

  // Close on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks?.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── SCROLL REVEAL ──────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── STATS COUNTER ──────────────────────────────── */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'));
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step     = 16;
    const steps    = duration / step;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  /* ── GALLERY FILTER ─────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');
      filterItems.forEach(item => {
        if (cat === 'all' || item.getAttribute('data-cat') === cat) {
          item.style.display = '';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = ''; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  /* ── LIGHTBOX ───────────────────────────────────── */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (src && lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ── SERVICES FILTER ────────────────────────────── */
  // Re-uses filter logic above (data-cat on service cards)

  /* ── MEMBERSHIP FORM (EmailJS) ───────────────────── */
  const memberForm = document.getElementById('membershipForm');
  memberForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = memberForm.querySelector('[type="submit"]');
    const msg = document.getElementById('formMsg');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    const params = {
      from_name:  memberForm.querySelector('[name="name"]').value,
      from_email: memberForm.querySelector('[name="email"]').value,
      phone:      memberForm.querySelector('[name="phone"]').value,
      plan:       memberForm.querySelector('[name="plan"]').value,
      message:    memberForm.querySelector('[name="message"]')?.value || 'New membership enquiry',
    };

    try {
      // ⚠️ Replace with your EmailJS credentials
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params, 'YOUR_PUBLIC_KEY');
      msg.className  = 'form-message success';
      msg.textContent = '✓ Request sent! We will contact you within 24 hours.';
      msg.style.display = 'block';
      memberForm.reset();
    } catch (err) {
      msg.className  = 'form-message error';
      msg.textContent = '✗ Something went wrong. Please try WhatsApp or call us directly.';
      msg.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });

  /* ── CONTACT FORM (EmailJS) ──────────────────────── */
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const msg = document.getElementById('contactMsg');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    const params = {
      from_name:  contactForm.querySelector('[name="name"]').value,
      from_email: contactForm.querySelector('[name="email"]').value,
      subject:    contactForm.querySelector('[name="subject"]').value,
      message:    contactForm.querySelector('[name="message"]').value,
    };

    try {
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params, 'YOUR_PUBLIC_KEY');
      msg.className   = 'form-message success';
      msg.textContent = '✓ Message sent! We will get back to you soon.';
      msg.style.display = 'block';
      contactForm.reset();
    } catch (err) {
      msg.className   = 'form-message error';
      msg.textContent = '✗ Could not send. Please email us directly.';
      msg.style.display = 'block';
    } finally {
      btn.disabled  = false;
      btn.innerHTML = originalText;
    }
  });

});
