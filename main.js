// ── SPA routing ──
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');

  const link = document.querySelector(`nav a[data-page="${pageId}"]`);
  if (link) link.classList.add('active');

  // update URL hash without scrolling
  history.replaceState(null, '', '#' + pageId);
  window.scrollTo(0, 0);

  closeSidebar();
}

// hash-based routing on load
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash);

  document.querySelectorAll('nav a[data-page]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(a.dataset.page);
    });
  });
});

// ── hamburger ──
const ham = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('show');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

ham?.addEventListener('click', openSidebar);
overlay?.addEventListener('click', closeSidebar);

// ── animated atmospheric line art ──
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, lines, animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildLines();
  }

  function buildLines() {
    lines = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      lines.push({
        y: H * (i + 0.5) / count,
        phase: Math.random() * Math.PI * 2,
        freq: 0.004 + Math.random() * 0.003,
        amp: 18 + Math.random() * 22,
        speed: 0.004 + Math.random() * 0.003,
        drift: 0,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#8BA4C4';
    ctx.lineWidth = 1;

    lines.forEach(line => {
      line.drift += line.speed;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const y = line.y + Math.sin(x * line.freq + line.phase + line.drift) * line.amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    animId = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  draw();
}

document.addEventListener('DOMContentLoaded', initHeroCanvas);
