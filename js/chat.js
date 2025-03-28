class ChatManager {
    constructor() {
        // API Configuration
        this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
        this.API_KEY = 'AIzaSyAAqW48wgWJqNCmIr7-wqTY1ovyNeC27jM';
        this.MODEL = 'gemini-2.0-flash';

        // DOM Elements
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.querySelector('.chat-messages');
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.handleSend());
        }
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend();
                }
            });
        }

        // Load chat history if exists
        this.loadChatHistory();
    }

    async handleSend() {
        if (this.isProcessing) return;

        const message = this.messageInput.value.trim();
        if (!message) return;

        try {
            // Add user message
            this.addMessage(message, 'user');
            
            // Clear input
            this.messageInput.value = '';

            // Show typing indicator
            this.isProcessing = true;
            this.showTypingIndicator();

            // Get API response
            const response = await this.getAIResponse(message);
            
            // Remove typing indicator and add response
            this.removeTypingIndicator();
            this.addMessage(response, 'bot');

            // Save chat history
            this.saveChatHistory();

        } catch (error) {
            console.error('Error:', error);
            this.removeTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot error');
        } finally {
            this.isProcessing = false;
        }
    }

    async getAIResponse(message) {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.API_KEY}`
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: [{
                        role: "user",
                        content: message
                    }],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    addMessage(text, type) {
        if (!this.chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (type === 'bot') {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'message-header';
            headerDiv.innerHTML = '<i class="fas fa-robot"></i> ZETA AI';
            messageDiv.appendChild(headerDiv);
        }
        
        contentDiv.textContent = text;
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        if (!this.chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-header">
                <i class="fas fa-robot"></i> ZETA AI
            </div>
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        if (!this.chatMessages) return;
        
        const typingIndicator = this.chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    saveChatHistory() {
        const messages = Array.from(this.chatMessages.children).map(msg => ({
            type: msg.classList.contains('user-message') ? 'user' : 'bot',
            text: msg.querySelector('.message-content').textContent
        }));
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }

    loadChatHistory() {
        const history = localStorage.getItem('chatHistory');
        if (history) {
            const messages = JSON.parse(history);
            messages.forEach(msg => this.addMessage(msg.text, msg.type));
        }
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatManager();
}); 