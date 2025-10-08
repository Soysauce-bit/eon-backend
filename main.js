// Scroll animations
function setupScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-100px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the living platform
    const platform = new LivingPlatform();
    platform.start();
    
    // Initialize custom cursor
    const cursor = new CustomCursor();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Trigger hero section immediately
    document.getElementById('hero').classList.add('visible');
    
    console.log('Living Platform v1.0.3 initialized. Ready to evolve with your interactions!');
    console.log('Session ID:', platform.sessionId);
});