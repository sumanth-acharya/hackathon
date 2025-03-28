// Login functionality
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        window.location.href = 'chat.html';
    } else {
        alert('Invalid username or password!');
    }
}

// Registration functionality
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
        alert('Username already exists!');
        return;
    }
    
    // Add new user
    users.push({
        username,
        email,
        password // Note: In a real application, never store passwords in plain text
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Automatically log in the user
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    
    // Redirect to chat page
    window.location.href = 'chat.html';
}

// Initialize the appropriate form handler based on the current page
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

class Auth {
    constructor() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.currentUser = localStorage.getItem('username');
    }

    init() {
        // Initialize auth-related elements
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.handleLogout());

        // Check authentication status on protected pages
        if (window.location.pathname.includes('chat.html') && !this.isLoggedIn) {
            window.location.href = 'login.html';
        }

        // Update UI based on auth status
        this.updateUI();
    }

    handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.setLoggedIn(username);
            window.location.href = 'chat.html';
        } else {
            this.showError('Invalid username or password');
        }
    }

    handleRegister(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.some(user => user.username === username)) {
            this.showError('Username already exists');
            return;
        }
        
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        this.setLoggedIn(username);
        window.location.href = 'chat.html';
    }

    handleLogout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }

    setLoggedIn(username) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        this.isLoggedIn = true;
        this.currentUser = username;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const form = document.querySelector('form');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => errorDiv.remove(), 3000);
    }

    updateUI() {
        const profileBtn = document.querySelector('.profile-btn');
        if (profileBtn && this.currentUser) {
            profileBtn.textContent = this.currentUser.charAt(0).toUpperCase();
        }
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    const auth = new Auth();
    auth.init();
}); 
