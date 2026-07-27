/* ═══════════════════════════════════════════════════
   TÂM THƯ — Script
   Rain, Light Particles, Typewriter, Scroll Reveals
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Rain Effect (Dark Phase) ───
  initRainCanvas();

  // ─── Light Particles (Light Phase) ───
  initLightCanvas();

  // ─── Scroll Reveal ───
  initScrollReveal();

  // ─── Typewriter Effect ───
  initTypewriters();

  // ─── Phase Detection ───
  initPhaseDetection();

  // ─── Scroll Indicator ───
  initScrollIndicator();

  // ─── Phase Nav Click ───
  initPhaseNav();
});

/* ═══════════════════════════════════════════════════
   RAIN CANVAS
   ═══════════════════════════════════════════════════ */
function initRainCanvas() {
  const canvas = document.getElementById('rainCanvas');
  const ctx = canvas.getContext('2d');

  let drops = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createDrops() {
    drops = [];
    const count = Math.floor(canvas.width / 8);
    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.15 + 0.05,
        width: Math.random() * 1 + 0.5
      });
    }
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drops.forEach(drop => {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x + 0.5, drop.y + drop.length);
      ctx.strokeStyle = `rgba(99, 102, 241, ${drop.opacity})`;
      ctx.lineWidth = drop.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      drop.y += drop.speed;

      if (drop.y > canvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * canvas.width;
      }
    });

    animationId = requestAnimationFrame(drawRain);
  }

  resize();
  createDrops();
  drawRain();

  window.addEventListener('resize', () => {
    resize();
    createDrops();
  });
}

/* ═══════════════════════════════════════════════════
   LIGHT PARTICLES CANVAS
   ═══════════════════════════════════════════════════ */
function initLightCanvas() {
  const canvas = document.getElementById('lightCanvas');
  const ctx = canvas.getContext('2d');

  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor(canvas.width / 15);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -Math.random() * 0.8 - 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.pulse += 0.02;
      const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

      // Glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      gradient.addColorStop(0, `rgba(244, 165, 74, ${currentOpacity})`);
      gradient.addColorStop(1, 'rgba(244, 165, 74, 0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 220, 160, ${currentOpacity * 1.5})`;
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
    });

    requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-element, .reveal-text');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger delay based on siblings
        const parent = entry.target.parentElement;
        const siblings = parent.querySelectorAll('.reveal-element, .reveal-text');
        let siblingIndex = 0;
        siblings.forEach((sib, i) => {
          if (sib === entry.target) siblingIndex = i;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, siblingIndex * 150);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════
   TYPEWRITER EFFECT
   ═══════════════════════════════════════════════════ */
function initTypewriters() {
  const typewriters = document.querySelectorAll('.typewriter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.typed) {
        entry.target.dataset.typed = 'true';
        typeText(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  typewriters.forEach(tw => observer.observe(tw));
}

function typeText(element) {
  const fullText = element.dataset.text;
  const cursor = element.querySelector('.typewriter-cursor');
  let index = 0;

  // Clear any existing text nodes
  const textNodes = Array.from(element.childNodes).filter(n => n.nodeType === 3);
  textNodes.forEach(n => n.remove());

  function type() {
    if (index < fullText.length) {
      // Insert text before cursor
      const textNode = document.createTextNode(fullText.charAt(index));
      element.insertBefore(textNode, cursor);
      index++;

      // Variable speed for natural feel
      const char = fullText.charAt(index - 1);
      let delay = 35;
      if (char === ',' || char === '.') delay = 200;
      else if (char === ' ') delay = 60;
      else delay = Math.random() * 30 + 25;

      setTimeout(type, delay);
    } else {
      // Typing complete - keep cursor blinking for a bit then hide
      setTimeout(() => {
        cursor.classList.add('hidden');
      }, 3000);
    }
  }

  // Delay before starting
  setTimeout(type, 500);
}

/* ═══════════════════════════════════════════════════
   PHASE DETECTION
   ═══════════════════════════════════════════════════ */
function initPhaseDetection() {
  const body = document.body;
  const lightPhase = document.getElementById('lightPhase');
  const transitionZone = document.getElementById('transitionZone');
  const darkDot = document.querySelector('.phase-dot[data-phase="dark"]');
  const lightDot = document.querySelector('.phase-dot[data-phase="light"]');

  function checkPhase() {
    const transitionRect = transitionZone.getBoundingClientRect();
    const viewportMid = window.innerHeight / 2;

    if (transitionRect.top < viewportMid) {
      body.classList.add('in-light');
      darkDot.classList.remove('active');
      lightDot.classList.add('active');

      // Update scrollbar colors
      document.documentElement.style.setProperty('--scrollbar-thumb', '#d4a04a');
      document.documentElement.style.setProperty('--scrollbar-track', '#fdf6ee');
    } else {
      body.classList.remove('in-light');
      darkDot.classList.add('active');
      lightDot.classList.remove('active');
    }
  }

  window.addEventListener('scroll', checkPhase, { passive: true });
  checkPhase();
}

/* ═══════════════════════════════════════════════════
   SCROLL INDICATOR
   ═══════════════════════════════════════════════════ */
function initScrollIndicator() {
  const indicator = document.getElementById('scrollIndicator');

  function checkScroll() {
    if (window.scrollY > 100) {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
}

/* ═══════════════════════════════════════════════════
   PHASE NAV
   ═══════════════════════════════════════════════════ */
function initPhaseNav() {
  const dots = document.querySelectorAll('.phase-dot');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const phase = dot.dataset.phase;
      const target = phase === 'dark'
        ? document.getElementById('darkPhase')
        : document.getElementById('lightPhase');

      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════════════
   PARALLAX SUBTLE EFFECT (performance-friendly)
   ═══════════════════════════════════════════════════ */
(function initParallax() {
  const hero = document.querySelector('.hero__content');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          const opacity = 1 - (scrollY / (window.innerHeight * 0.7));
          const translateY = scrollY * 0.3;
          hero.style.opacity = Math.max(0, opacity);
          hero.style.transform = `translateY(${translateY}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
