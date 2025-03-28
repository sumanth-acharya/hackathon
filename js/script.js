const themeToggle = document.getElementById('theme-toggle');

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', toggleTheme);

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

const API_KEY = 'AIzaSyAAqW48wgWJqNCmIr7-wqTY1ovyNeC27jM';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, true);
    chatInput.value = '';

    const loadingMessage = addMessage('Thinking...');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userMessage
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || 'API request failed');
        }

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;
        loadingMessage.querySelector('.message-content').innerHTML = formatMessage(botResponse);
    } catch (error) {
        loadingMessage.querySelector('.message-content').textContent =
            `Error: ${error.message}`;
        console.error('API Error:', error);
    }
}

const chatInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendChatBtn');
const chatMessages = document.getElementById('chatMessages');

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatMessage(content) {
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`{3}([\s\S]*?)`{3}/g, (match, p1) => `<pre><code>${escapeHtml(p1)}</code></pre>`)
        .replace(/`(.*?)`/g, (match, p1) => `<code>${escapeHtml(p1)}</code>`)
        .replace(/\n/g, '<br>');
}

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `<div class="message-content">${formatMessage(content)}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, true);
    chatInput.value = '';

    const loadingMessage = addMessage('Thinking...');

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userMessage }]
                }]
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message || 'API request failed');

        const botResponse = data.candidates[0].content.parts[0].text;
        loadingMessage.querySelector('.message-content').innerHTML = formatMessage(botResponse);
    } catch (error) {
        loadingMessage.querySelector('.message-content').textContent =
            'Error: Could not get response';
        console.error('API Error:', error);
    }
}

if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}