// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle button icon
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Mobile Navigation
class MobileNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.init();
    }
    
    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Form Handling
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!this.validateForm(data)) {
            return;
        }
        
        // Show success message (in real implementation, you'd send this to a server)
        this.showSuccessMessage();
        this.form.reset();
    }
    
    validateForm(data) {
        const requiredFields = ['name', 'phone', 'violation'];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showError(`Please fill in the ${field} field.`);
                return false;
            }
        }
        
        // Phone number validation (basic Indian format)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            this.showError('Please enter a valid 10-digit Indian phone number.');
            return false;
        }
        
        return true;
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            ">
                <i class="fas fa-check-circle"></i>
                Thank you! We'll contact you soon.
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    showError(errorMessage) {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--error-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            ">
                <i class="fas fa-exclamation-circle"></i>
                ${errorMessage}
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// Navbar Scroll Effect
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScrollTop = 0;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background on scroll
        if (scrollTop > 50) {
            this.navbar.style.background = 'var(--bg-navbar)';
            this.navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            this.navbar.style.background = 'var(--bg-navbar)';
            this.navbar.style.boxShadow = 'none';
        }
        
        this.lastScrollTop = scrollTop;
    }
}

// Animated Counter for Stats
class AnimatedCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateValue(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.stats.forEach(stat => observer.observe(stat));
    }
    
    animateValue(element) {
        const text = element.textContent;
        const isPercentage = text.includes('%');
        const isTime = text.includes('hrs');
        
        if (isPercentage) {
            const target = parseInt(text);
            this.animateNumber(element, 0, target, 2000, '%');
        } else if (isTime) {
            element.textContent = text; // Keep as is for time
        } else {
            const target = parseInt(text.replace(/\D/g, ''));
            this.animateNumber(element, 0, target, 2000, '+');
        }
    }
    
    animateNumber(element, start, end, duration, suffix) {
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }
}

// Service Card Hover Effects
class ServiceCardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.service-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleHover(card, true));
            card.addEventListener('mouseleave', () => this.handleHover(card, false));
        });
    }
    
    handleHover(card, isHovering) {
        const icon = card.querySelector('.service-icon');
        
        if (isHovering) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        } else {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    }
}

// Process Step Animation
class ProcessStepAnimation {
    constructor() {
        this.steps = document.querySelectorAll('.step');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        this.steps.forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px)';
            step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(step);
        });
    }
}

// Contact Form Enhancement
class ContactFormEnhancement {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        this.addFloatingLabels();
        this.addInputValidation();
    }
    
    addFloatingLabels() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
    
    addInputValidation() {
        const phoneInput = document.getElementById('phone');
        
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    }
}

// Initialize all classes when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new MobileNav();
    new SmoothScroll();
    new ContactForm();
    new NavbarScroll();
    new AnimatedCounter();
    new ServiceCardEffects();
    new ProcessStepAnimation();
    new ContactFormEnhancement();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .form-group.focused label {
            transform: translateY(-20px) scale(0.8);
            color: var(--primary-color);
        }
        
        .service-card:hover .service-icon {
            background: var(--primary-dark);
        }
        
        .step:hover .step-number {
            background: var(--primary-dark);
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add scroll reveal animation
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.service-card, .contact-item, .about-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
});