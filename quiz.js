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
// UNIFIED COSMIC MODAL
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
const allGames = [
    'blitz', 'alchemist', 'archetype', 'ruler', 'truth', 'tracer', 
    'tarot', 'chemistry', 'retrograde', 'moon', 
    'aspects', 'houses', 'eclipse', 'balance', 'traveler'
];

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
    else if (gameId === 'aspects') { document.getElementById('aspectsView').style.display = 'block'; initAspectsGame(); }
    else if (gameId === 'houses') { document.getElementById('housesView').style.display = 'block'; initHousesGame(); }
    else if (gameId === 'eclipse') { document.getElementById('eclipseView').style.display = 'block'; initEclipseGame(); }
    else if (gameId === 'balance') { document.getElementById('balanceView').style.display = 'block'; initBalanceGame(); }
    else if (gameId === 'traveler') { document.getElementById('travelerView').style.display = 'block'; initTravelerGame(); }
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
    if (typeof aspectsState !== 'undefined' && aspectsState.timerInterval) clearInterval(aspectsState.timerInterval);
    if (typeof housesState !== 'undefined' && housesState.timerInterval) clearInterval(housesState.timerInterval);
    if (typeof eclipseState !== 'undefined' && eclipseState.timerInterval) clearInterval(eclipseState.timerInterval);
    if (typeof balanceState !== 'undefined' && balanceState.timerInterval) clearInterval(balanceState.timerInterval);
    if (typeof travelerState !== 'undefined' && travelerState.timerInterval) clearInterval(travelerState.timerInterval);
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
    { sign: "Aries", text: "Got impatient waiting for the microwave to finish and stopped it at 1 second." },
    { sign: "Aries", text: "Started a DIY project at 2 AM and got angry when it wasn't finished by 3 AM." },
    { sign: "Taurus", text: "Refused to go out because their favorite sweatpants were in the wash." },
    { sign: "Taurus", text: "Ordered takeout from the exact same restaurant for the 14th time in a row." },
    { sign: "Taurus", text: "Bought an expensive silk pillowcase because 'sleep is an investment'." },
    { sign: "Gemini", text: "Sent 8 separate text messages instead of one long paragraph." },
    { sign: "Gemini", text: "Started telling a story, got distracted, and finished a completely different story." },
    { sign: "Gemini", text: "Googled a random fact at 3 AM and went down a 4-hour Wikipedia rabbit hole." },
    { sign: "Cancer", text: "Kept a movie ticket stub from 2014 because 'it holds emotional value'." },
    { sign: "Cancer", text: "Canceled plans to stay home, wrap up in a blanket, and rewatch a comfort show." },
    { sign: "Cancer", text: "Cooked a three-course meal for a friend who had a bad day." },
    { sign: "Leo", text: "Practiced their 'surprised face' in the mirror just in case they win an award." },
    { sign: "Leo", text: "Accidentally turned a casual conversation into a 20-minute story about their own life." },
    { sign: "Leo", text: "Bought a round of drinks for the whole bar just to feel the applause." },
    { sign: "Virgo", text: "Corrected someone's grammar during an emotional argument." },
    { sign: "Virgo", text: "Made a detailed to-do list for their weekend relaxation time." },
    { sign: "Virgo", text: "Re-organized their apps by color and function." },
    { sign: "Libra", text: "Took 45 minutes to decide what to watch on Netflix, then fell asleep." },
    { sign: "Libra", text: "Agreed with both sides of an argument just to keep the peace." },
    { sign: "Libra", text: "Spent 20 minutes curating the perfect aesthetic Instagram story." },
    { sign: "Scorpio", text: "Did deep background research on their new coworker before saying 'hello'." },
    { sign: "Scorpio", text: "Remembered a minor insult from 5 years ago with perfect clarity." },
    { sign: "Scorpio", text: "Found out their crush's entire dating history just by knowing their first name." },
    { sign: "Sagittarius", text: "Booked a flight to another country because they got bored on a Tuesday." },
    { sign: "Sagittarius", text: "Accidentally insulted someone by being 'too honest'." },
    { sign: "Sagittarius", text: "Agreed to give a presentation on a topic they know nothing about." },
    { sign: "Capricorn", text: "Scheduled a 'mental breakdown' into their calendar for exactly 7:30 PM." },
    { sign: "Capricorn", text: "Felt a surge of romantic attraction when their partner paid a bill on time." },
    { sign: "Capricorn", text: "Created a 5-year plan spreadsheet on a Saturday night." },
    { sign: "Aquarius", text: "Ghosted everyone for a week to 'recharge', then returned like nothing happened." },
    { sign: "Aquarius", text: "Argued against a popular opinion just to play devil's advocate." },
    { sign: "Aquarius", text: "Argued that aliens built the pyramids just to see people's reactions." },
    { sign: "Pisces", text: "Cried because they saw an old man eating alone at a restaurant." },
    { sign: "Pisces", text: "Fell in love with someone they made eye contact with on the train for 2 seconds." },
    { sign: "Pisces", text: "Felt bad for an inanimate object and apologized to it." }
];

let archetypeState = { score: 0, timeLeft: 120, timerActive: false, timerInterval: null, currentScenario: null, hasStarted: false, questionPool: [], matchedCount: 0 };

function initArchetypeGame() {
    if (archetypeState.timerInterval) clearInterval(archetypeState.timerInterval);
    archetypeState = { score: 0, timeLeft: 120, timerActive: true, timerInterval: null, currentScenario: null, hasStarted: false, questionPool: shuffleArray([...archetypeScenarios]), matchedCount: 0 };
    document.getElementById('archetype-highscore').innerText = localStorage.getItem('astroArchetypeHighScore') || 0;
    document.getElementById('archetype-score').innerText = '0';
    document.getElementById('archetype-timer').innerText = '02:00';
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
    { s1: "Libra", s2: "Aquarius", ans: "Soulmates" }, { s1: "Scorpio", s2: "Cancer", ans: "Soulmates" },
    { s1: "Aries", s2: "Aries", ans: "Wildcard" }, { s1: "Taurus", s2: "Scorpio", ans: "Soulmates" },
    { s1: "Gemini", s2: "Sagittarius", ans: "Soulmates" }, { s1: "Cancer", s2: "Libra", ans: "Challenging" },
    { s1: "Leo", s2: "Taurus", ans: "Challenging" }, { s1: "Virgo", s2: "Taurus", ans: "Soulmates" },
    { s1: "Libra", s2: "Aries", ans: "Soulmates" }, { s1: "Scorpio", s2: "Aquarius", ans: "Challenging" },
    { s1: "Sagittarius", s2: "Virgo", ans: "Challenging" }, { s1: "Capricorn", s2: "Taurus", ans: "Soulmates" },
    { s1: "Aquarius", s2: "Leo", ans: "Soulmates" }, { s1: "Pisces", s2: "Gemini", ans: "Challenging" }
];

let chemState = { score: 0, timeLeft: 90, timerActive: false, timerInterval: null, currentPair: null, hasStarted: false, pool: [], matchedCount: 0 };

function initChemistryGame() {
    if (chemState.timerInterval) clearInterval(chemState.timerInterval);
    chemState = { score: 0, timeLeft: 90, timerActive: true, timerInterval: null, currentPair: null, hasStarted: false, pool: shuffleArray([...chemistryPairs]), matchedCount: 0 };
    document.getElementById('chem-highscore').innerText = localStorage.getItem('astroChemHighScore') || 0;
    document.getElementById('chem-score').innerText = '0';
    document.getElementById('chem-timer').innerText = '01:30';
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
        if (chemState.matchedCount >= chemistryPairs.length) endChemGame(true);
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
    { p: "Mercury", text: "Buy an expensive new laptop.", ans: false }, { p: "Venus", text: "Get a drastic, spontaneous new haircut.", ans: false },
    { p: "Mars", text: "Take a martial arts class to release stress.", ans: true }, { p: "Mars", text: "Launch a new business venture aggressively.", ans: false },
    { p: "Jupiter", text: "Go on a spontaneous luxury vacation.", ans: false }, { p: "Jupiter", text: "Return to a spiritual text you read years ago.", ans: true },
    { p: "Saturn", text: "Review your career boundaries.", ans: true }, { p: "Saturn", text: "Quit your job with no backup plan.", ans: false },
    { p: "Uranus", text: "Make a sudden, irreversible life change.", ans: false }, { p: "Uranus", text: "Reflect on your need for personal freedom.", ans: true },
    { p: "Neptune", text: "Start a creative dream journal.", ans: true }, { p: "Neptune", text: "Ignore red flags in a new relationship.", ans: false }
];

let retroState = { score: 0, timeLeft: 90, timerActive: false, timerInterval: null, currentScenario: null, hasStarted: false, pool: [], matchedCount: 0 };

function initRetrogradeGame() {
    if (retroState.timerInterval) clearInterval(retroState.timerInterval);
    retroState = { score: 0, timeLeft: 90, timerActive: true, timerInterval: null, currentScenario: null, hasStarted: false, pool: shuffleArray([...retrogradeScenarios]), matchedCount: 0 };
    document.getElementById('retro-highscore').innerText = localStorage.getItem('astroRetroHighScore') || 0;
    document.getElementById('retro-score').innerText = '0';
    document.getElementById('retro-timer').innerText = '01:30';
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
    
    const btns = document.getElementById('retrogradeView').querySelectorAll('button');
    
    if (guess === retroState.currentScenario.ans) {
        retroState.score++; retroState.matchedCount++; document.getElementById('retro-score').innerText = retroState.score;
        if (typeof playSound === 'function') playSound('success');
        card.style.borderColor = '#22c55e'; card.style.transform = 'scale(1.05)';
    } else {
        retroState.score = Math.max(0, retroState.score - 1); document.getElementById('retro-score').innerText = retroState.score;
        card.style.borderColor = '#ef4444'; card.style.transform = 'translateX(-10px)'; 
        retroState.pool.unshift(retroState.currentScenario); shuffleArray(retroState.pool);
    }
    
    btns.forEach(b => { if(!b.innerText.includes('Hub') && !b.innerText.includes('Restart')) b.disabled = true; });
    setTimeout(() => {
        card.style.transform = 'none'; card.style.borderColor = '#fbbf24';
        btns.forEach(b => b.disabled = false);
        if (retroState.matchedCount >= retrogradeScenarios.length) endRetroGame(true);
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
        if (moonState.matchedCount >= moonPhases.length) endMoonGame(true);
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

// ==========================================
// GAME 11: ASPECT ALIGNMENT
// ==========================================
const aspectsScenarios = [
    { text: "A sudden clash of egos that forces both parties to grow.", ans: "Square" },
    { text: "Effortless mutual understanding and shared luck.", ans: "Trine" },
    { text: "Finding balance through a tug-of-war with a partner.", ans: "Opposition" },
    { text: "A helpful opportunity presented by a casual acquaintance.", ans: "Sextile" },
    { text: "Two energies fusing together, acting as a single intense force.", ans: "Conjunction" },
    { text: "Feeling blocked, like hitting a brick wall in your career.", ans: "Square" },
    { text: "Natural charisma that opens doors without trying.", ans: "Trine" },
    { text: "Realizing your shadow self by looking at your known enemy.", ans: "Opposition" },
    { text: "A spark of inspiration that requires you to take action to manifest.", ans: "Sextile" },
    { text: "Total alignment of thoughts and actions; you speak and it happens.", ans: "Conjunction" }
];
let aspectsState = { score: 0, timeLeft: 60, timerActive: false, timerInterval: null, current: null, hasStarted: false, pool: [], matchedCount: 0 };

function initAspectsGame() {
    if (aspectsState.timerInterval) clearInterval(aspectsState.timerInterval);
    aspectsState = { score: 0, timeLeft: 60, timerActive: true, timerInterval: null, current: null, hasStarted: false, pool: shuffleArray([...aspectsScenarios]), matchedCount: 0 };
    document.getElementById('aspects-highscore').innerText = localStorage.getItem('astroAspectsHighScore') || 0;
    document.getElementById('aspects-score').innerText = '0';
    document.getElementById('aspects-timer').innerText = '01:00';
    loadNextAspect();
}
function startAspectsTimer() {
    aspectsState.timerInterval = setInterval(() => {
        aspectsState.timeLeft--;
        let mins = Math.floor(aspectsState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (aspectsState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('aspects-timer').innerText = `${mins}:${secs}`;
        if (aspectsState.timeLeft <= 0) endAspectsGame(false);
    }, 1000);
}
function loadNextAspect() {
    aspectsState.current = aspectsState.pool.pop();
    document.getElementById('aspects-title').innerText = "Cosmic Aspect";
    document.getElementById('aspects-desc').innerText = `"${aspectsState.current.text}"`;
    
    const allAns = ["Square", "Trine", "Opposition", "Sextile", "Conjunction"];
    const wrong = shuffleArray(allAns.filter(a => a !== aspectsState.current.ans)).slice(0, 3);
    const options = shuffleArray([aspectsState.current.ans, ...wrong]);
    const container = document.getElementById('aspects-buttons');
    container.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'glow-btn outline'; btn.innerText = opt; btn.style.color = '#fff'; btn.style.borderColor = 'rgba(255,255,255,0.2)';
        btn.onclick = () => handleAspectGuess(opt, btn); container.appendChild(btn);
    });
}
function handleAspectGuess(guess, btn) {
    if (!aspectsState.timerActive) return;
    if (!aspectsState.hasStarted) { aspectsState.hasStarted = true; startAspectsTimer(); }
    const card = document.getElementById('aspects-current-card');
    
    if (guess === aspectsState.current.ans) {
        aspectsState.score++; aspectsState.matchedCount++; document.getElementById('aspects-score').innerText = aspectsState.score;
        btn.style.borderColor = '#22c55e'; btn.style.color = '#22c55e'; card.style.transform = 'scale(1.05)';
    } else {
        aspectsState.score = Math.max(0, aspectsState.score - 1); document.getElementById('aspects-score').innerText = aspectsState.score;
        btn.style.borderColor = '#ef4444'; btn.style.color = '#ef4444'; card.style.transform = 'translateX(-10px)';
        aspectsState.pool.unshift(aspectsState.current); shuffleArray(aspectsState.pool);
    }
    
    const allBtns = document.getElementById('aspects-buttons').children;
    for (let b of allBtns) { b.onclick = null; }
    
    setTimeout(() => { 
        card.style.transform = 'none';
        if (aspectsState.matchedCount >= aspectsScenarios.length) endAspectsGame(true);
        else loadNextAspect();
    }, 500);
}
function endAspectsGame(isWin = false) {
    clearInterval(aspectsState.timerInterval); aspectsState.timerActive = false;
    let stored = parseInt(localStorage.getItem('astroAspectsHighScore') || 0);
    if (aspectsState.score > stored) { localStorage.setItem('astroAspectsHighScore', aspectsState.score); document.getElementById('aspects-highscore').innerText = aspectsState.score; }
    showCosmicModal("Aspects Complete!", `Final Score: ${aspectsState.score}`, () => initAspectsGame());
}

// ==========================================
// GAME 12: HOUSE RULER
// ==========================================
const housesData = [
    { house: "1st House", domain: "Self, appearance, vitality & new beginnings" },
    { house: "2nd House", domain: "Money, possessions, values & self-worth" },
    { house: "3rd House", domain: "Communication, local travel, siblings & mind" },
    { house: "4th House", domain: "Home, family, roots & emotional foundation" },
    { house: "5th House", domain: "Romance, creativity, children & pleasure" },
    { house: "6th House", domain: "Daily routine, health, work habits & service" },
    { house: "7th House", domain: "Partnerships, marriage & open enemies" },
    { house: "8th House", domain: "Transformation, shared wealth, rebirth & secrets" },
    { house: "9th House", domain: "Higher learning, philosophy, long-distance travel & expansion" },
    { house: "10th House", domain: "Career, public reputation, status & ambitions" },
    { house: "11th House", domain: "Friendships, groups, community & future aspirations" },
    { house: "12th House", domain: "Spirituality, subconscious, isolation & hidden things" }
];
let housesState = { score: 0, timeLeft: 60, timerActive: false, timerInterval: null, current: null, hasStarted: false, pool: [], matchedCount: 0 };

function initHousesGame() {
    if (housesState.timerInterval) clearInterval(housesState.timerInterval);
    housesState = { score: 0, timeLeft: 60, timerActive: true, timerInterval: null, current: null, hasStarted: false, pool: shuffleArray([...housesData]), matchedCount: 0 };
    document.getElementById('houses-highscore').innerText = localStorage.getItem('astroHousesHighScore') || 0;
    document.getElementById('houses-score').innerText = '0';
    document.getElementById('houses-timer').innerText = '01:00';
    loadNextHouse();
}
function startHousesTimer() {
    housesState.timerInterval = setInterval(() => {
        housesState.timeLeft--;
        let mins = Math.floor(housesState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (housesState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('houses-timer').innerText = `${mins}:${secs}`;
        if (housesState.timeLeft <= 0) endHousesGame(false);
    }, 1000);
}
function loadNextHouse() {
    housesState.current = housesState.pool.pop();
    document.getElementById('houses-title').innerText = housesState.current.house;
    
    const wrong = shuffleArray(housesData.filter(h => h.domain !== housesState.current.domain)).slice(0, 3);
    const options = shuffleArray([housesState.current.domain, ...wrong.map(w => w.domain)]);
    const container = document.getElementById('houses-buttons');
    container.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'glow-btn outline'; btn.innerText = opt; btn.style.color = '#fff'; btn.style.fontSize = '0.85rem'; btn.style.borderColor = 'rgba(255,255,255,0.2)';
        btn.onclick = () => handleHouseGuess(opt, btn); container.appendChild(btn);
    });
}
function handleHouseGuess(guess, btn) {
    if (!housesState.timerActive) return;
    if (!housesState.hasStarted) { housesState.hasStarted = true; startHousesTimer(); }
    const card = document.getElementById('houses-current-card');
    
    if (guess === housesState.current.domain) {
        housesState.score++; housesState.matchedCount++; document.getElementById('houses-score').innerText = housesState.score;
        btn.style.borderColor = '#22c55e'; btn.style.color = '#22c55e'; card.style.transform = 'scale(1.05)';
    } else {
        housesState.score = Math.max(0, housesState.score - 1); document.getElementById('houses-score').innerText = housesState.score;
        btn.style.borderColor = '#ef4444'; btn.style.color = '#ef4444'; card.style.transform = 'translateX(-10px)';
        housesState.pool.unshift(housesState.current); shuffleArray(housesState.pool);
    }
    
    const allBtns = document.getElementById('houses-buttons').children;
    for (let b of allBtns) { b.onclick = null; }
    
    setTimeout(() => { 
        card.style.transform = 'none';
        if (housesState.matchedCount >= housesData.length) endHousesGame(true); 
        else loadNextHouse();
    }, 500);
}
function endHousesGame(isWin = false) {
    clearInterval(housesState.timerInterval); housesState.timerActive = false;
    let stored = parseInt(localStorage.getItem('astroHousesHighScore') || 0);
    if (housesState.score > stored) { localStorage.setItem('astroHousesHighScore', housesState.score); document.getElementById('houses-highscore').innerText = housesState.score; }
    showCosmicModal("Houses Mastered!", `Final Score: ${housesState.score}`, () => initHousesGame());
}

// ==========================================
// GAME 13: ECLIPSE ALCHEMIST
// ==========================================
const eclipseData = [
    { text: "Starting a new career path.", ans: "Solar" },
    { text: "Planting seeds for a 6-month goal.", ans: "Solar" },
    { text: "A sudden external opportunity arriving.", ans: "Solar" },
    { text: "Initiating a new relationship phase.", ans: "Solar" },
    { text: "Cutting ties with a toxic friend.", ans: "Lunar" },
    { text: "A secret being revealed to you.", ans: "Lunar" },
    { text: "Quitting a bad habit permanently.", ans: "Lunar" },
    { text: "Emotional culmination of a long project.", ans: "Lunar" },
    { text: "A sudden urge to change your physical appearance.", ans: "Solar" },
    { text: "Realizing you outgrew your current living situation.", ans: "Lunar" },
    { text: "New beginnings, outward push, resetting identity.", ans: "Solar" },
    { text: "Emotional release, endings, and shadow work.", ans: "Lunar" },
    { text: "Directly affects vitality and external life paths.", ans: "Solar" },
    { text: "Directly impacts inner world, dreams, and relationships.", ans: "Lunar" },
    { text: "Aligns with the New Moon phase.", ans: "Solar" },
    { text: "Aligns with the Full Moon phase.", ans: "Lunar" }
];
let eclipseState = { score: 0, timeLeft: 60, timerActive: false, timerInterval: null, current: null, hasStarted: false, pool: [], matchedCount: 0 };

function initEclipseGame() {
    if (eclipseState.timerInterval) clearInterval(eclipseState.timerInterval);
    eclipseState = { score: 0, timeLeft: 60, timerActive: true, timerInterval: null, current: null, hasStarted: false, pool: shuffleArray([...eclipseData]), matchedCount: 0 };
    document.getElementById('eclipse-highscore').innerText = localStorage.getItem('astroEclipseHighScore') || 0;
    document.getElementById('eclipse-score').innerText = '0';
    document.getElementById('eclipse-timer').innerText = '01:00';
    loadNextEclipse();
}
function startEclipseTimer() {
    eclipseState.timerInterval = setInterval(() => {
        eclipseState.timeLeft--;
        let mins = Math.floor(eclipseState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (eclipseState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('eclipse-timer').innerText = `${mins}:${secs}`;
        if (eclipseState.timeLeft <= 0) endEclipseGame(false);
    }, 1000);
}
function loadNextEclipse() {
    eclipseState.current = eclipseState.pool.pop();
    document.getElementById('eclipse-scenario').innerText = `"${eclipseState.current.text}"`;
}
function handleEclipseGuess(guess) {
    if (!eclipseState.timerActive) return;
    if (!eclipseState.hasStarted) { eclipseState.hasStarted = true; startEclipseTimer(); }
    const card = document.getElementById('eclipse-current-card');
    const btns = document.getElementById('eclipseView').querySelectorAll('button');
    
    if (guess === eclipseState.current.ans) {
        eclipseState.score++; eclipseState.matchedCount++; document.getElementById('eclipse-score').innerText = eclipseState.score;
        card.style.borderColor = '#22c55e'; card.style.transform = 'scale(1.05)';
    } else {
        eclipseState.score = Math.max(0, eclipseState.score - 1); document.getElementById('eclipse-score').innerText = eclipseState.score;
        card.style.borderColor = '#ef4444'; card.style.transform = 'translateX(-10px)';
        eclipseState.pool.unshift(eclipseState.current); shuffleArray(eclipseState.pool);
    }
    
    btns.forEach(b => { if(!b.innerText.includes('Hub') && !b.innerText.includes('Restart')) b.disabled = true; });
    setTimeout(() => { 
        card.style.borderColor = '#8b5cf6'; card.style.transform = 'none';
        btns.forEach(b => b.disabled = false);
        if (eclipseState.matchedCount >= eclipseData.length) endEclipseGame(true);
        else loadNextEclipse(); 
    }, 400);
}
function endEclipseGame(isWin = false) {
    clearInterval(eclipseState.timerInterval); eclipseState.timerActive = false;
    let stored = parseInt(localStorage.getItem('astroEclipseHighScore') || 0);
    if (eclipseState.score > stored) { localStorage.setItem('astroEclipseHighScore', eclipseState.score); document.getElementById('eclipse-highscore').innerText = eclipseState.score; }
    showCosmicModal("Eclipse Master!", `Final Score: ${eclipseState.score}`, () => initEclipseGame());
}

// ==========================================
// GAME 14: ELEMENT BALANCE
// ==========================================
const balanceData = [
    { text: "Spontaneous road trip with zero planning.", ans: "Fire" },
    { text: "Baking sourdough bread and tending to house plants.", ans: "Earth" },
    { text: "Debating philosophy over coffee for 4 hours.", ans: "Air" },
    { text: "Crying while listening to an emotional indie playlist.", ans: "Water" },
    { text: "Starting a high-intensity gym workout at 5 AM.", ans: "Fire" },
    { text: "Organizing your entire bank account and budgeting spreadsheet.", ans: "Earth" },
    { text: "Impulsively joining a dance competition.", ans: "Fire" },
    { text: "Defending your friend aggressively.", ans: "Fire" },
    { text: "Building a wooden shelf from scratch.", ans: "Earth" },
    { text: "Scheduling your meals for the week.", ans: "Earth" },
    { text: "Reading three books at the same time.", ans: "Air" },
    { text: "Gossiping at a networking event.", ans: "Air" },
    { text: "Trusting your gut feeling about a stranger.", ans: "Water" },
    { text: "Adopting a stray kitten because you felt bad.", ans: "Water" },
    { text: "Starting a bonfire just to watch the flames.", ans: "Fire" },
    { text: "Saving 20% of your paycheck every month.", ans: "Earth" },
    { text: "Debating politics with a stranger online.", ans: "Air" },
    { text: "Writing a poem about a dream you had.", ans: "Water" },
    { text: "Taking the lead in a group project naturally.", ans: "Fire" },
    { text: "Refusing to change your mind despite new evidence.", ans: "Earth" }
];
let balanceState = { score: 0, timeLeft: 90, timerActive: false, timerInterval: null, current: null, hasStarted: false, pool: [], matchedCount: 0 };

function initBalanceGame() {
    if (balanceState.timerInterval) clearInterval(balanceState.timerInterval);
    balanceState = { score: 0, timeLeft: 90, timerActive: true, timerInterval: null, current: null, hasStarted: false, pool: shuffleArray([...balanceData]), matchedCount: 0 };
    document.getElementById('balance-highscore').innerText = localStorage.getItem('astroBalanceHighScore') || 0;
    document.getElementById('balance-score').innerText = '0';
    document.getElementById('balance-timer').innerText = '01:30';
    loadNextBalance();
}
function startBalanceTimer() {
    balanceState.timerInterval = setInterval(() => {
        balanceState.timeLeft--;
        let mins = Math.floor(balanceState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (balanceState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('balance-timer').innerText = `${mins}:${secs}`;
        if (balanceState.timeLeft <= 0) endBalanceGame(false);
    }, 1000);
}
function loadNextBalance() {
    balanceState.current = balanceState.pool.pop();
    document.getElementById('balance-scenario').innerText = `"${balanceState.current.text}"`;
}
function handleBalanceGuess(guess) {
    if (!balanceState.timerActive) return;
    if (!balanceState.hasStarted) { balanceState.hasStarted = true; startBalanceTimer(); }
    const card = document.getElementById('balance-current-card');
    const btns = document.getElementById('balanceView').querySelectorAll('button');
    
    if (guess === balanceState.current.ans) {
        balanceState.score++; balanceState.matchedCount++; document.getElementById('balance-score').innerText = balanceState.score;
        card.style.borderColor = '#22c55e'; card.style.transform = 'scale(1.05)';
    } else {
        balanceState.score = Math.max(0, balanceState.score - 1); document.getElementById('balance-score').innerText = balanceState.score;
        card.style.borderColor = '#ef4444'; card.style.transform = 'translateX(-10px)';
        balanceState.pool.unshift(balanceState.current); shuffleArray(balanceState.pool);
    }
    
    btns.forEach(b => { if(!b.innerText.includes('Hub') && !b.innerText.includes('Restart')) b.disabled = true; });
    setTimeout(() => { 
        card.style.borderColor = '#10b981'; card.style.transform = 'none';
        btns.forEach(b => b.disabled = false);
        if (balanceState.matchedCount >= balanceData.length) endBalanceGame(true);
        else loadNextBalance(); 
    }, 400);
}
function endBalanceGame(isWin = false) {
    clearInterval(balanceState.timerInterval); balanceState.timerActive = false;
    let stored = parseInt(localStorage.getItem('astroBalanceHighScore') || 0);
    if (balanceState.score > stored) { localStorage.setItem('astroBalanceHighScore', balanceState.score); document.getElementById('balance-highscore').innerText = balanceState.score; }
    showCosmicModal("Balanced Elements!", `Final Score: ${balanceState.score}`, () => initBalanceGame());
}

// ==========================================
// GAME 15: CELESTIAL TIME TRAVELER
// ==========================================
const travelerData = [
    { text: "Pluto was officially reclassified as a dwarf planet in 2006.", ans: true },
    { text: "Astrology and Astronomy were treated as completely separate fields in ancient Babylon.", ans: false },
    { text: "Uranus was discovered by astronomer William Herschel in 1781.", ans: true },
    { text: "There are officially 13 recognized constellations in the zodiac belt, including Ophiuchus.", ans: true },
    { text: "Halley's Comet passes close to Earth every 15 years.", ans: false },
    { text: "The shift into the Age of Aquarius happened precisely in the year 2000.", ans: false },
    { text: "Neptune was found by mathematical prediction rather than empirical observation.", ans: true },
    { text: "The concept of the 12-sign zodiac originated in ancient Babylon.", ans: true },
    { text: "Carl Jung used astrology in his psychological profiling.", ans: true },
    { text: "A complete cycle of Uranus around the Sun takes exactly 100 years.", ans: false },
    { text: "The Moon rules the sign of Cancer.", ans: true },
    { text: "Venus rules both Taurus and Libra.", ans: true },
    { text: "Mercury is the ruling planet of Scorpio.", ans: false },
    { text: "The planet Mars was named after the Roman god of war.", ans: true },
    { text: "The zodiac sign Leo is ruled by the Moon.", ans: false }
];
let travelerState = { score: 0, timeLeft: 90, timerActive: false, timerInterval: null, current: null, hasStarted: false, pool: [], matchedCount: 0 };

function initTravelerGame() {
    if (travelerState.timerInterval) clearInterval(travelerState.timerInterval);
    travelerState = { score: 0, timeLeft: 90, timerActive: true, timerInterval: null, current: null, hasStarted: false, pool: shuffleArray([...travelerData]), matchedCount: 0 };
    document.getElementById('traveler-highscore').innerText = localStorage.getItem('astroTravelerHighScore') || 0;
    document.getElementById('traveler-score').innerText = '0';
    document.getElementById('traveler-timer').innerText = '01:30';
    loadNextTraveler();
}
function startTravelerTimer() {
    travelerState.timerInterval = setInterval(() => {
        travelerState.timeLeft--;
        let mins = Math.floor(travelerState.timeLeft / 60).toString().padStart(2, '0');
        let secs = (travelerState.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('traveler-timer').innerText = `${mins}:${secs}`;
        if (travelerState.timeLeft <= 0) endTravelerGame(false);
    }, 1000);
}
function loadNextTraveler() {
    travelerState.current = travelerState.pool.pop();
    document.getElementById('traveler-scenario').innerText = `"${travelerState.current.text}"`;
}
function handleTravelerGuess(guess) {
    if (!travelerState.timerActive) return;
    if (!travelerState.hasStarted) { travelerState.hasStarted = true; startTravelerTimer(); }
    const card = document.getElementById('traveler-current-card');
    const btns = document.getElementById('travelerView').querySelectorAll('button');
    
    if (guess === travelerState.current.ans) {
        travelerState.score++; travelerState.matchedCount++; document.getElementById('traveler-score').innerText = travelerState.score;
        card.style.borderColor = '#22c55e'; card.style.transform = 'scale(1.05)';
    } else {
        travelerState.score = Math.max(0, travelerState.score - 1); document.getElementById('traveler-score').innerText = travelerState.score;
        card.style.borderColor = '#ef4444'; card.style.transform = 'translateX(-10px)';
        travelerState.pool.unshift(travelerState.current); shuffleArray(travelerState.pool);
    }
    
    btns.forEach(b => { if(!b.innerText.includes('Hub') && !b.innerText.includes('Restart')) b.disabled = true; });
    setTimeout(() => { 
        card.style.borderColor = '#f97316'; card.style.transform = 'none';
        btns.forEach(b => b.disabled = false);
        if (travelerState.matchedCount >= travelerData.length) endTravelerGame(true);
        else loadNextTraveler(); 
    }, 400);
}
function endTravelerGame(isWin = false) {
    clearInterval(travelerState.timerInterval); travelerState.timerActive = false;
    let stored = parseInt(localStorage.getItem('astroTravelerHighScore') || 0);
    if (travelerState.score > stored) { localStorage.setItem('astroTravelerHighScore', travelerState.score); document.getElementById('traveler-highscore').innerText = travelerState.score; }
    showCosmicModal("Time Traveler!", `Final Score: ${travelerState.score}`, () => initTravelerGame());
}