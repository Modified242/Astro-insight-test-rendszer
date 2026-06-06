// ==========================================
// AUDIO SYSTEM 
// ==========================================
const sfxCyber = new Audio('https://actions.google.com/sounds/v1/science_fiction/sci_fi_computer_bleep.ogg');
const sfxMystic = new Audio('https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg');
const sfxSuccess = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg');

function playSound(type) {
    // Звуки вимкнено за рішенням команди
}

// ==========================================
// MASTER DATABASE (UI, Coordinates, & Astro Data)
// ==========================================
const zodiacData = {
    Aries: { 
        name: 'Aries', icon: '♈', motto: 'I Am', 
        aura: '#ef4444', colorName: 'Crimson Red',
        planet: 'Mars', element: 'Fire', energy: 'Dynamic, leading, spark',
        points: [[10, 80], [25, 60], [40, 35], [45, 10], [75, 50], [95, 70]],
        links: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]]
    },
    Taurus: { 
        name: 'Taurus', icon: '♉', motto: 'I Have', 
        aura: '#22c55e', colorName: 'Emerald Green',
        planet: 'Venus', element: 'Earth', energy: 'Stable, sensual, confident',
        points: [[10, 25], [30, 10], [45, 30], [45, 45], [30, 50], [35, 60], [50, 55], [45, 70], [55, 80], [75, 100], [75, 45], [90, 45]],
        links: [[0, 4], [1, 2], [2, 3], [3, 4], [3, 6], [4, 5], [5, 7], [6, 7], [3, 10], [10, 11], [7, 8], [8, 9]]
    },
    Gemini: { 
        name: 'Gemini', icon: '♊', motto: 'I Think', 
        aura: '#eab308', colorName: 'Golden Yellow',
        planet: 'Mercury', element: 'Air', energy: 'Intellectual, quick, mutable',
        points: [[25, 10], [25, 28], [10, 25], [20, 45], [30, 65], [20, 85], [40, 85], [40, 30], [60, 32], [90, 35], [55, 20], [45, 8], [65, 55], [55, 75], [80, 70], [95, 90]],
        links: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [4, 6], [1, 7], [7, 8], [8, 9], [8, 10], [10, 11], [8, 12], [12, 13], [12, 14], [14, 15]]
    },
    Cancer: { 
        name: 'Cancer', icon: '♋', motto: 'I Feel', 
        aura: '#cbd5e1', colorName: 'Silver',
        planet: 'Moon', element: 'Water', energy: 'Intuitive, empathetic, soft',
        points: [[50, 10], [55, 35], [50, 50], [20, 70], [80, 80]],
        links: [[0, 1], [1, 2], [2, 3], [2, 4]]
    },
    Leo: { 
        name: 'Leo', icon: '♌', motto: 'I Will', 
        aura: '#f59e0b', colorName: 'Radiant Gold',
        planet: 'Sun', element: 'Fire', energy: 'Majestic, creative, solar',
        points: [[10, 80], [30, 60], [40, 80], [75, 80], [80, 60], [70, 40], [60, 25], [85, 10], [95, 20]],
        links: [[0, 1], [1, 2], [0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]]
    },
    Virgo: { 
        name: 'Virgo', icon: '♍', motto: 'I Analyze', 
        aura: '#d4a373', colorName: 'Earthy Brown',
        planet: 'Mercury', element: 'Earth', energy: 'Analytical, orderly, pure',
        points: [[5, 60], [20, 50], [35, 45], [50, 35], [40, 20], [65, 40], [75, 35], [90, 25], [85, 10], [70, 15], [55, 55], [60, 75], [40, 75], [25, 65], [10, 75]],
        links: [[0, 1], [1, 2], [1, 13], [13, 14], [13, 12], [2, 3], [3, 4], [3, 5], [2, 10], [5, 10], [10, 11], [5, 6], [6, 7], [7, 8], [8, 9]]
    },
    Libra: { 
        name: 'Libra', icon: '♎', motto: 'I Balance', 
        aura: '#93c5fd', colorName: 'Pastel Blue',
        planet: 'Venus', element: 'Air', energy: 'Harmonious, aesthetic, diplomatic',
        points: [[10, 80], [20, 65], [35, 50], [25, 30], [50, 10], [85, 30], [75, 55], [90, 70]],
        links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 5], [5, 6], [6, 7]]
    },
    Scorpio: { 
        name: 'Scorpio', icon: '♏', motto: 'I Desire', 
        aura: '#991b1b', colorName: 'Deep Red',
        planet: 'Pluto', element: 'Water', energy: 'Intense, transformational, mysterious',
        points: [[35, 35], [20, 45], [10, 55], [25, 70], [45, 70], [60, 60], [65, 45], [75, 35], [80, 25], [85, 20], [90, 5], [100, 15], [95, 35]],
        links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [9, 11], [9, 12]]
    },
    Sagittarius: { 
        name: 'Sagittarius', icon: '♐', motto: 'I See', 
        aura: '#a855f7', colorName: 'Deep Purple',
        planet: 'Jupiter', element: 'Fire', energy: 'Optimistic, expansive, philosophical',
        points: [[50, 70], [0, 40], [40, 35], [10, 10], [10, -10], [20, -40], [40, -50], [60, -30], [70, -55], [68, -80], [80, -35], [90, -25], [70, -17], [110, -30], [135, -35], [117, -10], [140, -10], [105, 15], [125, 35]],
        links: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [7, 10], [10, 11], [11, 12], [11, 13], [13, 14], [13, 15], [15, 16], [15, 17], [17, 18]]
    },
    Capricorn: { 
        name: 'Capricorn', icon: '♑', motto: 'I Use', 
        aura: '#475569', colorName: 'Dark Grey',
        planet: 'Saturn', element: 'Earth', energy: 'Disciplined, ambitious, grounded',
        points: [[90, 15], [85, 25], [80, 35], [50, 40], [40, 38], [20, 35], [10, 35], [35, 65], [55, 75], [65, 65]],
        links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 2]]
    },
    Aquarius: { 
        name: 'Aquarius', icon: '♒', motto: 'I Know', 
        aura: '#06b6d4', colorName: 'Electric Blue',
        planet: 'Uranus', element: 'Air', energy: 'Visionary, eccentric, independent',
        points: [[5, 55], [25, 35], [35, 25], [10, -5], [40, -40], [65,-40], [70,-10], [90, -20], [65, 15], [75, 55], [102, 10], [125, 35]],
        links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [7, 10], [10, 11]]
    },
    Pisces: { 
        name: 'Pisces', icon: '♓', motto: 'I Believe', 
        aura: '#14b8a6', colorName: 'Sea Green',
        planet: 'Neptune', element: 'Water', energy: 'Dreamy, compassionate, mystic',
        points: [[80, 40], [90, 35], [95, 25], [85, 20], [75, 30], [65, 33], [55, 40], [45, 43], [35, 48], [25, 52], [15, 65], [22, 40], [18, 25], [8, 20], [13, 10]],
        links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 12]]
    }
};

const localDb = {
    Insight: [
        "The stars align to grant you clarity today. Trust your intuition over pure logic.",
        "A celestial shift might bring a minor miscommunication. Speak with intention and grace.",
        "Your planetary ruler is well-aspected. A perfect day to plant the seeds for future success."
    ],
    weekly: [
        "This week's lunar phase emphasizes emotional growth. Seek harmony in your relationships.",
        "A dynamic transit brings rapid changes. Keep your mind open and adapt to the currents.",
        "The cosmos advises patience. Focus on foundational work rather than immediate results."
    ],
    monthly: [
        "This lunar cycle heralds a period of deep transformation. Shed what no longer serves your spirit.",
        "Your solar return brings radiant energy. Step into the spotlight and claim your power.",
        "A major planetary alignment suggests it is time to realign your physical space with your spiritual goals."
    ]
};

// ==========================================
// BACKGROUND CANVAS (CONSTELLATIONS & TOUCH)
// ==========================================
const canvas = document.getElementById('starlight-canvas');
const ctx = canvas.getContext('2d');
let width, height, stars = [];
let currentAuraColor = '#d4af37'; 
const mouse = { x: null, y: null };

function initCanvas() {
    // Pixel Snapping: округлюємо розміри полотна до цілих чисел
    width = canvas.width = Math.floor(window.innerWidth);
    height = canvas.height = Math.floor(window.innerHeight);
    stars = [];

    // ОПТИМІЗАЦІЯ ДЛЯ СМАРТФОНІВ (Зменшуємо кількість зірок для батареї)
    const divisor = width < 768 ? 25000 : 10000;
    const starCount = (width * height) / divisor;
    
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star(Math.random() * width, Math.random() * height, false));
    }

    const signs = Object.keys(zodiacData);
    const cols = width < 768 ? 2 : 4; // 2 колонки сузір'їв на телефонах, 4 на ПК
    
    signs.forEach((name, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        
        const centerX = (width / cols) * (col + 0.5) - 50; 
        const centerY = (height / Math.ceil(signs.length / cols)) * (row + 0.5) - 50;
        
        // Масштабування для різних екранів
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
    });
}

class Star {
    constructor(x, y, isZodiac, signName = null) {
        this.x = x; this.y = y;
        this.isZodiac = isZodiac;
        this.signName = signName;
        // На телефонах зірки сузір'їв трішки менші
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
        this.x -= 0.05; 
        if (this.x < -150) this.x = width + 150;
        this.draw();
    }
}

function drawLines() {
    stars.forEach(s1 => {
        if (s1.isZodiac && s1.connections.length > 0) {
            s1.connections.forEach(s2 => {
                
                // --- ДОДАНИЙ ЗАПОБІЖНИК (ВІДСІКАННЯ ПОЗА ЕКРАНОМ) ---
                if (s1.x < -50 || s1.x > width + 50 || s1.y < -50 || s1.y > height + 50) return;
                if (s2.x < -50 || s2.x > width + 50 || s2.y < -50 || s2.y > height + 50) return;
                // ---------------------------------------------------

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

function animate() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(s => s.update());
    drawLines();
    requestAnimationFrame(animate);
}

// Події ПК (Мишка)
window.addEventListener('resize', initCanvas);
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

// Події МОБІЛЬНІ (Тачскрін)
window.addEventListener('touchstart', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, {passive: true});
window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, {passive: true});
window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

initCanvas();
animate();

// ==========================================
// SYSTEM CORE (UI & RESONANCE)
// ==========================================
const coreGrid = document.getElementById('zodiacGrid');
const sel1 = document.getElementById('sign1');
const sel2 = document.getElementById('sign2');

// ЗАПОБІЖНИК: Генеруємо сітку знаків тільки якщо вона є на сторінці (на index.html)
if (coreGrid && sel1 && sel2) {
    Object.values(zodiacData).forEach(s => {
        let coreCard = document.createElement('div'); coreCard.className = 'card';
        coreCard.innerHTML = `<div class="icon" style="color:${s.aura}">${s.icon}</div><h3>${s.name}</h3><span class="sign-motto">"${s.motto}"</span>`;
        
        coreCard.onclick = () => { 
            setAura(s.aura); 
            playSound('mystic'); 
            openModal(s.name); 
        };
        coreGrid.appendChild(coreCard);
        sel1.add(new Option(s.name, s.name));
        sel2.add(new Option(s.name, s.name));
    });
}

const omenTextEl = document.getElementById('omenText');
if (omenTextEl) {
    omenTextEl.innerText = "The position of Venus suggests harmony in upcoming endeavors.";
}

function setAura(hexColor) {
    document.documentElement.style.setProperty('--glow-color', hexColor);
    currentAuraColor = hexColor; 
}

function resetAura() {
    setAura('#d4af37'); 
    playSound('mystic');
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

// ==========================================
// JSON MODAL LOGIC (З FailSafe)
// ==========================================
async function openModal(sign) {
    // Отримуємо всі фіксовані дані для обраного знака
    const zData = zodiacData[sign];

    document.getElementById('signTitle').innerText = sign;
    document.getElementById('saveBtn').style.display = 'inline-block';
    document.getElementById('saveBtn').innerText = "Inscribe to Grimoire";
    document.getElementById('fortuneModal').style.display = "block";
    
    // Заповнюємо нові астрологічні поля
    document.getElementById('modalPlanet').innerText = zData.planet;
    document.getElementById('modalElement').innerText = zData.element;
    document.getElementById('modalEnergy').innerText = `"${zData.energy}"`;

    // Статичний колір аури з бази
    document.getElementById('luckyColorBox').style.backgroundColor = zData.aura;
    document.getElementById('luckyColorBox').style.color = zData.aura;
    document.getElementById('luckyColorName').innerText = zData.colorName;

    // Щасливі числа залишаємо випадковими (магія моменту)
    document.getElementById('luckyNumbers').innerText = Array.from({length: 3}, () => Math.floor(Math.random() * 9) + 1).join(' - ');

    try { switchTab(null, 'Insight'); } catch(e) {} 
    
    document.getElementById('fortuneTextInsight').innerText = "Consulting the celestial charts...";
    document.getElementById('fortuneTextWeekly').innerText = "Calculating planetary transits...";
    document.getElementById('fortuneTextMonthly').innerText = "Reading the lunar cycles...";

    try {
        const response = await fetch('horoszkop.json');
        if (!response.ok) throw new Error('File not found');
        const data = await response.json();
        
        document.getElementById('fortuneTextInsight').innerText = data.zodiacs[sign].Insight;
        document.getElementById('fortuneTextWeekly').innerText = data.zodiacs[sign].weekly;
        document.getElementById('fortuneTextMonthly').innerText = data.zodiacs[sign].monthly;
    } catch (error) {
        console.log("JSON offline, reverting to local mystical database...");
        document.getElementById('fortuneTextInsight').innerText = localDb.Insight[Math.floor(Math.random() * localDb.Insight.length)] + "\n\n(Drawn from local grimoire)";
        document.getElementById('fortuneTextWeekly').innerText = localDb.weekly[Math.floor(Math.random() * localDb.weekly.length)];
        document.getElementById('fortuneTextMonthly').innerText = localDb.monthly[Math.floor(Math.random() * localDb.monthly.length)];
    }
}

function switchTab(event, tabName) {
    playSound('mystic');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const targetBtn = event ? event.target : document.querySelector(`.tab-btn[onclick*="${tabName}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active-content'));
    document.getElementById(`tab-${tabName}`).classList.add('active-content');
}

// ==========================================
// WIDGETS
// ==========================================
function checkCompatibility() {
    playSound('mystic');
    const score = Math.floor(Math.random() * 40) + 60; 
    let message = score > 85 ? "A celestial match written in the stars." : score > 70 ? "Strong alignment, with room for growth." : "Challenging aspects. Patience is required.";
    document.getElementById('compResult').innerHTML = `Harmonic Resonance: <strong>${score}%</strong> <br><br> <span style="font-size:0.9em; color:var(--text-muted)">${message}</span>`;
}

function drawTarot() {
    const tarotContainer = document.getElementById('tarotResult');
    // ЗАПОБІЖНИК: Малюємо Таро тільки якщо на сторінці є блок для них
    if (!tarotContainer) return;

    playSound('mystic');
    const cards = ["The Magician", "The High Priestess", "The Empress", "Wheel of Fortune", "The Star", "The Moon", "The Sun"];
    const shuffled = cards.sort(() => 0.5 - Math.random()).slice(0, 3);
    const layout = ["Past", "Present", "Future"];
    let html = "";
    for(let i=0; i<3; i++) {
        html += `<div class="tarot-card" onclick="this.classList.toggle('flipped'); playSound('mystic')"><div class="tarot-inner"><div class="tarot-front">✧</div><div class="tarot-back"><div class="tarot-title">${layout[i]}</div><div class="tarot-name">${shuffled[i]}</div></div></div></div>`;
    }
    tarotContainer.innerHTML = html;
}
drawTarot();

function analyzeUsername() {
    playSound('mystic');
    const name = document.getElementById('usernameInput').value.trim();
    if (!name) return;
    const powers = ["Aura Healer", "Truth Seeker", "Dream Weaver", "Star Walker", "Spirit Guide"];
    let hash = 0; for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    document.getElementById('analyzerResult').innerText = `Your Hidden Arcana: [ ${powers[hash % powers.length]} ]`;
}

async function getMagicAnswer() {
    const inputField = document.getElementById("questionInput");
    const resultDisplay = document.getElementById("magicAnswer");
    const question = inputField.value.trim();

    console.log("Button clicked! Input value is:", question);

    if (!question) {
        resultDisplay.textContent = "You must peer into the sphere and type a question first...";
        return;
    }

    resultDisplay.textContent = "Consulting the cosmic alignment... 🌌";
    inputField.value = ""; 

    const webhookUrl = "https://hook.eu1.make.com/i2tz7oqk8m8qjbhqqu6ue25smktyy21x";

    try {
        
        console.log("Sending fetch request to Make.com...");

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: question })
        });

        
        console.log("Response status received from Make:", response.status);

        if (!response.ok) {
            throw new Error("The connection to the spiritual realm timed out.");
        }

        const aiResponseText = await response.text();
        resultDisplay.textContent = aiResponseText;

    } catch (error) {
        console.error("Caught an error in the fetch cycle:", error);
        resultDisplay.textContent = "The ether is disrupted. Try asking again.";
    }
}

/*function submitLead() {
    const email = document.getElementById('emailInput').value;
    const res = document.getElementById('leadResult');
    if(!email.includes('@')) { res.style.color = '#ef4444'; res.innerText = "Please provide a valid connection."; return; }
    document.getElementById('leadBtn').innerText = "Aligning...";
    setTimeout(() => {
        playSound('success');
        document.getElementById('leadBtn').innerText = "Subscribed";
        res.style.color = '#22c55e';
        res.innerText = "The stars acknowledge your request. Projection initiated.";
    }, 1500);
}
*/

// ==========================================
// ARCHIVE SYSTEM (PERSONAL GRIMOIRE)
// ==========================================

function saveToArchive() { 
    document.getElementById('saveBtn').innerText = "Inscribed ✓"; 
    playSound('success');
    
    let archive = JSON.parse(localStorage.getItem('astroArchive')) || [];
    
    // Створюємо "капсулу часу", тепер з Планетою, Стихією та Енергією
    let pureSign = document.getElementById('signTitle').innerText.replace(" (Archived)", "").trim();
    
    let newRecord = {
        sign: pureSign,
        date: new Date().toLocaleString(),
        color: currentAuraColor,
        luckyNumbers: document.getElementById('luckyNumbers').innerText,
        luckyColorHex: document.getElementById('luckyColorBox').style.backgroundColor,
        luckyColorName: document.getElementById('luckyColorName').innerText,
        
        // НОВІ ПОЛЯ:
        planet: document.getElementById('modalPlanet').innerText,
        element: document.getElementById('modalElement').innerText,
        energy: document.getElementById('modalEnergy').innerText,
        
        Insight: document.getElementById('fortuneTextInsight').innerText,
        weekly: document.getElementById('fortuneTextWeekly').innerText,
        monthly: document.getElementById('fortuneTextMonthly').innerText
    };

    archive.unshift(newRecord); // Додаємо на початок
    localStorage.setItem('astroArchive', JSON.stringify(archive));
    renderArchive();
}

function renderArchive() {
    // ... Ця функція залишається без змін, не чіпай її, якщо вона є
    const container = document.getElementById('archiveContainer');
    let archive = JSON.parse(localStorage.getItem('astroArchive')) || [];
    
    if (archive.length === 0) {
        container.innerHTML = '<p class="subtitle">Your saved readings will be preserved here...</p>';
        return;
    }
    
    let html = ''; 
    archive.forEach((item, index) => { 
        html += `
        <div class="archive-item" style="border-left-color: ${item.color}" onclick="openSavedModal(${index})">
            <div class="archive-info">
                <div class="archive-date">${item.date}</div>
                <strong>${item.sign} Reading</strong>
            </div>
            <button class="delete-btn" onclick="deleteArchiveItem(${index}, event)" title="Erase from Grimoire">&times;</button>
        </div>`; 
    });
    container.innerHTML = html;
}

function openSavedModal(index) {
    let archive = JSON.parse(localStorage.getItem('astroArchive')) || [];
    let item = archive[index];
    if (!item) return;

    playSound('mystic');
    setAura(item.color); 

    // Беремо чисту назву знака і шукаємо його в базі (на випадок старих записів)
    let pureSign = item.sign.replace(" (Archived)", "").trim();
    let fallbackData = zodiacData[pureSign] || {};

    document.getElementById('signTitle').innerText = pureSign + " (Archived)";
    document.getElementById('fortuneModal').style.display = "block";
    document.getElementById('saveBtn').style.display = 'none';

    // ВІДНОВЛЮЄМО АСТРО-ПАСПОРТ (Якщо в пам'яті порожньо - беремо з бази zodiacData)
    document.getElementById('modalPlanet').innerText = item.planet || fallbackData.planet || "Unknown";
    document.getElementById('modalElement').innerText = item.element || fallbackData.element || "Unknown";
    document.getElementById('modalEnergy').innerText = item.energy || `"${fallbackData.energy}"` || "";

    // Відновлюємо старі параметри
    document.getElementById('luckyNumbers').innerText = item.luckyNumbers;
    document.getElementById('luckyColorBox').style.backgroundColor = item.luckyColorHex;
    document.getElementById('luckyColorBox').style.color = item.luckyColorHex;
    document.getElementById('luckyColorName').innerText = item.luckyColorName;

    document.getElementById('fortuneTextInsight').innerText = item.Insight;
    document.getElementById('fortuneTextWeekly').innerText = item.weekly;
    document.getElementById('fortuneTextMonthly').innerText = item.monthly;

    try { switchTab(null, 'Insight'); } catch(e) {}
}

// НОВА ФУНКЦІЯ: Видалення прогнозу
function deleteArchiveItem(index, event) {
    event.stopPropagation(); // Запобігає випадковому відкриттю вікна при кліку на хрестик
    let archive = JSON.parse(localStorage.getItem('astroArchive')) || [];
    archive.splice(index, 1); // Видаляємо 1 елемент за індексом
    localStorage.setItem('astroArchive', JSON.stringify(archive));
    renderArchive();
    playSound('cyber'); // Звук видалення
}

// Базові обробники подій
document.querySelector('.close-btn').onclick = () => document.getElementById('fortuneModal').style.display = "none";
window.onclick = (e) => { if (e.target == document.getElementById('fortuneModal')) document.getElementById('fortuneModal').style.display = "none"; };

// Запуск рендеру при завантаженні сторінки
renderArchive();
