/* ═══════════ CHAT MANAGEMENT ═══════════ */
'use strict';

function newChat() {
    const c = {
        id: uid(),
        title: 'Novo Chat',
        messages: [],
        createdAt: Date.now(),
        pinned: false
    };
    chats.unshift(c);
    activeId = c.id;
    save();
    renderList();
    renderMsgs();
    closeMobile();
    el('inp').focus();
    return c;
}

function active() {
    return chats.find(c => c.id === activeId);
}

function switchChat(id) {
    activeId = id;
    save();
    renderList();
    renderMsgs();
    closeMobile();
}

function delChat(id) {
    chats = chats.filter(c => c.id !== id);
    if (activeId === id) activeId = chats.length ? chats[0].id : null;
    save();
    renderList();
    renderMsgs();
}

function renChat(id) {
    const c = chats.find(x => x.id === id);
    if (!c) return;
    const n = prompt('Novo nome:', c.title);
    if (n && n.trim()) {
        c.title = n.trim();
        save();
        renderList();
    }
}

function pinChat(id) {
    const c = chats.find(x => x.id === id);
    if (!c) return;
    c.pinned = !c.pinned;
    save();
    renderList();
    toast(c.pinned ? 'Chat fixado' : 'Chat desfixado', c.pinned ? '📌' : '📍');
}

function forkChat(chatId, msgIdx) {
    const orig = chats.find(x => x.id === chatId);
    if (!orig) return;
    const forked = {
        id: uid(),
        title: '🔀 ' + orig.title.substring(0, 30),
        messages: JSON.parse(JSON.stringify(orig.messages.slice(0, msgIdx + 1))),
        createdAt: Date.now(),
        pinned: false,
        forkedFrom: orig.id
    };
    chats.unshift(forked);
    activeId = forked.id;
    save();
    renderList();
    renderMsgs();
    toast('Chat bifurcado!', '🔀');
}

function autoTitle(c) {
    if (c.messages.length > 0 && c.title === 'Novo Chat') {
        const t = c.messages[0].content;
        c.title = t.substring(0, 38) + (t.length > 38 ? '...' : '');
        save();
        renderList();
    }
}

function editMessage(chat, msgIdx) {
    if (!chat || generating) return;
    const m = chat.messages[msgIdx];
    if (!m || m.role !== 'user') return;

    const newContent = prompt('Editar mensagem:', m.content);
    if (newContent === null || newContent.trim() === '') return;

    chat.messages = chat.messages.slice(0, msgIdx);
    save();
    renderMsgs();

    el('inp').value = newContent.trim();
    updBtn();
    send();
}
