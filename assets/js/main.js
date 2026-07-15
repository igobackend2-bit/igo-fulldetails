// IGO Groups — site interactions: nav, theme, counters, filters, scroll-reveal, particle network
document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // Sticky nav: add elevated/blurred style once scrolled
  var navbar = document.querySelector('.navbar');
  function onNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 8) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  // Dark mode toggle
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('igo-theme', isDark ? 'dark' : 'light');
    });
  }

  // Animated counters
  var counters = document.querySelectorAll('.num[data-count]');
  var animated = false;
  function animateCounters() {
    if (animated) return;
    var triggerEl = counters[0];
    if (!triggerEl) return;
    var rect = triggerEl.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;
    animated = true;
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var duration = 1200;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.floor(progress * target).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('en-IN') + '+';
      }
      requestAnimationFrame(step);
    });
  }
  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();

  // Brand directory filter (brands.html only)
  var grid = document.getElementById('brandsGrid');
  if (grid) {
    var filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filterVal = btn.getAttribute('data-filter');
        grid.querySelectorAll('.dir-card').forEach(function (card) {
          if (filterVal === 'all' || card.getAttribute('data-status') === filterVal) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Scroll-reveal animations
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    // Immediately reveal elements already in the viewport (above the fold)
    var vh = window.innerHeight;
    revealEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
      revealEls.forEach(function (el, i) {
        if (!el.classList.contains('revealed')) {
          el.style.transitionDelay = (Math.min(i % 4, 3) * 80) + 'ms';
          io.observe(el);
        }
      });
    } else {
      revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }
  }

  // Ecosystem / hero particle-network canvas backgrounds
  var nets = document.querySelectorAll('.particle-net');
  nets.forEach(function (canvas) { initParticleNetwork(canvas); });
});

function initParticleNetwork(canvas) {
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w, h, nodes;
  var density = parseInt(canvas.getAttribute('data-density'), 10) || 36;
  var color = canvas.getAttribute('data-color') || '46,184,92';

  function size() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeNodes() {
    nodes = [];
    for (var i = 0; i < density; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.4 + Math.random() * 1.6
      });
    }
  }

  size();
  makeNodes();
  window.addEventListener('resize', function () { size(); makeNodes(); });

  function tick() {
    var maxDist = Math.max(90, Math.min(w, h) * 0.22);
    ctx.clearRect(0, 0, w, h);
    var i, j;
    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    for (i = 0; i < nodes.length; i++) {
      for (j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.strokeStyle = 'rgba(' + color + ',' + (0.16 * (1 - dist / maxDist)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + color + ',0.55)';
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
}
/* ---------- Global Modal Logic ---------- */
function openModal(title, subtitle, description, featuresArray, ctaText, ctaLink) {
  let overlay = document.getElementById('igo-global-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'igo-global-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h2 class="modal-title" id="modal-title-el"></h2>
            <div class="modal-subtitle" id="modal-subtitle-el"></div>
          </div>
          <button class="modal-close" onclick="closeModal()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body">
          <p id="modal-desc-el"></p>
          <h3 id="modal-features-title">Highlights</h3>
          <div class="modal-features" id="modal-features-el"></div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="closeModal()">Close</button>
          <a href="#" class="btn btn-primary" id="modal-cta-el"></a>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
  }

  document.getElementById('modal-title-el').textContent = title;
  document.getElementById('modal-subtitle-el').textContent = subtitle;
  document.getElementById('modal-desc-el').innerHTML = description;

  const featsEl = document.getElementById('modal-features-el');
  featsEl.innerHTML = '';
  if (featuresArray && featuresArray.length > 0) {
    document.getElementById('modal-features-title').style.display = 'block';
    featuresArray.forEach(f => {
      let div = document.createElement('div');
      div.className = 'modal-feature-item';
      div.textContent = f;
      featsEl.appendChild(div);
    });
  } else {
    document.getElementById('modal-features-title').style.display = 'none';
  }

  const ctaEl = document.getElementById('modal-cta-el');
  if (ctaLink) {
    ctaEl.style.display = 'inline-block';
    ctaEl.textContent = ctaText || 'Visit Website';
    ctaEl.href = ctaLink;
    if (/^https?:\/\//i.test(ctaLink)) {
      ctaEl.target = '_blank';
      ctaEl.rel = 'noopener';
    } else {
      ctaEl.removeAttribute('target');
      ctaEl.removeAttribute('rel');
    }
  } else {
    ctaEl.style.display = 'none';
  }

  // Force reflow
  void overlay.offsetWidth;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('igo-global-modal');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ---------- Image Lightbox (department team/banner photos) ---------- */
function openImageLightbox(src, alt) {
  let overlay = document.getElementById('igo-img-lightbox');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'igo-img-lightbox';
    overlay.className = 'img-lightbox-overlay';
    overlay.innerHTML = `
      <button class="img-lightbox-close" onclick="closeImageLightbox()" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <img class="img-lightbox-img" id="igo-img-lightbox-img" src="" alt="">
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeImageLightbox();
    });
  }
  document.getElementById('igo-img-lightbox-img').src = src;
  document.getElementById('igo-img-lightbox-img').alt = alt || '';
  void overlay.offsetWidth;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeImageLightbox() {
  const overlay = document.getElementById('igo-img-lightbox');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeImageLightbox();
});
