function setAura(hexColor) {
    document.documentElement.style.setProperty('--glow-color', hexColor);
    currentAuraColor = hexColor; 
}

function resetAura() {
    setAura('#d4af37'); 
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}
// ==========================================
// WIDGETS
// ==========================================

function applyAuraColor(color) {
    if (!color) return;
    
    document.documentElement.style.setProperty('--glow-color', color);
    document.documentElement.style.setProperty('--glow-color-dim', `${color}33`);
    document.documentElement.style.setProperty('--glow-color-mid', `${color}66`);
    
    if (typeof currentAuraColor !== 'undefined') {
        currentAuraColor = color; 
    }
}

function initGlobalAuraUI() {
    let wrapper = document.getElementById('global-aura-wrapper');
    
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = 'global-aura-wrapper';
        
        wrapper.style.position = 'fixed';
        wrapper.style.bottom = '20px';
        wrapper.style.right = '20px';
        wrapper.style.zIndex = '9999';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '10px'; 
        wrapper.style.width = '120px'; 
        
        const iconDiv = document.createElement('div');
        iconDiv.id = 'global-sign-icon';
        iconDiv.style.width = '50px'; 
        iconDiv.style.height = '50px';
        iconDiv.style.color = 'var(--glow-color)'; 
        iconDiv.style.filter = 'drop-shadow(0 0 8px var(--glow-color))';
        iconDiv.style.display = 'flex';
        iconDiv.style.justifyContent = 'center';
        iconDiv.style.alignItems = 'center';

        const btn = document.createElement('button');
        btn.id = 'global-clear-btn';
        btn.className = 'reset-btn'; 
        btn.innerText = 'Clear Aura';
        btn.style.width = '100%'; 
        btn.onclick = () => clearAura();
        
        wrapper.appendChild(iconDiv);
        wrapper.appendChild(btn);
        document.body.appendChild(wrapper);
    }
    
    const savedSign = sessionStorage.getItem('selectedSign');
    const savedAura = sessionStorage.getItem('selectedAura');
    
    if (savedSign && savedAura) {
        wrapper.style.display = 'flex'; 
        
        const iconDiv = document.getElementById('global-sign-icon');
        const signData = zodiacData[savedSign];
        
        if (signData && signData.svgIcon) { 
            iconDiv.innerHTML = signData.svgIcon; 
            
            const svgElement = iconDiv.querySelector('svg');
            if (svgElement) {
                svgElement.style.width = '100%';
                svgElement.style.height = '100%';
                svgElement.style.fill = 'currentColor';
                svgElement.style.display = 'block';
            }
        }
    } else {
        wrapper.style.display = 'none'; 
    }
}

function clearAura() {
    sessionStorage.removeItem('selectedAura');
    sessionStorage.removeItem('selectedSign'); 
    applyAuraColor('#d4af37'); 
    
    const wrapper = document.getElementById('global-aura-wrapper');
    if (wrapper) wrapper.style.display = 'none'; 
}

window.addEventListener('DOMContentLoaded', () => {
    const navEntries = performance.getEntriesByType('navigation');
    
    if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        sessionStorage.removeItem('selectedAura');
        sessionStorage.removeItem('selectedSign');
    }

    const savedAura = sessionStorage.getItem('selectedAura');
    if (savedAura) {
        applyAuraColor(savedAura);
    }
    
    initGlobalAuraUI();
    initCustomDropdowns();
});

// ==========================================
// CUSTOM DROPDOWN LOGIC
// ==========================================

function initCustomDropdowns() {
    const signs = Object.keys(zodiacData);
    
    ['custom-dropdown-1', 'custom-dropdown-2'].forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        
        const trigger = dropdown.querySelector('.select-trigger');
        const selectedContent = dropdown.querySelector('.selected-content');
        const optionsList = dropdown.querySelector('.custom-options');
        const hiddenInput = dropdown.querySelector('input[type="hidden"]');
        
        signs.forEach(sign => {
            const li = document.createElement('li');
            li.className = 'custom-option';
            
            li.innerHTML = `
                <div class="dropdown-icon">${zodiacData[sign].svgIcon}</div>
                <span>${sign}</span>
            `;
            
            li.addEventListener('click', (e) => {
                e.stopPropagation(); 
                
                hiddenInput.value = sign; 
                
                selectedContent.innerHTML = `
                    <div class="dropdown-icon">${zodiacData[sign].svgIcon}</div>
                    <span>${sign}</span>
                `;
                
                optionsList.classList.remove('open');
            });
            
            optionsList.appendChild(li);
        });
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-options').forEach(list => {
                if (list !== optionsList) list.classList.remove('open');
            });
            optionsList.classList.toggle('open');
        });
    });
    
    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-options').forEach(list => {
            list.classList.remove('open');
        });
    });
}

// ==========================================
// SHARE FATE (DESTINY) FUNCTIONALITY
// ==========================================

function shareDestiny() {
    const savedSign = sessionStorage.getItem('selectedSign');
    const signName = savedSign || "my Zodiac Sign";
    const signData = zodiacData[savedSign];
    const motto = signData && signData.motto ? ` (${signData.motto})` : '';
    
    const shareText = `✨ I just uncovered my cosmic destiny and aura color for ${signName}${motto} on Astro Insight! Check your celestial readings here:`;
    const shareUrl = window.location.origin + window.location.pathname;
    const shareBtn = document.getElementById('shareBtn');

    if (navigator.share) {
        navigator.share({
            title: 'Astro Insight - Celestial Readings',
            text: shareText,
            url: shareUrl
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } 
    else {
        const fullShareContent = `${shareText} ${shareUrl}`;
        
        navigator.clipboard.writeText(fullShareContent)
            .then(() => {
                const originalText = shareBtn.innerText;
                shareBtn.innerText = 'Copied to Clipboard! 🔮';
                shareBtn.style.borderColor = 'var(--glow-color, #d4af37)';
                shareBtn.style.color = 'var(--glow-color, #d4af37)';

                setTimeout(() => {
                    shareBtn.innerText = originalText;
                    shareBtn.style.borderColor = '';
                    shareBtn.style.color = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    }
}

// ==========================================
// WIDGETS: MOON PHASE & ASTRO WEATHER
// ==========================================

// --- SUPPORT FORM GOOGLE APPS SCRIPT BEKÜLDÉS ---
document.addEventListener('DOMContentLoaded', () => {
    const supportForm = document.getElementById('support-form');
    const responseDiv = document.getElementById('form-response');

    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const scriptURL = 'https://script.google.com/macros/s/AKfycbxcRUvUiiVmMbhS4d31enDkfHLGp9Cj0xVHzOvL6029xGlY2VojsQ0nmB7CIRGENIVOzQ/exec'; 
            const formData = new FormData(supportForm);

            const submitButton = supportForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        responseDiv.innerHTML = '<p style="color: #4CAF50;">Your message has been sent successfully!</p>';
                        supportForm.reset();
                    } else {
                        responseDiv.innerHTML = '<p style="color: #f44336;">There was an error sending your message.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    responseDiv.innerHTML = '<p style="color: #f44336;">Network error occurred.</p>';
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                });
        });
    }
});

// =========================================
// СИСТЕМА КАСТОМНОГО КУРСОРА (Cosmic Satellite)
// =========================================
(function initCustomCursor() {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const customCursor = document.createElement('div');
    customCursor.id = 'custom-svg-cursor';
    
    customCursor.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 304.61 296.96">
            <defs>
                <style>
                    .cls-1 { fill:none; stroke:var(--glow-color, #d4af37); stroke-miterlimit:10; stroke-width:3px; }
                    .cls-2 { fill:var(--glow-color, #d4af37); stroke:var(--glow-color, #d4af37); stroke-miterlimit:10; stroke-width:3px; }
                </style>
            </defs>
            <g id="Kurzor">
                <path class="cls-1" d="M203.29,108.32c4.07.23,40,2.88,62.26,33.93,14.33,20,15,40.55,15.13,47.25.15,7.74.24,35.39-21.1,58.46C238,271.31,210,273.28,203.36,273.55c-32.39,1.34-53.94-17.06-58.65-21.29-3.6-3.24-27.79-25.74-27.64-62a83.89,83.89,0,0,1,43.14-72.49A81.93,81.93,0,0,1,203.29,108.32Zm-7.09,45.2c-2.31-4-8.34-14.13-20.17-19.8A36.32,36.32,0,0,0,164,130.23a34.34,34.34,0,0,0-17.19,3,32.19,32.19,0,0,0-10.95,8.34c-1.48,3.08-7.06,15.63-2.12,29.39,5.82,16.23,21.86,21.84,27.77,23.91,19.45,6.8,36.75-.45,41.34-2.56C203.74,186.38,205.58,169.74,196.2,153.52ZM206.53,224c2,4.47,7.45,17,20.3,23a31.77,31.77,0,0,0,13.57,3.24A30.42,30.42,0,0,0,254.35,247a28.77,28.77,0,0,0,9.58-8.1c1.56-2.48,8-13.43,4.61-26.14-4-15.08-18.8-21-24.1-23.11-19.36-7.75-37.47.45-41.35,2.32A55,55,0,0,0,206.53,224Zm-36.42-39.34c-5.67.51-19.36,1.77-29.14,12.32a39.67,39.67,0,0,0-8,13.47,32.46,32.46,0,0,0-2.14,14.16,28.84,28.84,0,0,0,4,12.72c6.91,11.13,20.59,12.87,22.61,13.1,16,1.79,27.78-9.47,30.81-12.36,17.91-17.1,14.85-42.83,14.38-46.32A56.78,56.78,0,0,0,170.11,184.65Zm67.62,13.2c4.23-.79,18.87-3.54,27.45-15.73A31.29,31.29,0,0,0,271,167.65a32.25,32.25,0,0,0-1.12-12.52c-.78-2.69-2.43-8.42-7.29-13.07-7.28-7-17-6.93-20-6.91-13.75.08-23.16,8.93-25.78,11.39C199.31,163,202.61,188.73,203.09,192,207.64,194.48,221,201,237.73,197.85Zm-10,20.08c3.91,1.8,17.45,8,31.49,3a31.35,31.35,0,0,0,13.09-8.47,27,27,0,0,0,6-27.46A30,30,0,0,0,268,170.64c-11-8.62-24.31-7.07-27.71-6.68-24,2.78-36.29,26.81-37.46,29.18C205.09,197.8,212.27,210.84,227.71,217.93Zm-58.16-56.26c-4.29-1.32-18.78-5.77-31.94,1.12a37.91,37.91,0,0,0-12,10.23,28.35,28.35,0,0,0-5.44,11.33,27.87,27.87,0,0,0,1.66,16.51,31,31,0,0,0,11.38,13.53c10.84,7.78,22.74,7.5,25.88,7.42,26.55-.62,42.84-27.82,44-29.81C201,187.64,191.1,168.29,169.55,161.67ZM239,171.2c2.53-3.31,10.71-14,9.53-28A33.49,33.49,0,0,0,243,126.93a27.54,27.54,0,0,0-8.22-8.22,28.49,28.49,0,0,0-16.8-4.11,29.48,29.48,0,0,0-13.45,3.93c-10.44,5.92-14.16,16.56-15.58,20.62-8.48,24.25,11,49.4,12.79,51.58C206.05,190.32,226.2,188,239,171.2Zm-20.36-9.9c1.29-6.27,3.12-15.13-.74-25.4a40.44,40.44,0,0,0-15.88-19.24,28.08,28.08,0,0,0-11.39-4.48A27.33,27.33,0,0,0,174,115.3a28.19,28.19,0,0,0-9,7.8,33,33,0,0,0-6.45,15c-2.39,14,5,25.68,7.47,29.51,11.6,18.27,31.58,23,36.61,24.09A63.88,63.88,0,0,0,218.67,161.3Zm-45.2,44.45c-4.88,4.13-11.79,10-15.08,20.46a40.39,40.39,0,0,0,.64,24.93,28.14,28.14,0,0,0,6.2,10.56,27.29,27.29,0,0,0,15.07,7.84,28.17,28.17,0,0,0,11.88-.61,33,33,0,0,0,14.35-7.86c11.48-10.41,12.23-25.29,12.32-27.83.26-7.68-1.8-13.28-5.59-23.57a120.68,120.68,0,0,0-8.37-18A64,64,0,0,0,173.47,205.75Zm13.45,17.37c-1.75,8.4-3.46,16.66.59,25.74,5,11.2,15.43,16.13,18,17.32a28.32,28.32,0,0,0,11.83,3.16,27.31,27.31,0,0,0,16.24-5,28.3,28.3,0,0,0,8-8.77,33.1,33.1,0,0,0,4.71-15.67c.86-15.34-9-26.43-10.77-28.48-5.48-6.2-11.55-9.34-19.63-13.52a101.08,101.08,0,0,0-14-6A74.31,74.31,0,0,0,186.92,223.12Zm-37.7-31.64c0,28.66,23.68,52.73,52.47,52.47,28.33-.25,51.3-24,51.54-52,.24-28.33-22.79-52.66-51.54-52.92S149.22,162.88,149.22,191.48Z"/>
                <path class="cls-2" d="M24.3,29.37l95.07,188c-9.29-28.17-3.42-59.87,16.72-82.46q1.42-1.6,2.93-3.12L28.11,26.42Z"/>
                <path class="cls-1" d="M31.79,23.58l-3.68,2.84L139,131.8c22-22.24,54.86-30,84.51-21Z"/>
            </g>
        </svg>
    `;

    document.body.appendChild(customCursor);
    document.documentElement.classList.add('custom-cursor-ready');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.65;
        cursorY += (mouseY - cursorY) * 0.65;

        customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const clickableElements = document.querySelectorAll('a, button, .card, .dropbtn, .hamburger, .info-tooltip');
    clickableElements.forEach(el => {
        el.addEventListener('mouseenter', () => customCursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => customCursor.classList.remove('hovering'));
    });
})();
// ==========================================
// INSIGHTS HUB: ARTICLE FILTERING
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const filterBtns = document.querySelectorAll(".selector-group .glow-btn");
    const articles = document.querySelectorAll(".insight-card");

    if(filterBtns.length > 0 && articles.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove("active-filter", "active"));
                
                // Add active class to clicked button
                btn.classList.add("active-filter");

                const filterValue = btn.getAttribute("data-filter");

                articles.forEach(article => {
                    // Check category
                    if (filterValue === "all" || article.getAttribute("data-category") === filterValue) {
                        article.style.display = "flex";
                        // Small animation delay for smooth appearance
                        setTimeout(() => {
                            article.style.opacity = "1";
                            article.style.transform = "scale(1)";
                        }, 50);
                    } else {
                        article.style.opacity = "0";
                        article.style.transform = "scale(0.95)";
                        // Hide element after animation finishes
                        setTimeout(() => {
                            article.style.display = "none";
                        }, 300);
                    }
                });
            });
        });
    }
});
// ==========================================
// AUTOMATIC ZODIAC SVG & AURA INJECTOR
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const zodiacCards = document.querySelectorAll('.insight-card[data-zodiac]');

    zodiacCards.forEach(card => {
        const signKey = card.getAttribute('data-zodiac');
        const imgBox = card.querySelector('.svg-box');

        if (zodiacData && zodiacData[signKey] && imgBox) {
            const data = zodiacData[signKey];

            // 1. Вставляємо SVG-іконку перед баджем
            const badge = imgBox.querySelector('.insight-badge');
            const svgWrapper = document.createElement('div');
            svgWrapper.className = 'zodiac-svg-wrapper';
            svgWrapper.innerHTML = data.svgIcon;

            imgBox.insertBefore(svgWrapper, badge);

            // 2. Встановлюємо індивідуальне світіння знака при наведенні
            card.style.setProperty('--zodiac-aura', data.aura);
        }
    });
});
// ==========================================
// SEAMLESS INFINITE CAROUSEL GENERATOR
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const relatedContainer = document.getElementById("relatedArticlesGrid");
    if (!relatedContainer) return;

    const allArticles = [
        { slug: "intro-astrology-guide.html", title: "Astrology for Beginners", badge: "Main Guide", type: "img", src: "cica.webp", desc: "Foundations of natal charts & cosmic paths." },
        { slug: "aries.html", title: "Aries: Courage & Fire", badge: "Zodiac", type: "zodiac", sign: "Aries", desc: "Traits, passion, and spiritual drive of the Ram." },
        { slug: "taurus.html", title: "Taurus: Stability & Senses", badge: "Zodiac", type: "zodiac", sign: "Taurus", desc: "Sensual appreciation, loyalty, and grounded power." },
        { slug: "gemini.html", title: "Gemini: Curiosity & Mind", badge: "Zodiac", type: "zodiac", sign: "Gemini", desc: "Intellectual agility and dual perception." },
        { slug: "cancer.html", title: "Cancer: Emotional Tides", badge: "Zodiac", type: "zodiac", sign: "Cancer", desc: "Intuitive depth and ancestral protection." },
        { slug: "leo.html", title: "Leo: Radiant Sovereignty", badge: "Zodiac", type: "zodiac", sign: "Leo", desc: "Creative passion, royal heart energy, and confidence." },
        { slug: "virgo.html", title: "Virgo: Precision & Service", badge: "Zodiac", type: "zodiac", sign: "Virgo", desc: "Sacred order, analytical mind, and bodily wisdom." },
        { slug: "libra.html", title: "Libra: Balance & Charm", badge: "Zodiac", type: "zodiac", sign: "Libra", desc: "Aesthetic mastery and relational alchemy." },
        { slug: "scorpio.html", title: "Scorpio: Deep Transformation", badge: "Zodiac", type: "zodiac", sign: "Scorpio", desc: "Emotional power, rebirth, and hidden truths." },
        { slug: "sagittarius.html", title: "Sagittarius: Truth & Freedom", badge: "Zodiac", type: "zodiac", sign: "Sagittarius", desc: "Philosophical expansion and wild optimism." },
        { slug: "capricorn.html", title: "Capricorn: Mastery of Time", badge: "Zodiac", type: "zodiac", sign: "Capricorn", desc: "Disciplined ambition and structural mastery." },
        { slug: "aquarius.html", title: "Aquarius: Cosmic Innovation", badge: "Zodiac", type: "zodiac", sign: "Aquarius", desc: "Visionary rebellion and collective mind." },
        { slug: "pisces.html", title: "Pisces: Universal Dreams", badge: "Zodiac", type: "zodiac", sign: "Pisces", desc: "Mystic compassion and artistic transcendence." },
        { slug: "sun.html", title: "Sun: Core Purpose & Identity", badge: "Planet", type: "img", src: "sun.webp", desc: "The central star of vitality and soul purpose." },
        { slug: "moon.html", title: "Moon: Subconscious & Instinct", badge: "Planet", type: "img", src: "moon.webp", desc: "Inner emotional realm and ancestral memory." },
        { slug: "mercury.html", title: "Mercury: Mind & Intellect", badge: "Planet", type: "img", src: "mercury.webp", desc: "Communication styles and mental processing." },
        { slug: "venus.html", title: "Venus: Love & Harmony", badge: "Planet", type: "img", src: "venus.webp", desc: "Attraction, aesthetic appreciation, and relationships." },
        { slug: "mars.html", title: "Mars: Willpower & Drive", badge: "Planet", type: "img", src: "mars.webp", desc: "Navigating ambition, conflict, and physical drive." },
        { slug: "jupiter.html", title: "Jupiter: Expansion & Fortune", badge: "Planet", type: "img", src: "jupiter.webp", desc: "Unlocking opportunities, wisdom, and growth." },
        { slug: "saturn.html", title: "Saturn: Discipline & Time", badge: "Planet", type: "img", src: "saturn.webp", desc: "Karmic lessons, boundaries, and long-term endurance." },
        { slug: "uranus.html", title: "Uranus: Awakening & Change", badge: "Planet", type: "img", src: "uranus.webp", desc: "Breakthroughs, individuality, and sudden shifts." },
        { slug: "neptune.html", title: "Neptune: Dreams & Illusion", badge: "Planet", type: "img", src: "neptune.webp", desc: "Spiritual connection, intuition, and mysticism." },
        { slug: "pluto.html", title: "Pluto: Rebirth & Power", badge: "Planet", type: "img", src: "pluto.webp", desc: "Generational shifts, shadow work, and evolution." }
    ];

    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const availableArticles = allArticles.filter(item => item.slug !== currentPath);
    const shuffled = [...availableArticles].sort(() => 0.5 - Math.random());
    const selectedArticles = shuffled.slice(0, 9);

    function createCardElement(item) {
        const card = document.createElement("article");
        card.className = "insight-card article-card";

        let mediaBoxHtml = "";

        if (item.type === "zodiac" && typeof zodiacData !== "undefined" && zodiacData[item.sign]) {
            card.setAttribute("data-zodiac", item.sign);
            card.style.setProperty("--zodiac-aura", zodiacData[item.sign].aura);
            mediaBoxHtml = `
                <div class="insight-img-box svg-box">
                    <div class="zodiac-svg-wrapper">${zodiacData[item.sign].svgIcon}</div>
                    <span class="insight-badge">${item.badge}</span>
                </div>
            `;
        } else {
            mediaBoxHtml = `
                <div class="insight-img-box">
                    <img src="image/${item.src}" alt="${item.title}" loading="lazy">
                    <span class="insight-badge">${item.badge}</span>
                </div>
            `;
        }

        card.innerHTML = `
            <a href="${item.slug}">
                ${mediaBoxHtml}
                <div class="insight-body">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="insight-footer">
                        <span>Read Guide</span>
                        <span class="read-more">&rarr;</span>
                    </div>
                </div>
            </a>
        `;
        return card;
    }

    // Створюємо зациклений потрійний масив (9 + 9 + 9 = 27 карток)
    const infiniteSequence = [...selectedArticles, ...selectedArticles, ...selectedArticles];
    
    relatedContainer.innerHTML = "";
    infiniteSequence.forEach(item => {
        relatedContainer.appendChild(createCardElement(item));
    });

    // Динамічні змінні розмірів
    let oneSetWidth = 0;
    let singleCardWidth = 0;

    // Розрахунок точних розмірів прямо з DOM
    function updateMetrics() {
        const cards = relatedContainer.querySelectorAll('.article-card');
        if (cards.length < 27) return;

        // Точний крок однієї картки (ширина + реальний CSS gap)
        singleCardWidth = cards[1].offsetLeft - cards[0].offsetLeft;
        
        // Точна ширина 1 повноцінного набору з 9 карток
        oneSetWidth = cards[selectedArticles.length].offsetLeft - cards[0].offsetLeft;
    }

    // Допоміжна функція миттєвого перескоку
    function jumpTo(x) {
        const prevBehavior = relatedContainer.style.scrollBehavior;
        relatedContainer.style.scrollBehavior = "auto";
        relatedContainer.scrollLeft = x;
        void relatedContainer.offsetHeight; // форсуємо reflow
        relatedContainer.style.scrollBehavior = prevBehavior || "";
    }

    // Початковий розрахунок і стартова позиція у 2-му блоці
    requestAnimationFrame(() => {
        updateMetrics();
        if (oneSetWidth > 0) {
            jumpTo(oneSetWidth);
        }
    });

    // Оновлюємо розрахунки при зміні розміру екрана або орієнтації
    window.addEventListener("resize", updateMetrics);

    // Безшовна корекція позиції під час скролу
    let ticking = false;
    relatedContainer.addEventListener("scroll", () => {
        if (ticking || oneSetWidth === 0) return;
        ticking = true;
        
        requestAnimationFrame(() => {
            const sl = relatedContainer.scrollLeft;

            // Перескок з 3-го на 2-й блок
            if (sl >= oneSetWidth * 2) {
                jumpTo(sl - oneSetWidth);
            }
            // Перескок з 1-го на 2-й блок
            else if (sl <= oneSetWidth * 0.5) {
                jumpTo(sl + oneSetWidth);
            }

            ticking = false;
        });
    }, { passive: true });

    // Кнопки-стрілочки з динамічним кроком
    const leftBtn = document.getElementById("scrollLeftBtn");
    const rightBtn = document.getElementById("scrollRightBtn");

    if (leftBtn && rightBtn) {
        leftBtn.addEventListener("click", () => {
            const step = singleCardWidth || 330;
            relatedContainer.scrollBy({ left: -step, behavior: "smooth" });
        });

        rightBtn.addEventListener("click", () => {
            const step = singleCardWidth || 330;
            relatedContainer.scrollBy({ left: step, behavior: "smooth" });
        });
    }
});
// --- AUTOMATIKUS ÚTVONALJAVÍTÓ A DINAMIKUS KÁRTYÁKHOZ ---
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const currentPath = window.location.pathname;
        let rootPrefix = "";
        
        // Mappamélység megállapítása
        if (currentPath.includes('/articles/')) rootPrefix = "../../";
        else if (currentPath.includes('/pages/')) rootPrefix = "../";
        else return; // Gyökérben vagyunk, a JS kód alapból helyes

        const grid = document.getElementById('relatedArticlesGrid');
        if (grid) {
            // 1. Képek forrásának javítása
            grid.querySelectorAll('img').forEach(img => {
                const src = img.getAttribute('src');
                if (src && src.startsWith('image/')) {
                    img.setAttribute('src', rootPrefix + src);
                }
            });
            
            // 2. Linkek (Read Guide gombok) javítása
            grid.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href');
                if (href && !href.startsWith('.') && !href.startsWith('http')) {
                    const planets = ['sun.html', 'moon.html', 'mercury.html', 'venus.html', 'mars.html', 'jupiter.html', 'saturn.html', 'uranus.html', 'neptune.html', 'pluto.html'];
                    const folder = planets.includes(href) ? 'planets/' : 'zodiac/';
                    a.setAttribute('href', rootPrefix + 'articles/' + folder + href);
                }
            });
        }
    }, 500); // 500ms késleltetés a JS kártyagenerálás kivárására
});
