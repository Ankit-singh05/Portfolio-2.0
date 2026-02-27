import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App = () => {

    useEffect(() => {
        // ═══════════════════════════════════════════════════
        // Core Layout Scripts
        // ═══════════════════════════════════════════════════
        const navbar = document.getElementById('navbar');
        const scrollListener = () => { navbar.classList.toggle('scrolled', window.scrollY > 50); };
        window.addEventListener('scroll', scrollListener);

        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburgerClick = () => { mobileMenu.classList.toggle('open'); };
        hamburger.addEventListener('click', hamburgerClick);

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
        const scrollSpy = () => {
            let cur = '';
            sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
            navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--accent)' : ''; });
        };
        window.addEventListener('scroll', scrollSpy);

        const smoothScroll = function (e) {
            let targetHref = this.getAttribute('href');
            if (targetHref && targetHref.startsWith('#')) {
                const t = document.querySelector(targetHref);
                if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            }
        };
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', smoothScroll);
        });

        const mouseMoveListener = function (e) {
            var cx = e.clientX / window.innerWidth - 0.5;
            var cy = e.clientY / window.innerHeight - 0.5;
            var o1 = document.querySelector('.orb1');
            var o2 = document.querySelector('.orb2');
            var o3 = document.querySelector('.orb3');
            if (o1) { o1.style.transform = "translate(" + (cx * 25) + "px," + (cy * 25) + "px)"; }
            if (o2) { o2.style.transform = "translate(" + (cx * -15) + "px," + (cy * -15) + "px)"; }
            if (o3) { o3.style.transform = "translate(" + (cx * 20) + "px," + (cy * 20) + "px)"; }
        };
        window.addEventListener('mousemove', mouseMoveListener);

        document.querySelectorAll('#hero .reveal').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), 200 + i * 150);
        });

        // ═══════════════════════════════════════════════════
        // GAME ENGINE
        // ═══════════════════════════════════════════════════
        let rafId = null;
        let resizeListener = null;
        let keydownListener = null;
        let keyupListener = null;
        let mousemoveListener2 = null;
        let clickListener = null;

        (function () {
            const cv = document.getElementById('g2-canvas');
            if (!cv) return;
            const cx = cv.getContext('2d');

            function setSize() {
                cv.width = cv.parentElement.clientWidth;
                cv.height = Math.min(Math.round(cv.width * 0.62), 520);
            }
            setSize();
            resizeListener = () => { setSize(); if (!G.running) drawBg(); };
            window.addEventListener('resize', resizeListener);

            const P = {
                bg0: '#050910', bg1: '#080d15', bg2: '#0d1421',
                surf: '#131d2e', surf2: '#1a2640',
                accent: '#64dcb4', accent2: '#4fb8e0', accent3: '#a78bfa',
                warn: '#ff6b6b', gold: '#fbbf24',
                text: '#e8f0fe', text2: '#8fa3c0', text3: '#4a6070',
                grid: 'rgba(100,220,180,0.03)'
            };

            const G = {
                running: false, over: false, won: false,
                score: 0, wave: 1, lives: 3, best: 0,
                frame: 0, waveTimer: 0, waveBreak: false, waveBreakTimer: 0,
                maxWaves: 8,
                shooter: { x: 0.5, w: 50, h: 22, speed: 0.007, charging: false, chargeT: 0 },
                bullets: [], bugs: [], particles: [], stars: [], debris: [], powerups: [],
                bgLines: [], scanline: 0
            };

            G.stars = Array.from({ length: 90 }, () => ({
                x: Math.random(), y: Math.random(),
                r: Math.random() * 1.8 + .3,
                speed: Math.random() * .0003 + .0001,
                alpha: Math.random() * .6 + .15,
                twinkle: Math.random() * Math.PI * 2
            }));

            G.bgLines = Array.from({ length: 6 }, (_, i) => ({
                y: (i + 1) / 7, speed: .0004 + i * .0002, alpha: .04 + i * .01
            }));

            const K = {};
            keydownListener = e => {
                K[e.code] = true;
                if (e.code === 'Space' && G.running && !G.over && !G.won) { e.preventDefault(); shoot(); }
                if ((e.code === 'ArrowLeft' || e.code === 'ArrowRight') && G.running) e.preventDefault();
            };
            document.addEventListener('keydown', keydownListener);
            keyupListener = e => { K[e.code] = false; };
            document.addEventListener('keyup', keyupListener);

            mousemoveListener2 = e => {
                if (!G.running || G.over || G.won) return;
                const rect = cv.getBoundingClientRect();
                G.shooter.x = (e.clientX - rect.left) / cv.width;
                G.shooter.x = Math.max(.04, Math.min(.96, G.shooter.x));
            };
            cv.addEventListener('mousemove', mousemoveListener2);
            clickListener = () => { if (G.running && !G.over && !G.won) shoot(); };
            cv.addEventListener('click', clickListener);

            let mL = false, mR = false;
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

            function waveConfig(w) {
                const configs = [
                    { count: 6, speed: [.0012, .0018], rows: 2, cols: 3, type: 'basic', pts: 10 },
                    { count: 10, speed: [.0015, .0022], rows: 2, cols: 5, type: 'basic', pts: 10 },
                    { count: 9, speed: [.0018, .0025], rows: 3, cols: 3, type: 'zigzag', pts: 15 },
                    { count: 8, speed: [.0012, .0018], rows: 2, cols: 4, type: 'tank', pts: 25 },
                    { count: 14, speed: [.002, .003], rows: 2, cols: 7, type: 'fast', pts: 20 },
                    { count: 12, speed: [.0018, .0026], rows: 3, cols: 4, type: 'mixed', pts: 20 },
                    { count: 16, speed: [.0022, .003], rows: 4, cols: 4, type: 'mixed', pts: 30 },
                    { count: 1, speed: [.0008, .001], rows: 1, cols: 1, type: 'boss', pts: 500 },
                ];
                return configs[Math.min(w - 1, configs.length - 1)];
            }

            function spawnWave() {
                const cfg = waveConfig(G.wave);
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

            let lastShot = 0;
            function shoot() {
                const now = Date.now();
                if (now - lastShot < 220) return;
                lastShot = now;
                const sx = G.shooter.x * cv.width;
                const sy = cv.height - 40;
                G.bullets.push({ x: sx, y: sy, vy: -cv.height * .018, r: 4, life: 1 });
                spawnFX(sx, sy, P.accent, 5, 'spark');
            }

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

            function maybeDropPowerup(x, y) {
                if (Math.random() < .12) {
                    G.powerups.push({ x: x / cv.width, y: y / cv.height, vy: .003, type: 'shield', life: 600 });
                }
                if (Math.random() < .08) {
                    G.powerups.push({ x: x / cv.width, y: y / cv.height, vy: .003, type: 'rapid', life: 600 });
                }
            }

            function update() {
                if (!G.running || G.over || G.won) return;
                G.frame++;
                G.scanline = (G.scanline + 1.2) % cv.height;

                if (G.waveBreak) {
                    G.waveBreakTimer--;
                    if (G.waveBreakTimer <= 0) { G.waveBreak = false; G.wave++; spawnWave(); updateHUD(); }
                    return;
                }

                if (G.bugs.length === 0 && !G.waveBreak) {
                    if (G.wave >= G.maxWaves) { endGame(true); return; }
                    G.waveBreak = true;
                    G.waveBreakTimer = 120;
                    addText(cv.width / 2, cv.height / 2, '✅ Wave ' + G.wave + ' cleared!', P.accent);
                }

                const sh = G.shooter;
                if (K['ArrowLeft'] || mL) sh.x = Math.max(.04, sh.x - sh.speed);
                if (K['ArrowRight'] || mR) sh.x = Math.min(.96, sh.x + sh.speed);

                G.stars.forEach(s => {
                    s.y += s.speed;
                    s.twinkle += .02;
                    if (s.y > 1) s.y = 0;
                });

                G.bgLines.forEach(l => {
                    l.y += l.speed;
                    if (l.y > 1) l.y = 0;
                });

                G.bullets.forEach((b, i) => {
                    b.y += b.vy;
                    if (b.y < -10) G.bullets.splice(i, 1);
                });

                G.bugs.forEach((bug, bi) => {
                    if (bug.type === 'boss') {
                        bug.phase += .02;
                        bug.x += Math.sin(bug.phase) * .004;
                        bug.y += bug.vy || .001;
                        bug.x = Math.max(.07, Math.min(.93, bug.x));
                        if (G.frame % 90 === 0) {
                            spawnFX(bug.x * cv.width, bug.y * cv.height, P.warn, 8, 'burst');
                        }
                    } else {
                        bug.y += bug.vy;
                        bug.wobble += .04;
                        bug.x += bug.vx;
                        bug.angle += .02;
                        if (bug.x < .05 || bug.x > .95) bug.vx *= -1;
                    }

                    if (bug.y > 1.02) {
                        G.bugs.splice(bi, 1);
                        G.lives--;
                        updateHUD();
                        spawnFX(bug.x * cv.width, cv.height - 20, P.warn, 15, 'burst');
                        addText(cv.width / 2, cv.height * .6, '🛑 -1 Life!', P.warn);
                        if (G.lives <= 0) { endGame(false); return; }
                    }
                });

                G.bullets.forEach((b, bi) => {
                    G.bugs.forEach((bug, bgi) => {
                        const bx = b.x, by = b.y;
                        const ex = bug.x * cv.width, ey = bug.y * cv.height;
                        const hw = bug.size / 2 + 6;
                        if (bx > ex - hw && bx < ex + hw && by > ey - hw && by < ey + hw) {
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
                                spawnFX(ex, ey, P.warn, 6, 'spark');
                            }
                            updateHUD();
                        }
                    });
                });

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

                G.particles.forEach((p, i) => {
                    p.x += p.vx; p.y += p.vy; p.vy += .1; p.life -= p.decay;
                    if (p.life <= 0) G.particles.splice(i, 1);
                });

                G.debris.forEach((d, i) => {
                    d.x += d.vx; d.y += d.vy; d.life -= .018;
                    if (d.life <= 0) G.debris.splice(i, 1);
                });
            }

            function drawBg() {
                const W = cv.width, H = cv.height;
                const grd = cx.createLinearGradient(0, 0, 0, H);
                grd.addColorStop(0, '#030609');
                grd.addColorStop(.5, '#060c14');
                grd.addColorStop(1, '#080d17');
                cx.fillStyle = grd;
                cx.fillRect(0, 0, W, H);

                cx.strokeStyle = P.grid;
                cx.lineWidth = 1;
                for (let x = 0; x < W; x += 50) { cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x, H); cx.stroke(); }
                for (let y = 0; y < H; y += 50) { cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); }

                G.bgLines.forEach(l => {
                    cx.globalAlpha = l.alpha;
                    cx.strokeStyle = P.accent;
                    cx.lineWidth = 1;
                    cx.beginPath(); cx.moveTo(0, l.y * H); cx.lineTo(W, l.y * H); cx.stroke();
                });
                cx.globalAlpha = 1;

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

                cx.globalAlpha = .03;
                cx.fillStyle = P.accent;
                cx.fillRect(0, G.scanline - 1, W, 2);
                cx.globalAlpha = 1;

                const gbGrd = cx.createLinearGradient(0, H - 14, 0, H);
                gbGrd.addColorStop(0, 'rgba(100,220,180,0.18)');
                gbGrd.addColorStop(1, 'rgba(100,220,180,0.04)');
                cx.fillStyle = gbGrd;
                cx.fillRect(0, H - 14, W, 14);
                cx.shadowColor = P.accent; cx.shadowBlur = 10;
                cx.strokeStyle = P.accent; cx.lineWidth = 1.5;
                cx.beginPath(); cx.moveTo(0, H - 14); cx.lineTo(W, H - 14); cx.stroke();
                cx.shadowBlur = 0;

                const serverX = [W * .1, W * .3, W * .5, W * .7, W * .9];
                serverX.forEach(sx => {
                    cx.font = '11px serif'; cx.textAlign = 'center';
                    cx.globalAlpha = .5;
                    cx.fillText('🖥️', sx, H - 2);
                    cx.globalAlpha = 1;
                });

                if (G.waveBreak) {
                    cx.font = 'bold 18px "Syne", sans-serif';
                    cx.textAlign = 'center'; cx.fillStyle = P.accent;
                    cx.shadowColor = P.accent; cx.shadowBlur = 12;
                    cx.fillText('⚡ WAVE ' + (G.wave + 1) + ' INCOMING...', W / 2, H / 2);
                    cx.shadowBlur = 0;
                }

                G.powerups.forEach(p => {
                    const px = p.x * W, py = p.y * H;
                    cx.font = '20px serif'; cx.textAlign = 'center';
                    cx.globalAlpha = Math.min(1, p.life / 60);
                    cx.shadowColor = p.type === 'shield' ? P.warn : P.gold;
                    cx.shadowBlur = 12;
                    cx.strokeStyle = p.type === 'shield' ? P.warn : P.gold;
                    cx.lineWidth = 1.5;
                    cx.beginPath(); cx.arc(px, py, 14, 0, Math.PI * 2); cx.stroke();
                    cx.shadowBlur = 0;
                    cx.fillText(p.type === 'shield' ? '❤️' : '⚡', px, py + 7);
                    cx.globalAlpha = 1;
                });

                G.bugs.forEach(bug => {
                    const bx = bug.x * W, by = bug.y * H;

                    if (bug.type === 'boss') {
                        const grad = cx.createRadialGradient(bx, by, 0, bx, by, 50);
                        grad.addColorStop(0, 'rgba(251,191,36,.15)');
                        grad.addColorStop(1, 'transparent');
                        cx.fillStyle = grad; cx.beginPath(); cx.arc(bx, by, 50, 0, Math.PI * 2); cx.fill();
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
                        cx.save();
                        cx.translate(bx, by);
                        cx.rotate(Math.sin(bug.wobble) * .2);
                        if (bug.type === 'tank') {
                            cx.shadowColor = P.warn; cx.shadowBlur = 12;
                        }
                        cx.font = bug.size + 'px serif'; cx.textAlign = 'center';
                        cx.fillText(bug.emoji, 0, bug.size * .38);
                        cx.shadowBlur = 0;
                        if (bug.hp === 2) {
                            cx.fillStyle = P.warn;
                            cx.beginPath(); cx.arc(8, -bug.size / 2, 4, 0, Math.PI * 2); cx.fill();
                        }
                        cx.restore();
                    }
                });

                G.bullets.forEach(b => {
                    cx.shadowColor = P.accent; cx.shadowBlur = 14;
                    const bGrd = cx.createLinearGradient(b.x, b.y, b.x, b.y + 16);
                    bGrd.addColorStop(0, P.accent);
                    bGrd.addColorStop(1, 'transparent');
                    cx.fillStyle = bGrd;
                    cx.beginPath(); cx.ellipse(b.x, b.y, 3, 10, 0, 0, Math.PI * 2); cx.fill();
                    cx.shadowBlur = 0;
                });

                const sx = G.shooter.x * W;
                const sy = H - 32;
                cx.shadowColor = P.accent; cx.shadowBlur = 18;
                cx.fillStyle = P.accent;
                cx.beginPath();
                cx.moveTo(sx, sy - 16);
                cx.lineTo(sx - 20, sy + 8);
                cx.lineTo(sx - 8, sy + 2);
                cx.lineTo(sx, sy + 8);
                cx.lineTo(sx + 8, sy + 2);
                cx.lineTo(sx + 20, sy + 8);
                cx.closePath(); cx.fill();
                cx.fillStyle = P.accent2;
                cx.beginPath(); cx.ellipse(sx, sy - 4, 5, 7, 0, 0, Math.PI * 2); cx.fill();
                cx.shadowColor = P.accent; cx.shadowBlur = 8;
                cx.fillStyle = 'rgba(100,220,180,.6)';
                cx.beginPath(); cx.ellipse(sx, sy + 12, 6, 4, 0, 0, Math.PI * 2); cx.fill();
                cx.shadowBlur = 0;

                G.particles.forEach(p => {
                    cx.globalAlpha = Math.max(0, p.life);
                    cx.fillStyle = p.color;
                    cx.shadowColor = p.color; cx.shadowBlur = 6;
                    cx.beginPath(); cx.arc(p.x, p.y, Math.max(.1, p.r * p.life), 0, Math.PI * 2); cx.fill();
                    cx.shadowBlur = 0;
                });
                cx.globalAlpha = 1;

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

                if (G.running && !G.over && !G.won) {
                    cx.fillStyle = 'rgba(255,255,255,.04)';
                    cx.fillRect(0, 0, W, 3);
                    const wpGrd = cx.createLinearGradient(0, 0, W, 0);
                    wpGrd.addColorStop(0, P.accent); wpGrd.addColorStop(1, P.accent2);
                    cx.fillStyle = wpGrd;
                    cx.fillRect(0, 0, W * Math.min(1, (G.wave - 1) / G.maxWaves), 3);
                }
            }

            function updateHUD() {
                document.getElementById('g2-score').textContent = G.score;
                document.getElementById('g2-wave').textContent = G.wave;
                document.getElementById('g2-lives').textContent = '❤️'.repeat(G.lives) + '🖤'.repeat(3 - G.lives);
            }

            function loop() {
                update(); drawFrame();
                rafId = requestAnimationFrame(loop);
            }

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
                drawFrame();

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

            drawBg(); drawFrame();

        })();

        // Cleanup for global listeners to avoid memory leaks when re-rendering
        return () => {
            window.removeEventListener('scroll', scrollListener);
            hamburger.removeEventListener('click', hamburgerClick);
            window.removeEventListener('scroll', scrollSpy);
            window.removeEventListener('mousemove', mouseMoveListener);
            document.querySelectorAll('a[href^="#"]').forEach(a => {
                a.removeEventListener('click', smoothScroll);
            });
            if (rafId) cancelAnimationFrame(rafId);
            if (resizeListener) window.removeEventListener('resize', resizeListener);
            if (keydownListener) document.removeEventListener('keydown', keydownListener);
            if (keyupListener) document.removeEventListener('keyup', keyupListener);
            if (mousemoveListener2) {
                const cv = document.getElementById('g2-canvas');
                if (cv) cv.removeEventListener('mousemove', mousemoveListener2);
            }
            if (clickListener) {
                const cv = document.getElementById('g2-canvas');
                if (cv) cv.removeEventListener('click', clickListener);
            }
        };
    }, []);

    return (
        <div>
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <Projects />

            {/* CERTIFICATIONS */}
            <section id="certifications">
                <div className="section-inner">
                    <div className="section-label reveal">04 / Certifications</div>
                    <h2 className="section-title reveal">Credentials</h2>
                    <div className="cert-grid">
                        <div className="cert-card reveal">
                            <div className="cert-img-wrap">
                                <img
                                    src="images/certificate.jpeg"
                                    alt="CETPA Data Engineering Certificate" />
                                <div className="cert-overlay">
                                    <span className="cert-badge-overlay">✓ Verified</span>
                                </div>
                            </div>
                            <div className="cert-body">
                                <div className="cert-issuer">CETPA Infotech · A CMMI Level 5 Company</div>
                                <div className="cert-title">Training Completion Certificate — "Data Engineering"</div>
                                <div className="cert-meta">
                                    <div className="cert-meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        Started: 20 August 2025
                                    </div>
                                    <div className="cert-meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        Duration: 6 Months
                                    </div>
                                </div>
                                <div className="cert-partners">
                                    <span className="cert-partner-tag">Wipro Partner</span>
                                    <span className="cert-partner-tag">Google Partner</span>
                                    <span className="cert-partner-tag">Microsoft Partner</span>
                                    <span className="cert-partner-tag">Panasonic</span>
                                    <span className="cert-partner-tag">DDU-GKY</span>
                                </div>
                            </div>
                        </div>

                        <div className="cert-info-card reveal">
                            <div className="cert-info-header">
                                <div className="cert-info-icon">🏆</div>
                                <div>
                                    <div className="cert-info-title">Data Engineering</div>
                                    <div className="cert-info-subtitle">Six Months Industrial Training</div>
                                </div>
                            </div>

                            <div className="cert-detail-row">
                                <div className="cdr-icon">🏢</div>
                                <div>
                                    <div className="cdr-label">Issuing Organization</div>
                                    <div className="cdr-value">CETPA Infotech & Infogain Collaboration</div>
                                </div>
                            </div>
                            <div className="cert-detail-row">
                                <div className="cdr-icon">📋</div>
                                <div>
                                    <div className="cdr-label">Topics Covered</div>
                                    <div className="cdr-value">Distributed Data Processing · PySpark Workflows · Azure Databricks · Cloud Pipeline Development · ETL · Delta Lake</div>
                                </div>
                            </div>
                            <div className="cert-detail-row">
                                <div className="cdr-icon">🎯</div>
                                <div>
                                    <div className="cdr-label">Accreditation</div>
                                    <div className="cdr-value">CMMI Level 5 Certified Company · Industry-focused curriculum</div>
                                </div>
                            </div>
                            <div className="cert-detail-row">
                                <div className="cdr-icon">👨‍💼</div>
                                <div>
                                    <div className="cdr-label">Authorized By</div>
                                    <div className="cdr-value">Mr. Anil Kumar Singh (Director) · Mr. Vikas Kalra (Director)</div>
                                </div>
                            </div>

                            <div className="cert-verify">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Reg: ETAzur151120256M1412812 · Verify at cetpainfotech.com
                            </div>

                            <div>
                                <div className="cert-partners-label">Industry Partners</div>
                                <div className="cert-partners-row">
                                    <span className="cert-partner-tag" style={{ background: 'rgba(100,220,180,.06)', borderColor: 'rgba(100,220,180,.2)', color: 'var(--accent2)' }}>🔵 Wipro</span>
                                    <span className="cert-partner-tag" style={{ background: 'rgba(100,220,180,.06)', borderColor: 'rgba(100,220,180,.2)', color: 'var(--accent2)' }}>🔴 Google</span>
                                    <span className="cert-partner-tag" style={{ background: 'rgba(100,220,180,.06)', borderColor: 'rgba(100,220,180,.2)', color: 'var(--accent2)' }}>🪟 Microsoft</span>
                                    <span className="cert-partner-tag" style={{ background: 'rgba(100,220,180,.06)', borderColor: 'rgba(100,220,180,.2)', color: 'var(--accent2)' }}>📺 Panasonic</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* RESUME */}
            <section id="resume">
                <div className="section-inner">
                    <div className="resume-cta reveal">
                        <div className="resume-text">
                            <h2>Ready to see my full experience?</h2>
                            <p>Download my resume for a complete view of my projects, skills, and certifications.</p>
                        </div>
                        <a href="#" className="btn-primary large">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download Resume
                        </a>
                    </div>
                </div>
            </section>

            <Contact />

            {/* GAME SECTION */}
            <section id="game">
                <div className="section-inner">
                    <div className="section-label reveal">06 / Mini Game</div>
                    <h2 className="section-title reveal">Data Defender <span style={{ color: 'var(--accent)' }}>🎮</span></h2>
                </div>

                <div className="game-outer reveal">
                    <div className="game-left-panel">
                        <div className="game-about-card">
                            <div className="gac-icon">🕹️</div>
                            <h3>Made by Ankit</h3>
                            <p>I love building games alongside data pipelines. This is <strong>Data Defender</strong> — shoot down the incoming bugs before they breach your server!</p>
                            <div className="gac-tech-row">
                                <span>Canvas API</span><span>Vanilla JS</span><span>Physics</span>
                            </div>
                        </div>
                        <div className="game-hud-panel">
                            <div className="ghp-row">
                                <div className="ghp-item">
                                    <div className="ghp-val" id="g2-score">0</div>
                                    <div className="ghp-lbl">Score</div>
                                </div>
                                <div className="ghp-item">
                                    <div className="ghp-val" id="g2-wave">1</div>
                                    <div className="ghp-lbl">Wave</div>
                                </div>
                                <div className="ghp-item">
                                    <div className="ghp-val" id="g2-best">0</div>
                                    <div className="ghp-lbl">Best</div>
                                </div>
                            </div>
                            <div className="ghp-lives" id="g2-lives">❤️❤️❤️</div>
                        </div>
                        <div className="game-howto">
                            <div className="ght-title">How to Play</div>
                            <div className="ght-row"><span className="ght-key">←→</span><span>Move shooter</span></div>
                            <div className="ght-row"><span className="ght-key">SPACE</span><span>Fire laser</span></div>
                            <div className="ght-row"><span className="ght-key">Mouse</span><span>Also works!</span></div>
                            <div className="ght-row" style={{ marginTop: '.75rem', fontSize: '.78rem', color: 'var(--text3)' }}>Bugs reach the bottom = lose a life</div>
                        </div>
                    </div>

                    <div className="game-right-panel">
                        <canvas id="g2-canvas"></canvas>
                        <div className="g2-overlay" id="g2-start">
                            <div className="g2ov-emoji">🛡️</div>
                            <div className="g2ov-title">Data Defender</div>
                            <div className="g2ov-sub">Destroy the incoming bugs before they corrupt your data server. Survive all waves to win!</div>
                            <button className="g2-btn" onClick={() => window.g2Start && window.g2Start()}>▶ Launch Defense</button>
                        </div>
                        <div className="g2-overlay hidden" id="g2-over">
                            <div className="g2ov-emoji">💥</div>
                            <div className="g2ov-title">Server Down!</div>
                            <div className="g2ov-score-big" id="g2-final-score">0</div>
                            <div className="g2ov-sub" id="g2-over-msg">The bugs broke through. Redeploy and try again!</div>
                            <button className="g2-btn" onClick={() => window.g2Start && window.g2Start()}>🔄 Redeploy</button>
                        </div>
                        <div className="g2-overlay hidden" id="g2-win">
                            <div className="g2ov-emoji">🏆</div>
                            <div className="g2ov-title">Pipeline Secured!</div>
                            <div className="g2ov-score-big" id="g2-win-score">0</div>
                            <div className="g2ov-sub">You defeated all waves! Your data is safe. True Data Engineer energy 💪</div>
                            <button className="g2-btn" onClick={() => window.g2Start && window.g2Start()}>🎮 Play Again</button>
                        </div>

                        <div className="g2-mobile-ctrl">
                            <button className="g2-mob-btn" id="g2-mob-left">◀</button>
                            <button className="g2-mob-btn g2-fire-btn" id="g2-mob-fire">🔥 FIRE</button>
                            <button className="g2-mob-btn" id="g2-mob-right">▶</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default App;
