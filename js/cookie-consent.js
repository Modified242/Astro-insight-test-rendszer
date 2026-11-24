/**
 * Astro Insight - Cookie Consent & Google Consent Mode v2 Engine
 * Domain: astroinsight.space
 * Standards: CCPA 2026 (GPC Supported) & GDPR Compliant
 *
 * ВАЖЛИВО: ініціалізація dataLayer/gtag та встановлення consent-default
 * винесені в inline <script> на самому початку <head> (index.html),
 * щоб жоден тег не міг виконатись раніше, ніж визначено стан згоди.
 * Цей файл лише читає той стан з window.__astroConsent, довантажує
 * GA4 та керує UI банера.
 */

const GA_ID = 'G-XXXXXXXXXXX'; // TODO: Замінити на реальний GA4 Measurement ID

const astroConsent = window.__astroConsent || {
  COOKIE_KEY: 'astro_cookie_consent',
  isGPCActivated: !!(navigator.globalPrivacyControl || window.globalPrivacyControl),
  savedConsent: (() => { try { return localStorage.getItem('astro_cookie_consent'); } catch (e) { return null; } })(),
  getConsentPayload: function (state) {
    const isGranted = state === 'granted';
    const isNecessary = state === 'necessary';
    return {
      'analytics_storage': isGranted ? 'granted' : 'denied',
      'ad_storage': isGranted ? 'granted' : 'denied',
      'ad_user_data': isGranted ? 'granted' : 'denied',
      'ad_personalization': isGranted ? 'granted' : 'denied',
      'functionality_storage': (isGranted || isNecessary) ? 'granted' : 'denied',
      'personalization_storage': (isGranted || isNecessary) ? 'granted' : 'denied',
      'security_storage': 'granted',
      'restricted_data_processing': !isGranted
    };
  }
};

const {
  COOKIE_KEY,
  isGPCActivated,
  savedConsent,
  getConsentPayload
} = astroConsent;

function safeSetConsentStorage(value) {
  try {
    localStorage.setItem(COOKIE_KEY, value);
  } catch (e) {}
}

function sendConsentUpdate(state) {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', getConsentPayload(state));
  }
}

// --- 1. ЗАВАНТАЖЕННЯ СКРИПТА GOOGLE ANALYTICS 4 ---
function loadGA4() {
  // Захист: поки не вставлено реальний Measurement ID, не смітимо мережевими
  // запитами на неіснуючий стрім.
  if (!GA_ID || GA_ID.indexOf('XXXXXXXXXX') !== -1) {
    console.warn('[cookie-consent] GA_ID ще не заданий — GA4 не завантажується.');
    return;
  }

  // Запобігаємо повторному завантаженню
  if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    return;
  }

  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gaScript);

  gtag('js', new Date());
  gtag('config', GA_ID);
}



// --- 3. ДИНАМІЧНА ІН'ЄКЦІЯ HTML-БАНЕРА ---
function injectBannerHTML() {
  if (document.getElementById('cookie-banner')) return;
  const bannerHTML = `
    <div id="cookie-banner" class="cookie-banner hidden" role="dialog" aria-modal="true" aria-labelledby="cookie-banner-text" tabindex="-1">
      <div class="cookie-content">
        <p id="cookie-banner-text" class="cookie-text">
          We use cookies to enhance your experience and analyze traffic. "Necessary Only" keeps the site working (e.g. remembering your preferences) without analytics or ads. Read our <a href="/pages/privacy.html" class="cookie-link">Privacy Policy</a>.
        </p>
        <div class="cookie-actions">
          <button id="cookie-reject-all-btn" class="cookie-btn btn-reject">Reject All</button>
          <button id="cookie-reject-btn" class="cookie-btn btn-secondary">Necessary Only</button>
          <button id="cookie-accept-btn" class="cookie-btn btn-primary">Accept All</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', bannerHTML);
}

// --- 4. ОБРОБКА ПОДІЙ ВЗАЄМОДІЇ ---
window.showCookieBanner = function () {
  injectBannerHTML();
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.classList.remove('hidden');
    banner.focus();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (savedConsent === 'granted') {
    loadGA4();
  }

  if (savedConsent === null && !isGPCActivated) {
    injectBannerHTML();

    const banner = document.getElementById('cookie-banner');
    setTimeout(() => {
      if (banner) {
        banner.classList.remove('hidden');
        banner.focus(); // Доступність: переносимо фокус у модальний банер при появі
      }
    }, 400);
  }

  document.body.addEventListener('click', (e) => {
    const banner = document.getElementById('cookie-banner');
    if (e.target.id === 'cookie-accept-btn') {
      safeSetConsentStorage('granted');
      sendConsentUpdate('granted');
      loadGA4();
      if (banner) banner.classList.add('hidden');
    } else if (e.target.id === 'cookie-reject-btn') {
      safeSetConsentStorage('necessary');
      sendConsentUpdate('necessary');
      if (banner) banner.classList.add('hidden');
    } else if (e.target.id === 'cookie-reject-all-btn') {
      safeSetConsentStorage('denied');
      sendConsentUpdate('denied');
      if (banner) banner.classList.add('hidden');
    }
  });
});
