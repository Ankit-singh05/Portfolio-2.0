
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => { mobileMenu.classList.toggle('open'); });
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.pill-fill').forEach(fill => { fill.style.width = fill.style.getPropertyValue('--w'); });
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-group').forEach(g => skillObs.observe(g));

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--accent)' : ''; });
});

function handleFormSubmit(e) {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    const btn = e.target.querySelector('button[type="submit"]');
    if (!document.getElementById('fname').value.trim() || !document.getElementById('femail').value.trim() || !document.getElementById('fmessage').value.trim()) {
        msg.textContent = 'Please fill in all required fields.'; msg.className = 'form-msg error'; return;
    }
    btn.textContent = 'Sending...'; btn.disabled = true;
    setTimeout(() => { msg.textContent = '✅ Message sent! I\'ll get back to you soon.'; msg.className = 'form-msg success'; btn.textContent = 'Send Message'; btn.disabled = false; e.target.reset(); }, 1200);
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        const t = document.querySelector(this.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

window.addEventListener('mousemove', function (e) {

    var cx = e.clientX / window.innerWidth - 0.5;
    var cy = e.clientY / window.innerHeight - 0.5;

    var o1 = document.querySelector('.orb1');
    var o2 = document.querySelector('.orb2');
    var o3 = document.querySelector('.orb3');

    if (o1) {
        o1.style.transform = "translate(" + (cx * 25) + "px," + (cy * 25) + "px)";
    }

    if (o2) {
        o2.style.transform = "translate(" + (cx * -15) + "px," + (cy * -15) + "px)";
    }

    if (o3) {
        o3.style.transform = "translate(" + (cx * 20) + "px," + (cy * 20) + "px)";
    }

});

window.addEventListener('load', () => {
    document.querySelectorAll('#hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
});



// ═══════════════════════════════════════════════════
//   DATA DEFENDER — complete game engine
// ═══════════════════════════════════════════════════
(function () {
    const cv = document.getElementById('g2-canvas');
    const cx = cv.getContext('2d');

    // Sizing
    function setSize() {
        cv.width = cv.parentElement.clientWidth;
        cv.height = Math.min(Math.round(cv.width * 0.62), 520);
    }
    setSize();
    window.addEventListener('resize', () => { setSize(); if (!G.running) drawBg(); });

    // ── Palette ──
    const P = {
        bg0: '#050910', bg1: '#080d15', bg2: '#0d1421',
        surf: '#131d2e', surf2: '#1a2640',
        accent: '#64dcb4', accent2: '#4fb8e0', accent3: '#a78bfa',
        warn: '#ff6b6b', gold: '#fbbf24',
        text: '#e8f0fe', text2: '#8fa3c0', text3: '#4a6070',
        grid: 'rgba(100,220,180,0.03)'
    };

    // ── State ──
    const G = {
        running: false, over: false, won: false,
        score: 0, wave: 1, lives: 3, best: 0,
        frame: 0, waveTimer: 0, waveBreak: false, waveBreakTimer: 0,
        maxWaves: 8,
        shooter: { x: 0.5, w: 50, h: 22, speed: 0.007, charging: false, chargeT: 0 },
        bullets: [], bugs: [], particles: [], stars: [], debris: [], powerups: [],
        bgLines: [], scanline: 0
    };

    // Gen stars
    G.stars = Array.from({ length: 90 }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.8 + .3,
        speed: Math.random() * .0003 + .0001,
        alpha: Math.random() * .6 + .15,
        twinkle: Math.random() * Math.PI * 2
    }));

    // Gen bg grid lines
    G.bgLines = Array.from({ length: 6 }, (_, i) => ({
        y: (i + 1) / 7, speed: .0004 + i * .0002, alpha: .04 + i * .01
    }));

    // ── Input ──
    const K = {};
    document.addEventListener('keydown', e => {
        K[e.code] = true;
        if (e.code === 'Space' && G.running && !G.over && !G.won) { e.preventDefault(); shoot(); }
        if ((e.code === 'ArrowLeft' || e.code === 'ArrowRight') && G.running) e.preventDefault();
    });
    document.addEventListener('keyup', e => { K[e.code] = false; });

    // Mouse / touch aim on canvas
    cv.addEventListener('mousemove', e => {
        if (!G.running || G.over || G.won) return;
        const rect = cv.getBoundingClientRect();
        G.shooter.x = (e.clientX - rect.left) / cv.width;
        G.shooter.x = Math.max(.04, Math.min(.96, G.shooter.x));
    });
    cv.addEventListener('click', () => { if (G.running && !G.over && !G.won) shoot(); });

    // Mobile buttons
    let mL = false, mR = false, mFire = false;
    const mb = (id, down, up) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('touchstart', e => { e.preventDefault(); down(); });
        el.addEventListener('touchend', () => up());
        el.addEventListener('mousedown', down);
        el.addEventListener('mouseup', up);
    };
    mb('g2-mob-left', () => mL = true, () => mL = false);
    mb('g2-mob-right', () => mR = true, () => mR = false);
    document.getElementById('g2-mob-fire')?.addEventListener('touchstart', e => { e.preventDefault(); shoot(); });
    document.getElementById('g2-mob-fire')?.addEventListener('click', () => shoot());

    // ── Wave Configs ──
    function waveConfig(w) {
        const configs = [
            // wave 1 — simple slow bugs
            { count: 6, speed: [.0012, .0018], rows: 2, cols: 3, type: 'basic', pts: 10 },
            // wave 2 — more, a bit faster
            { count: 10, speed: [.0015, .0022], rows: 2, cols: 5, type: 'basic', pts: 10 },
            // wave 3 — zigzag introduced
            { count: 9, speed: [.0018, .0025], rows: 3, cols: 3, type: 'zigzag', pts: 15 },
            // wave 4 — tanks (take 2 hits)
            { count: 8, speed: [.0012, .0018], rows: 2, cols: 4, type: 'tank', pts: 25 },
            // wave 5 — fast swarm
            { count: 14, speed: [.002, .003], rows: 2, cols: 7, type: 'fast', pts: 20 },
            // wave 6 — mixed
            { count: 12, speed: [.0018, .0026], rows: 3, cols: 4, type: 'mixed', pts: 20 },
            // wave 7 — boss swarm
            { count: 16, speed: [.0022, .003], rows: 4, cols: 4, type: 'mixed', pts: 30 },
            // wave 8 — BOSS
            { count: 1, speed: [.0008, .001], rows: 1, cols: 1, type: 'boss', pts: 500 },
        ];
        return configs[Math.min(w - 1, configs.length - 1)];
    }

    function spawnWave() {
        const cfg = waveConfig(G.wave);
        const W = cv.width, H = cv.height;
        const rows = cfg.rows, cols = cfg.cols;

        if (cfg.type === 'boss') {
            G.bugs.push({
                x: .5, y: .05, w: 70, h: 70, hp: 20, maxHp: 20,
                vx: .001, vy: 0, type: 'boss', phase: 0, pts: cfg.pts,
                emoji: '👾', wobble: 0, size: 70
            });
            return;
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = r * cols + c;
                if (idx >= cfg.count) break;
                const spd = cfg.speed[0] + Math.random() * (cfg.speed[1] - cfg.speed[0]);
                const xOff = .1 + (c / (cols - 1 || 1)) * .8;
                const typeArr = cfg.type === 'mixed'
                    ? ['basic', 'zigzag', 'tank', 'fast']
                    : [cfg.type];
                const t = typeArr[Math.floor(Math.random() * typeArr.length)];
                const emojis = {
                    basic: ['🐛', '🦠', '💀'],
                    zigzag: ['🔴', '⚠️', '🧨'],
                    tank: ['☠️', '💣', '👹'],
                    fast: ['⚡', '🔥', '💢'],
                    boss: ['👾']
                };
                const eList = emojis[t] || emojis.basic;
                G.bugs.push({
                    x: xOff, y: -.05 - r * .09,
                    w: t === 'tank' ? 36 : 28, h: t === 'tank' ? 36 : 28,
                    hp: t === 'tank' ? 2 : 1, maxHp: t === 'tank' ? 2 : 1,
                    vx: t === 'zigzag' ? .002 * (Math.random() > .5 ? 1 : -1) : 0,
                    vy: spd, type: t, pts: cfg.pts,
                    emoji: eList[Math.floor(Math.random() * eList.length)],
                    wobble: Math.random() * Math.PI * 2,
                    angle: 0, size: t === 'tank' ? 36 : 28
                });
            }
        }
    }

    // ── Shoot ──
    let lastShot = 0;
    function shoot() {
        const now = Date.now();
        if (now - lastShot < 220) return;
        lastShot = now;
        const sx = G.shooter.x * cv.width;
        const sy = cv.height - 40;
        G.bullets.push({ x: sx, y: sy, vy: -cv.height * .018, r: 4, life: 1 });
        // Muzzle flash
        spawnFX(sx, sy, P.accent, 5, 'spark');
    }

    // ── Particles ──
    function spawnFX(x, y, color, count = 10, style = 'burst') {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = style === 'spark' ? Math.random() * 3 + 1 : Math.random() * 4 + 2;
            G.particles.push({
                x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (style === 'burst' ? 2 : 0),
                life: 1, decay: .03 + Math.random() * .04,
                r: style === 'spark' ? 2 : 3 + Math.random() * 3,
                color, style
            });
        }
    }

    function addText(x, y, text, color) {
        G.debris.push({ x, y, text, color, life: 1, vy: -1.2, vx: (Math.random() - .5) });
    }

    // ── Powerup drop ──
    function maybeDropPowerup(x, y) {
        if (Math.random() < .12) {
            G.powerups.push({ x: x / cv.width, y: y / cv.height, vy: .003, type: 'shield', life: 600 });
        }
        if (Math.random() < .08) {
            G.powerups.push({ x: x / cv.width, y: y / cv.height, vy: .003, type: 'rapid', life: 600 });
        }
    }

    // ── Update ──
    function update() {
        if (!G.running || G.over || G.won) return;
        G.frame++;
        G.scanline = (G.scanline + 1.2) % cv.height;

        // Wave break
        if (G.waveBreak) {
            G.waveBreakTimer--;
            if (G.waveBreakTimer <= 0) { G.waveBreak = false; G.wave++; spawnWave(); updateHUD(); }
            return;
        }

        // Check wave clear
        if (G.bugs.length === 0 && !G.waveBreak) {
            if (G.wave >= G.maxWaves) { endGame(true); return; }
            G.waveBreak = true;
            G.waveBreakTimer = 120;
            addText(cv.width / 2, cv.height / 2, '✅ Wave ' + G.wave + ' cleared!', P.accent);
        }

        // Move shooter
        const sh = G.shooter;
        if (K['ArrowLeft'] || mL) sh.x = Math.max(.04, sh.x - sh.speed);
        if (K['ArrowRight'] || mR) sh.x = Math.min(.96, sh.x + sh.speed);

        // Stars twinkle
        G.stars.forEach(s => {
            s.y += s.speed;
            s.twinkle += .02;
            if (s.y > 1) s.y = 0;
        });

        // Moving bg lines
        G.bgLines.forEach(l => {
            l.y += l.speed;
            if (l.y > 1) l.y = 0;
        });

        // Bullets
        G.bullets.forEach((b, i) => {
            b.y += b.vy;
            if (b.y < -10) G.bullets.splice(i, 1);
        });

        // Bugs
        G.bugs.forEach((bug, bi) => {
            // Boss special movement
            if (bug.type === 'boss') {
                bug.phase += .02;
                bug.x += Math.sin(bug.phase) * .004;
                bug.y += bug.vy || .001;
                bug.x = Math.max(.07, Math.min(.93, bug.x));
                // Boss shoots back occasionally
                if (G.frame % 90 === 0) {
                    spawnFX(bug.x * cv.width, bug.y * cv.height, P.warn, 8, 'burst');
                }
            } else {
                bug.y += bug.vy;
                bug.wobble += .04;
                bug.x += bug.vx;
                bug.angle += .02;
                // Zigzag bounce
                if (bug.x < .05 || bug.x > .95) bug.vx *= -1;
            }

            // Bottom breach
            if (bug.y > 1.02) {
                G.bugs.splice(bi, 1);
                G.lives--;
                updateHUD();
                spawnFX(bug.x * cv.width, cv.height - 20, P.warn, 15, 'burst');
                addText(cv.width / 2, cv.height * .6, '🛑 -1 Life!', P.warn);
                if (G.lives <= 0) { endGame(false); return; }
            }
        });

        // Bullet ↔ bug collision
        G.bullets.forEach((b, bi) => {
            G.bugs.forEach((bug, bgi) => {
                const bx = b.x, by = b.y;
                const ex = bug.x * cv.width, ey = bug.y * cv.height;
                const hw = bug.size / 2 + 6;
                if (bx > ex - hw && bx < ex + hw && by > ey - hw && by < ey + hw) {
                    // Hit
                    G.bullets.splice(bi, 1);
                    bug.hp--;
                    if (bug.hp <= 0) {
                        const pts = bug.pts * (bug.type === 'boss' ? 1 : 1);
                        G.score += pts;
                        spawnFX(ex, ey, bug.type === 'boss' ? P.gold : P.accent, bug.type === 'boss' ? 30 : 12, 'burst');
                        addText(ex, ey - 20, '+' + pts, bug.type === 'boss' ? P.gold : P.accent2);
                        maybeDropPowerup(ex, ey);
                        G.bugs.splice(bgi, 1);
                        if (G.score > G.best) {
                            G.best = G.score;
                            document.getElementById('g2-best').textContent = G.best;
                        }
                    } else {
                        // Tank flash
                        spawnFX(ex, ey, P.warn, 6, 'spark');
                    }
                    updateHUD();
                }
            });
        });

        // Powerups
        G.powerups.forEach((p, pi) => {
            p.y += p.vy;
            p.life--;
            const px = p.x * cv.width, py = p.y * cv.height;
            const sx = G.shooter.x * cv.width;
            const sy = cv.height - 32;
            if (Math.abs(px - sx) < 30 && Math.abs(py - sy) < 24) {
                if (p.type === 'shield' && G.lives < 3) { G.lives = Math.min(3, G.lives + 1); updateHUD(); addText(sx, sy - 20, '❤️ +1 Life', P.warn); }
                if (p.type === 'rapid') { lastShot = 0; addText(sx, sy - 20, '⚡ Rapid Fire!', P.gold); }
                G.powerups.splice(pi, 1);
            }
            if (p.y > 1.05 || p.life <= 0) G.powerups.splice(pi, 1);
        });

        // Particles
        G.particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.vy += .1; p.life -= p.decay;
            if (p.life <= 0) G.particles.splice(i, 1);
        });

        G.debris.forEach((d, i) => {
            d.x += d.vx; d.y += d.vy; d.life -= .018;
            if (d.life <= 0) G.debris.splice(i, 1);
        });
    }

    // ── Draw ──
    function drawBg() {
        const W = cv.width, H = cv.height;
        // Deep space gradient
        const grd = cx.createLinearGradient(0, 0, 0, H);
        grd.addColorStop(0, '#030609');
        grd.addColorStop(.5, '#060c14');
        grd.addColorStop(1, '#080d17');
        cx.fillStyle = grd;
        cx.fillRect(0, 0, W, H);

        // Grid
        cx.strokeStyle = P.grid;
        cx.lineWidth = 1;
        for (let x = 0; x < W; x += 50) { cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x, H); cx.stroke(); }
        for (let y = 0; y < H; y += 50) { cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); }

        // Moving horizontal scan lines
        G.bgLines.forEach(l => {
            cx.globalAlpha = l.alpha;
            cx.strokeStyle = P.accent;
            cx.lineWidth = 1;
            cx.beginPath(); cx.moveTo(0, l.y * H); cx.lineTo(W, l.y * H); cx.stroke();
        });
        cx.globalAlpha = 1;

        // Stars
        G.stars.forEach(s => {
            const t = Math.sin(s.twinkle);
            cx.globalAlpha = s.alpha * (.6 + .4 * t);
            cx.fillStyle = '#e8f0fe';
            cx.beginPath(); cx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); cx.fill();
        });
        cx.globalAlpha = 1;
    }

    function drawFrame() {
        const W = cv.width, H = cv.height;
        drawBg();

        // Scanline effect (subtle)
        cx.globalAlpha = .03;
        cx.fillStyle = P.accent;
        cx.fillRect(0, G.scanline - 1, W, 2);
        cx.globalAlpha = 1;

        // Bottom ground bar
        const gbGrd = cx.createLinearGradient(0, H - 14, 0, H);
        gbGrd.addColorStop(0, 'rgba(100,220,180,0.18)');
        gbGrd.addColorStop(1, 'rgba(100,220,180,0.04)');
        cx.fillStyle = gbGrd;
        cx.fillRect(0, H - 14, W, 14);
        cx.shadowColor = P.accent; cx.shadowBlur = 10;
        cx.strokeStyle = P.accent; cx.lineWidth = 1.5;
        cx.beginPath(); cx.moveTo(0, H - 14); cx.lineTo(W, H - 14); cx.stroke();
        cx.shadowBlur = 0;

        // Server icons on ground bar
        const serverX = [W * .1, W * .3, W * .5, W * .7, W * .9];
        serverX.forEach(sx => {
            cx.font = '11px serif'; cx.textAlign = 'center';
            cx.globalAlpha = .5;
            cx.fillText('🖥️', sx, H - 2);
            cx.globalAlpha = 1;
        });

        // Wave break banner
        if (G.waveBreak) {
            cx.font = 'bold 18px "Syne", sans-serif';
            cx.textAlign = 'center'; cx.fillStyle = P.accent;
            cx.shadowColor = P.accent; cx.shadowBlur = 12;
            cx.fillText('⚡ WAVE ' + (G.wave + 1) + ' INCOMING...', W / 2, H / 2);
            cx.shadowBlur = 0;
        }

        // Power-ups
        G.powerups.forEach(p => {
            const px = p.x * W, py = p.y * H;
            cx.font = '20px serif'; cx.textAlign = 'center';
            cx.globalAlpha = Math.min(1, p.life / 60);
            // Glow ring
            cx.shadowColor = p.type === 'shield' ? P.warn : P.gold;
            cx.shadowBlur = 12;
            cx.strokeStyle = p.type === 'shield' ? P.warn : P.gold;
            cx.lineWidth = 1.5;
            cx.beginPath(); cx.arc(px, py, 14, 0, Math.PI * 2); cx.stroke();
            cx.shadowBlur = 0;
            cx.fillText(p.type === 'shield' ? '❤️' : '⚡', px, py + 7);
            cx.globalAlpha = 1;
        });

        // Bugs
        G.bugs.forEach(bug => {
            const bx = bug.x * W, by = bug.y * H;

            if (bug.type === 'boss') {
                // Boss glow
                const grad = cx.createRadialGradient(bx, by, 0, bx, by, 50);
                grad.addColorStop(0, 'rgba(251,191,36,.15)');
                grad.addColorStop(1, 'transparent');
                cx.fillStyle = grad; cx.beginPath(); cx.arc(bx, by, 50, 0, Math.PI * 2); cx.fill();
                // Boss HP bar
                const bpw = 70;
                cx.fillStyle = 'rgba(255,255,255,.1)';
                cx.fillRect(bx - bpw / 2, by - 50, bpw, 6);
                cx.fillStyle = P.gold;
                cx.fillRect(bx - bpw / 2, by - 50, bpw * (bug.hp / bug.maxHp), 6);
                cx.font = '44px serif'; cx.textAlign = 'center';
                cx.shadowColor = P.gold; cx.shadowBlur = 20;
                cx.fillText(bug.emoji, bx, by + 15);
                cx.shadowBlur = 0;
            } else {
                // Regular bug
                cx.save();
                cx.translate(bx, by);
                cx.rotate(Math.sin(bug.wobble) * .2);
                // Glow halo for tanks
                if (bug.type === 'tank') {
                    cx.shadowColor = P.warn; cx.shadowBlur = 12;
                }
                cx.font = bug.size + 'px serif'; cx.textAlign = 'center';
                cx.fillText(bug.emoji, 0, bug.size * .38);
                cx.shadowBlur = 0;
                // HP pip for tank
                if (bug.hp === 2) {
                    cx.fillStyle = P.warn;
                    cx.beginPath(); cx.arc(8, -bug.size / 2, 4, 0, Math.PI * 2); cx.fill();
                }
                cx.restore();
            }
        });

        // Bullets
        G.bullets.forEach(b => {
            cx.shadowColor = P.accent; cx.shadowBlur = 14;
            const bGrd = cx.createLinearGradient(b.x, b.y, b.x, b.y + 16);
            bGrd.addColorStop(0, P.accent);
            bGrd.addColorStop(1, 'transparent');
            cx.fillStyle = bGrd;
            cx.beginPath(); cx.ellipse(b.x, b.y, 3, 10, 0, 0, Math.PI * 2); cx.fill();
            cx.shadowBlur = 0;
        });

        // Shooter
        const sx = G.shooter.x * W;
        const sy = H - 32;
        cx.shadowColor = P.accent; cx.shadowBlur = 18;
        // Ship body
        cx.fillStyle = P.accent;
        cx.beginPath();
        cx.moveTo(sx, sy - 16);
        cx.lineTo(sx - 20, sy + 8);
        cx.lineTo(sx - 8, sy + 2);
        cx.lineTo(sx, sy + 8);
        cx.lineTo(sx + 8, sy + 2);
        cx.lineTo(sx + 20, sy + 8);
        cx.closePath(); cx.fill();
        // Cockpit
        cx.fillStyle = P.accent2;
        cx.beginPath(); cx.ellipse(sx, sy - 4, 5, 7, 0, 0, Math.PI * 2); cx.fill();
        // Engine glow
        cx.shadowColor = P.accent; cx.shadowBlur = 8;
        cx.fillStyle = 'rgba(100,220,180,.6)';
        cx.beginPath(); cx.ellipse(sx, sy + 12, 6, 4, 0, 0, Math.PI * 2); cx.fill();
        cx.shadowBlur = 0;

        // Particles
        G.particles.forEach(p => {
            cx.globalAlpha = Math.max(0, p.life);
            cx.fillStyle = p.color;
            cx.shadowColor = p.color; cx.shadowBlur = 6;
            cx.beginPath(); cx.arc(p.x, p.y, Math.max(.1, p.r * p.life), 0, Math.PI * 2); cx.fill();
            cx.shadowBlur = 0;
        });
        cx.globalAlpha = 1;

        // Floating text
        G.debris.forEach(d => {
            cx.globalAlpha = Math.max(0, d.life);
            cx.font = 'bold 15px "DM Sans", sans-serif';
            cx.textAlign = 'center';
            cx.fillStyle = d.color;
            cx.shadowColor = d.color; cx.shadowBlur = 8;
            cx.fillText(d.text, d.x, d.y);
            cx.shadowBlur = 0;
        });
        cx.globalAlpha = 1;

        // Wave progress (top bar)
        if (G.running && !G.over && !G.won) {
            cx.fillStyle = 'rgba(255,255,255,.04)';
            cx.fillRect(0, 0, W, 3);
            const wProg = (G.maxWaves - G.bugs.length) / Math.max(1, G.maxWaves);
            const wpGrd = cx.createLinearGradient(0, 0, W, 0);
            wpGrd.addColorStop(0, P.accent); wpGrd.addColorStop(1, P.accent2);
            cx.fillStyle = wpGrd;
            cx.fillRect(0, 0, W * Math.min(1, (G.wave - 1) / G.maxWaves), 3);
        }
    }

    // ── HUD ──
    function updateHUD() {
        document.getElementById('g2-score').textContent = G.score;
        document.getElementById('g2-wave').textContent = G.wave;
        document.getElementById('g2-lives').textContent = '❤️'.repeat(G.lives) + '🖤'.repeat(3 - G.lives);
    }

    // ── Game loop ──
    let rafId = null;
    function loop() {
        update(); drawFrame();
        rafId = requestAnimationFrame(loop);
    }

    // ── Public start / end ──
    window.g2Start = function () {
        if (rafId) cancelAnimationFrame(rafId);
        G.running = true; G.over = false; G.won = false;
        G.score = 0; G.lives = 3; G.wave = 1; G.frame = 0;
        G.waveBreak = false; G.waveBreakTimer = 0;
        G.bullets = []; G.bugs = []; G.particles = []; G.debris = []; G.powerups = [];
        G.shooter.x = .5;
        spawnWave();
        updateHUD();
        document.getElementById('g2-start').classList.add('hidden');
        document.getElementById('g2-over').classList.add('hidden');
        document.getElementById('g2-win').classList.add('hidden');
        loop();
    };

    function endGame(won) {
        G.running = false; G.over = !won; G.won = won;
        if (G.score > G.best) { G.best = G.score; document.getElementById('g2-best').textContent = G.best; }
        if (rafId) cancelAnimationFrame(rafId);
        drawFrame(); // final snapshot

        if (won) {
            document.getElementById('g2-win-score').textContent = G.score;
            document.getElementById('g2-win').classList.remove('hidden');
        } else {
            document.getElementById('g2-final-score').textContent = G.score;
            const msgs = [
                'The bugs broke through. Redeploy and try again!',
                'Data corrupted! Run the pipeline again. 💪',
                'Server breached! Better firewall next time.',
                'Even the best engineers iterate. Keep going!'
            ];
            document.getElementById('g2-over-msg').textContent = msgs[Math.floor(Math.random() * msgs.length)];
            document.getElementById('g2-over').classList.remove('hidden');
        }
    }

    // Initial idle draw
    drawBg(); drawFrame();

})(); // end IIFE
// ═══════════════════════════════════════════════════
