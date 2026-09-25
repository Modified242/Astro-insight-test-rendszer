async function analyzeUsername() {
    const inputField = document.getElementById("usernameInput");
    const answerField = document.getElementById("analyzerResult");
    
    if (!inputField || !answerField) return;

    const name = inputField.value.trim();

    if (!name) {
        answerField.innerText = "The numbers are silent. Please provide a name...";
        return;
    }

    const rateLimit = checkRateLimit('usage_numerology');
    if (!rateLimit.allowed) {
        answerField.innerText = `🔮 The cosmic energies are resting. ${rateLimit.message}`;
        return;
    }

    answerField.innerText = "🔮 Calculating cosmic frequencies...";
    inputField.disabled = true;

    try {
        const response = await fetch(NUMEROLOGY_WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: name })
        });

        if (!response.ok) {
            throw new Error("Server returned status: " + response.status);
        }

        const data = await response.json();
        answerField.innerText = data.response;
        recordUsage('usage_numerology', rateLimit.usageData);

    } catch (error) {
        console.error("Numerology hiba:", error);
        answerField.innerText = "The cosmic numbers are shifting. Please try again later.";
    } finally {
        inputField.disabled = false;
        inputField.value = "";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const nameInputField = document.getElementById("usernameInput");
    if (nameInputField) {
        nameInputField.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                analyzeUsername();
            }
        });
    }
});

const CLOUDFLARE_WORKER_URL = "https://oracle-bot.astroinsight.workers.dev";

async function getMagicAnswer() {
    const inputField = document.getElementById("questionInput");
    const answerField = document.getElementById("magicAnswer");
    
    if (!inputField || !answerField) return;

    const question = inputField.value.trim();

    if (!question) {
        answerField.innerText = "The sphere remains dark. Please whisper a question...";
        return;
    }

    const rateLimit = checkRateLimit('usage_sphere');
    if (!rateLimit.allowed) {
        answerField.innerText = `✨ The seer's vision is clouded. ${rateLimit.message}`;
        return;
    }

    answerField.innerText = "Gazing into the cosmos...";
    inputField.disabled = true;

    try {
        const response = await fetch(CLOUDFLARE_WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: question })
        });

        if (!response.ok) {
            throw new Error("Server returned status: " + response.status);
        }

        const data = await response.json();
        answerField.innerText = data.response;
        recordUsage('usage_sphere', rateLimit.usageData);

    } catch (error) {
        console.error("Hiba:", error);
        answerField.innerText = "The stars are misaligned. Try asking again later.";
    } finally {
        inputField.disabled = false;
        inputField.value = "";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.getElementById("questionInput");
    if (inputField) {
        inputField.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                getMagicAnswer();
            }
        });
    }
});

// ==========================================
// ASTRO-COMPATIBILITY SYSTEM
// ==========================================

function populateSignSelects() {
    const sign1Select = document.getElementById('sign1');
    const sign2Select = document.getElementById('sign2');
    
    if (!sign1Select || !sign2Select) return;
    
    let optionsHtml = '<option value="" disabled selected>Select sign...</option>';
    
    for (const [key, data] of Object.entries(zodiacData)) {
        optionsHtml += `<option value="${key}">${data.icon} ${data.name}</option>`;
    }
    
    sign1Select.innerHTML = optionsHtml;
    sign2Select.innerHTML = optionsHtml;
}

document.addEventListener('DOMContentLoaded', populateSignSelects);


const COMPATIBILITY_WORKER_URL = "https://natal-engine.astroinsight.workers.dev/";

async function calculateCompatibility() {
    const sign1El = document.querySelector('#custom-dropdown-1 input[type="hidden"]') || document.getElementById('sign1');
    const sign2El = document.querySelector('#custom-dropdown-2 input[type="hidden"]') || document.getElementById('sign2');
    
    const sign1 = sign1El ? sign1El.value : null;
    const sign2 = sign2El ? sign2El.value : null;

    const date1 = document.getElementById('date1').value;
    const date2 = document.getElementById('date2').value;

    const resultBox = document.getElementById('compatibilityResult');
    const scoreSpan = document.getElementById('syncScore');
    const titleSpan = document.getElementById('syncTitle');
    const verdictP = document.getElementById('syncVerdict');
    const breakdownDiv = document.getElementById('syncBreakdown');

    resultBox.classList.remove('hidden');
    scoreSpan.innerText = "...";
    titleSpan.innerText = "Aligning Celestial Spheres...";
    verdictP.innerText = "";
    breakdownDiv.innerHTML = "Connecting to the Natal Synastry Engine...";

    if (!date1 || !date2) {
        scoreSpan.innerText = "ERR";
        titleSpan.innerText = "Date Required";
        breakdownDiv.innerHTML = "Please provide exact birth dates for both individuals to calculate natal positions.";
        return;
    }

    if (!sign1 || !sign2 || sign1 === "" || sign2 === "") {
        scoreSpan.innerText = "ERR";
        titleSpan.innerText = "Zodiac Signs Required";
        breakdownDiv.innerHTML = "Please select the Sun signs for both individuals before calculating.";
        return; 
    }

    const parsedDate1 = new Date(date1);
    const parsedDate2 = new Date(date2);
    const minDate = new Date("1900-01-01");
    const today = new Date();

    if (isNaN(parsedDate1.getTime()) || isNaN(parsedDate2.getTime()) || 
        parsedDate1 < minDate || parsedDate2 < minDate || 
        parsedDate1 > today || parsedDate2 > today) {
        
        scoreSpan.innerText = "ERR";
        titleSpan.innerText = "Invalid Time Line";
        breakdownDiv.innerHTML = "Please enter valid birth dates (between 1900 and today's date). We cannot calculate synastry for time travelers.";
        return;
    }

    try {
        const response = await fetch(COMPATIBILITY_WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sign1, date1, sign2, date2 })
        });

        if (!response.ok) throw new Error(`Server returned HTTP status ${response.status}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error || "Unknown calculation error");

        scoreSpan.innerText = `${data.synastry.score}`; 
        titleSpan.innerText = data.synastry.title;
        verdictP.innerText = data.synastry.verdict;

        const planetsInfo = `
            <div style="background: rgba(212, 175, 55, 0.1); padding: 12px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9rem;">
                <strong>Calculated Natal Placements:</strong><br>
                ✦ Person 1: Moon in ${data.person1.moon}, Venus in ${data.person1.venus}, Mars in ${data.person1.mars}<br>
                ✦ Person 2: Moon in ${data.person2.moon}, Venus in ${data.person2.venus}, Mars in ${data.person2.mars}
            </div>
        `;
        breakdownDiv.innerHTML = planetsInfo + data.synastry.details;

        const weatherScoreEl = document.getElementById('weatherScore');
        const weatherVerdictEl = document.getElementById('weatherVerdict');
        const weatherDetailsEl = document.getElementById('weatherDetails');

        if (weatherScoreEl && data.weather) {
            weatherScoreEl.innerText = `${data.weather.weatherScore}%`;
            weatherVerdictEl.innerText = data.weather.weatherVerdict;
            weatherDetailsEl.innerText = data.weather.transitDetails;
        }

    } catch (error) {
        console.error("Natal Engine Communication Failure:", error);
        scoreSpan.innerText = "---";
        titleSpan.innerText = "Cosmic Disconnection";
        breakdownDiv.innerHTML = `Unable to reach the Cloudflare Worker. Details: ${error.message}`;
    }
}
// ==========================================
// AURA COLOR MEMORY SYSTEM & WIDGET
// ==========================================



// ==========================================
// TAROT SYSTEM: 78-CARD AI ORACLE
// ==========================================

const tarotDeck = [];

const majorArcanaNames = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", 
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", 
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", 
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun", 
    "Judgement", "The World"
];

majorArcanaNames.forEach((name, index) => {
    tarotDeck.push({
        id: `major_${index}`,
        name: name,
        type: "Major Arcana",
        imageUrl: `assets/tarot/major_${index}.webp`
    });
});

const suits = ["Wands", "Cups", "Swords", "Pentacles"];
const courtCards = ["Page", "Knight", "Queen", "King"];

suits.forEach(suit => {
    for (let i = 1; i <= 14; i++) {
        let cardName = "";
        if (i === 1) cardName = `Ace of ${suit}`;
        else if (i >= 2 && i <= 10) cardName = `${i} of ${suit}`;
        else cardName = `${courtCards[i - 11]} of ${suit}`;

        tarotDeck.push({
            id: `minor_${suit.toLowerCase()}_${i}`,
            name: cardName,
            type: `Minor Arcana - ${suit}`,
            imageUrl: `assets/tarot/${suit.toLowerCase()}_${i}.webp`
        });
    }
});

function shuffleTarotDeck(deck) {
    const shuffled = [...deck]; 
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

function drawArcanaSpread() {
    const activeDeck = shuffleTarotDeck(tarotDeck);
    
    const spread = {
        past: activeDeck[0],
        present: activeDeck[1],
        future: activeDeck[2]
    };
    
    console.log("🔮 The Arcana Spread initialized:", spread);
    return spread;
}

function renderTarotCards(spread, flipped = false) {
    const layout = [
        { key: 'past', label: 'Past', data: spread.past },
        { key: 'present', label: 'Present', data: spread.present },
        { key: 'future', label: 'Future', data: spread.future }
    ];

    let htmlOutput = "";
    layout.forEach(item => {
        htmlOutput += `
            <div class="tarot-card ${flipped ? 'flipped' : ''}" onclick="handleTarotCardFlip(this)">
                <div class="tarot-inner">
                    <div class="tarot-front">✧</div>
                    <div class="tarot-back">
                        <div class="tarot-position-label">${item.label}</div>
                        <div class="tarot-card-title">${item.data.name}</div>
                        <div class="tarot-card-type">${item.data.type}</div>
                    </div>
                </div>
            </div>
        `;
    });
    return htmlOutput;
}

window.handleTarotCardFlip = function(card) {
    card.classList.toggle('flipped');
    const container = document.getElementById('tarotResult');
    if (!container) return;
    
    const allCards = container.querySelectorAll('.tarot-card');
    const flippedCards = container.querySelectorAll('.tarot-card.flipped');
    const readingBox = document.getElementById('tarot-interpretation');
    
    if (readingBox) {
        if (allCards.length > 0 && flippedCards.length === allCards.length) {
            readingBox.style.display = 'block';
            readingBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            readingBox.style.display = 'none';
        }
    }
}

function drawTarot() {
    const container = document.getElementById('tarotResult');
    if (!container) return;

    const rateLimit = checkRateLimit('usage_tarot', 1);
    if (!rateLimit.allowed) {
        let readingBox = document.getElementById('tarot-interpretation');
        if (!readingBox) {
            readingBox = document.createElement('div');
            readingBox.id = 'tarot-interpretation';
            readingBox.className = 'oracle-reading';
            container.parentNode.insertBefore(readingBox, container.nextSibling);
        }

        const savedSpread = localStorage.getItem('saved_tarot_spread');
        const savedReading = localStorage.getItem('saved_tarot_reading');

        if (savedSpread && savedReading) {
            try {
                const spreadData = JSON.parse(savedSpread);
                container.innerHTML = renderTarotCards(spreadData, true);
                readingBox.style.display = 'block';
                readingBox.innerHTML = `
                    <div class="reading-error" style="margin-bottom: 20px;">The cards are resting. ${rateLimit.message}</div>
                    <div class="reading-content">${savedReading}</div>
                `;
                readingBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                return;
            } catch (e) {
                console.error("Error restoring saved tarot reading:", e);
            }
        }

        readingBox.style.display = 'block';
        readingBox.innerHTML = `<div class="reading-error">The cards are resting. ${rateLimit.message}</div>`;
        readingBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }

    const spread = drawArcanaSpread();
    container.innerHTML = renderTarotCards(spread, false);

    fetchTarotReading(spread, rateLimit);
}

async function fetchTarotReading(spread, existingRateLimit = null) {
    const container = document.getElementById('tarotResult');
    
    let readingBox = document.getElementById('tarot-interpretation');
    if (!readingBox) {
        readingBox = document.createElement('div');
        readingBox.id = 'tarot-interpretation';
        readingBox.className = 'oracle-reading';
        container.parentNode.insertBefore(readingBox, container.nextSibling);
    }

    const rateLimit = existingRateLimit || checkRateLimit('usage_tarot', 1);
    if (!rateLimit.allowed) {
        readingBox.style.display = 'block';
        readingBox.innerHTML = `<div class="reading-error">The cards are resting. ${rateLimit.message}</div>`;
        readingBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }

    // Hide initially until cards are flipped
    readingBox.style.display = 'none';
    readingBox.innerHTML = `
        <div class="oracle-loader">
            <span class="glow-text">The Oracle is consulting the ether...</span>
        </div>
    `;

    try {
        const response = await fetch("https://tarot-oracle-api.astroinsight.workers.dev/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spread)
        });

        if (!response.ok) {
            let errorText = "Network disruption";
            try {
                const errorData = await response.json();
                if (errorData.error) errorText = errorData.error;
            } catch (e) {}
            throw new Error(errorText);
        }

        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        readingBox.innerHTML = `<div class="reading-content">${data.reading}</div>`;
        // Scroll into view if already revealed
        if (readingBox.style.display === 'block') {
            readingBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        recordUsage('usage_tarot', rateLimit.usageData);
        try {
            localStorage.setItem('saved_tarot_spread', JSON.stringify(spread));
            localStorage.setItem('saved_tarot_reading', data.reading);
        } catch (e) {
            console.error("Error saving tarot reading:", e);
        }

    } catch (error) {
        console.error("Fetch error:", error);
        readingBox.innerHTML = `
            <div class="reading-error">
                The connection to the stars was lost. <br><small>Reason: ${error.message || "Unknown error"}</small><br><br>
                <span style="color: #fbbf24; font-size: 0.9em;">Don't worry, your daily attempt was not used up. You can try again.</span>
            </div>
            ${localStorage.getItem('saved_tarot_reading') ? '<div style="text-align:center; margin-top: 15px;"><button class="glow-btn" style="padding: 8px 16px; font-size: 0.9rem;" onclick="initDailyTarotState()">Show Previous Reading</button></div>' : ''}
        `;
    }
}

function initDailyTarotState() {
    const container = document.getElementById('tarotResult');
    if (!container) return;

    const rateLimit = checkRateLimit('usage_tarot', 1);
    const savedSpread = localStorage.getItem('saved_tarot_spread');
    const savedReading = localStorage.getItem('saved_tarot_reading');

    if (savedSpread && savedReading) {
        try {
            const spreadData = JSON.parse(savedSpread);
            container.innerHTML = renderTarotCards(spreadData, true);

            let readingBox = document.getElementById('tarot-interpretation');
            if (!readingBox) {
                readingBox = document.createElement('div');
                readingBox.id = 'tarot-interpretation';
                readingBox.className = 'oracle-reading';
                container.parentNode.insertBefore(readingBox, container.nextSibling);
            }
            readingBox.style.display = 'block';
            
            if (!rateLimit.allowed) {
                readingBox.innerHTML = `
                    <div class="reading-error" style="margin-bottom: 20px;">The cards are resting. ${rateLimit.message}</div>
                    <div class="reading-content">${savedReading}</div>
                `;
            } else {
                readingBox.innerHTML = `
                    <div class="reading-content">
                        <div style="margin-bottom: 15px; font-style: italic; color: #fbbf24; text-align: center;">This is your previous reading. You can draw new cards for today!</div>
                        ${savedReading}
                    </div>
                `;
            }
        } catch (e) {
            console.error("Error loading daily tarot state:", e);
        }
    }
}

document.addEventListener('DOMContentLoaded', initDailyTarotState);

// ==========================================
// DYNAMIC SITE LOGO & ELEGANT PRELOADER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("astro-preloader");
    const introLogo = document.getElementById("intro-logo-container");
    const siteLogo = document.getElementById("site-logo-container");
    const siteTitle = document.getElementById("site-title-container"); 

    const introPlayed = sessionStorage.getItem('introPlayed');

    fetch(getRootPrefix() + 'logo.svg')
        .then(response => {
            if (!response.ok) throw new Error('Error loading logo.svg');
            return response.text();
        })
        .then(svgData => {
            if (siteLogo) siteLogo.innerHTML = svgData;

            if (!introPlayed && preloader && introLogo && siteLogo) {
                
                document.body.classList.add('no-scroll');
                introLogo.innerHTML = svgData;
                
                siteLogo.style.opacity = '0';
                if (siteTitle) siteTitle.style.opacity = '0'; 

                // Várunk, amíg a bevezető animáció kibontakozik
                setTimeout(() => {
                    // 1. A középső preloader elegánsan elhalványul
                    preloader.style.opacity = '0';
                    preloader.style.pointerEvents = 'none';
                    
                    // 2. A navigációs sáv logója és szövege ezzel egyidőben megjelenik
                    siteLogo.style.transition = 'opacity 1.2s ease';
                    siteLogo.style.opacity = '1'; 
                    
                    if (siteTitle) {
                        siteTitle.style.transition = 'opacity 1.2s ease';
                        siteTitle.style.opacity = '1';
                    }

                    // 3. A preloader teljes eltávolítása a háttérből
                    setTimeout(() => {
                        preloader.remove(); 
                        document.body.classList.remove('no-scroll'); 
                        sessionStorage.setItem('introPlayed', 'true'); 
                    }, 1200);

                }, 1800);

            } else {
                // Ha már látta a felhasználó, azonnal megjelenítjük az oldalt
                if (siteLogo) siteLogo.style.opacity = '1';
                if (siteTitle) siteTitle.style.opacity = '1';
                if (preloader) preloader.remove();
                document.body.classList.remove('no-scroll');
            }
        })
        .catch(error => {
            console.error('Logo loading error:', error);
            if (siteLogo) siteLogo.style.opacity = '1';
            if (siteTitle) siteTitle.style.opacity = '1';
            if (preloader) preloader.remove();
            document.body.classList.remove('no-scroll');
        });
});
