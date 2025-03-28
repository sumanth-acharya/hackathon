class UserMenu {
    constructor() {
        this.profileBtn = document.getElementById('profileBtn');
        this.userDropdown = document.getElementById('userDropdown');
        this.init();
    }

    init() {
        if (!this.profileBtn || !this.userDropdown) return;

        // Set initial user info
        const username = localStorage.getItem('username');
        if (username) {
            const profileInitial = document.querySelector('.profile-initial');
            if (profileInitial) {
                profileInitial.textContent = username.charAt(0).toUpperCase();
            }
        }

        // Toggle dropdown on click
        this.profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.userDropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Handle logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    toggleDropdown() {
        this.userDropdown.classList.toggle('active');
        this.profileBtn.setAttribute('aria-expanded', 
            this.userDropdown.classList.contains('active'));
    }

    closeDropdown() {
        this.userDropdown.classList.remove('active');
        this.profileBtn.setAttribute('aria-expanded', 'false');
    }

    handleLogout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UserMenu();
}); 