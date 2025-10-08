class CustomCursor {
    constructor() {
        this.cursorDot = document.querySelector('.custom-cursor .cursor-dot');
        this.cursorRing = document.querySelector('.custom-cursor .cursor-ring');
        this.mouseX = 0;
        this.mouseY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.ringX = 0;
        this.ringY = 0;
        this.setupEventListeners();
        this.animate();
    }
    
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        const interactiveElements = document.querySelectorAll('a, .btn, .skill-card, .work-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursorRing.style.transform = 'translate(-50%, -50%) scale(1.8)';
                this.cursorRing.style.borderColor = '#c084fc';
            });
            element.addEventListener('mouseleave', () => {
                this.cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
                this.cursorRing.style.borderColor = '#67e8f9';
            });
        });
    }
    
    animate() {
        // Smoothly move the dot
        this.dotX += (this.mouseX - this.dotX) / 8;
        this.dotY += (this.mouseY - this.dotY) / 8;
        this.cursorDot.style.left = this.dotX + 'px';
        this.cursorDot.style.top = this.dotY + 'px';

        // Smoothly move the ring
        this.ringX += (this.mouseX - this.ringX) / 6;
        this.ringY += (this.mouseY - this.ringY) / 6;
        this.cursorRing.style.left = this.ringX + 'px';
        this.cursorRing.style.top = this.ringY + 'px';

        requestAnimationFrame(() => this.animate());
    }
}