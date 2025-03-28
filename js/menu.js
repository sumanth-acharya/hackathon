class MenuManager {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.sideMenu = document.getElementById('sideMenu');
        this.isMenuOpen = false;

        // Initialize event listeners
        this.init();
    }

    init() {
        // Toggle menu on button click
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.sideMenu.contains(e.target) && 
                !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on window resize if in desktop mode
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.sideMenu.classList.toggle('active');
        this.menuToggle.setAttribute('aria-expanded', this.isMenuOpen);
        
        // Toggle aria-label for accessibility
        this.menuToggle.setAttribute('aria-label', 
            this.isMenuOpen ? 'Close menu' : 'Open menu'
        );
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.sideMenu.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-label', 'Open menu');
    }
}

// Initialize MenuManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const menuManager = new MenuManager();
}); 