class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        // Initialize theme
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add click event listener to theme toggle button
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Update button aria-label for accessibility
        this.updateToggleButton();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateToggleButton();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add animation to the toggle button
        this.themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'none';
        }, 300);
    }

    updateToggleButton() {
        // Update button icon and aria-label based on current theme
        if (this.currentTheme === 'dark') {
            this.themeToggle.textContent = '☀️';
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            this.themeToggle.textContent = '🌙';
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

// Initialize ThemeManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
}); 