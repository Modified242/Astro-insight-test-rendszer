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
                playSound('mystic'); 
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
            history.pushState(null, 'Astro Insight', '/index.html');
        };
        window.onclick = (e) => { 
            if (e.target == fortuneModal) {
                fortuneModal.style.display = "none";
                history.pushState(null, 'Astro Insight', '/index.html');
            }
        };
    }

    // HÁTTÉRBEN TÖRTÉNŐ ELŐTÖLTÉS INDÍTÁSA (1 mp késleltetéssel)
    setTimeout(preloadAllDailyReadings, 1000);
});

// --- ÚJ FÜGGVÉNY: Időalapú Cache Buster generálása ---
function getCacheBuster(type) {
    const d = new Date();
    if (type === 'monthly') return `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (type === 'weekly') {
        const start = new Date(d.getFullYear(), 0, 1);
        const days = Math.floor((d - start) / (24 * 60 * 60 * 1000));
        return `${d.getFullYear()}-W${Math.ceil(days / 7)}`;
    }
    // Napi buster
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// 3. Backend hívás (AI Cloudflare Worker)
async function fetchCelestialReading(sign, type) {
    try {
        const cb = getCacheBuster(type);
        const response = await fetch(`${READINGS_WORKER_URL}?sign=${sign}&type=${type}&cb=${cb}`);
        if (!response.ok) throw new Error("Stars are obscured today");
        const data = await response.json();
        return data.reading;
    } catch (error) {
        console.error("Worker fetch failed for " + type + ":", error);
        return "The cosmic currents are shifting. The Oracle needs a moment to align with your stars.";
    }
}

// 4. Lazy Load egy fülhöz
async function loadHoroscopeForTab(sign, tabName) {
    const typeMap = { 'Insight': 'daily', 'weekly': 'weekly', 'monthly': 'monthly' };
    const backendType = typeMap[tabName];
    const elementMap = { 'daily': 'fortuneTextInsight', 'weekly': 'fortuneTextWeekly', 'monthly': 'fortuneTextMonthly' };
    const targetElementId = elementMap[backendType];

    if (currentSignCache[backendType]) return; // Már megvan, kilépünk

    const reading = await fetchCelestialReading(sign, backendType);
    
    currentSignCache[backendType] = reading;
    const targetEl = document.getElementById(targetElementId);
    if(targetEl) targetEl.innerText = reading;
}

// 5. Modal megnyitása
async function openModal(sign) {
    const zData = zodiacData[sign];
    const selectedAuraColor = zData.aura; 
    
    sessionStorage.setItem('selectedAura', selectedAuraColor);
    sessionStorage.setItem('selectedSign', sign);
    applyAuraColor(selectedAuraColor);
    initGlobalAuraUI();

   const signTitleEl = document.getElementById('signTitle');
    if (signTitleEl) {
        signTitleEl.innerHTML = `
            <a href="articles/zodiac/${sign.toLowerCase()}.html" class="modal-title-link" title="Read full article about ${sign}" style="text-decoration: none; color: ${zData.aura}; text-shadow: 0 0 12px ${zData.aura};">
                ${sign.toUpperCase()} <span class="link-icon" style="font-size: 0.8em; margin-left: 5px;">↗</span>
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
    

   document.getElementById('modalPlanet').innerHTML = `<a href="articles/planets/${zData.planet.toLowerCase()}.html" style="color: var(--glow-color); text-decoration: underline; cursor: pointer;">${zData.planet}</a>`;
    
    document.getElementById('modalElement').innerText = zData.element;
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
    playSound('mystic');
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
async function saveToArchive() { 
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

    const btn = document.getElementById('saveBtn');
    btn.innerText = "Inscribing... ⟡"; 
    btn.style.pointerEvents = 'none';

    // Betöltjük a Heti és Havi horoszkópot a háttérben, ha még nem tette volna meg
    const sign = currentSignCache.sign || document.getElementById('signTitle').innerText.replace(" (Archived)", "").trim();
    if (!currentSignCache.weekly) await loadHoroscopeForTab(sign, 'weekly');
    if (!currentSignCache.monthly) await loadHoroscopeForTab(sign, 'monthly');

    btn.innerText = "Inscribed ✓"; 
    btn.style.pointerEvents = 'auto';
    playSound('success');
    
    let archive = JSON.parse(localStorage.getItem('astroArchive')) || [];
    let pureSign = document.getElementById('signTitle').innerText.replace(" (Archived)", "").trim();
    
    let newRecord = {
        sign: pureSign,
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
    localStorage.setItem('astroArchive', JSON.stringify(archive));
    renderArchive();
}

function renderArchive() {
    const container = document.getElementById('archiveContainer');
    if (!container) return;

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
    
    let pureSign = item.sign.replace(" (Archived)", "").trim();
    let fallbackData = typeof zodiacData !== 'undefined' ? (zodiacData[pureSign] || {}) : {};

    document.getElementById('signTitle').innerText = pureSign + " (Archived)";
    document.getElementById('fortuneModal').style.display = "block";
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn && saveBtn.parentElement) saveBtn.parentElement.style.display = 'none';
    else if (saveBtn) saveBtn.style.display = 'none';

    document.getElementById('modalPlanet').innerText = item.planet || fallbackData.planet || "Unknown";
    document.getElementById('modalElement').innerText = item.element || fallbackData.element || "Unknown";
    document.getElementById('modalEnergy').innerText = item.energy || (fallbackData.energy ? `"${fallbackData.energy}"` : "");

    document.getElementById('luckyNumbers').innerText = item.luckyNumbers;
    document.getElementById('luckyColorBox').style.backgroundColor = item.luckyColorHex;
    document.getElementById('luckyColorBox').style.color = item.luckyColorHex;
    document.getElementById('luckyColorName').innerText = item.luckyColorName;

    document.getElementById('fortuneTextInsight').innerText = item.Insight || item.daily || "Reading lost in time...";
    document.getElementById('fortuneTextWeekly').innerText = item.weekly;
    document.getElementById('fortuneTextMonthly').innerText = item.monthly;

    try { switchTab(null, 'Insight'); } catch(e) {}
}

function deleteArchiveItem(index, event) {
    event.stopPropagation();
    let archive = JSON.parse(localStorage.getItem('astroArchive')) || [];
    archive.splice(index, 1);
    localStorage.setItem('astroArchive', JSON.stringify(archive));
    renderArchive();
    playSound('cyber');
}
document.querySelectorAll('.zodiac-card').forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault(); 
        const sign = this.dataset.sign;

        // Javítva az openModal hívásra az openFortuneModal helyett
        openModal(sign); 

        // Update URL for sharing
        history.pushState({ modal: true, sign: sign }, `${sign} Reading`, `/${sign.toLowerCase()}.html`);
    });
});

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