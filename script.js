/* ==========================================================================
   Navbar — scroll backdrop + active link tracking
   ========================================================================== */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

/* ==========================================================================
   Mobile Navigation Toggle
   ========================================================================== */
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');

navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navMobile.setAttribute('aria-hidden', !isOpen);
    navToggle.querySelector('i').setAttribute('data-lucide', isOpen ? 'x' : 'menu');
    lucide.createIcons();
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
        navToggle.querySelector('i').setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

/* ==========================================================================
   Background Canvas — Cyan Particle Network
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

let W, H, particles = [], rafId;
const PARTICLE_COUNT = 55;
const MAX_DIST       = 120;
const ACCENT_RGB     = '34,211,238';

function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(); }

    reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - .5) * .35;
        this.vy = (Math.random() - .5) * .35;
        this.r  = Math.random() * 1.5 + 1;
        this.a  = Math.random() * .35 + .15;
    }

    step() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT_RGB},${this.a})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < MAX_DIST) {
                const opacity = (1 - d / MAX_DIST) * 0.12;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${ACCENT_RGB},${opacity})`;
                ctx.lineWidth = .8;
                ctx.stroke();
            }
        }
    }

    particles.forEach(p => { p.step(); p.draw(); });
    rafId = requestAnimationFrame(drawFrame);
}

resizeCanvas();
initParticles();
drawFrame();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        cancelAnimationFrame(rafId);
        resizeCanvas();
        initParticles();
        drawFrame();
    }, 150);
}, { passive: true });

/* ==========================================================================
   Scroll Fade-In Animation (IntersectionObserver)
   ========================================================================== */
const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
