/* ═══════════ UI CONTROLS ═══════════ */
'use strict';

const sidebar = el('sidebar');
const sOverlay = el('sOverlay');
const btnSend = el('btnSend');
const btnScrollBottom = el('btnScrollBottom');
const charCountEl = el('charCount');

function updBtn() {
    const inp = el('inp');
    const has = inp.value.trim().length > 0 || pendingImages.length > 0;
    if (generating) {
        btnSend.disabled = false;
        btnSend.className = 'btn-send stop';
        btnSend.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`;
    } else {
        btnSend.disabled = !has;
        btnSend.className = 'btn-send';
        btnSend.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
    }
}

function updCharCount() {
    const len = el('inp').value.length;
    if (len === 0) {
        charCountEl.textContent = '';
        charCountEl.className = 'char-count';
        return;
    }
    charCountEl.textContent = len.toLocaleString();
    if (len > 30000) charCountEl.className = 'char-count over';
    else if (len > 20000) charCountEl.className = 'char-count warn';
    else charCountEl.className = 'char-count';
}

function updBadge() {
    const badge = el('badge');
    const badgeTxt = el('badgeTxt');
    const valid = getValidKeys();
    if (valid.length > 0) {
        badge.className = 'badge on';
        badgeTxt.textContent = `${valid.length} chave${valid.length > 1 ? 's' : ''}`;
    } else {
        badge.className = 'badge off';
        badgeTxt.textContent = 'Sem chave';
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('hide');
    if (window.innerWidth <= 768) {
        sOverlay.classList.toggle('show', !sidebar.classList.contains('hide'));
    }
}

function closeMobile() {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('hide');
        sOverlay.classList.remove('show');
    }
}

// Scroll-to-bottom button visibility
let scrollBtnVisible = false;

function initScrollWatcher() {
    const cw = el('chatWrap');
    cw.addEventListener('scroll', () => {
        const dist = cw.scrollHeight - cw.scrollTop - cw.clientHeight;
        const shouldShow = dist > 200;
        if (shouldShow !== scrollBtnVisible) {
            scrollBtnVisible = shouldShow;
            btnScrollBottom.style.display = shouldShow ? 'flex' : 'none';
        }
    });
}
