/* ═══════════ SETTINGS MODAL ═══════════ */
'use strict';

const setModal = el('setModal');

function renderKeysList() {
    const list = el('keysList');
    list.innerHTML = '';

    S.apiKeys.forEach((k, i) => {
        const row = document.createElement('div');
        row.className = 'key-row';
        row.innerHTML = `
            <span class="key-num">${i + 1}</span>
            <input type="password" class="sg-input mono key-inp" value="${k || ''}" placeholder="AIzaSy..." data-idx="${i}">
            <button class="key-rm" data-idx="${i}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>`;
        list.appendChild(row);
    });

    list.querySelectorAll('.key-rm').forEach(b => {
        b.addEventListener('click', () => {
            const idx = parseInt(b.dataset.idx);
            if (S.apiKeys.length <= 1) S.apiKeys = [''];
            else S.apiKeys.splice(idx, 1);
            renderKeysList();
        });
    });
}

function openSet() {
    renderKeysList();
    el('sysInp').value = S.systemPrompt;
    el('tempSl').value = S.temperature;
    el('tempV').textContent = S.temperature.toFixed(1);
    el('tokSl').value = S.maxTokens;
    el('tokV').textContent = S.maxTokens;
    el('topSl').value = S.topP;
    el('topV').textContent = S.topP.toFixed(2);
    el('thinkTog').checked = S.thinking;
    el('thinkSl').value = S.thinkingBudget;
    el('thinkV').textContent = S.thinkingBudget;
    el('streamTog').checked = S.streaming;
    el('thinkBudgetGrp').style.display = S.thinking ? 'flex' : 'none';
    updThemeUI();
    setModal.classList.add('show');
}

function closeSet() {
    setModal.classList.remove('show');
}

function saveSet() {
    const keyInps = document.querySelectorAll('.key-inp');
    S.apiKeys = Array.from(keyInps).map(i => i.value.trim()).slice(0, 10);
    if (!S.apiKeys.length) S.apiKeys = [''];
    S.currentKeyIdx = 0;

    S.systemPrompt = el('sysInp').value.trim();
    S.temperature = parseFloat(el('tempSl').value);
    S.maxTokens = parseInt(el('tokSl').value);
    S.topP = parseFloat(el('topSl').value);
    S.thinking = el('thinkTog').checked;
    S.thinkingBudget = parseInt(el('thinkSl').value);
    S.streaming = el('streamTog').checked;
    S.model = el('selModel').value;

    save();
    updBadge();
    closeSet();
    toast('Configurações salvas!', '✅');
}

function resetSet() {
    if (confirm('Resetar configurações?')) {
        S = { ...DEFAULTS, apiKeys: [''] };
        save();
        updBadge();
        el('selModel').value = S.model;
        document.documentElement.setAttribute('data-theme', S.theme);
        openSet();
        toast('Resetado', 'ℹ️');
    }
}

function updThemeUI() {
    document.querySelectorAll('.theme-opt').forEach(t => {
        t.classList.toggle('active', t.dataset.theme === S.theme);
    });
}

function setTheme(theme) {
    S.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    save();
    updThemeUI();
}
