/*
  RedeNet - preferências de cookies.
  IMPORTANTE: o Analytics NÃO está instalado enquanto ANALYTICS_ID estiver vazio.
  Para ativar o GA4 posteriormente, informe o ID real G-XXXXXXXXXX.
  Não adicione outro snippet do Google Analytics no index.html: este arquivo
  é o responsável por carregá-lo SOMENTE após consentimento.
*/
(() => {
    'use strict';

    const ANALYTICS_ID = ''; // Exemplo futuro: 'G-XXXXXXXXXX'
    const ANALYTICS_ENABLED = /^G-[A-Z0-9]+$/i.test(ANALYTICS_ID);
    const STORAGE_KEY = 'redenet-consentimento-v1';
    let analyticsLoaded = false;
    let currentConsent = readConsent();
    let previousFocus = null;

    function readConsent() {
        try {
            const item = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return item && typeof item.analytics === 'boolean' ? item : null;
        } catch (_) { return null; }
    }

    function writeConsent(analytics) {
        currentConsent = { analytics, updatedAt: new Date().toISOString() };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConsent)); }
        catch (_) { /* Algumas configurações do navegador bloqueiam armazenamento. */ }
    }

    function loadAnalytics() {
        if (!ANALYTICS_ENABLED || analyticsLoaded) return;
        analyticsLoaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        });
        window.gtag('config', ANALYTICS_ID);
        const tag = document.createElement('script');
        tag.async = true;
        tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ANALYTICS_ID)}`;
        document.head.appendChild(tag);
    }

    function clearAnalyticsCookies() {
        const hostname = window.location.hostname;
        const hosts = [hostname, `.${hostname}`];
        const parts = hostname.split('.');
        // Tenta apagar cookies próprios do GA nas variações comuns de domínio.
        for (let i = 1; i < parts.length - 1; i++) {
            hosts.push(`.${parts.slice(i).join('.')}`);
        }
        document.cookie.split(';').forEach((value) => {
            const name = value.split('=')[0].trim();
            if (!/^_ga(?:_|$)/.test(name)) return;
            const expire = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
            document.cookie = expire;
            hosts.forEach(domain => { document.cookie = `${expire}; domain=${domain}`; });
        });
    }

    const banner = document.createElement('aside');
    banner.className = 'cookieBanner';
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.hidden = true;
    banner.innerHTML = `
        <h2>Preferências de cookies</h2>
        <p>Usamos cookies opcionais de análise somente com sua autorização para entender visitas e melhorar o site. Você pode recusar sem perder funcionalidades.</p>
        <a href="cookies.html">Leia nossa Política de Cookies</a>
        <div class="cookieActions">
            <button class="cookieBtn cookieBtnPrimary" type="button" data-cookie-accept>Aceitar</button>
            <button class="cookieBtn cookieBtnSecondary" type="button" data-cookie-reject>Rejeitar</button>
            <button class="cookieBtn cookieBtnNeutral" type="button" data-cookie-customize>Configurar</button>
        </div>`;

    const overlay = document.createElement('div');
    overlay.className = 'cookieOverlay';
    overlay.hidden = true;
    overlay.innerHTML = `
        <div class="cookieModal" role="dialog" aria-modal="true" aria-labelledby="cookieModalTitle" tabindex="-1">
            <button class="cookieClose" type="button" data-cookie-close aria-label="Fechar preferências">&times;</button>
            <h2 id="cookieModalTitle">Preferências de privacidade</h2>
            <p>Você controla os cookies opcionais. Os essenciais, quando necessários, não dependem dessa escolha.</p>
            <div class="cookieCategory">
                <div class="cookieCategoryLabel"><strong>Essenciais</strong><p>Recursos necessários para o funcionamento e para guardar sua decisão.</p></div>
                <input type="checkbox" checked disabled aria-label="Cookies essenciais sempre ativos">
            </div>
            <div class="cookieCategory">
                <div class="cookieCategoryLabel"><strong>Estatísticas (Google Analytics)</strong>
                    <p id="cookieAnalyticsDescription"></p></div>
                <input type="checkbox" id="cookieAnalyticsToggle" aria-label="Permitir cookies de estatísticas">
            </div>
            <p>Veja nossa <a href="cookies.html">Política de Cookies</a> e nossa <a href="privacidade.html">Política de Privacidade</a>.</p>
            <div class="cookieActions">
                <button class="cookieBtn cookieBtnPrimary" type="button" data-cookie-save>Salvar preferências</button>
                <button class="cookieBtn cookieBtnSecondary" type="button" data-cookie-reject-modal>Rejeitar opcionais</button>
            </div>
        </div>`;

    document.body.appendChild(banner);
    document.body.appendChild(overlay);
    const modal = overlay.querySelector('.cookieModal');
    const analyticsToggle = overlay.querySelector('#cookieAnalyticsToggle');
    const analyticsDescription = overlay.querySelector('#cookieAnalyticsDescription');
    analyticsToggle.disabled = !ANALYTICS_ENABLED;
    analyticsDescription.textContent = ANALYTICS_ENABLED
        ? 'Opcional. Mede visitas e interações no site quando você autoriza.'
        : 'Não utilizado no momento. O site não carrega o Google Analytics.';

    function updateBanner() {
        banner.hidden = !ANALYTICS_ENABLED || currentConsent !== null;
    }

    function showPreferences() {
        previousFocus = document.activeElement;
        analyticsToggle.checked = ANALYTICS_ENABLED && Boolean(currentConsent?.analytics);
        overlay.hidden = false;
        modal.focus();
    }

    function hidePreferences() {
        overlay.hidden = true;
        if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    }

    function setConsent(accept) {
        const wasLoaded = analyticsLoaded;
        writeConsent(ANALYTICS_ENABLED && accept);
        updateBanner();
        hidePreferences();
        if (currentConsent.analytics) loadAnalytics();
        else if (wasLoaded) {
            // Reiniciar evita que uma tag já carregada continue ativa.
            if (typeof window.gtag === 'function') {
                window.gtag('consent', 'update', {analytics_storage:'denied'});
            }
            clearAnalyticsCookies();
            window.location.reload();
        }
    }

    banner.querySelector('[data-cookie-accept]').addEventListener('click', () => setConsent(true));
    banner.querySelector('[data-cookie-reject]').addEventListener('click', () => setConsent(false));
    banner.querySelector('[data-cookie-customize]').addEventListener('click', showPreferences);
    overlay.querySelector('[data-cookie-save]').addEventListener('click', () => {
        if (!ANALYTICS_ENABLED) { hidePreferences(); return; }
        setConsent(analyticsToggle.checked);
    });
    overlay.querySelector('[data-cookie-reject-modal]').addEventListener('click', () => setConsent(false));
    overlay.querySelector('[data-cookie-close]').addEventListener('click', hidePreferences);
    overlay.addEventListener('click', e => { if (e.target === overlay) hidePreferences(); });
    document.addEventListener('keydown', e => {
        if (overlay.hidden) return;
        if (e.key === 'Escape') { hidePreferences(); return; }
        if (e.key !== 'Tab') return;
        const focusables = [...modal.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href]')];
        const first = focusables[0], last = focusables[focusables.length-1];
        if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
        else if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
    });
    document.querySelectorAll('[data-cookie-preferences]').forEach(button => {
        button.addEventListener('click', showPreferences);
    });

    updateBanner();
    if (ANALYTICS_ENABLED && currentConsent?.analytics) loadAnalytics();
})();
