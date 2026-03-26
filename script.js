/* ================================================================
   AYA KHAMA — DATA SCIENCE & AI PORTFOLIO  v2.0
   script.js — Enhanced with Dark/Light Theme Toggle + All Features
   ================================================================ */

/* ================================================================
   HOW THE THEME TOGGLE WORKS
   ──────────────────────────
   1. On page load, an inline <script> in <head> reads localStorage
      and sets data-theme="dark" on <html> BEFORE paint, preventing
      any flash of wrong theme.

   2. The toggle button listens for clicks. On each click it:
        a. Flips data-theme between "light" and "dark" on <html>.
        b. Saves the new preference to localStorage under key "theme".

   3. ALL colours in style.css are CSS custom properties (--clr-*).
      The [data-theme="dark"] block overrides every variable.
      Because we put `transition: background-color, color...` on
      every element, swapping one attribute triggers a smooth,
      simultaneous colour transition across the whole page.

   4. The toggle thumb slides via CSS transform, and the sun/moon
      icons fade in/out — all driven by the data-theme attribute,
      so no JS animation is needed for the button itself.
================================================================ */

/* ----------------------------------------------------------------
   1. THEME TOGGLE
---------------------------------------------------------------- */
const html         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');

/**
 * Apply a theme and persist it.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

// Read saved preference (inline script in <head> already set the
// attribute for initial render; here we just sync the button state).
const savedTheme = localStorage.getItem('theme') || 'light';
themeToggle.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');

// Toggle on click
themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ----------------------------------------------------------------
   2. NAVBAR — Scroll State & Mobile Hamburger
---------------------------------------------------------------- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

/* ----------------------------------------------------------------
   3. ACTIVE NAV LINK on scroll
---------------------------------------------------------------- */
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top  = section.offsetTop;
    const ht   = section.offsetHeight;
    const id   = section.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (!link) return;

    if (scrollY >= top && scrollY < top + ht) {
      navLinks.querySelectorAll('a').forEach(a => a.removeAttribute('style'));
      link.style.color = 'var(--clr-accent)';
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ----------------------------------------------------------------
   4. SCROLL REVEAL — IntersectionObserver
---------------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ----------------------------------------------------------------
   5. SKILL BAR ANIMATIONS — Animate fills on visibility
---------------------------------------------------------------- */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.querySelectorAll('.skill-fill').forEach(fill => {
            fill.classList.add('animated');
          });
        }, 300);
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

/* ----------------------------------------------------------------
   6. STATS COUNTER ANIMATION
---------------------------------------------------------------- */
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-num, .hstat-num').forEach(numEl => {
        const raw    = numEl.textContent.trim();
        const target = parseInt(raw);
        if (isNaN(target)) return;
        const suffix = raw.includes('+') ? '+' : '';
        let current  = 0;
        const step   = Math.max(1, Math.ceil(target / 30));
        const timer  = setInterval(() => {
          current = Math.min(current + step, target);
          numEl.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 40);
      });
      statsObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll('.about-stats, .hero-stats').forEach(el => {
  if (el) statsObserver.observe(el);
});

/* ----------------------------------------------------------------
   7. SMOOTH SCROLL for anchor links
---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ----------------------------------------------------------------
   8. CONTACT FORM — Demo submission handler
---------------------------------------------------------------- */
function handleForm(e) {
  e.preventDefault();
  const note  = document.getElementById('form-note');
  const btn   = e.target.querySelector('button[type="submit"]');
  const name  = document.getElementById('name').value.trim();

  btn.disabled     = true;
  btn.textContent  = 'Sending…';

  setTimeout(() => {
    note.textContent = `Thank you${name ? ', ' + name : ''}! I'll get back to you soon ✓`;
    btn.textContent  = 'Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    e.target.reset();

    setTimeout(() => {
      note.textContent     = '';
      btn.disabled         = false;
      btn.textContent      = 'Send Message';
      btn.style.background = '';
    }, 5000);
  }, 1200);
}

/* ----------------------------------------------------------------
   9. PROJECT CARD 3-D TILT on hover
---------------------------------------------------------------- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 7;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 7;
    card.style.transform  = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform 0.05s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = '';
  });
});

/* ----------------------------------------------------------------
   10. SCROLL PROGRESS BAR — thin accent stripe at very top
---------------------------------------------------------------- */
(function initProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.style.cssText = `
    position: fixed; top: 0; left: 0;
    height: 3px; z-index: 999;
    background: linear-gradient(90deg, #0ea5e9, #14b8a6);
    width: 0%; pointer-events: none;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const pct = (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ----------------------------------------------------------------
   11. PARALLAX — Hero mesh orb mouse tracking
---------------------------------------------------------------- */
(function initParallax() {
  const orbs = document.querySelectorAll('.mesh-orb');
  if (!orbs.length) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 14;
      const dir    = i % 2 === 0 ? 1 : -1;
      orb.style.transform = `translate(${x * factor * dir}px, ${y * factor * dir}px)`;
    });
  });
})();

/* ----------------------------------------------------------------
   12. HERO PARTICLE CANVAS
   Draws small floating dots that react to the current theme.
---------------------------------------------------------------- */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Create particles
  function createParticles() {
    particles = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a:  Math.random() * 0.5 + 0.2,
      });
    }
  }

  createParticles();

  // Get accent colour based on theme
  function getAccentColor() {
    return html.getAttribute('data-theme') === 'dark'
      ? '56, 189, 248'   // sky-400 for dark
      : '14, 165, 233';  // sky-500 for light
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const accent = getAccentColor();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accent}, ${p.a})`;
      ctx.fill();
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${accent}, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  draw();

  // Recreate on resize so density stays correct
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

/* ----------------------------------------------------------------
   13. EDUCATION TIMELINE — Animate dots on scroll
---------------------------------------------------------------- */
const eduObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.edu-tl-dot').forEach((dot, i) => {
          setTimeout(() => {
            dot.style.transform = 'scale(1)';
            dot.style.opacity   = '1';
          }, i * 200);
        });
        eduObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const eduTimeline = document.querySelector('.edu-timeline');
if (eduTimeline) eduObserver.observe(eduTimeline);

/* ----------------------------------------------------------------
   14. CONSOLE SIGNATURE
---------------------------------------------------------------- */
console.log(`
%c  AYA KHAMA — Portfolio v2.0  
%c  Data Science & AI Engineering
%c  🌙 Dark / ☀️ Light mode supported
%c  Built with HTML · CSS · JavaScript
`,
  'background:linear-gradient(135deg,#0ea5e9,#14b8a6);color:white;padding:4px 20px;font-size:16px;font-weight:bold;border-radius:4px',
  'color:#0ea5e9;font-size:12px;padding:2px 20px',
  'color:#14b8a6;font-size:11px;padding:2px 20px',
  'color:#64748b;font-size:11px;padding:2px 20px'
);
