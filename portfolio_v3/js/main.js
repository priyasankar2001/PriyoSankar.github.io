/* =============================================
   MAIN.JS — Portfolio V3 Interactions
   ============================================= */

/* ---- CUSTOM CURSOR ---- */
(function () {
  const dot  = document.getElementById('cursor');
  const glow = document.getElementById('cursor-glow');
  let gx = 0, gy = 0;

  document.addEventListener('mousemove', (e) => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    gx += (e.clientX - gx) * 0.1;
    gy += (e.clientY - gy) * 0.1;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
  });

  const smoothFollow = () => {
    requestAnimationFrame(smoothFollow);
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
  };
  smoothFollow();

  const hoverEls = 'a, button, .skill-card, .project-card-big, .project-card-sm, .edu-card, .contact-card, .quality-pill';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      glow.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      glow.classList.remove('hover');
    });
  });
})();


/* ---- SCROLL REVEAL ---- */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
})();


/* ---- NAV SCROLLED STATE ---- */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });
})();


/* ---- MOBILE MENU ---- */
(function () {
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.add('open');
  });
  document.getElementById('mobileClose').addEventListener('click', closeMobile);
})();

function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}


/* ---- SKILL CARD 3D TILT ---- */
(function () {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-8px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => card.style.transition = '', 600);
    });
  });
})();


/* ---- PROJECT CARD TILT ---- */
(function () {
  document.querySelectorAll('.project-card-big, .project-card-sm').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s ease';
      setTimeout(() => card.style.transition = '', 600);
    });
  });
})();


/* ---- ACTIVE NAV LINKS ---- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => {
          l.style.color = '';
          if (l.getAttribute('href') === '#' + e.target.id) {
            l.style.color = 'var(--gold2)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();


/* ---- HERO NAME SHIMMER on load ---- */
(function () {
  const italic = document.querySelector('.ht-italic');
  if (!italic) return;
  setTimeout(() => {
    italic.style.transition = 'filter 0.5s';
    italic.style.filter = 'brightness(1.4)';
    setTimeout(() => { italic.style.filter = ''; }, 700);
  }, 1200);
})();
