/* ═══════════ UTILITIES ═══════════ */
'use strict';

const toastsEl = el('toasts');

function uid() {
    return 'c' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function toast(msg, icon = 'ℹ️') {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
    toastsEl.appendChild(t);
    setTimeout(() => { if (t.parentNode) t.remove(); }, 3000);
}

function esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function wordCount(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// ═══════════ IMPROVED MARKDOWN ═══════════
function md(text) {
    if (!text) return '';
    let h = text;

    // Protect code blocks
    const codeBlocks = [];
    h = h.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => {
        const idx = codeBlocks.length;
        codeBlocks.push({ lang, code: code.trim() });
        return `%%CODEBLOCK_${idx}%%`;
    });

    // Protect inline code
    const inlineCodes = [];
    h = h.replace(/`([^`]+)`/g, (m, code) => {
        const idx = inlineCodes.length;
        inlineCodes.push(code);
        return `%%INLINE_${idx}%%`;
    });

    // Escape HTML
    h = esc(h);

    // Restore inline code
    h = h.replace(/%%INLINE_(\d+)%%/g, (m, idx) => {
        return `<code>${esc(inlineCodes[parseInt(idx)])}</code>`;
    });

    // Restore code blocks
    h = h.replace(/%%CODEBLOCK_(\d+)%%/g, (m, idx) => {
        const block = codeBlocks[parseInt(idx)];
        return `<div class="code-wrap"><div class="code-head"><span>${esc(block.lang) || 'code'}</span><button class="copy-btn" onclick="R.copyEl(this)">Copiar</button></div><pre><code>${esc(block.code)}</code></pre></div>`;
    });

    // Formatting
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
    h = h.replace(/~~(.+?)~~/g, '<del>$1</del>');
    h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    h = h.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    h = h.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    h = h.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    h = h.replace(/^---$/gm, '<hr>');

    // Links
    h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Ordered lists
    h = h.replace(/^(\d+)\. (.+)$/gm, '<oli>$2</oli>');
    h = h.replace(/((?:<oli>[\s\S]*?<\/oli>\n?)+)/g, (m) => {
        return '<ol>' + m.replace(/<\/?oli>/g, tag => tag.replace('oli', 'li')) + '</ol>';
    });

    // Unordered lists
    h = h.replace(/^[\-\*] (.+)$/gm, '<uli>$1</uli>');
    h = h.replace(/((?:<uli>[\s\S]*?<\/uli>\n?)+)/g, (m) => {
        return '<ul>' + m.replace(/<\/?uli>/g, tag => tag.replace('uli', 'li')) + '</ul>';
    });

    // Paragraphs
    h = h.replace(/\n\n/g, '</p><p>');
    h = '<p>' + h + '</p>';
    h = h.replace(/<p><\/p>/g, '');

    // Clean up paragraphs wrapping block elements
    const blockTags = ['h1','h2','h3','ul','ol','div','blockquote','hr','pre'];
    for (const tag of blockTags) {
        const re1 = new RegExp(`<p>(<${tag}[> ])`, 'g');
        const re2 = new RegExp(`(</${tag}>)<\/p>`, 'g');
        h = h.replace(re1, '$1');
        h = h.replace(re2, '$1');
    }
    // Self-closing block tags
    h = h.replace(/<p>(<hr>)/g, '$1');
    h = h.replace(/(<hr>)<\/p>/g, '$1');

    return h;
}

// SVG icons used in messages
const SVG = {
    userAvatar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--tx-3)"><circle cx="12" cy="8" r="4"/><path d="M5.5 21c0-4.14 2.91-7.5 6.5-7.5s6.5 3.36 6.5 7.5"/></svg>`,
    botAvatar: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.73 12.73l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
    copy: '📋',
    regen: '🔄',
    fork: '🔀',
    edit: '✏️',
    pin: '📌'
};

// Global for code copy buttons
window.R = {
    copyEl(btn) {
        const code = btn.closest('.code-wrap')?.querySelector('pre code');
        if (code) {
            navigator.clipboard.writeText(code.textContent).then(() => {
                btn.textContent = 'Copiado!';
                setTimeout(() => btn.textContent = 'Copiar', 2000);
            });
        }
    },
    openLightbox(src) {
        el('lbImg').src = src;
        el('lightbox').classList.add('show');
    }
};
