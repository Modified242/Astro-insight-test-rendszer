// ==========================================
// ASTRO QUIZ HUB & GAME LOGIC
// ==========================================

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// ==========================================
// UNIFIED COSMIC MODAL (Alert helyett)
// ==========================================
function showCosmicModal(title, message, onRestart) {
    const existingModal = document.getElementById('cosmicCustomModal');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'cosmicCustomModal';
    overlay.className = 'cosmic-modal-overlay';

    overlay.innerHTML = `
        <div class="cosmic-modal-box">
            <h2 class="cosmic-modal-title">${title}</h2>
            <p class="cosmic-modal-text">${message.replace(/\n/g, '<br>')}</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button class="glow-btn outline" id="modalHubBtn" style="padding: 10px 20px; font-size: 0.95rem;">← Hub</button>
                <button class="glow-btn" id="modalRestartBtn" style="padding: 10px 20px; font-size: 0.95rem;">Play Again ⟲</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('modalHubBtn').onclick = () => {
        overlay.remove();
        returnToHub();
    };

    document.getElementById('modalRestartBtn').onclick = () => {
        overlay.remove();
        onRestart();
    };
}

// VIEW SWITCHING LOGIC
function openGame(gameId) {
    document.getElementById('hubView').style.display = 'none';
    document.getElementById('blitzView').style.display = 'none';
    document.getElementById('alchemistView').style.display = 'none';
    document.getElementById('archetypeView').style.display = 'none';
    document.getElementById('rulerView').style.display = 'none';
    document.getElementById('truthView').style.display = 'none';
    
    if (gameId === 'blitz') {
        document.getElementById('blitzView').style.display = 'block';
        resetBlitzGame();
    } else if (gameId === 'alchemist') {
        document.getElementById('alchemistView').style.display = 'block';
        initAlchemistGame();
    } else if (gameId === 'archetype') {
        document.getElementById('archetypeView').style.display = 'block';
        initArchetypeGame();
    } else if (gameId === 'ruler') { 
        document.getElementById('rulerView').style.display = 'block';
        initRulerGame();
    } else if (gameId === 'truth') { 
        document.getElementById('truthView').style.display = 'block';
        initTruthGame();
    }
}

function returnToHub() {
    document.getElementById('blitzView').style.display = 'none';
    document.getElementById('alchemistView').style.display = 'none';
    document.getElementById('archetypeView').style.display = 'none';
    document.getElementById('rulerView').style.display = 'none';
    document.getElementById('truthView').style.display = 'none';
    document.getElementById('hubView').style.display = 'block';
    
    if (blitzState.timerInterval) clearInterval(blitzState.timerInterval);
    if (alchemistState.timerInterval) clearInterval(alchemistState.timerInterval);
    if (typeof archetypeState !== 'undefined' && archetypeState.timerInterval) clearInterval(archetypeState.timerInterval);
    if (typeof rulerState !== 'undefined' && rulerState.timerInterval) clearInterval(rulerState.timerInterval);
    if (typeof truthState !== 'undefined' && truthState.timerInterval) clearInterval(truthState.timerInterval);
}

// ==========================================
// GAME 1: ZODIAC MATCH BLITZ
// ==========================================
let blitzState = {
    selectedText: null, selectedIcon: null, correct: 0, wrong: 0,
    guessesRemaining: 15, timeLeft: 60, timerActive: false,
    timerInterval: null, hasStarted: false
};

function resetBlitzGame() {
    if (blitzState.timerInterval) clearInterval(blitzState.timerInterval);
    
    blitzState = {
        selectedText: null, selectedIcon: null, correct: 0, wrong: 0,
        guessesRemaining: 15, timeLeft: 60, timerActive: true, 
        timerInterval: null, hasStarted: false
    };

    let storedHighScore = localStorage.getItem('astroBlitzHighScore') || 0;
    document.getElementById('blitz-highscore').textContent = storedHighScore;

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

    if (!blitzState.hasStarted) {
        blitzState.hasStarted = true;
        startBlitzTimer();
    }

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
    checkBlitzWinCondition();
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

        if (blitzState.timeLeft <= 0) {
            endBlitzGame("Time's up! The stars have shifted.");
        }
    }, 1000);
}

function checkBlitzWinCondition() {
    if (blitzState.correct === 12) {
        endBlitzGame("Cosmic Alignment Achieved! You matched them all.");
    } else if (blitzState.guessesRemaining <= 0) {
        endBlitzGame("Out of guesses! The constellation fades.");
    }
}

function endBlitzGame(message) {
    clearInterval(blitzState.timerInterval);
    blitzState.timerActive = false;
    
    let title = "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroBlitzHighScore') || 0);
    if (blitzState.correct > storedHighScore) {
        localStorage.setItem('astroBlitzHighScore', blitzState.correct);
        document.getElementById('blitz-highscore').textContent = blitzState.correct;
        title = "New High Score! 🌟";
        message = `You matched ${blitzState.correct} pairs.\n` + message;
    }
    
    showCosmicModal(title, message, () => resetBlitzGame());
}


// ==========================================
// GAME 2: ELEMENT ALCHEMIST
// ==========================================
let alchemistState = {
    score: 0, timeLeft: 120, timerActive: false,
    timerInterval: null, currentSign: null, hasStarted: false
};

function initAlchemistGame() {
    if (alchemistState.timerInterval) clearInterval(alchemistState.timerInterval);
    
    alchemistState = {
        score: 0, timeLeft: 120, timerActive: true,
        timerInterval: null, currentSign: null, hasStarted: false
    };
    
    let storedHighScore = localStorage.getItem('astroAlchemistHighScore') || 0;
    document.getElementById('alchemist-highscore').innerText = storedHighScore;
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
        
        if (alchemistState.timeLeft <= 0) {
            endAlchemistGame();
        }
    }, 1000);
}

function loadNextAlchemistCard() {
    const signs = Object.keys(zodiacData);
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    alchemistState.currentSign = zodiacData[randomSign];
    
    const cardIcon = document.getElementById('alchemist-card-icon');
    const cardName = document.getElementById('alchemist-card-name');
    const card = document.getElementById('alchemist-current-card');
    
    card.style.borderColor = alchemistState.currentSign.aura;
    card.style.boxShadow = `0 0 10px ${alchemistState.currentSign.aura}33`;
    
    cardIcon.style.color = alchemistState.currentSign.aura;
    cardIcon.innerHTML = alchemistState.currentSign.svgIcon;
    
    const svgElement = cardIcon.querySelector('svg');
    if(svgElement) {
        svgElement.style.width = '60px';
        svgElement.style.height = '60px';
    }
    
    cardName.innerText = alchemistState.currentSign.name;
    cardName.style.color = alchemistState.currentSign.aura;
}

function handleAlchemistGuess(guessedElement) {
    if (!alchemistState.timerActive) return;
    
    if (!alchemistState.hasStarted) {
        alchemistState.hasStarted = true;
        startAlchemistTimer();
    }
    
    const card = document.getElementById('alchemist-current-card');
    
    if (guessedElement === alchemistState.currentSign.element) {
        alchemistState.score++;
        document.getElementById('alchemist-score').innerText = alchemistState.score;
        if (typeof playSound === 'function') playSound('success');
        card.style.transform = 'scale(1.1)'; 
    } else {
        alchemistState.score = Math.max(0, alchemistState.score - 1); 
        document.getElementById('alchemist-score').innerText = alchemistState.score;
        card.style.transform = 'translateX(-10px)'; 
        card.style.borderColor = '#ef4444';
    }
    
    setTimeout(() => {
        card.style.transform = 'none';
        loadNextAlchemistCard();
    }, 200);
}

function endAlchemistGame() {
    clearInterval(alchemistState.timerInterval);
    alchemistState.timerActive = false;
    
    let title = "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroAlchemistHighScore') || 0);
    let msg = `You correctly sorted ${alchemistState.score} signs.`;
    
    if (alchemistState.score > storedHighScore) {
        localStorage.setItem('astroAlchemistHighScore', alchemistState.score);
        document.getElementById('alchemist-highscore').innerText = alchemistState.score;
        title = "New High Score! 🌟";
        msg = `You sorted ${alchemistState.score} signs!\n` + msg;
    }
    
    showCosmicModal(title, msg, () => initAlchemistGame());
}

// ==========================================
// GAME 3: ARCHETYPE ORACLE
// ==========================================
const archetypeScenarios = [
    { sign: "Aries", text: "Challenged a stranger to a race because they were walking too fast." },
    { sign: "Aries", text: "Started a DIY project at 2 AM and got angry when it wasn't finished by 3 AM." },
    { sign: "Taurus", text: "Refused to go out because their favorite sweatpants were in the wash." },
    { sign: "Taurus", text: "Ordered takeout from the exact same restaurant for the 14th time in a row." },
    { sign: "Gemini", text: "Sent 8 separate text messages instead of one long paragraph." },
    { sign: "Gemini", text: "Started telling a story, got distracted, and finished a completely different story." },
    { sign: "Cancer", text: "Kept a movie ticket stub from 2014 because 'it holds emotional value'." },
    { sign: "Cancer", text: "Canceled plans to stay home, wrap up in a blanket, and rewatch a comfort show." },
    { sign: "Leo", text: "Practiced their 'surprised face' in the mirror just in case they win an award." },
    { sign: "Leo", text: "Accidentally turned a casual conversation into a 20-minute story about their own life." },
    { sign: "Virgo", text: "Corrected someone's grammar during an emotional argument." },
    { sign: "Virgo", text: "Made a detailed to-do list for their weekend relaxation time." },
    { sign: "Libra", text: "Took 45 minutes to decide what to watch on Netflix, then fell asleep." },
    { sign: "Libra", text: "Agreed with both sides of an argument just to keep the peace." },
    { sign: "Scorpio", text: "Did deep background research on their new coworker before saying 'hello'." },
    { sign: "Scorpio", text: "Remembered a minor insult from 5 years ago with perfect clarity." },
    { sign: "Sagittarius", text: "Booked a flight to another country because they got bored on a Tuesday." },
    { sign: "Sagittarius", text: "Accidentally insulted someone by being 'too honest'." },
    { sign: "Capricorn", text: "Scheduled a 'mental breakdown' into their calendar for exactly 7:30 PM." },
    { sign: "Capricorn", text: "Felt a surge of romantic attraction when their partner paid a bill on time." },
    { sign: "Aquarius", text: "Ghosted everyone for a week to 'recharge', then returned like nothing happened." },
    { sign: "Aquarius", text: "Argued against a popular opinion just to play devil's advocate." },
    { sign: "Pisces", text: "Cried because they saw an old man eating alone at a restaurant." },
    { sign: "Pisces", text: "Fell in love with someone they made eye contact with on the train for 2 seconds." }
];

let archetypeState = {
    score: 0, timeLeft: 90, timerActive: false,
    timerInterval: null, currentScenario: null, hasStarted: false,
    questionPool: []
};

function initArchetypeGame() {
    if (archetypeState.timerInterval) clearInterval(archetypeState.timerInterval);
    
    archetypeState = {
        score: 0, timeLeft: 90, timerActive: true,
        timerInterval: null, currentScenario: null, hasStarted: false,
        questionPool: shuffleArray([...archetypeScenarios])
    };
    
    let storedHighScore = localStorage.getItem('astroArchetypeHighScore') || 0;
    document.getElementById('archetype-highscore').innerText = storedHighScore;
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
        
        if (archetypeState.timeLeft <= 0) {
            endArchetypeGame();
        }
    }, 1000);
}

function loadNextArchetype() {
    if (archetypeState.questionPool.length === 0) {
        archetypeState.questionPool = shuffleArray([...archetypeScenarios]);
    }
    
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
        btn.innerHTML = `${zodiacData[sign].icon} ${sign}`;
        btn.style.color = '#fff';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        
        btn.onclick = () => handleArchetypeGuess(sign, btn);
        btnContainer.appendChild(btn);
    });
}

function handleArchetypeGuess(guessedSign, btnElement) {
    if (!archetypeState.timerActive) return;
    
    if (!archetypeState.hasStarted) {
        archetypeState.hasStarted = true;
        startArchetypeTimer();
    }
    
    const isCorrect = (guessedSign === archetypeState.currentScenario.sign);
    
    if (isCorrect) {
        archetypeState.score++;
        document.getElementById('archetype-score').innerText = archetypeState.score;
        if (typeof playSound === 'function') playSound('success');
        
        btnElement.style.borderColor = '#22c55e'; 
        btnElement.style.color = '#22c55e';
    } else {
        btnElement.style.borderColor = '#ef4444'; 
        btnElement.style.color = '#ef4444';
        
        const allBtns = document.getElementById('archetype-buttons').children;
        for (let b of allBtns) {
            if (b.innerText.includes(archetypeState.currentScenario.sign)) {
                b.style.borderColor = '#22c55e';
                b.style.color = '#22c55e';
            }
        }
    }
    
    const allBtns = document.getElementById('archetype-buttons').children;
    for (let b of allBtns) { b.onclick = null; }
    
    setTimeout(() => {
        loadNextArchetype();
    }, 800); 
}

function endArchetypeGame() {
    clearInterval(archetypeState.timerInterval);
    archetypeState.timerActive = false;
    
    let title = "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroArchetypeHighScore') || 0);
    let msg = `You correctly guessed ${archetypeState.score} archetypes.`;
    
    if (archetypeState.score > storedHighScore) {
        localStorage.setItem('astroArchetypeHighScore', archetypeState.score);
        document.getElementById('archetype-highscore').innerText = archetypeState.score;
        title = "New High Score! 🌟";
        msg = `You read ${archetypeState.score} minds!\n` + msg;
    }
    
    showCosmicModal(title, msg, () => initArchetypeGame());
}

// ==========================================
// GAME 4: CELESTIAL RULERS
// ==========================================
let rulerState = {
    score: 0, timeLeft: 60, timerActive: false,
    timerInterval: null, currentSign: null, hasStarted: false
};

const allPlanets = [...new Set(Object.values(zodiacData).map(s => s.planet))];

function initRulerGame() {
    if (rulerState.timerInterval) clearInterval(rulerState.timerInterval);
    
    rulerState = {
        score: 0, timeLeft: 60, timerActive: true,
        timerInterval: null, currentSign: null, hasStarted: false
    };
    
    let storedHighScore = localStorage.getItem('astroRulerHighScore') || 0;
    document.getElementById('ruler-highscore').innerText = storedHighScore;
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
        
        if (rulerState.timeLeft <= 0) {
            endRulerGame();
        }
    }, 1000);
}

function loadNextRulerCard() {
    const signs = Object.keys(zodiacData);
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    rulerState.currentSign = zodiacData[randomSign];
    
    const cardIcon = document.getElementById('ruler-card-icon');
    const cardName = document.getElementById('ruler-card-name');
    const card = document.getElementById('ruler-current-card');
    
    card.style.borderColor = rulerState.currentSign.aura;
    card.style.boxShadow = `0 0 10px ${rulerState.currentSign.aura}33`;
    
    cardIcon.style.color = rulerState.currentSign.aura;
    cardIcon.innerHTML = rulerState.currentSign.svgIcon;
    
    const svgElement = cardIcon.querySelector('svg');
    if(svgElement) {
        svgElement.style.width = '60px';
        svgElement.style.height = '60px';
    }
    
    cardName.innerText = rulerState.currentSign.name;
    cardName.style.color = rulerState.currentSign.aura;
    
    const correctPlanet = rulerState.currentSign.planet;
    const wrongPlanets = shuffleArray(allPlanets.filter(p => p !== correctPlanet)).slice(0, 3);
    const options = shuffleArray([correctPlanet, ...wrongPlanets]);
    
    const btnContainer = document.getElementById('ruler-buttons');
    btnContainer.innerHTML = '';
    
    options.forEach(planet => {
        const btn = document.createElement('button');
        btn.className = 'glow-btn outline';
        btn.innerText = planet;
        btn.style.color = '#fff';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        
        btn.onclick = () => handleRulerGuess(planet, btn);
        btnContainer.appendChild(btn);
    });
}

function handleRulerGuess(guessedPlanet, btnElement) {
    if (!rulerState.timerActive) return;
    
    if (!rulerState.hasStarted) {
        rulerState.hasStarted = true;
        startRulerTimer();
    }
    
    const card = document.getElementById('ruler-current-card');
    const isCorrect = (guessedPlanet === rulerState.currentSign.planet);
    
    if (isCorrect) {
        rulerState.score++;
        document.getElementById('ruler-score').innerText = rulerState.score;
        if (typeof playSound === 'function') playSound('success');
        
        btnElement.style.borderColor = '#22c55e'; 
        btnElement.style.color = '#22c55e';
        card.style.transform = 'scale(1.1)'; 
    } else {
        rulerState.score = Math.max(0, rulerState.score - 1); 
        document.getElementById('ruler-score').innerText = rulerState.score;
        
        btnElement.style.borderColor = '#ef4444'; 
        btnElement.style.color = '#ef4444';
        card.style.transform = 'translateX(-10px)'; 
        
        const allBtns = document.getElementById('ruler-buttons').children;
        for (let b of allBtns) {
            if (b.innerText === rulerState.currentSign.planet) {
                b.style.borderColor = '#22c55e';
                b.style.color = '#22c55e';
            }
        }
    }
    
    const allBtns = document.getElementById('ruler-buttons').children;
    for (let b of allBtns) { b.onclick = null; }
    
    setTimeout(() => {
        card.style.transform = 'none';
        loadNextRulerCard();
    }, 600);
}

function endRulerGame() {
    clearInterval(rulerState.timerInterval);
    rulerState.timerActive = false;
    
    let title = "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroRulerHighScore') || 0);
    let msg = `You matched ${rulerState.score} planets.`;
    
    if (rulerState.score > storedHighScore) {
        localStorage.setItem('astroRulerHighScore', rulerState.score);
        document.getElementById('ruler-highscore').innerText = rulerState.score;
        title = "New High Score! 🌟";
        msg = `You mastered ${rulerState.score} planetary domains!\n` + msg;
    }
    
    showCosmicModal(title, msg, () => initRulerGame());
}

// ==========================================
// GAME 5: COSMIC TRUTHS (True or False)
// ==========================================
let truthState = {
    score: 0, timeLeft: 60, timerActive: false,
    timerInterval: null, currentAnswer: null, hasStarted: false
};

function initTruthGame() {
    if (truthState.timerInterval) clearInterval(truthState.timerInterval);
    
    truthState = {
        score: 0, timeLeft: 60, timerActive: true,
        timerInterval: null, currentAnswer: null, hasStarted: false
    };
    
    let storedHighScore = localStorage.getItem('astroTruthHighScore') || 0;
    document.getElementById('truth-highscore').innerText = storedHighScore;
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
        
        if (truthState.timeLeft <= 0) {
            endTruthGame();
        }
    }, 1000);
}

function loadNextTruthCard() {
    const signs = Object.keys(zodiacData);
    const signName = signs[Math.floor(Math.random() * signs.length)];
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
    
    card.style.borderColor = sign.aura;
    card.style.boxShadow = `0 0 10px ${sign.aura}33`;
    
    cardIcon.style.color = sign.aura;
    cardIcon.innerHTML = sign.svgIcon;
    const svgEl = cardIcon.querySelector('svg');
    if(svgEl) { svgEl.style.width = '100%'; svgEl.style.height = '100%'; }
    
    document.getElementById('truth-scenario-text').innerText = statementText;
}

function handleTruthGuess(guessedAnswer) {
    if (!truthState.timerActive) return;
    
    if (!truthState.hasStarted) {
        truthState.hasStarted = true;
        startTruthTimer();
    }
    
    const card = document.getElementById('truth-current-card');
    const isCorrect = (guessedAnswer === truthState.currentAnswer);
    
    if (isCorrect) {
        truthState.score++;
        document.getElementById('truth-score').innerText = truthState.score;
        if (typeof playSound === 'function') playSound('success');
        
        card.style.borderColor = '#22c55e';
        card.style.transform = 'scale(1.05)';
    } else {
        truthState.score = Math.max(0, truthState.score - 1); 
        document.getElementById('truth-score').innerText = truthState.score;
        
        card.style.borderColor = '#ef4444';
        card.style.transform = 'translateX(-10px)'; 
    }
    
    const btns = document.getElementById('truth-buttons').querySelectorAll('button');
    btns.forEach(b => b.disabled = true);
    
    setTimeout(() => {
        card.style.transform = 'none';
        btns.forEach(b => b.disabled = false);
        loadNextTruthCard();
    }, 400);
}

function endTruthGame() {
    clearInterval(truthState.timerInterval);
    truthState.timerActive = false;
    
    let title = "Time's up!";
    let storedHighScore = parseInt(localStorage.getItem('astroTruthHighScore') || 0);
    let msg = `You scored ${truthState.score} points.`;
    
    if (truthState.score > storedHighScore) {
        localStorage.setItem('astroTruthHighScore', truthState.score);
        document.getElementById('truth-highscore').innerText = truthState.score;
        title = "New High Score! 🌟";
        msg = `You unlocked ${truthState.score} cosmic truths!\n` + msg;
    }
    
    showCosmicModal(title, msg, () => initTruthGame());
}