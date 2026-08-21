// ==========================================
// ASTRO QUIZ HUB & GAME LOGIC
// ==========================================

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// ==========================================
// UNIFIED COSMIC MODAL (Alert helyett)
// ==========================================
function showCosmicModal(title, message, onRestart) {
    if (!document.getElementById('cosmic-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'cosmic-modal-styles';
        style.innerHTML = `
            .cosmic-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(5px);
                display: flex; justify-content: center; align-items: center;
                z-index: 100000; opacity: 0; animation: fadeInModal 0.3s forwards;
            }
            .cosmic-modal-box {
                background: #0f172a; border: 2px solid var(--glow-color, #d4af37);
                border-radius: 12px; padding: 40px 30px; max-width: 400px; width: 90%;
                text-align: center; box-shadow: 0 0 30px var(--glow-color-dim, rgba(212, 175, 55, 0.4));
                transform: scale(0.9); animation: scaleUpModal 0.3s forwards;
            }
            .cosmic-modal-title {
                font-family: 'Playfair Display', serif; font-size: 1.8rem;
                color: var(--glow-color, #d4af37); margin-bottom: 15px;
                text-transform: uppercase; letter-spacing: 2px;
            }
            .cosmic-modal-text {
                color: #e2e8f0; font-size: 1.1rem; line-height: 1.6; margin-bottom: 25px;
            }
            #custom-svg-cursor { z-index: 999999 !important; }
            @keyframes fadeInModal { to { opacity: 1; } }
            @keyframes scaleUpModal { to { transform: scale(1); } }
        `;
        document.head.appendChild(style);
    }

    const existingModal = document.getElementById('cosmicCustomModal');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'cosmicCustomModal';
    overlay.className = 'cosmic-modal-overlay';
    const safeMessage = message ? message.replace(/\n/g, '<br>') : '';

    overlay.innerHTML = `
        <div class="cosmic-modal-box">
            <h2 class="cosmic-modal-title">${title}</h2>
            <p class="cosmic-modal-text">${safeMessage}</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button class="glow-btn outline" id="modalHubBtn" style="padding: 10px 20px; font-size: 0.95rem;">← Hub</button>
                <button class="glow-btn" id="modalRestartBtn" style="padding: 10px 20px; font-size: 0.95rem;">Play Again ⟲</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('modalHubBtn').onclick = () => { overlay.remove(); returnToHub(); };
    document.getElementById('modalRestartBtn').onclick = () => { overlay.remove(); if (typeof onRestart === 'function') onRestart(); };
}

// VIEW SWITCHING LOGIC
const allGames = ['blitz', 'alchemist', 'archetype', 'ruler', 'truth', 'tracer', 'tarot', 'chemistry', 'retrograde', 'moon'];

function openGame(gameId) {
    document.getElementById('hubView').style.display = 'none';
    allGames.forEach(g => {
        const el = document.getElementById(g + 'View');
        if (el) el.style.display = 'none';
    });
    
    if (gameId === 'blitz') { document.getElementById('blitzView').style.display = 'block'; resetBlitzGame(); }
    else if (gameId === 'alchemist') { document.getElementById('alchemistView').style.display = 'block'; initAlchemistGame(); }
    else if (gameId === 'archetype') { document.getElementById('archetypeView').style.display = 'block'; initArchetypeGame(); }
    else if (gameId === 'ruler') { document.getElementById('rulerView').style.display = 'block'; initRulerGame(); }
    else if (gameId === 'truth') { document.getElementById('truthView').style.display = 'block'; initTruthGame(); }
    else if (gameId === 'tracer') { document.getElementById('tracerView').style.display = 'block'; initTracerGame(); }
    else if (gameId === 'tarot') { document.getElementById('tarotView').style.display = 'block'; initTarotGame(); }
    else if (gameId === 'chemistry') { document.getElementById('chemistryView').style.display = 'block'; initChemistryGame(); }
    else if (gameId === 'retrograde') { document.getElementById('retrogradeView').style.display = 'block'; initRetrogradeGame(); }
    else if (gameId === 'moon') { document.getElementById('moonView').style.display = 'block'; initMoonGame(); }
}

function returnToHub() {
    allGames.forEach(g => {
        const el = document.getElementById(g + 'View');
        if (el) el.style.display = 'none';
    });
    document.getElementById('hubView').style.display = 'block';
    
    if (typeof blitzState !== 'undefined' && blitzState.timerInterval) clearInterval(blitzState.timerInterval);
    if (typeof alchemistState !== 'undefined' && alchemistState.timerInterval) clearInterval(alchemistState.timerInterval);
    if (typeof archetypeState !== 'undefined' && archetypeState.timerInterval) clearInterval(archetypeState.timerInterval);
    if (typeof rulerState !== 'undefined' && rulerState.timerInterval) clearInterval(rulerState.timerInterval);
    if (typeof truthState !== 'undefined' && truthState.timerInterval) clearInterval(truthState.timerInterval);
    if (typeof tracerState !== 'undefined' && tracerState.timerInterval) clearInterval(tracerState.timerInterval);
    if (typeof tarotState !== 'undefined' && tarotState.timerInterval) clearInterval(tarotState.timerInterval);
    if (typeof chemState !== 'undefined' && chemState.timerInterval) clearInterval(chemState.timerInterval);
    if (typeof retroState !== 'undefined' && retroState.timerInterval) clearInterval(retroState.timerInterval);
    if (typeof moonState !== 'undefined' && moonState.timerInterval) clearInterval(moonState.timerInterval);
}

// ==========================================
// GAME 1: ZODIAC MATCH BLITZ
// ==========================================
let blitzState = {
    selectedText: null, selectedIcon: null, correct: 0, wrong: 0,
    guessesRemaining: 15, timeLeft: 60, timerActive: false, timerInterval: null, hasStarted: false
};

function resetBlitzGame() {
    if (blitzState.timerInterval) clearInterval(blitzState.timerInterval);
    blitzState = {
        selectedText: null, selectedIcon: null, correct: 0, wrong: 0,
        guessesRemaining: 15, timeLeft: 60, timerActive: true, timerInterval: null, hasStarted: false
    };
    document.getElementById('blitz-highscore').textContent = localStorage.getItem('astroBlitzHighScore') || 0;
    updateBlitzStats();
    document.getElementById('blitz-timer').textContent = "01:00";

    const textPanel = document.getElementById('blitz-text-panel');
    const iconPanel = document.getElementById('blitz-icon-panel');
    textPanel.innerHTML = ''; iconPanel.innerHTML = '';

    const zodiacArray = Object.values(zodiacData);
    const texts = shuffleArray([...zodiacArray]);
    const icons = shuffleArray([...zodiacArray]);

    texts.forEach(zodiac => {
        const btn = document.createElement('div');
        btn.className = 'blitz-card blitz-text-card';
        btn.textContent = zodiac.name;
        btn.dataset.zodiac = zodiac.name;
        btn.onclick = () => handleBlitzSelection(btn, 'text');
        textPanel.appendChild(btn);
    });

    icons.forEach(zodiac => {
        const btn = document.createElement('div');
        btn.className = 'blitz-card blitz-icon-card';
        btn.style.color = zodiac.aura; 
        btn.innerHTML = zodiac.svgIcon; 
        btn.dataset.zodiac = zodiac.name;
        btn.onclick = () => handleBlitzSelection(btn, 'icon');
        iconPanel.appendChild(btn);
    });
}

function handleBlitzSelection(element, type) {
    if (element.classList.contains('matched') || !blitzState.timerActive) return;
    if (!blitzState.hasStarted) { blitzState.hasStarted = true; startBlitzTimer(); }
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        type === 'text' ? blitzState.selectedText = null : blitzState.selectedIcon = null;
        return;
    }
    document.querySelectorAll(`.blitz-${type}-card.selected`).forEach(el => el.classList.remove('selected'));
    
    element.classList.add('selected');
    if (type === 'text') blitzState.selectedText = element;
    if (type === 'icon') blitzState.selectedIcon = element;

    if (blitzState.selectedText && blitzState.selectedIcon) {
        setTimeout(checkBlitzMatch, 200); 
    }
}

function checkBlitzMatch() {
    const textVal = blitzState.selectedText.dataset.zodiac;
    const iconVal = blitzState.selectedIcon.dataset.zodiac;
    blitzState.guessesRemaining--;

    if (textVal === iconVal) {
        blitzState.correct++;
        blitzState.selectedText.classList.add('matched');
        blitzState.selectedIcon.classList.add('matched');
        if (typeof playSound === "function") playSound('success'); 
    } else {
        blitzState.wrong++;
        blitzState.selectedText.style.borderColor = '#ef4444';
        blitzState.selectedIcon.style.borderColor = '#ef4444';
        setTimeout(() => {
            if(blitzState.selectedText) blitzState.selectedText.style.borderColor = '';
            if(blitzState.selectedIcon) blitzState.selectedIcon.style.borderColor = '';
        }, 300);
    }
    blitzState.selectedText.classList.remove('selected');
    blitzState.selectedIcon.classList.remove('selected');
    blitzState.selectedText = null;
    blitzState.selectedIcon = null;

    updateBlitzStats();
    if (blitzState.correct === 12) endBlitzGame(true);
    else if (blitzState.guessesRemaining <= 0) endBlitzGame(false);
}

function updateBlitzStats() {
    document.getElementById('blitz-correct').textContent = blitzState.correct;
    document.getElementById('blitz-guesses').textContent = blitzState.guessesRemaining;
}

function startBlitzTimer() {
    blitzState.timerInterval = setInterval(() => {
        blitzState.timeLeft--;
        const seconds = (blitzState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('blitz-timer').textContent = `00:${seconds}`;
        if (blitzState.timeLeft <= 0) endBlitzGame(false);
    }, 1000);
}

function endBlitzGame(isWin = false) {
    clearInterval(blitzState.timerInterval);
    blitzState.timerActive = false;
    let title = isWin ? "Cosmic Mastery! 🏆" : "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroBlitzHighScore') || 0);
    let msg = isWin 
        ? `Incredible! You matched all 12 pairs with ${blitzState.timeLeft} seconds and ${blitzState.guessesRemaining} guesses left.`
        : `You matched ${blitzState.correct} pairs before the stars shifted.`;
    
    if (blitzState.correct > storedHighScore) {
        localStorage.setItem('astroBlitzHighScore', blitzState.correct);
        document.getElementById('blitz-highscore').textContent = blitzState.correct;
        title = "New High Score! 🌟";
        msg = (isWin ? `You mastered the zodiac perfectly!\n\n` : `A new record!\n\n`) + msg;
    }
    showCosmicModal(title, msg, () => resetBlitzGame());
}

// ==========================================
// GAME 2: ELEMENT ALCHEMIST
// ==========================================
let alchemistState = { score: 0, timeLeft: 120, timerActive: false, timerInterval: null, currentSign: null, hasStarted: false, signPool: [], matchedCount: 0 };

function initAlchemistGame() {
    if (alchemistState.timerInterval) clearInterval(alchemistState.timerInterval);
    alchemistState = { score: 0, timeLeft: 120, timerActive: true, timerInterval: null, currentSign: null, hasStarted: false, signPool: shuffleArray(Object.keys(zodiacData)), matchedCount: 0 };
    document.getElementById('alchemist-highscore').innerText = localStorage.getItem('astroAlchemistHighScore') || 0;
    document.getElementById('alchemist-score').innerText = '0';
    document.getElementById('alchemist-timer').innerText = '02:00';
    loadNextAlchemistCard();
}

function startAlchemistTimer() {
    alchemistState.timerInterval = setInterval(() => {
        alchemistState.timeLeft--;
        let mins = Math.floor(alchemistState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (alchemistState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('alchemist-timer').innerText = `${mins}:${secs}`;
        if (alchemistState.timeLeft <= 0) endAlchemistGame(false);
    }, 1000);
}

function loadNextAlchemistCard() {
    const randomSign = alchemistState.signPool.pop();
    alchemistState.currentSign = zodiacData[randomSign];
    const cardIcon = document.getElementById('alchemist-card-icon');
    const cardName = document.getElementById('alchemist-card-name');
    const card = document.getElementById('alchemist-current-card');
    card.style.borderColor = alchemistState.currentSign.aura;
    card.style.boxShadow = `0 0 10px ${alchemistState.currentSign.aura}33`;
    cardIcon.style.color = alchemistState.currentSign.aura;
    cardIcon.innerHTML = alchemistState.currentSign.svgIcon;
    const svgElement = cardIcon.querySelector('svg');
    if(svgElement) { svgElement.style.width = '60px'; svgElement.style.height = '60px'; }
    cardName.innerText = alchemistState.currentSign.name;
    cardName.style.color = alchemistState.currentSign.aura;
}

function handleAlchemistGuess(guessedElement) {
    if (!alchemistState.timerActive) return;
    if (!alchemistState.hasStarted) { alchemistState.hasStarted = true; startAlchemistTimer(); }
    const card = document.getElementById('alchemist-current-card');
    
    if (guessedElement === alchemistState.currentSign.element) {
        alchemistState.score++; alchemistState.matchedCount++;
        document.getElementById('alchemist-score').innerText = alchemistState.score;
        if (typeof playSound === 'function') playSound('success');
        card.style.transform = 'scale(1.1)'; 
    } else {
        alchemistState.score = Math.max(0, alchemistState.score - 1); 
        document.getElementById('alchemist-score').innerText = alchemistState.score;
        card.style.transform = 'translateX(-10px)'; 
        card.style.borderColor = '#ef4444';
        alchemistState.signPool.unshift(alchemistState.currentSign.name);
        shuffleArray(alchemistState.signPool);
    }
    
    setTimeout(() => {
        card.style.transform = 'none';
        if (alchemistState.matchedCount >= 12) endAlchemistGame(true);
        else loadNextAlchemistCard();
    }, 200);
}

function endAlchemistGame(isWin = false) {
    clearInterval(alchemistState.timerInterval); alchemistState.timerActive = false;
    let title = isWin ? "Cosmic Mastery! 🏆" : "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroAlchemistHighScore') || 0);
    let msg = isWin ? `Amazing! You sorted all 12 elements with ${alchemistState.timeLeft} seconds left.\nFinal Score: ${alchemistState.score}` : `You correctly sorted ${alchemistState.matchedCount} signs.\nFinal Score: ${alchemistState.score}`;
    if (alchemistState.score > storedHighScore) {
        localStorage.setItem('astroAlchemistHighScore', alchemistState.score);
        document.getElementById('alchemist-highscore').innerText = alchemistState.score;
        title = "New High Score! 🌟"; msg = (isWin ? `You are a true Alchemist!\n\n` : `Great effort!\n\n`) + msg;
    }
    showCosmicModal(title, msg, () => initAlchemistGame());
}

// ==========================================
// GAME 3: ARCHETYPE ORACLE
// ==========================================
const archetypeScenarios = [
    { sign: "Aries", text: "Challenged a stranger to a race because they were walking too fast." },
    { sign: "Taurus", text: "Refused to go out because their favorite sweatpants were in the wash." },
    { sign: "Gemini", text: "Sent 8 separate text messages instead of one long paragraph." },
    { sign: "Cancer", text: "Kept a movie ticket stub from 2014 because 'it holds emotional value'." },
    { sign: "Leo", text: "Practiced their 'surprised face' in the mirror just in case they win an award." },
    { sign: "Virgo", text: "Made a detailed to-do list for their weekend relaxation time." },
    { sign: "Libra", text: "Took 45 minutes to decide what to watch on Netflix, then fell asleep." },
    { sign: "Scorpio", text: "Did deep background research on their new coworker before saying 'hello'." },
    { sign: "Sagittarius", text: "Booked a flight to another country because they got bored on a Tuesday." },
    { sign: "Capricorn", text: "Scheduled a 'mental breakdown' into their calendar for exactly 7:30 PM." },
    { sign: "Aquarius", text: "Ghosted everyone for a week to 'recharge', then returned like nothing happened." },
    { sign: "Pisces", text: "Cried because they saw an old man eating alone at a restaurant." }
];

let archetypeState = { score: 0, timeLeft: 90, timerActive: false, timerInterval: null, currentScenario: null, hasStarted: false, questionPool: [], matchedCount: 0 };

function initArchetypeGame() {
    if (archetypeState.timerInterval) clearInterval(archetypeState.timerInterval);
    archetypeState = { score: 0, timeLeft: 90, timerActive: true, timerInterval: null, currentScenario: null, hasStarted: false, questionPool: shuffleArray([...archetypeScenarios]), matchedCount: 0 };
    document.getElementById('archetype-highscore').innerText = localStorage.getItem('astroArchetypeHighScore') || 0;
    document.getElementById('archetype-score').innerText = '0';
    document.getElementById('archetype-timer').innerText = '01:30';
    loadNextArchetype();
}

function startArchetypeTimer() {
    archetypeState.timerInterval = setInterval(() => {
        archetypeState.timeLeft--;
        let mins = Math.floor(archetypeState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (archetypeState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('archetype-timer').innerText = `${mins}:${secs}`;
        if (archetypeState.timeLeft <= 0) endArchetypeGame(false);
    }, 1000);
}

function loadNextArchetype() {
    archetypeState.currentScenario = archetypeState.questionPool.pop();
    document.getElementById('archetype-scenario-text').innerText = archetypeState.currentScenario.text;
    
    const allSigns = Object.keys(zodiacData);
    const wrongSigns = shuffleArray(allSigns.filter(s => s !== archetypeState.currentScenario.sign)).slice(0, 3);
    const options = shuffleArray([archetypeState.currentScenario.sign, ...wrongSigns]);
    const btnContainer = document.getElementById('archetype-buttons');
    btnContainer.innerHTML = '';
    
    options.forEach(sign => {
        const btn = document.createElement('button');
        btn.className = 'glow-btn outline';
        btn.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; font-size: 1.1rem;">
                <div style="width: 45px; height: 45px; color: ${zodiacData[sign].aura}; display: flex; align-items: center; justify-content: center;">
                    ${zodiacData[sign].svgIcon}
                </div><span>${sign}</span>
            </div>`;
        btn.style.color = '#fff'; btn.style.borderColor = 'rgba(255, 255, 255, 0.2)'; btn.style.padding = '15px';
        btn.onclick = () => handleArchetypeGuess(sign, btn);
        btnContainer.appendChild(btn);
    });
}

function handleArchetypeGuess(guessedSign, btnElement) {
    if (!archetypeState.timerActive) return;
    if (!archetypeState.hasStarted) { archetypeState.hasStarted = true; startArchetypeTimer(); }
    
    if (guessedSign === archetypeState.currentScenario.sign) {
        archetypeState.score++; archetypeState.matchedCount++;
        document.getElementById('archetype-score').innerText = archetypeState.score;
        if (typeof playSound === 'function') playSound('success');
        btnElement.style.borderColor = '#22c55e'; btnElement.style.color = '#22c55e';
    } else {
        btnElement.style.borderColor = '#ef4444'; btnElement.style.color = '#ef4444';
        archetypeState.questionPool.unshift(archetypeState.currentScenario); shuffleArray(archetypeState.questionPool);
        const allBtns = document.getElementById('archetype-buttons').children;
        for (let b of allBtns) {
            if (b.innerText.includes(archetypeState.currentScenario.sign)) { b.style.borderColor = '#22c55e'; b.style.color = '#22c55e'; }
        }
    }
    const allBtns = document.getElementById('archetype-buttons').children;
    for (let b of allBtns) { b.onclick = null; }
    
    setTimeout(() => {
        if (archetypeState.matchedCount >= archetypeScenarios.length) endArchetypeGame(true);
        else loadNextArchetype();
    }, 800); 
}

function endArchetypeGame(isWin = false) {
    clearInterval(archetypeState.timerInterval); archetypeState.timerActive = false;
    let title = isWin ? "Cosmic Mastery! 🏆" : "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroArchetypeHighScore') || 0);
    let msg = isWin ? `Flawless! You deciphered all ${archetypeScenarios.length} scenarios with ${archetypeState.timeLeft} seconds left.\nFinal Score: ${archetypeState.score}` : `You correctly guessed ${archetypeState.matchedCount} archetypes.\nFinal Score: ${archetypeState.score}`;
    if (archetypeState.score > storedHighScore) {
        localStorage.setItem('astroArchetypeHighScore', archetypeState.score);
        document.getElementById('archetype-highscore').innerText = archetypeState.score;
        title = "New High Score! 🌟"; msg = (isWin ? `You read their minds perfectly!\n\n` : `Great intuition!\n\n`) + msg;
    }
    showCosmicModal(title, msg, () => initArchetypeGame());
}

// ==========================================
// GAME 4: CELESTIAL RULERS
// ==========================================
let rulerState = { score: 0, timeLeft: 60, timerActive: false, timerInterval: null, currentSign: null, currentSignKey: null, hasStarted: false, signPool: [], matchedCount: 0 };
const allPlanets = [...new Set(Object.values(zodiacData).map(s => s.planet))];

function initRulerGame() {
    if (rulerState.timerInterval) clearInterval(rulerState.timerInterval);
    rulerState = { score: 0, timeLeft: 60, timerActive: true, timerInterval: null, currentSign: null, currentSignKey: null, hasStarted: false, signPool: shuffleArray(Object.keys(zodiacData)), matchedCount: 0 };
    document.getElementById('ruler-highscore').innerText = localStorage.getItem('astroRulerHighScore') || 0;
    document.getElementById('ruler-score').innerText = '0';
    document.getElementById('ruler-timer').innerText = '01:00';
    loadNextRulerCard();
}

function startRulerTimer() {
    rulerState.timerInterval = setInterval(() => {
        rulerState.timeLeft--;
        let mins = Math.floor(rulerState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (rulerState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('ruler-timer').innerText = `${mins}:${secs}`;
        if (rulerState.timeLeft <= 0) endRulerGame(false);
    }, 1000);
}

function loadNextRulerCard() {
    const randomSignKey = rulerState.signPool.pop();
    rulerState.currentSignKey = randomSignKey;
    rulerState.currentSign = zodiacData[randomSignKey];
    
    const cardIcon = document.getElementById('ruler-card-icon');
    const cardName = document.getElementById('ruler-card-name');
    const card = document.getElementById('ruler-current-card');
    card.style.borderColor = rulerState.currentSign.aura;
    card.style.boxShadow = `0 0 10px ${rulerState.currentSign.aura}33`;
    cardIcon.style.color = rulerState.currentSign.aura;
    cardIcon.innerHTML = rulerState.currentSign.svgIcon;
    const svgElement = cardIcon.querySelector('svg');
    if(svgElement) { svgElement.style.width = '60px'; svgElement.style.height = '60px'; }
    cardName.innerText = rulerState.currentSign.name;
    cardName.style.color = rulerState.currentSign.aura;
    
    const correctPlanet = rulerState.currentSign.planet;
    const wrongPlanets = shuffleArray(allPlanets.filter(p => p !== correctPlanet)).slice(0, 3);
    const options = shuffleArray([correctPlanet, ...wrongPlanets]);
    const btnContainer = document.getElementById('ruler-buttons');
    btnContainer.innerHTML = '';
    
    options.forEach(planet => {
        const btn = document.createElement('button');
        btn.className = 'glow-btn outline'; btn.innerText = planet; btn.style.color = '#fff'; btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        btn.onclick = () => handleRulerGuess(planet, btn); btnContainer.appendChild(btn);
    });
}

function handleRulerGuess(guessedPlanet, btnElement) {
    if (!rulerState.timerActive) return;
    if (!rulerState.hasStarted) { rulerState.hasStarted = true; startRulerTimer(); }
    const card = document.getElementById('ruler-current-card');
    if (guessedPlanet === rulerState.currentSign.planet) {
        rulerState.score++; rulerState.matchedCount++; document.getElementById('ruler-score').innerText = rulerState.score;
        if (typeof playSound === 'function') playSound('success');
        btnElement.style.borderColor = '#22c55e'; btnElement.style.color = '#22c55e'; card.style.transform = 'scale(1.1)'; 
    } else {
        rulerState.score = Math.max(0, rulerState.score - 1); document.getElementById('ruler-score').innerText = rulerState.score;
        btnElement.style.borderColor = '#ef4444'; btnElement.style.color = '#ef4444'; card.style.transform = 'translateX(-10px)'; 
        rulerState.signPool.unshift(rulerState.currentSignKey); shuffleArray(rulerState.signPool);
        const allBtns = document.getElementById('ruler-buttons').children;
        for (let b of allBtns) { if (b.innerText === rulerState.currentSign.planet) { b.style.borderColor = '#22c55e'; b.style.color = '#22c55e'; } }
    }
    const allBtns = document.getElementById('ruler-buttons').children;
    for (let b of allBtns) { b.onclick = null; }
    setTimeout(() => {
        card.style.transform = 'none';
        if (rulerState.matchedCount >= 12) endRulerGame(true);
        else loadNextRulerCard();
    }, 600);
}

function endRulerGame(isWin = false) {
    clearInterval(rulerState.timerInterval); rulerState.timerActive = false;
    let title = isWin ? "Cosmic Mastery! 🏆" : "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroRulerHighScore') || 0);
    let msg = isWin ? `Incredible! You matched all 12 planets with ${rulerState.timeLeft} seconds left.\nFinal Score: ${rulerState.score}` : `You matched ${rulerState.matchedCount} planets.\nFinal Score: ${rulerState.score}`;
    if (rulerState.score > storedHighScore) {
        localStorage.setItem('astroRulerHighScore', rulerState.score); document.getElementById('ruler-highscore').innerText = rulerState.score;
        title = "New High Score! 🌟"; msg = isWin ? `You mastered all planetary domains perfectly!\n\n` + msg : `You mastered the planetary domains!\n\n` + msg;
    }
    showCosmicModal(title, msg, () => initRulerGame());
}

// ==========================================
// GAME 5: COSMIC TRUTHS (True or False)
// ==========================================
let truthState = { score: 0, timeLeft: 60, timerActive: false, timerInterval: null, currentAnswer: null, currentSignName: null, hasStarted: false, signPool: [], matchedCount: 0 };

function initTruthGame() {
    if (truthState.timerInterval) clearInterval(truthState.timerInterval);
    truthState = { score: 0, timeLeft: 60, timerActive: true, timerInterval: null, currentAnswer: null, currentSignName: null, hasStarted: false, signPool: shuffleArray(Object.keys(zodiacData)), matchedCount: 0 };
    document.getElementById('truth-highscore').innerText = localStorage.getItem('astroTruthHighScore') || 0;
    document.getElementById('truth-score').innerText = '0';
    document.getElementById('truth-timer').innerText = '01:00';
    loadNextTruthCard();
}

function startTruthTimer() {
    truthState.timerInterval = setInterval(() => {
        truthState.timeLeft--;
        let mins = Math.floor(truthState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (truthState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('truth-timer').innerText = `${mins}:${secs}`;
        if (truthState.timeLeft <= 0) endTruthGame(false);
    }, 1000);
}

function loadNextTruthCard() {
    const signName = truthState.signPool.pop();
    truthState.currentSignName = signName;
    const sign = zodiacData[signName];
    const isPlanetQuestion = Math.random() > 0.5;
    const isTrueStatement = Math.random() > 0.5;
    let statementText = "";
    
    if (isPlanetQuestion) {
        let planet = sign.planet;
        if (!isTrueStatement) {
            const allPlanetsList = [...new Set(Object.values(zodiacData).map(s => s.planet))];
            const wrongPlanets = allPlanetsList.filter(p => p !== planet);
            planet = wrongPlanets[Math.floor(Math.random() * wrongPlanets.length)];
        }
        statementText = `${planet} is the ruling planet of ${signName}.`;
    } else {
        let element = sign.element;
        if (!isTrueStatement) {
            const elementsList = ["Fire", "Earth", "Air", "Water"].filter(e => e !== element);
            element = elementsList[Math.floor(Math.random() * elementsList.length)];
        }
        statementText = `${signName} is an ${element} sign.`;
    }
    
    truthState.currentAnswer = isTrueStatement;
    const card = document.getElementById('truth-current-card');
    const cardIcon = document.getElementById('truth-card-icon');
    card.style.borderColor = sign.aura; card.style.boxShadow = `0 0 10px ${sign.aura}33`;
    cardIcon.style.color = sign.aura; cardIcon.innerHTML = sign.svgIcon;
    const svgEl = cardIcon.querySelector('svg'); if(svgEl) { svgEl.style.width = '100%'; svgEl.style.height = '100%'; }
    document.getElementById('truth-scenario-text').innerText = statementText;
}

function handleTruthGuess(guessedAnswer) {
    if (!truthState.timerActive) return;
    if (!truthState.hasStarted) { truthState.hasStarted = true; startTruthTimer(); }
    
    const card = document.getElementById('truth-current-card');
    if (guessedAnswer === truthState.currentAnswer) {
        truthState.score++; truthState.matchedCount++; document.getElementById('truth-score').innerText = truthState.score;
        if (typeof playSound === 'function') playSound('success');
        card.style.borderColor = '#22c55e'; card.style.transform = 'scale(1.05)';
    } else {
        truthState.score = Math.max(0, truthState.score - 1); document.getElementById('truth-score').innerText = truthState.score;
        card.style.borderColor = '#ef4444'; card.style.transform = 'translateX(-10px)'; 
        truthState.signPool.unshift(truthState.currentSignName); shuffleArray(truthState.signPool);
    }
    
    const btns = document.getElementById('truth-buttons').querySelectorAll('button');
    btns.forEach(b => b.disabled = true);
    setTimeout(() => {
        card.style.transform = 'none'; btns.forEach(b => b.disabled = false);
        if (truthState.matchedCount >= 12) endTruthGame(true);
        else loadNextTruthCard();
    }, 400);
}

function endTruthGame(isWin = false) {
    clearInterval(truthState.timerInterval); truthState.timerActive = false;
    let title = isWin ? "Cosmic Mastery! 🏆" : "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroTruthHighScore') || 0);
    let msg = isWin ? `Perfect! You revealed all 12 cosmic truths with ${truthState.timeLeft} seconds left.\nFinal Score: ${truthState.score}` : `You unlocked ${truthState.matchedCount} truths.\nFinal Score: ${truthState.score}`;
    if (truthState.score > storedHighScore) {
        localStorage.setItem('astroTruthHighScore', truthState.score); document.getElementById('truth-highscore').innerText = truthState.score;
        title = "New High Score! 🌟"; msg = (isWin ? `You are a master of the cosmic facts!\n\n` : `Great knowledge!\n\n`) + msg;
    }
    showCosmicModal(title, msg, () => initTruthGame());
}

// ==========================================
// GAME 6: CONSTELLATION TRACER
// ==========================================
const starMaps = {
    "Aries": `<svg viewBox="0 0 100 100"><polyline points="20,80 40,50 80,40 90,50" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="20" cy="80" r="3" fill="currentColor"/><circle cx="40" cy="50" r="3" fill="currentColor"/><circle cx="80" cy="40" r="3" fill="currentColor"/><circle cx="90" cy="50" r="3" fill="currentColor"/></svg>`,
    "Taurus": `<svg viewBox="0 0 100 100"><polyline points="90,10 60,40 40,50 30,60 20,80" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="60,40 80,60" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="90" cy="10" r="3" fill="currentColor"/><circle cx="60" cy="40" r="4" fill="currentColor"/><circle cx="40" cy="50" r="3" fill="currentColor"/><circle cx="30" cy="60" r="3" fill="currentColor"/><circle cx="20" cy="80" r="3" fill="currentColor"/><circle cx="80" cy="60" r="3" fill="currentColor"/></svg>`,
    "Gemini": `<svg viewBox="0 0 100 100"><polyline points="20,80 30,50 40,30 60,20 80,30" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="30,50 50,60 70,50 80,30" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="20" cy="80" r="3" fill="currentColor"/><circle cx="30" cy="50" r="3" fill="currentColor"/><circle cx="40" cy="30" r="4" fill="currentColor"/><circle cx="60" cy="20" r="3" fill="currentColor"/><circle cx="80" cy="30" r="4" fill="currentColor"/><circle cx="50" cy="60" r="3" fill="currentColor"/><circle cx="70" cy="50" r="3" fill="currentColor"/></svg>`,
    "Cancer": `<svg viewBox="0 0 100 100"><polyline points="20,40 40,50 60,40 80,60" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="40,50 50,70" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="20" cy="40" r="3" fill="currentColor"/><circle cx="40" cy="50" r="4" fill="currentColor"/><circle cx="60" cy="40" r="3" fill="currentColor"/><circle cx="80" cy="60" r="3" fill="currentColor"/><circle cx="50" cy="70" r="3" fill="currentColor"/></svg>`,
    "Leo": `<svg viewBox="0 0 100 100"><polyline points="90,40 70,20 40,30 20,50 30,80 60,70 90,40" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="40,30 60,70" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="90" cy="40" r="3" fill="currentColor"/><circle cx="70" cy="20" r="3" fill="currentColor"/><circle cx="40" cy="30" r="3" fill="currentColor"/><circle cx="20" cy="50" r="3" fill="currentColor"/><circle cx="30" cy="80" r="4" fill="currentColor"/><circle cx="60" cy="70" r="3" fill="currentColor"/></svg>`,
    "Virgo": `<svg viewBox="0 0 100 100"><polyline points="80,10 60,30 40,40 20,60 30,80 50,70 70,50 90,70" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="40,40 70,50" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="80" cy="10" r="3" fill="currentColor"/><circle cx="60" cy="30" r="3" fill="currentColor"/><circle cx="40" cy="40" r="3" fill="currentColor"/><circle cx="20" cy="60" r="3" fill="currentColor"/><circle cx="30" cy="80" r="4" fill="currentColor"/><circle cx="50" cy="70" r="3" fill="currentColor"/><circle cx="70" cy="50" r="3" fill="currentColor"/><circle cx="90" cy="70" r="3" fill="currentColor"/></svg>`,
    "Libra": `<svg viewBox="0 0 100 100"><polyline points="20,60 50,40 80,60" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="50,40 40,80 60,80 50,40" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="20" cy="60" r="3" fill="currentColor"/><circle cx="50" cy="40" r="4" fill="currentColor"/><circle cx="80" cy="60" r="3" fill="currentColor"/><circle cx="40" cy="80" r="3" fill="currentColor"/><circle cx="60" cy="80" r="3" fill="currentColor"/></svg>`,
    "Scorpio": `<svg viewBox="0 0 100 100"><polyline points="80,20 60,30 40,40 20,50 30,70 50,80 70,70 80,50 60,60" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="80" cy="20" r="3" fill="currentColor"/><circle cx="60" cy="30" r="3" fill="currentColor"/><circle cx="40" cy="40" r="4" fill="currentColor"/><circle cx="20" cy="50" r="3" fill="currentColor"/><circle cx="30" cy="70" r="3" fill="currentColor"/><circle cx="50" cy="80" r="3" fill="currentColor"/><circle cx="70" cy="70" r="3" fill="currentColor"/><circle cx="80" cy="50" r="3" fill="currentColor"/><circle cx="60" cy="60" r="3" fill="currentColor"/></svg>`,
    "Sagittarius": `<svg viewBox="0 0 100 100"><polyline points="20,80 40,60 30,40 50,30 70,20 80,40 60,50 40,60" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="50,30 60,50 80,70" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="20" cy="80" r="3" fill="currentColor"/><circle cx="40" cy="60" r="3" fill="currentColor"/><circle cx="30" cy="40" r="3" fill="currentColor"/><circle cx="50" cy="30" r="3" fill="currentColor"/><circle cx="70" cy="20" r="3" fill="currentColor"/><circle cx="80" cy="40" r="3" fill="currentColor"/><circle cx="60" cy="50" r="3" fill="currentColor"/><circle cx="80" cy="70" r="3" fill="currentColor"/></svg>`,
    "Capricorn": `<svg viewBox="0 0 100 100"><polyline points="80,40 60,20 40,30 20,50 40,70 60,80 80,60 80,40" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="40,30 80,60" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="80" cy="40" r="3" fill="currentColor"/><circle cx="60" cy="20" r="3" fill="currentColor"/><circle cx="40" cy="30" r="3" fill="currentColor"/><circle cx="20" cy="50" r="3" fill="currentColor"/><circle cx="40" cy="70" r="3" fill="currentColor"/><circle cx="60" cy="80" r="3" fill="currentColor"/><circle cx="80" cy="60" r="3" fill="currentColor"/></svg>`,
    "Aquarius": `<svg viewBox="0 0 100 100"><polyline points="20,50 40,40 50,20 70,30 90,20" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="40,40 50,60 40,80 20,70" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="50,60 70,70 90,80" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="20" cy="50" r="3" fill="currentColor"/><circle cx="40" cy="40" r="3" fill="currentColor"/><circle cx="50" cy="20" r="3" fill="currentColor"/><circle cx="70" cy="30" r="3" fill="currentColor"/><circle cx="90" cy="20" r="3" fill="currentColor"/><circle cx="50" cy="60" r="3" fill="currentColor"/><circle cx="40" cy="80" r="3" fill="currentColor"/><circle cx="20" cy="70" r="3" fill="currentColor"/><circle cx="70" cy="70" r="3" fill="currentColor"/><circle cx="90" cy="80" r="3" fill="currentColor"/></svg>`,
    "Pisces": `<svg viewBox="0 0 100 100"><polyline points="20,20 40,30 30,50 20,20" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="40,30 60,70" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polyline points="80,80 60,70 70,50 80,80" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="20" cy="20" r="3" fill="currentColor"/><circle cx="40" cy="30" r="3" fill="currentColor"/><circle cx="30" cy="50" r="3" fill="currentColor"/><circle cx="60" cy="70" r="3" fill="currentColor"/><circle cx="80" cy="80" r="3" fill="currentColor"/><circle cx="70" cy="50" r="3" fill="currentColor"/></svg>`
};

let tracerState = { score: 0, timeLeft: 60, timerActive: false, timerInterval: null, currentSignName: null, hasStarted: false, signPool: [], matchedCount: 0 };

function initTracerGame() {
    if (tracerState.timerInterval) clearInterval(tracerState.timerInterval);
    tracerState = { score: 0, timeLeft: 60, timerActive: true, timerInterval: null, currentSignName: null, hasStarted: false, signPool: shuffleArray(Object.keys(starMaps)), matchedCount: 0 };
    document.getElementById('tracer-highscore').innerText = localStorage.getItem('astroTracerHighScore') || 0;
    document.getElementById('tracer-score').innerText = '0';
    document.getElementById('tracer-timer').innerText = '01:00';
    loadNextTracerCard();
}

function startTracerTimer() {
    tracerState.timerInterval = setInterval(() => {
        tracerState.timeLeft--;
        let mins = Math.floor(tracerState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (tracerState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('tracer-timer').innerText = `${mins}:${secs}`;
        if (tracerState.timeLeft <= 0) endTracerGame(false);
    }, 1000);
}

function loadNextTracerCard() {
    const signName = tracerState.signPool.pop();
    tracerState.currentSignName = signName;
    const card = document.getElementById('tracer-current-card');
    const cardIcon = document.getElementById('tracer-card-icon');
    card.style.borderColor = zodiacData[signName].aura; card.style.boxShadow = `0 0 15px ${zodiacData[signName].aura}44`;
    cardIcon.style.color = zodiacData[signName].aura; cardIcon.innerHTML = starMaps[signName];
    
    const allSigns = Object.keys(starMaps);
    const wrongSigns = shuffleArray(allSigns.filter(s => s !== signName)).slice(0, 3);
    const options = shuffleArray([signName, ...wrongSigns]);
    const btnContainer = document.getElementById('tracer-buttons');
    btnContainer.innerHTML = '';
    
    options.forEach(sign => {
        const btn = document.createElement('button');
        btn.className = 'glow-btn outline'; btn.innerText = sign; btn.style.color = '#fff'; btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        btn.onclick = () => handleTracerGuess(sign, btn); btnContainer.appendChild(btn);
    });
}

function handleTracerGuess(guessedSign, btnElement) {
    if (!tracerState.timerActive) return;
    if (!tracerState.hasStarted) { tracerState.hasStarted = true; startTracerTimer(); }
    const card = document.getElementById('tracer-current-card');
    
    if (guessedSign === tracerState.currentSignName) {
        tracerState.score++; tracerState.matchedCount++; document.getElementById('tracer-score').innerText = tracerState.score;
        if (typeof playSound === 'function') playSound('success');
        btnElement.style.borderColor = '#22c55e'; btnElement.style.color = '#22c55e'; card.style.transform = 'scale(1.05)';
    } else {
        tracerState.score = Math.max(0, tracerState.score - 1); document.getElementById('tracer-score').innerText = tracerState.score;
        btnElement.style.borderColor = '#ef4444'; btnElement.style.color = '#ef4444'; card.style.transform = 'translateX(-10px)'; 
        tracerState.signPool.unshift(tracerState.currentSignName); shuffleArray(tracerState.signPool);
        const allBtns = document.getElementById('tracer-buttons').children;
        for (let b of allBtns) { if (b.innerText === tracerState.currentSignName) { b.style.borderColor = '#22c55e'; b.style.color = '#22c55e'; } }
    }
    const allBtns = document.getElementById('tracer-buttons').children;
    for (let b of allBtns) { b.onclick = null; }
    
    setTimeout(() => {
        card.style.transform = 'none';
        if (tracerState.matchedCount >= 12) endTracerGame(true);
        else loadNextTracerCard();
    }, 600);
}

function endTracerGame(isWin = false) {
    clearInterval(tracerState.timerInterval); tracerState.timerActive = false;
    let title = isWin ? "Cosmic Mastery! 🏆" : "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroTracerHighScore') || 0);
    let msg = isWin ? `Incredible! You mapped all 12 constellations with ${tracerState.timeLeft} seconds left.\nFinal Score: ${tracerState.score}` : `You traced ${tracerState.matchedCount} constellations.\nFinal Score: ${tracerState.score}`;
    if (tracerState.score > storedHighScore) {
        localStorage.setItem('astroTracerHighScore', tracerState.score); document.getElementById('tracer-highscore').innerText = tracerState.score;
        title = "New High Score! 🌟"; msg = (isWin ? `You are a true Stargazer!\n\n` : `Great navigation!\n\n`) + msg;
    }
    showCosmicModal(title, msg, () => initTracerGame());
}


// ==========================================
// GAME 7: TAROT MEMORY MATRIX
// ==========================================
const tarotCards = [
    { id: "fool", name: "The Fool", symbol: "🃏" }, { id: "magician", name: "The Magician", symbol: "🪄" },
    { id: "priestess", name: "The High Priestess", symbol: "👁️" }, { id: "empress", name: "The Empress", symbol: "👑" },
    { id: "emperor", name: "The Emperor", symbol: "🛡️" }, { id: "lovers", name: "The Lovers", symbol: "💞" },
    { id: "chariot", name: "The Chariot", symbol: "🚀" }, { id: "strength", name: "Strength", symbol: "🦁" }
];

let tarotState = { matchedCount: 0, timeLeft: 60, timerActive: false, timerInterval: null, hasStarted: false, firstCard: null, secondCard: null, lockBoard: false };

function initTarotGame() {
    if (tarotState.timerInterval) clearInterval(tarotState.timerInterval);
    tarotState = { matchedCount: 0, timeLeft: 60, timerActive: true, timerInterval: null, hasStarted: false, firstCard: null, secondCard: null, lockBoard: false };
    document.getElementById('tarot-highscore').innerText = localStorage.getItem('astroTarotHighScore') || 0;
    document.getElementById('tarot-score').innerText = '0';
    document.getElementById('tarot-timer').innerText = '01:00';
    
    let deck = [];
    tarotCards.forEach(card => {
        deck.push({ id: card.id, content: card.name, type: 'name' });
        deck.push({ id: card.id, content: card.symbol, type: 'symbol' });
    });
    deck = shuffleArray(deck);
    
    const board = document.getElementById('tarot-board');
    board.innerHTML = '';
    deck.forEach((card, index) => {
        const el = document.createElement('div');
        el.className = 'tarot-memory-card';
        el.dataset.id = card.id;
        el.dataset.index = index;
        el.innerHTML = `<div class="tmc-face tmc-back">✧</div><div class="tmc-face tmc-front" style="font-size: ${card.type==='symbol' ? '2.5rem' : '0.9rem'};">${card.content}</div>`;
        el.onclick = () => handleTarotFlip(el);
        board.appendChild(el);
    });
}

function startTarotTimer() {
    tarotState.timerInterval = setInterval(() => {
        tarotState.timeLeft--;
        let mins = Math.floor(tarotState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (tarotState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('tarot-timer').innerText = `${mins}:${secs}`;
        if (tarotState.timeLeft <= 0) endTarotGame(false);
    }, 1000);
}

function handleTarotFlip(card) {
    if (tarotState.lockBoard || card.classList.contains('flipped') || card.classList.contains('matched') || !tarotState.timerActive) return;
    if (!tarotState.hasStarted) { tarotState.hasStarted = true; startTarotTimer(); }
    
    card.classList.add('flipped');
    if (!tarotState.firstCard) { tarotState.firstCard = card; return; }
    
    tarotState.secondCard = card;
    tarotState.lockBoard = true;
    
    if (tarotState.firstCard.dataset.id === tarotState.secondCard.dataset.id) {
        tarotState.matchedCount++;
        document.getElementById('tarot-score').innerText = tarotState.matchedCount;
        if (typeof playSound === 'function') playSound('success');
        tarotState.firstCard.classList.add('matched'); tarotState.secondCard.classList.add('matched');
        tarotState.firstCard = null; tarotState.secondCard = null; tarotState.lockBoard = false;
        if (tarotState.matchedCount === 8) endTarotGame(true);
    } else {
        setTimeout(() => {
            tarotState.firstCard.classList.remove('flipped'); tarotState.secondCard.classList.remove('flipped');
            tarotState.firstCard = null; tarotState.secondCard = null; tarotState.lockBoard = false;
        }, 1000);
    }
}

function endTarotGame(isWin = false) {
    clearInterval(tarotState.timerInterval); tarotState.timerActive = false;
    let title = isWin ? "Cosmic Mastery! 🏆" : "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroTarotHighScore') || 0);
    let msg = isWin ? `You matched all 8 pairs with ${tarotState.timeLeft} seconds left.` : `You matched ${tarotState.matchedCount} pairs.`;
    if (tarotState.matchedCount > storedHighScore) {
        localStorage.setItem('astroTarotHighScore', tarotState.matchedCount); document.getElementById('tarot-highscore').innerText = tarotState.matchedCount;
        title = "New High Score! 🌟"; msg = (isWin ? `A true Oracle!\n\n` : `Great memory!\n\n`) + msg;
    }
    showCosmicModal(title, msg, () => initTarotGame());
}

// ==========================================
// GAME 8: COSMIC CHEMISTRY
// ==========================================
const chemistryPairs = [
    { s1: "Aries", s2: "Leo", ans: "Soulmates" }, { s1: "Taurus", s2: "Virgo", ans: "Soulmates" },
    { s1: "Gemini", s2: "Libra", ans: "Soulmates" }, { s1: "Cancer", s2: "Capricorn", ans: "Challenging" },
    { s1: "Leo", s2: "Scorpio", ans: "Challenging" }, { s1: "Aries", s2: "Cancer", ans: "Challenging" },
    { s1: "Gemini", s2: "Scorpio", ans: "Wildcard" }, { s1: "Aquarius", s2: "Taurus", ans: "Wildcard" },
    { s1: "Pisces", s2: "Sagittarius", ans: "Wildcard" }, { s1: "Virgo", s2: "Pisces", ans: "Challenging" },
    { s1: "Libra", s2: "Aquarius", ans: "Soulmates" }, { s1: "Scorpio", s2: "Cancer", ans: "Soulmates" }
];

let chemState = { score: 0, timeLeft: 60, timerActive: false, timerInterval: null, currentPair: null, hasStarted: false, pool: [], matchedCount: 0 };

function initChemistryGame() {
    if (chemState.timerInterval) clearInterval(chemState.timerInterval);
    chemState = { score: 0, timeLeft: 60, timerActive: true, timerInterval: null, currentPair: null, hasStarted: false, pool: shuffleArray([...chemistryPairs]), matchedCount: 0 };
    document.getElementById('chem-highscore').innerText = localStorage.getItem('astroChemHighScore') || 0;
    document.getElementById('chem-score').innerText = '0';
    document.getElementById('chem-timer').innerText = '01:00';
    loadNextChemCard();
}

function startChemTimer() {
    chemState.timerInterval = setInterval(() => {
        chemState.timeLeft--;
        let mins = Math.floor(chemState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (chemState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('chem-timer').innerText = `${mins}:${secs}`;
        if (chemState.timeLeft <= 0) endChemGame(false);
    }, 1000);
}

function loadNextChemCard() {
    chemState.currentPair = chemState.pool.pop();
    const s1 = zodiacData[chemState.currentPair.s1]; const s2 = zodiacData[chemState.currentPair.s2];
    const icon1 = document.getElementById('chem-sign1'); const icon2 = document.getElementById('chem-sign2');
    icon1.innerHTML = s1.svgIcon; icon1.style.color = s1.aura; icon1.style.width = '60px'; icon1.style.height = '60px';
    icon2.innerHTML = s2.svgIcon; icon2.style.color = s2.aura; icon2.style.width = '60px'; icon2.style.height = '60px';
}

function handleChemGuess(guess) {
    if (!chemState.timerActive) return;
    if (!chemState.hasStarted) { chemState.hasStarted = true; startChemTimer(); }
    const card = document.getElementById('chem-current-card');
    
    if (guess === chemState.currentPair.ans) {
        chemState.score++; chemState.matchedCount++; document.getElementById('chem-score').innerText = chemState.score;
        if (typeof playSound === 'function') playSound('success');
        card.style.borderColor = '#22c55e'; card.style.transform = 'scale(1.05)';
    } else {
        chemState.score = Math.max(0, chemState.score - 1); document.getElementById('chem-score').innerText = chemState.score;
        card.style.borderColor = '#ef4444'; card.style.transform = 'translateX(-10px)'; 
        chemState.pool.unshift(chemState.currentPair); shuffleArray(chemState.pool);
    }
    
    setTimeout(() => {
        card.style.transform = 'none'; card.style.borderColor = '#f43f5e';
        if (chemState.matchedCount >= 12) endChemGame(true);
        else loadNextChemCard();
    }, 400);
}

function endChemGame(isWin = false) {
    clearInterval(chemState.timerInterval); chemState.timerActive = false;
    let title = isWin ? "Cosmic Mastery! 🏆" : "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroChemHighScore') || 0);
    let msg = isWin ? `You mastered synastry with ${chemState.timeLeft} seconds left.\nFinal Score: ${chemState.score}` : `You matched ${chemState.matchedCount} pairings.\nFinal Score: ${chemState.score}`;
    if (chemState.score > storedHighScore) {
        localStorage.setItem('astroChemHighScore', chemState.score); document.getElementById('chem-highscore').innerText = chemState.score;
        title = "New High Score! 🌟"; msg = (isWin ? `Cupid of the Stars!\n\n` : `Great intuition!\n\n`) + msg;
    }
    showCosmicModal(title, msg, () => initChemistryGame());
}

// ==========================================
// GAME 9: RETROGRADE ROULETTE
// ==========================================
const retrogradeScenarios = [
    { p: "Mercury", text: "Sign a 2-year apartment lease.", ans: false }, { p: "Mercury", text: "Reorganize your messy closet.", ans: true },
    { p: "Venus", text: "Text your ex 'I miss you'.", ans: false }, { p: "Venus", text: "Focus on self-care and a spa day.", ans: true },
    { p: "Mars", text: "Start a heated argument with a coworker.", ans: false }, { p: "Mars", text: "Reflect on where your anger comes from.", ans: true },
    { p: "Jupiter", text: "Make a massive, risky financial investment.", ans: false }, { p: "Jupiter", text: "Re-evaluate your long-term goals.", ans: true },
    { p: "Mercury", text: "Buy an expensive new laptop.", ans: false }, { p: "Venus", text: "Get a drastic, spontaneous new haircut.", ans: false }
];

let retroState = { score: 0, timeLeft: 60, timerActive: false, timerInterval: null, currentScenario: null, hasStarted: false, pool: [], matchedCount: 0 };

function initRetrogradeGame() {
    if (retroState.timerInterval) clearInterval(retroState.timerInterval);
    retroState = { score: 0, timeLeft: 60, timerActive: true, timerInterval: null, currentScenario: null, hasStarted: false, pool: shuffleArray([...retrogradeScenarios]), matchedCount: 0 };
    document.getElementById('retro-highscore').innerText = localStorage.getItem('astroRetroHighScore') || 0;
    document.getElementById('retro-score').innerText = '0';
    document.getElementById('retro-timer').innerText = '01:00';
    loadNextRetroCard();
}

function startRetroTimer() {
    retroState.timerInterval = setInterval(() => {
        retroState.timeLeft--;
        let mins = Math.floor(retroState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (retroState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('retro-timer').innerText = `${mins}:${secs}`;
        if (retroState.timeLeft <= 0) endRetroGame(false);
    }, 1000);
}

function loadNextRetroCard() {
    retroState.currentScenario = retroState.pool.pop();
    document.getElementById('retro-planet').innerText = `${retroState.currentScenario.p} Retrograde`;
    document.getElementById('retro-scenario').innerText = `"${retroState.currentScenario.text}"`;
}

function handleRetroGuess(guess) {
    if (!retroState.timerActive) return;
    if (!retroState.hasStarted) { retroState.hasStarted = true; startRetroTimer(); }
    const card = document.getElementById('retro-current-card');
    
    if (guess === retroState.currentScenario.ans) {
        retroState.score++; retroState.matchedCount++; document.getElementById('retro-score').innerText = retroState.score;
        if (typeof playSound === 'function') playSound('success');
        card.style.borderColor = '#22c55e'; card.style.transform = 'scale(1.05)';
    } else {
        retroState.score = Math.max(0, retroState.score - 1); document.getElementById('retro-score').innerText = retroState.score;
        card.style.borderColor = '#ef4444'; card.style.transform = 'translateX(-10px)'; 
        retroState.pool.unshift(retroState.currentScenario); shuffleArray(retroState.pool);
    }
    
    setTimeout(() => {
        card.style.transform = 'none'; card.style.borderColor = '#fbbf24';
        if (retroState.matchedCount >= 10) endRetroGame(true);
        else loadNextRetroCard();
    }, 400);
}

function endRetroGame(isWin = false) {
    clearInterval(retroState.timerInterval); retroState.timerActive = false;
    let title = isWin ? "Cosmic Mastery! 🏆" : "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroRetroHighScore') || 0);
    let msg = isWin ? `Survived the Retrogrades with ${retroState.timeLeft} seconds left.\nFinal Score: ${retroState.score}` : `Navigated ${retroState.matchedCount} scenarios.\nFinal Score: ${retroState.score}`;
    if (retroState.score > storedHighScore) {
        localStorage.setItem('astroRetroHighScore', retroState.score); document.getElementById('retro-highscore').innerText = retroState.score;
        title = "New High Score! 🌟"; msg = (isWin ? `Astute Navigator!\n\n` : `Well dodged!\n\n`) + msg;
    }
    showCosmicModal(title, msg, () => initRetrogradeGame());
}

// ==========================================
// GAME 10: MOON PHASE MASTER
// ==========================================
const moonPhases = [
    { phase: "New Moon", icon: "🌑", meaning: "Set new intentions and plant seeds for the future." },
    { phase: "Waxing Crescent", icon: "🌒", meaning: "Take your first actions and build momentum." },
    { phase: "First Quarter", icon: "🌓", meaning: "Overcome obstacles and make firm decisions." },
    { phase: "Waxing Gibbous", icon: "🌔", meaning: "Refine, edit, and adjust your current path." },
    { phase: "Full Moon", icon: "🌕", meaning: "Release what no longer serves you and celebrate harvests." },
    { phase: "Waning Gibbous", icon: "🌖", meaning: "Show gratitude and share your wisdom with others." },
    { phase: "Third Quarter", icon: "🌗", meaning: "Forgive, clear out clutter, and break bad habits." },
    { phase: "Waning Crescent", icon: "🌘", meaning: "Rest, surrender, and prepare for the next cycle." }
];

let moonState = { score: 0, timeLeft: 60, timerActive: false, timerInterval: null, currentPhase: null, hasStarted: false, pool: [], matchedCount: 0 };

function initMoonGame() {
    if (moonState.timerInterval) clearInterval(moonState.timerInterval);
    moonState = { score: 0, timeLeft: 60, timerActive: true, timerInterval: null, currentPhase: null, hasStarted: false, pool: shuffleArray([...moonPhases]), matchedCount: 0 };
    document.getElementById('moon-highscore').innerText = localStorage.getItem('astroMoonHighScore') || 0;
    document.getElementById('moon-score').innerText = '0';
    document.getElementById('moon-timer').innerText = '01:00';
    loadNextMoonCard();
}

function startMoonTimer() {
    moonState.timerInterval = setInterval(() => {
        moonState.timeLeft--;
        let mins = Math.floor(moonState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (moonState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('moon-timer').innerText = `${mins}:${secs}`;
        if (moonState.timeLeft <= 0) endMoonGame(false);
    }, 1000);
}

function loadNextMoonCard() {
    moonState.currentPhase = moonState.pool.pop();
    document.getElementById('moon-icon').innerText = moonState.currentPhase.icon;
    document.getElementById('moon-name').innerText = moonState.currentPhase.phase;
    
    const wrongPhases = shuffleArray(moonPhases.filter(m => m.phase !== moonState.currentPhase.phase)).slice(0, 3);
    const options = shuffleArray([moonState.currentPhase, ...wrongPhases]);
    
    const btnContainer = document.getElementById('moon-buttons');
    btnContainer.innerHTML = '';
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'glow-btn outline'; btn.innerText = opt.meaning; 
        btn.style.color = '#fff'; btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        btn.style.fontSize = '0.9rem'; btn.style.textTransform = 'none';
        btn.onclick = () => handleMoonGuess(opt.phase, btn);
        btnContainer.appendChild(btn);
    });
}

function handleMoonGuess(guessedPhase, btnElement) {
    if (!moonState.timerActive) return;
    if (!moonState.hasStarted) { moonState.hasStarted = true; startMoonTimer(); }
    const card = document.getElementById('moon-current-card');
    
    if (guessedPhase === moonState.currentPhase.phase) {
        moonState.score++; moonState.matchedCount++; document.getElementById('moon-score').innerText = moonState.score;
        if (typeof playSound === 'function') playSound('success');
        btnElement.style.borderColor = '#22c55e'; btnElement.style.color = '#22c55e'; card.style.transform = 'scale(1.1)'; 
    } else {
        moonState.score = Math.max(0, moonState.score - 1); document.getElementById('moon-score').innerText = moonState.score;
        btnElement.style.borderColor = '#ef4444'; btnElement.style.color = '#ef4444'; card.style.transform = 'translateX(-10px)'; 
        moonState.pool.unshift(moonState.currentPhase); shuffleArray(moonState.pool);
    }
    
    const allBtns = document.getElementById('moon-buttons').children;
    for (let b of allBtns) { b.onclick = null; }
    
    setTimeout(() => {
        card.style.transform = 'none';
        if (moonState.matchedCount >= 8) endMoonGame(true);
        else loadNextMoonCard();
    }, 600);
}

function endMoonGame(isWin = false) {
    clearInterval(moonState.timerInterval); moonState.timerActive = false;
    let title = isWin ? "Cosmic Mastery! 🏆" : "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroMoonHighScore') || 0);
    let msg = isWin ? `Aligned all 8 phases with ${moonState.timeLeft} seconds left.\nFinal Score: ${moonState.score}` : `Aligned ${moonState.matchedCount} phases.\nFinal Score: ${moonState.score}`;
    if (moonState.score > storedHighScore) {
        localStorage.setItem('astroMoonHighScore', moonState.score); document.getElementById('moon-highscore').innerText = moonState.score;
        title = "New High Score! 🌟"; msg = (isWin ? `Lunar Master!\n\n` : `Great timing!\n\n`) + msg;
    }
    showCosmicModal(title, msg, () => initMoonGame());
}