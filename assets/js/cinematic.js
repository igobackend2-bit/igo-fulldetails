/* ══════════════════════════════════════════════════════════════
   CINEMATIC LAYER — GSAP ScrollTrigger reveals/parallax.
   Additive only: never touches the CSS-driven hero entrance in
   main.js, only adds scroll-linked parallax/reveal on top of it.
   No-ops entirely if the CDN libraries fail to load or the user
   prefers reduced motion.

   NOTE: Lenis smooth-scroll is intentionally NOT initialized here.
   This site's body has `overflow-x: hidden`, which per the CSS spec
   forces `overflow-y` to compute as `auto` too — making <body>,
   not <html>/window, the real scrolling element. Lenis assumes the
   latter, so it was capturing wheel/touch input and driving the
   wrong element, freezing scroll entirely. ScrollTrigger alone
   works fine against native scroll, so it stays; Lenis does not.
══════════════════════════════════════════════════════════════ */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener('DOMContentLoaded', function () {
    // ── Hero parallax: video + mesh drift slower than scroll for depth ──
    var hero = document.querySelector('.hero-premium');
    if (hero) {
      var video = hero.querySelector('.hero-bg-video');
      var mesh = hero.querySelector('.hero-mesh');
      if (video) {
        gsap.to(video, {
          yPercent: 14, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });
      }
      if (mesh) {
        gsap.to(mesh, {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });
      }
    }

    // ── Headquarters gallery: staggered cinematic reveal on scroll ──
    var hqCards = gsap.utils.toArray('.hq-photo-card');
    if (hqCards.length) {
      gsap.set(hqCards, { opacity: 0, y: 60, scale: 0.96 });
      ScrollTrigger.batch(hqCards, {
        start: 'top 88%',
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.12,
            ease: 'power4.out'
          });
        },
        once: true
      });
    }

    // ── Sitewide cinematic card stagger — every major grid gets the same
    //    "batch enters together, once" choreography, tying every page
    //    (not just the homepage) into one consistent scroll journey.
    //    Covers both the homepage's bespoke sections and the shared
    //    component classes used across all 69 other pages. ──
    var cinematicGroups = [
      // homepage-specific
      '.why-grid .why-card',
      '.sectors-section .bento-card',
      '.offer-grid .offer-card',
      '.testi-grid-new .testi-card-new',
      '.leader-grid .leader-card',
      '.stats-main-grid .stat-big-card',
      '.innovation-grid .innovation-card',
      '.vision-timeline .vt-node',
      // shared sitewide component classes (about, departments, brands, services, etc.)
      '.grid > .card',
      '.grid > .brand-card',
      '.grid > .pro-card',
      '.grid > .l1-card',
      '.grid > .eco-item',
      '.grid > .testi-card',
      '.grid > .subcat-card',
      '.grid > .proj-cat',
      '.grid > .milestone-card',
      '.brands-card-grid > .brand-showcase-card',
      '.timeline .timeline-item',
      '.openings-grid > .opening-card',
      '.dept-group .pro-card',
      '.dept-group .l1-card'
    ];
    var revealedItems = [];
    cinematicGroups.forEach(function (sel) {
      // Elements already carrying [data-reveal] are animated by main.js's
      // native CSS-transition reveal system. Letting GSAP drive opacity on
      // them too means two systems fight over the same property every
      // frame — the CSS transition keeps chasing GSAP's per-tick value and
      // the element gets stuck at a fractional opacity, reading as content
      // that silently vanishes while scrolling. Skip those here.
      var items = gsap.utils.toArray(sel).filter(function (el) { return !el.hasAttribute('data-reveal'); });
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: 44 });
      revealedItems = revealedItems.concat(items);
      ScrollTrigger.batch(items, {
        start: 'top 90%',
        onEnter: function (batch) {
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' });
        },
        once: true
      });
    });
    // Safety net: if anything above never got revealed (edge cases in batch
    // timing, layout shifts from late-loading images, etc.), force it visible
    // rather than risk permanently-invisible content.
    if (revealedItems.length) {
      setTimeout(function () {
        gsap.to(revealedItems.filter(function (el) { return +getComputedStyle(el).opacity < 1; }), {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: 'power2.out'
        });
      }, 2500);
    }

    // NOTE: an inner-page .page-hero parallax was tried here and removed.
    // .page-hero is short on inner pages (~400px, roughly 8% of total page
    // height on a typical page), so a scrub tied to "top top -> bottom top"
    // completed within the very first scroll gesture — the hero content
    // visually snapped away almost instantly, reading as a broken jump to
    // the next section even though no programmatic scroll jump occurred.

    // ── Section-background parallax — video/mesh layers drift slower than
    //    scroll for depth, same technique as the hero, reused everywhere
    //    a full-bleed background video exists. ──
    gsap.utils.toArray('.cinematic-bg-video').forEach(function (video) {
      var section = video.closest('section');
      if (!section) return;
      gsap.to(video, {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // ── Future Vision timeline: progress line fills as you scroll through it ──
    var track = document.querySelector('.vision-timeline-track');
    var fill = document.querySelector('.vision-timeline-fill');
    if (track && fill) {
      gsap.fromTo(fill, { scaleX: 0 }, {
        scaleX: 1, ease: 'none', transformOrigin: 'left center',
        scrollTrigger: { trigger: track, start: 'top 75%', end: 'bottom 60%', scrub: true }
      });
    }
  });
})();
