/* ============================================================
   B&T Natural Health — Shared JavaScript
   ============================================================ */
(function() {
  // Determine if page has a transparent hero
  const hasHero = document.querySelector('.hero, .page-hero');

  // === NAVBAR ===
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNav() {
    if (hasHero) {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
      if (window.scrollY > 80) navbar.classList.remove('transparent');
      else navbar.classList.add('transparent');
    }
  }
  if (hasHero) { navbar.classList.add('transparent'); updateNav(); }
  else { navbar.classList.add('solid'); }
  window.addEventListener('scroll', updateNav, { passive: true });

  // Active nav links
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPath || (currentPath === '' && link.dataset.page === 'index.html')) {
      link.classList.add('active');
    }
  });

  // === HAMBURGER ===
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');
  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksEl.classList.toggle('open');
      document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
    });
    navLinksEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksEl.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // === SCROLL ANIMATIONS ===
  const animEls = document.querySelectorAll('.animate-on-scroll');
  const observerAnim = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const siblings = Array.from(e.target.parentNode.children).filter(c => c.classList.contains('animate-on-scroll'));
        const idx = siblings.indexOf(e.target);
        setTimeout(() => e.target.classList.add('is-visible'), idx * 80);
        observerAnim.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  animEls.forEach(el => observerAnim.observe(el));

  // === COUNTER ANIMATION ===
  const counterEls = document.querySelectorAll('.stat-num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.target);
        const duration = 1800;
        const start = performance.now();
        const update = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));

  // === HERO PARTICLES ===
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.top  = Math.random() * 100 + '%';
      p.style.setProperty('--dur',   (6 + Math.random() * 8)   + 's');
      p.style.setProperty('--delay', (-Math.random() * 8)       + 's');
      p.style.width = p.style.height = (3 + Math.random() * 4) + 'px';
      particlesContainer.appendChild(p);
    }
  }

  // === PARALLAX HERO ===
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroBgImg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.22}px)`;
      }
    }, { passive: true });
  }

  // === TESTIMONIALS CAROUSEL ===
  const inner = document.getElementById('testimonials-inner');
  if (inner) {
    const cards = inner.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('t-dots');
    const prevBtn = document.getElementById('t-prev');
    const nextBtn = document.getElementById('t-next');
    let perPage = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    let total = Math.ceil(cards.length / perPage);
    let current = 0;
    let autoplayTimer;

    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const d = document.createElement('div');
        d.classList.add('t-dot');
        if (i === current) d.classList.add('active');
        d.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(d);
      }
    }
    function goTo(idx, animate = true) {
      current = (idx + total) % total;
      const cardWidth = (cards[0].offsetWidth || 380) + 24;
      inner.style.transition = animate ? 'transform .6s cubic-bezier(.16,1,.3,1)' : 'none';
      inner.style.transform = `translateX(-${current * perPage * cardWidth}px)`;
      if (dotsContainer) dotsContainer.querySelectorAll('.t-dot').forEach((d,i) => d.classList.toggle('active', i === current));
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goTo(current + 1), 5200);
    }
    function updatePerPage() {
      perPage = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      total = Math.ceil(cards.length / perPage);
      current = Math.min(current, total - 1);
      goTo(current, false); renderDots();
    }
    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    window.addEventListener('resize', updatePerPage, { passive: true });
    renderDots();
    autoplayTimer = setInterval(() => goTo(current + 1), 5200);
    let sx = 0;
    inner.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    inner.addEventListener('touchend',   e => { if (Math.abs(sx - e.changedTouches[0].clientX) > 50) goTo(current + (sx > e.changedTouches[0].clientX ? 1 : -1)); }, { passive: true });
  }

  // === FAQ ACCORDION ===
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // === SMOOTH SCROLL ===
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  // === INTERACTIVE STEPS ===
  const stepTriggers = document.querySelectorAll('.step-trigger');
  const stepDetails = document.querySelectorAll('.step-detail');
  const progressLine = document.getElementById('timeline-progress');

  if (stepTriggers.length && progressLine) {
    progressLine.style.width = '0%';
    stepTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const step = parseInt(trigger.dataset.step);
        stepTriggers.forEach(t => t.classList.toggle('active', t === trigger));
        stepDetails.forEach(d => {
          d.classList.remove('active');
          if (parseInt(d.dataset.step) === step) {
            d.offsetWidth; // force reflow for smooth animation
            d.classList.add('active');
          }
        });
        const percentage = ((step - 1) / (stepTriggers.length - 1)) * 100;
        progressLine.style.width = `${percentage}%`;
      });
    });
  }
})();

// === CONTACT FORM ===
function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn = document.getElementById('submit-btn');
  if (!form || !success || !btn) return;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => { form.style.display = 'none'; success.style.display = 'block'; }, 1200);
}
