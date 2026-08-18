// ==================== DOM Elements ====================

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const navbar = document.querySelector('.navbar');
const contactForm = document.querySelector('.contact-form');

// ==================== Mobile Menu Toggle ====================

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    hamburger.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.style.display = 'none';
        hamburger.classList.remove('active');
    });
});

// ==================== Navbar Background on Scroll ====================

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 14, 39, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
    }
});

// ==================== Smooth Scroll with Offset ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // navbar height
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== Intersection Observer for Animations ====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards and elements
document.querySelectorAll('.project-card, .skill-category, .education-card, .timeline-content').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ==================== Typing Animation for Hero Text ====================

function typeWriter(element, text, speed = 50) {
    element.textContent = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Apply typing effect to hero title
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        typeWriter(heroTitle, originalText, 30);
    }
});

// ==================== Counter Animation ====================

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Trigger counter animation on scroll
const statElements = document.querySelectorAll('.stat h3');
let countersAnimated = false;

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            statElements.forEach(el => {
                const value = parseInt(el.textContent);
                animateCounter(el, value, 1500);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    counterObserver.observe(aboutSection);
}

// ==================== Form Validation and Submission ====================

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = contactForm.querySelector('input[placeholder="Your Name"]').value;
        const email = contactForm.querySelector('input[placeholder="Your Email"]').value;
        const message = contactForm.querySelector('textarea').value;

        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }

        // Send message to Django backend
        const submitBtn = contactForm.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = {
            name: name,
            email: email,
            message: message
        };

        fetch('/api/send-message/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    submitBtn.textContent = 'Message Sent!';
                    contactForm.reset();
                    showNotification(data.message || 'Thank you! I will get back to you soon.', 'success');

                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                } else {
                    showNotification(data.error || 'Failed to send message. Please try again.', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                showNotification('Failed to send message. Please try again or contact directly.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

// ==================== Email Validation ====================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==================== Notification System ====================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00d084' : type === 'error' ? '#ff6b6b' : '#0066ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== Active Nav Link Indicator ====================

window.addEventListener('scroll', () => {
    let current = '';

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.style.color = 'var(--primary-color)';
        } else {
            item.style.color = 'var(--text-secondary)';
        }
    });
});

// ==================== Parallax Effect ====================

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.scrollY;
        hero.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
    }
});

// ==================== Skill Tag Hover Effect ====================

const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1) rotate(2deg)';
    });

    tag.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ==================== Project Card Click ====================

const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
        const projectTitle = this.querySelector('h3').textContent;
        console.log('Project clicked:', projectTitle);
        // Can add modal or link functionality here
    });
});

// ==================== Smooth Page Load Animation ====================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in';

setTimeout(() => {
    document.body.style.opacity = '1';
}, 100);

// ==================== Back to Top Button ====================

const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #0066ff, #00d4ff);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    display: none;
    z-index: 999;
    box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
    transition: all 0.3s ease;
    font-weight: bold;
`;

document.body.appendChild(backToTopBtn);

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.style.display = 'flex';
        backToTopBtn.style.alignItems = 'center';
        backToTopBtn.style.justifyContent = 'center';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

// Scroll to top on click
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect
backToTopBtn.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-5px)';
    this.style.boxShadow = '0 15px 40px rgba(0, 102, 255, 0.5)';
});

backToTopBtn.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 10px 30px rgba(0, 102, 255, 0.3)';
});

// ==================== Keyboard Navigation ====================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + / to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        navItems[0].focus();
    }

    // Escape to close mobile menu
    if (e.key === 'Escape') {
        navLinks.style.display = 'none';
        hamburger.classList.remove('active');
    }
});

// ==================== Accessibility: Focus Management ====================

document.querySelectorAll('a, button, input, textarea').forEach(element => {
    element.addEventListener('focus', function () {
        this.style.outline = '2px solid #0066ff';
        this.style.outlineOffset = '2px';
    });

    element.addEventListener('blur', function () {
        this.style.outline = 'none';
    });
});

// ==================== Console Welcome Message ====================

console.log('%c Welcome to Chetan Kumar Prajapati\'s Portfolio! ', 'background: linear-gradient(135deg, #0066ff, #00d4ff); color: white; font-size: 14px; padding: 10px; border-radius: 5px;');
console.log('%c AIML Engineer | Data Scientist | Python Developer ', 'color: #00d4ff; font-size: 12px; font-weight: bold;');
console.log('%c Email: chetan.dev94@gmail.com | Phone: +91 9461-1371 ', 'color: #a0aec0; font-size: 11px;');
