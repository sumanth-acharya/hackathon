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
        this.loginForm = document.getElementById('loginForm');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.init();
    }

    init() {
        // Check if user is logged in
        if (!localStorage.getItem('isLoggedIn') && !window.location.href.includes('login.html')) {
            window.location.href = 'login.html';
            return;
        }

        // Add logout handler
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Update profile button if logged in
        const username = localStorage.getItem('username');
        const profileBtn = document.querySelector('.profile-btn');
        if (profileBtn && username) {
            profileBtn.textContent = username.charAt(0).toUpperCase();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = 'index.html';
        } else {
            this.showError('Invalid username or password');
        }
    }

    handleLogout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const form = document.querySelector('form');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Initialize Auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Auth();
}); 
