const STAR_DRIFT_SPEED = prefersReducedMotion ? 0.005 : 0.05;
const WRAP_PADDING = 180;
const ZODIAC_REPEATS = 2;

function initCanvas() {
    width = canvas.width = Math.floor(window.innerWidth);
    height = canvas.height = Math.floor(window.innerHeight);
    stars = [];
    zodiacGroups = [];

    const divisor = width < 768 ? 25000 : 10000;
    const starFieldWidth = width + WRAP_PADDING * 2;
    const starCount = (starFieldWidth * height) / divisor;
    
    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * starFieldWidth - WRAP_PADDING;
        stars.push(new Star(x, Math.random() * height, false));
    }

    const signs = Object.keys(zodiacData);
    const cols = width < 768 ? 2 : 4;
    
    for (let repeat = 0; repeat < ZODIAC_REPEATS; repeat++) {
        const repeatOffsetX = repeat * width;

        signs.forEach((name, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            
            const centerX = (width / cols) * (col + 0.5) - 50 + repeatOffsetX; 
            const centerY = (height / Math.ceil(signs.length / cols)) * (row + 0.5) - 50;
            
            const baseScale = width < 768 ? 1200 : 800;
            const scale = Math.min(width, height) / baseScale; 

            const pattern = zodiacData[name];
            const zodiacStars = pattern.points.map(p => {
                const s = new Star(centerX + p[0] * scale, centerY + p[1] * scale, true, name);
                stars.push(s);
                return s;
            });
            
            pattern.links.forEach(link => {
                const s1 = zodiacStars[link[0]];
                const s2 = zodiacStars[link[1]];
                if (!s1.connections) s1.connections = [];
                s1.connections.push(s2);
            });

            zodiacGroups.push({
                stars: zodiacStars,
                wrapDistance: width * ZODIAC_REPEATS
            });
        });
    }
}

class Star {
    constructor(x, y, isZodiac, signName = null) {
        this.x = x; this.y = y;
        this.isZodiac = isZodiac;
        this.signName = signName;
        this.size = isZodiac ? (width < 768 ? 1.8 : 2.5) : Math.random() * 1.2 + 0.2;
        this.opacity = Math.random();
        this.blinkSpeed = 0.005 + Math.random() * 0.01;
        this.connections = [];
    }

    draw() {
        this.opacity += this.blinkSpeed;
        if (this.opacity > 1 || this.opacity < 0.2) this.blinkSpeed *= -1;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(this.opacity)})`;
        if (this.isZodiac) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = currentAuraColor; 
        } else { ctx.shadowBlur = 0; }
        
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; 
    }

    update() {
        if (!this.isZodiac) {
            this.x -= STAR_DRIFT_SPEED; 
            if (this.x < -WRAP_PADDING) this.x = width + WRAP_PADDING;
        }
        this.draw();
    }
}

function updateZodiacGroups() {
    zodiacGroups.forEach(group => {
        group.stars.forEach(star => {
            star.x -= STAR_DRIFT_SPEED;
        });

        const rightEdge = Math.max(...group.stars.map(star => star.x));
        if (rightEdge < -WRAP_PADDING) {
            group.stars.forEach(star => {
                star.x += group.wrapDistance;
            });
        }
    });
}

function drawLines() {
    stars.forEach(s1 => {
        if (s1.isZodiac && s1.connections.length > 0) {
            s1.connections.forEach(s2 => {
                if (s1.x < -50 || s1.x > width + 50 || s1.y < -50 || s1.y > height + 50) return;
                if (s2.x < -50 || s2.x > width + 50 || s2.y < -50 || s2.y > height + 50) return;

                let mdist = 1000;
                if (mouse.x != null) {
                    let dx = s1.x - mouse.x, dy = s1.y - mouse.y;
                    mdist = Math.sqrt(dx*dx + dy*dy);
                }
                ctx.globalAlpha = mdist < 180 ? 0.9 : 0.35;
                ctx.strokeStyle = currentAuraColor;
                ctx.lineWidth = mdist < 180 ? 1.5 : 0.8;
                ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
            });
        }
        if (!s1.isZodiac && mouse.x != null) {
            let dx = s1.x - mouse.x, dy = s1.y - mouse.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 120) {
                stars.forEach(s2 => {
                    if (s1 === s2 || s2.isZodiac) return;
                    let d2x = s1.x - s2.x, d2y = s1.y - s2.y;
                    if (Math.sqrt(d2x*d2x + d2y*d2y) < 40) {
                        ctx.globalAlpha = (1 - dist/120) * 0.2;
                        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 0.3;
                        ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
                    }
                });
            }
        }
    });
    ctx.globalAlpha = 1;
}

let animationId;
function animate() {
    ctx.clearRect(0, 0, width, height);
    updateZodiacGroups();
    stars.forEach(s => s.update());
    drawLines();
    animationId = requestAnimationFrame(animate);
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animate();
    }
});

window.addEventListener('resize', initCanvas);
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('touchstart', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, {passive: true});
window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, {passive: true});
window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

initCanvas();
animate();

// ==========================================
// 1. ASTRO TICKER SYSTEM
// ==========================================
function initAstroTicker() {
    const tickerContainer = document.getElementById('astro-ticker-content');
    if (!tickerContainer) return; 

    let tickerHtml = '';
    Object.values(zodiacData).forEach(s => {
        tickerHtml += `
            <span class="ticker-item" style="border-color: ${s.aura}">
                <span class="ticker-icon" style="color: ${s.aura}">${s.icon}</span>
                <strong>${s.name.toUpperCase()}:</strong> 
                Ruler: <span style="color: var(--glow-color)">${s.planet}</span> | 
                Element: ${s.element} ⟡
            </span>
        `;
    });

    tickerContainer.innerHTML = tickerHtml + tickerHtml;
}

document.addEventListener('DOMContentLoaded', initAstroTicker);

const omenTextEl = document.getElementById('omenText');
if (omenTextEl) {
    const omens = [
        "The position of Venus suggests harmony in upcoming endeavors.",
        "Solar winds are calm; excellent energy for analytical focus and structured coding.",
        "High planetary resonance today. Intuitive decision-making is heavily favored.",
        "Mercury aligns with Jupiter: expansive communication and clarity in negotiations.",
        "Lunar energy shifts toward Earth signs—ground your ideas into practical projects today.",
        "A rare celestial alignment enhances your creative potential this evening.",
        "The current phase of the moon brings clarity to unresolved emotional matters.",
        "Mars enters a dynamic phase—bold actions will be rewarded today.",
        "Saturn's influence promotes discipline; a great time to organize your thoughts.",
        "Neptune casts a dreamy aura, heightening intuition and spiritual awareness."
    ];
    const now = new Date();
    const nyTimeStr = now.toLocaleString("en-US", { timeZone: "America/New_York" });
    const nyNow = new Date(nyTimeStr);
    const startOfYear = new Date(nyNow.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((nyNow - startOfYear) / (1000 * 60 * 60 * 24));
    
    omenTextEl.innerText = omens[dayOfYear % omens.length];
}

