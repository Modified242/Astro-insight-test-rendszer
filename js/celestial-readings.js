// ==========================================
// CELESTIAL READINGS & PERSONAL GRIMOIRE
// ==========================================

const READINGS_WORKER_URL = "https://celestialreadings.astroinsight.workers.dev/";

// 1. Memóriacache a Lazy Loading-hoz
let currentSignCache = {
    sign: null,
    daily: null,
    weekly: null,
    monthly: null
};

const VALID_PLANETS = new Set(['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']);
const VALID_ELEMENTS = new Set(['fire', 'earth', 'air', 'water']);

function setAttributeLink(elementId, rawValue, folder, validSet) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const value = String(rawValue || '').trim();
    const slug = value.toLowerCase();
    if (value && validSet.has(slug)) {
        el.innerHTML = `<a href="articles/${folder}/${slug}.html" style="color: var(--glow-color); text-decoration: underline; cursor: pointer;">${escapeHtml(value)}</a>`;
    } else {
        el.innerText = value || 'Unknown';
    }
}

// 2. Kártyák generálása a UI-ra
document.addEventListener('DOMContentLoaded', () => {
    const coreGrid = document.getElementById('zodiacGrid');
    
    // Generáljuk a kártyákat, ha a grid létezik az oldalon
    if (coreGrid) {
        Object.values(zodiacData).forEach(s => {
            let coreCard = document.createElement('div'); 
            coreCard.className = 'card';
            coreCard.innerHTML = `<div class="icon" style="color:${s.aura}">${s.svgIcon}</div><h3>${s.name}</h3><span class="sign-motto">"${s.motto}"</span>`;
            
            coreCard.onclick = () => { 
                setAura(s.aura); 
                openModal(s.name); 
            };
            coreGrid.appendChild(coreCard);
        });
    }
    
    // Grimoire renderelése
    renderArchive();

    // Modal eseménykezelők (bezárás)
    const closeBtn = document.querySelector('.close-btn');
    const fortuneModal = document.getElementById('fortuneModal');
    if (closeBtn && fortuneModal) {
        closeBtn.onclick = () => {
            fortuneModal.style.display = "none";
        };
        window.addEventListener('click', (e) => {
            if (e.target === fortuneModal) {
                fortuneModal.style.display = "none";
            }
        });
    }

    // HÁTTÉRBEN TÖRTÉNŐ ELŐTÖLTÉS INDÍTÁSA (1 mp késleltetéssel)
    setTimeout(preloadAllDailyReadings, 1000);
});

// --- ÚJ FÜGGVÉNY: Időalapú Cache Buster generálása ---
function getCacheBuster(type) {
    const d = new Date();
    if (type === 'monthly') return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`;
    if (type === 'weekly') {
        const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const days = Math.floor((d - start) / (24 * 60 * 60 * 1000));
        return `${d.getUTCFullYear()}-W${Math.floor(days / 7) + 1}`;
    }
    // Napi buster
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

// 3. Backend hívás (AI Cloudflare Worker)
async function fetchCelestialReading(sign, type) {
    try {
        const cb = getCacheBuster(type);
        const response = await fetch(`${READINGS_WORKER_URL}?sign=${encodeURIComponent(sign)}&type=${encodeURIComponent(type)}&cb=${encodeURIComponent(cb)}`);
        if (!response.ok) throw new Error("Stars are obscured today");
        const data = await response.json();
        if (!data || typeof data.reading !== 'string') throw new Error("Empty reading");
        return { ok: true, reading: data.reading };
    } catch (error) {
        console.error("Worker fetch failed for " + type + ":", error);
        return { ok: false, reading: "The cosmic currents are shifting. The Oracle needs a moment to align with your stars." };
    }
}

// 4. Lazy Load egy fülhöz
async function loadHoroscopeForTab(sign, tabName) {
    const typeMap = { 'Insight': 'daily', 'weekly': 'weekly', 'monthly': 'monthly' };
    const backendType = typeMap[tabName];
    const elementMap = { 'daily': 'fortuneTextInsight', 'weekly': 'fortuneTextWeekly', 'monthly': 'fortuneTextMonthly' };
    const targetElementId = elementMap[backendType];

    if (currentSignCache.sign === sign && currentSignCache[backendType]) return; // Már megvan, kilépünk

    const result = await fetchCelestialReading(sign, backendType);
    if (currentSignCache.sign !== sign) return;

    if (result.ok) {
        currentSignCache[backendType] = result.reading;
    }
    const targetEl = document.getElementById(targetElementId);
    if (targetEl) targetEl.innerText = result.reading;
}

// 5. Modal megnyitása
async function openModal(sign) {
    const zData = zodiacData[sign];
    if (!zData) return;
    const selectedAuraColor = zData.aura; 
    
    safeStorageSet(sessionStorage, 'selectedAura', selectedAuraColor);
    safeStorageSet(sessionStorage, 'selectedSign', sign);
    applyAuraColor(selectedAuraColor);
    initGlobalAuraUI();

    const signTitleEl = document.getElementById('signTitle');
    if (signTitleEl) {
        signTitleEl.innerHTML = `
            <a href="articles/zodiac/${sign.toLowerCase()}.html" class="modal-title-link" title="Read full article about ${escapeHtml(sign)}" style="text-decoration: none; color: ${zData.aura}; text-shadow: 0 0 12px ${zData.aura};">
                ${escapeHtml(sign.toUpperCase())} <span class="link-icon" style="font-size: 0.8em; margin-left: 5px;">↗</span>
            </a>
        `;
    }
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.innerText = "Inscribe to Grimoire";
        if (saveBtn.parentElement) saveBtn.parentElement.style.display = 'flex';
        else saveBtn.style.display = 'inline-block';
    }
    
    document.getElementById('fortuneModal').style.display = "block";
    

    setAttributeLink('modalPlanet', zData.planet, 'planets', VALID_PLANETS);
    setAttributeLink('modalElement', zData.element, 'elements', VALID_ELEMENTS);
    document.getElementById('modalEnergy').innerText = `"${zData.energy}"`;
    document.getElementById('luckyColorBox').style.backgroundColor = zData.aura;
    document.getElementById('luckyColorBox').style.color = zData.aura;
    document.getElementById('luckyColorName').innerText = zData.colorName;
    document.getElementById('luckyNumbers').innerText = zData.luckyNumbers;

    // Cache törlése, ha új jegyet választottak
    if (currentSignCache.sign !== sign) {
        currentSignCache = { sign: sign, daily: null, weekly: null, monthly: null };
    }

    // Töltő üzenetek beállítása
    document.getElementById('fortuneTextInsight').innerText = "Aligning cosmic frequencies... ⟡";
    document.getElementById('fortuneTextWeekly').innerText = "Consulting planetary spheres... ⟡";
    document.getElementById('fortuneTextMonthly').innerText = "Reading celestial charts... ⟡";

    // Visszatérés a napi (első) fülre
    try { switchTab(null, 'Insight'); } catch(e) {} 
    
    // Azonnal lekérjük a napi horoszkópot
    await loadHoroscopeForTab(sign, 'Insight');
}

// 6. Fülek váltása
function switchTab(event, tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const targetBtn = event ? event.target : document.querySelector(`.tab-btn[onclick*="${tabName}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active-content'));
    document.getElementById(`tab-${tabName}`).classList.add('active-content');

    // Ha rákattintott a felhasználó és van aktív jegy, töltse be az adatot
    if (event && currentSignCache.sign) {
        loadHoroscopeForTab(currentSignCache.sign, tabName);
    }
}

// 7. Grimoire (Archívum) funkciók
let isSavingArchive = false;

function normalizeSignKey(rawSign) {
    if (!rawSign) return '';
    const cleaned = String(rawSign)
        .replace(/\(Archived\)/gi, '')
        .replace(/↗/g, '')
        .trim();
    if (!cleaned) return '';
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

function isSafeCssColor(color) {
    return typeof color === 'string' && (/^#[0-9a-fA-F]{3,8}$/.test(color.trim()) || /^rgba?\([\d\s.,%]+\)$/.test(color.trim()));
}

async function saveToArchive() { 
    if (isSavingArchive) return;
    const insightText = document.getElementById('fortuneTextInsight').innerText;
    
    // Védelem: Ha még nem töltött be az Oracle
    if (insightText.includes("Aligning cosmic frequencies...") || insightText.includes("cosmic currents are shifting")) {
        const btn = document.getElementById('saveBtn');
        const originalText = btn.innerText;
        btn.innerText = "Wait for Oracle...";
        btn.style.backgroundColor = "#ef4444";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = "";
        }, 1500);
        return;
    }

    isSavingArchive = true;
    const btn = document.getElementById('saveBtn');
    btn.innerText = "Inscribing... ⟡"; 
    btn.style.pointerEvents = 'none';

    try {
        // Betöltjük a Heti és Havi horoszkópot a háttérben, ha még nem tette volna meg
        const sign = currentSignCache.sign || normalizeSignKey(document.getElementById('signTitle').innerText);
        if (!currentSignCache.weekly) await loadHoroscopeForTab(sign, 'weekly');
        if (!currentSignCache.monthly) await loadHoroscopeForTab(sign, 'monthly');

        btn.innerText = "Inscribed ✓"; 
        
        let archive = safeJsonParse(safeStorageGet(localStorage, 'astroArchive'), []);
        if (!Array.isArray(archive)) archive = [];
        
        let newRecord = {
            sign: sign,
            date: new Date().toLocaleString(),
            color: typeof currentAuraColor !== 'undefined' ? currentAuraColor : document.documentElement.style.getPropertyValue('--glow-color'),
            luckyNumbers: document.getElementById('luckyNumbers').innerText,
            luckyColorHex: document.getElementById('luckyColorBox').style.backgroundColor,
            luckyColorName: document.getElementById('luckyColorName').innerText,
            planet: document.getElementById('modalPlanet').innerText,
            element: document.getElementById('modalElement').innerText,
            energy: document.getElementById('modalEnergy').innerText,
            Insight: document.getElementById('fortuneTextInsight').innerText,
            weekly: document.getElementById('fortuneTextWeekly').innerText,
            monthly: document.getElementById('fortuneTextMonthly').innerText
        };

        archive.unshift(newRecord);
        safeStorageSet(localStorage, 'astroArchive', JSON.stringify(archive));
        renderArchive();
    } finally {
        btn.style.pointerEvents = 'auto';
        isSavingArchive = false;
    }
}

function renderArchive() {
    const container = document.getElementById('archiveContainer');
    if (!container) return;

    let archive = safeJsonParse(safeStorageGet(localStorage, 'astroArchive'), []);
    if (!Array.isArray(archive)) archive = [];
    
    if (archive.length === 0) {
        container.innerHTML = '<p class="subtitle">Your saved readings will be preserved here...</p>';
        return;
    }
    
    let html = ''; 
    archive.forEach((item, index) => { 
        const safeColor = isSafeCssColor(item.color) ? item.color.trim() : '#d4af37';
        const displaySign = escapeHtml(normalizeSignKey(item.sign) || item.sign || 'Unknown');
        html += `
        <div class="archive-item" style="border-left-color: ${safeColor}" onclick="openSavedModal(${index})">
            <div class="archive-info">
                <div class="archive-date">${escapeHtml(item.date)}</div>
                <strong>${displaySign} Reading</strong>
            </div>
            <button class="delete-btn" onclick="deleteArchiveItem(${index}, event)" title="Erase from Grimoire">&times;</button>
        </div>`; 
    });
    container.innerHTML = html;
}

function openSavedModal(index) {
    let archive = safeJsonParse(safeStorageGet(localStorage, 'astroArchive'), []);
    if (!Array.isArray(archive)) return;
    let item = archive[index];
    if (!item) return;

    let pureSign = normalizeSignKey(item.sign) || 'Unknown';
    let fallbackData = typeof zodiacData !== 'undefined' ? (zodiacData[pureSign] || {}) : {};

    document.getElementById('signTitle').innerText = pureSign + " (Archived)";
    document.getElementById('fortuneModal').style.display = "block";
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn && saveBtn.parentElement) saveBtn.parentElement.style.display = 'none';
    else if (saveBtn) saveBtn.style.display = 'none';

    setAttributeLink('modalPlanet', item.planet || fallbackData.planet, 'planets', VALID_PLANETS);
    setAttributeLink('modalElement', item.element || fallbackData.element, 'elements', VALID_ELEMENTS);
    document.getElementById('modalEnergy').innerText = item.energy || (fallbackData.energy ? `"${fallbackData.energy}"` : "");

    document.getElementById('luckyNumbers').innerText = item.luckyNumbers || fallbackData.luckyNumbers || "";
    const colorHex = item.luckyColorHex || fallbackData.aura || '#d4af37';
    document.getElementById('luckyColorBox').style.backgroundColor = colorHex;
    document.getElementById('luckyColorBox').style.color = colorHex;
    document.getElementById('luckyColorName').innerText = item.luckyColorName || fallbackData.colorName || "";

    document.getElementById('fortuneTextInsight').innerText = item.Insight || item.daily || "Reading lost in time...";
    document.getElementById('fortuneTextWeekly').innerText = item.weekly || "";
    document.getElementById('fortuneTextMonthly').innerText = item.monthly || "";

    try { switchTab(null, 'Insight'); } catch(e) {}
}

function deleteArchiveItem(index, event) {
    event.stopPropagation();
    let archive = safeJsonParse(safeStorageGet(localStorage, 'astroArchive'), []);
    if (!Array.isArray(archive)) return;
    archive.splice(index, 1);
    safeStorageSet(localStorage, 'astroArchive', JSON.stringify(archive));
    renderArchive();
}

// 8. HÁTTÉRBEN TÖRTÉNŐ ELŐTÖLTÉS (SILENT PRELOADER)
async function preloadAllDailyReadings() {
    if (typeof zodiacData === 'undefined') return;

    const signs = Object.keys(zodiacData);
    const cb = getCacheBuster('daily');

    // Egyesével, kis késleltetéssel kérjük le az adatokat, hogy ne akasszuk meg a felületet
    for (const sign of signs) {
        try {
            await fetch(`${READINGS_WORKER_URL}?sign=${sign}&type=daily&cb=${cb}`);
        } catch (error) {
            // Csendes hibakezelés: ha egy kérés elbukik a háttérben, a UI nem omlik össze,
            // a felhasználó pedig újra megpróbálja majd a gombnyomással letölteni.
        }
        // 150ms szünet a hívások között
        await new Promise(resolve => setTimeout(resolve, 150));
    }
}
