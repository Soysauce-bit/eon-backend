class LivingPlatform {
    constructor() {
        this.interactionCount = 0;
        this.growthLevel = 0;
        this.maxInteractions = 50;
        this.changes = [
            { time: new Date(), message: "Platform initialized – v1.0.0" },
            { time: new Date(), message: "Interactive canvas system activated" },
            { time: new Date(), message: "Growth tracking mechanism implemented" }
        ];
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.canvas = document.getElementById('living-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.sessionId = this.getSessionId();
        this.setupCanvas();
        this.setupEventListeners();
        this.updateGrowthDisplay();
    }
    
    // Generate or retrieve session ID
    getSessionId() {
        let sessionId = localStorage.getItem('living_platform_session');
        if (!sessionId) {
            sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now();
            localStorage.setItem('living_platform_session', sessionId);
        }
        return sessionId;
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        // Track all interactions
        document.addEventListener('click', (e) => this.recordInteraction('click', e.clientX, e.clientY));
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.recordInteraction('move', e.clientX, e.clientY);
        });
        document.addEventListener('scroll', () => this.recordInteraction('scroll', window.scrollX, window.scrollY));
        document.addEventListener('keypress', (e) => this.recordInteraction('keypress', e.clientX || 0, e.clientY || 0));
        
        // Track specific element interactions
        const interactiveElements = document.querySelectorAll('a, .btn, .skill-card, .work-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => 
                this.recordInteraction('hover', e.clientX, e.clientY)
            );
        });
    }
    
    async recordInteraction(type, x, y) {
        this.interactionCount++;
        
        // Add visual particle for interaction
        if (this.interactionCount % 3 === 0) {
            this.createInteractionParticle(x, y, type);
        }
        
        // Update growth level
        const newGrowthLevel = Math.min(100, Math.floor((this.interactionCount / this.maxInteractions) * 100));
        if (newGrowthLevel > this.growthLevel) {
            this.growthLevel = newGrowthLevel;
            this.updateGrowthDisplay();
            this.triggerGrowthEvent();
        }
        
        // Send to backend (uncomment when backend is ready)
        try {
            const response = await fetch('https://eon-tqp0.onrender.com/api/interactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: type,
                    coordinates: { x: x, y: y },
                    sessionId: this.sessionId,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                // Update growth level from server if different
                if (data.growthLevel !== this.growthLevel) {
                    this.growthLevel = data.growthLevel;
                    this.updateGrowthDisplay();
                }
            }
        } catch (error) {
            console.log('Backend offline, continuing with local tracking');
            // Continue with local tracking if backend fails
        }
        
        console.log(`Interaction ${this.interactionCount}: ${type} at (${x}, ${y})`);
    }
    
    createInteractionParticle(x, y, type) {
        const colors = {
            'click': '#93c5fd',
            'hover': '#c084fc',
            'scroll': '#fbbf24',
            'keypress': '#34d399',
            'move': '#60a5fa'
        };
        
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            radius: Math.random() * 3 + 1,
            alpha: 1,
            color: colors[type] || '#93c5fd',
            life: 120 // frames to live
        };
        
        this.particles.push(particle);
    }
    
    updateGrowthDisplay() {
        document.getElementById('growth-percentage').textContent = `${this.growthLevel}%`;
        document.getElementById('meter-fill').style.width = `${this.growthLevel}%`;
    }
    
    triggerGrowthEvent() {
        // Add new changes to the feed based on growth milestones
        const milestones = [
            { level: 20, message: "Canvas ecosystem expanding with user interactions" },
            { level: 40, message: "Adaptive color system activated" },
            { level: 60, message: "New interactive elements discovered" },
            { level: 80, message: "Platform intelligence evolving" },
            { level: 100, message: "Full ecosystem maturity achieved – v1.1.0" }
        ];
        
        const milestone = milestones.find(m => m.level <= this.growthLevel && 
            !this.changes.some(c => c.message === m.message));
        
        if (milestone) {
            this.addChange(milestone.message);
            
            // Trigger visual changes at certain milestones
            if (milestone.level === 40) {
                this.activateAdaptiveColors();
            }
            if (milestone.level === 100) {
                this.celebrateMilestone();
            }
        }
    }
    
    addChange(message) {
        const newChange = {
            time: new Date(),
            message: message
        };
        this.changes.unshift(newChange);
        
        // Update the changes list in DOM
        const changesList = document.getElementById('changes-list');
        const changeItem = document.createElement('div');
        changeItem.className = 'change-item';
        changeItem.innerHTML = `
            <div class="change-dot"></div>
            <span>${message}</span>
        `;
        changesList.insertBefore(changeItem, changesList.firstChild);
        
        // Keep only last 5 changes
        if (changesList.children.length > 5) {
            changesList.removeChild(changesList.lastChild);
        }
    }
    
    activateAdaptiveColors() {
        // Change the gradient colors slightly to show evolution
        document.body.style.background = 'linear-gradient(135deg, #0c1222 0%, #1e1835 50%, #0c1222 100%)';
        document.querySelector('.logo').style.background = 'linear-gradient(90deg, #60a5fa, #d8b4fe)';
    }
    
    celebrateMilestone() {
        // Add celebration particles
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createInteractionParticle(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    'click'
                );
            }, i * 50);
        }
    }
    
    // Canvas animation methods
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = 1 - (distance / 100);
                    this.ctx.strokeStyle = `rgba(147, 197, 253, ${opacity * 0.1})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Mouse interaction
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.vx += (dx / distance) * force * 0.3;
                particle.vy += (dy / distance) * force * 0.3;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply friction
            particle.vx *= 0.96;
            particle.vy *= 0.96;
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -0.5;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -0.5;
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Update life and alpha
            particle.life--;
            particle.alpha = particle.life / 120;
            
            // Draw particle
            if (particle.alpha > 0) {
                this.ctx.fillStyle = particle.color.replace(')', `, ${particle.alpha})`).replace('rgb', 'rgba');
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.particles.splice(i, 1);
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        this.animate();
    }
}