class PopulationVisualizer {
    constructor(canvasId, simulator) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.simulator = simulator;
        
        // Visual properties
        this.individualRadius = 3;
        this.colors = {
            susceptible: '#3498db',
            infected: '#e74c3c',
            recovered: '#2ecc71'
        };
        
        // Animation properties
        this.animationSpeed = 1;
        this.showTransmission = true;
        this.transmissionEvents = [];
        this.infectionsThisFrame = [];
        this.explosionEffects = [];
        
        this.setupCanvas();
    }
    
    setupCanvas() {
        // Make canvas responsive
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Calculate scale factors
        this.scaleX = this.canvas.width / this.simulator.gridWidth;
        this.scaleY = this.canvas.height / this.simulator.gridHeight;
        this.individualRadius = Math.max(2, Math.min(this.scaleX, this.scaleY) / 6);
    }
    
    render() {
        this.clearCanvas();
        this.drawPopulation();
        this.drawTransmissionEvents();
        this.drawExplosionEffects();
        this.detectNewInfections();
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw subtle grid background
        this.ctx.strokeStyle = '#f0f2f5';
        this.ctx.lineWidth = 0.5;
        
        const gridSpacing = Math.min(this.scaleX, this.scaleY);
        for (let x = 0; x < this.canvas.width; x += gridSpacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSpacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawPopulation() {
        this.simulator.population.forEach(individual => {
            this.drawIndividual(individual);
        });
    }
    
    drawIndividual(individual) {
        const x = individual.x * this.scaleX;
        const y = individual.y * this.scaleY;
        
        // Draw individual circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.individualRadius, 0, 2 * Math.PI);
        
        // Color based on state
        this.ctx.fillStyle = this.colors[individual.state];
        this.ctx.fill();
        
        // Add border for better visibility
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Special effects for infected individuals
        if (individual.state === 'infected') {
            this.drawInfectionAura(x, y, individual.infectionDay);
        }
    }
    
    drawInfectionAura(x, y, infectionDay) {
        const time = Date.now() * 0.005;
        
        // Multiple pulsing rings for dramatic effect
        for (let ring = 0; ring < 3; ring++) {
            const ringDelay = ring * 0.3;
            const pulseIntensity = Math.sin(time + infectionDay + ringDelay) * 0.5 + 0.5;
            const baseRadius = this.individualRadius + 5;
            const auraRadius = baseRadius + ring * 8 + pulseIntensity * 6;
            
            // Outer glow ring
            this.ctx.beginPath();
            this.ctx.arc(x, y, auraRadius, 0, 2 * Math.PI);
            this.ctx.fillStyle = `rgba(231, 76, 60, ${0.15 * pulseIntensity * (1 - ring * 0.3)})`;
            this.ctx.fill();
        }
        
        // Inner danger zone (infection range indicator)
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.individualRadius + 15, 0, 2 * Math.PI);
        this.ctx.strokeStyle = `rgba(255, 0, 0, ${0.3 + Math.sin(time) * 0.2})`;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Sparkling particles around infected individual
        for (let i = 0; i < 6; i++) {
            const angle = (time + i * Math.PI / 3) % (2 * Math.PI);
            const sparkleRadius = this.individualRadius + 10 + Math.sin(time + i) * 5;
            const sparkleX = x + Math.cos(angle) * sparkleRadius;
            const sparkleY = y + Math.sin(angle) * sparkleRadius;
            
            this.ctx.beginPath();
            this.ctx.arc(sparkleX, sparkleY, 1 + Math.sin(time * 2 + i), 0, 2 * Math.PI);
            this.ctx.fillStyle = `rgba(255, 100, 100, ${0.7 + Math.sin(time + i) * 0.3})`;
            this.ctx.fill();
        }
    }
    
    addTransmissionEvent(fromX, fromY, toX, toY) {
        this.transmissionEvents.push({
            fromX: fromX * this.scaleX,
            fromY: fromY * this.scaleY,
            toX: toX * this.scaleX,
            toY: toY * this.scaleY,
            progress: 0,
            timestamp: Date.now()
        });
    }
    
    drawTransmissionEvents() {
        if (!this.showTransmission) return;
        
        this.transmissionEvents = this.transmissionEvents.filter(event => {
            const age = Date.now() - event.timestamp;
            const maxAge = 1000; // 1 second duration
            
            if (age > maxAge) return false;
            
            event.progress = age / maxAge;
            this.drawTransmissionLine(event);
            return true;
        });
    }
    
    drawTransmissionLine(event) {
        const opacity = 1 - event.progress;
        const currentX = event.fromX + (event.toX - event.fromX) * event.progress;
        const currentY = event.fromY + (event.toY - event.fromY) * event.progress;
        
        // Draw glowing transmission beam
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = `rgba(255, 50, 50, ${opacity * 0.4})`;
        this.ctx.beginPath();
        this.ctx.moveTo(event.fromX, event.fromY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
        
        // Inner bright beam
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = `rgba(255, 150, 150, ${opacity * 0.8})`;
        this.ctx.stroke();
        
        // Traveling virus particle with trail
        const particleSize = 3 + Math.sin(Date.now() * 0.02) * 2;
        
        // Particle glow
        this.ctx.beginPath();
        this.ctx.arc(currentX, currentY, particleSize + 3, 0, 2 * Math.PI);
        this.ctx.fillStyle = `rgba(255, 0, 0, ${opacity * 0.3})`;
        this.ctx.fill();
        
        // Particle core
        this.ctx.beginPath();
        this.ctx.arc(currentX, currentY, particleSize, 0, 2 * Math.PI);
        this.ctx.fillStyle = `rgba(255, 50, 50, ${opacity})`;
        this.ctx.fill();
        
        // Particle highlight
        this.ctx.beginPath();
        this.ctx.arc(currentX - 1, currentY - 1, particleSize / 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = `rgba(255, 200, 200, ${opacity})`;
        this.ctx.fill();
    }
    
    detectNewInfections() {
        // Track new infections for explosion effects
        const currentInfected = this.simulator.population.filter(ind => ind.state === 'infected');
        
        currentInfected.forEach(individual => {
            if (!this.infectionsThisFrame.find(inf => inf.id === individual.id)) {
                if (individual.infectionDay === 0) { // Newly infected this step
                    this.addExplosionEffect(
                        individual.x * this.scaleX,
                        individual.y * this.scaleY
                    );
                }
            }
        });
        
        // Update tracking
        this.infectionsThisFrame = currentInfected.map(ind => ({ id: ind.id }));
    }
    
    addExplosionEffect(x, y) {
        this.explosionEffects.push({
            x: x,
            y: y,
            timestamp: Date.now(),
            particles: this.generateExplosionParticles(x, y)
        });
    }
    
    generateExplosionParticles(centerX, centerY) {
        const particles = [];
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = 2 + Math.random() * 3;
            const life = 1000 + Math.random() * 500;
            
            particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: life,
                maxLife: life,
                size: 2 + Math.random() * 3
            });
        }
        return particles;
    }
    
    drawExplosionEffects() {
        this.explosionEffects = this.explosionEffects.filter(explosion => {
            const age = Date.now() - explosion.timestamp;
            const maxAge = 1500;
            
            if (age > maxAge) return false;
            
            // Draw central flash
            const flashIntensity = Math.max(0, (1 - age / 300)); // Quick bright flash
            if (flashIntensity > 0) {
                this.ctx.beginPath();
                this.ctx.arc(explosion.x, explosion.y, 15 * flashIntensity, 0, 2 * Math.PI);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity * 0.8})`;
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(explosion.x, explosion.y, 25 * flashIntensity, 0, 2 * Math.PI);
                this.ctx.fillStyle = `rgba(255, 100, 100, ${flashIntensity * 0.4})`;
                this.ctx.fill();
            }
            
            // Draw explosion particles
            explosion.particles.forEach(particle => {
                const particleAge = age;
                const life = 1 - (particleAge / particle.maxLife);
                
                if (life > 0) {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vx *= 0.98; // Friction
                    particle.vy *= 0.98;
                    
                    const size = particle.size * life;
                    const alpha = life * 0.8;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, size, 0, 2 * Math.PI);
                    this.ctx.fillStyle = `rgba(255, ${50 + life * 100}, ${50 + life * 50}, ${alpha})`;
                    this.ctx.fill();
                }
            });
            
            return true;
        });
    }
}

class ChartVisualizer {
    constructor(canvasId, simulator) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.simulator = simulator;
        
        // Chart properties
        this.margin = { top: 20, right: 20, bottom: 40, left: 60 };
        this.colors = {
            susceptible: '#3498db',
            infected: '#e74c3c',
            recovered: '#2ecc71'
        };
        
        this.setupCanvas();
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        this.chartWidth = this.canvas.width - this.margin.left - this.margin.right;
        this.chartHeight = this.canvas.height - this.margin.top - this.margin.bottom;
    }
    
    render() {
        this.clearCanvas();
        this.drawAxes();
        this.drawCurves();
        this.drawLegend();
        this.drawMetrics();
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Background
        this.ctx.fillStyle = '#fafbfc';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawAxes() {
        const history = this.simulator.history;
        if (history.days.length === 0) return;
        
        // Set up scales
        this.maxDay = Math.max(...history.days, 50);
        this.maxPopulation = this.simulator.populationSize;
        
        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 2;
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.margin.left, this.margin.top);
        this.ctx.lineTo(this.margin.left, this.margin.top + this.chartHeight);
        this.ctx.stroke();
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.margin.left, this.margin.top + this.chartHeight);
        this.ctx.lineTo(this.margin.left + this.chartWidth, this.margin.top + this.chartHeight);
        this.ctx.stroke();
        
        // Y-axis labels
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        
        for (let i = 0; i <= 5; i++) {
            const value = (this.maxPopulation / 5) * i;
            const y = this.margin.top + this.chartHeight - (i / 5) * this.chartHeight;
            
            this.ctx.fillText(Math.round(value).toString(), this.margin.left - 10, y);
            
            // Grid lines
            if (i > 0) {
                this.ctx.strokeStyle = '#ecf0f1';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(this.margin.left, y);
                this.ctx.lineTo(this.margin.left + this.chartWidth, y);
                this.ctx.stroke();
            }
        }
        
        // X-axis labels
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        
        for (let i = 0; i <= 10; i++) {
            const day = (this.maxDay / 10) * i;
            const x = this.margin.left + (i / 10) * this.chartWidth;
            
            this.ctx.fillStyle = '#2c3e50';
            this.ctx.fillText(`Day ${Math.round(day)}`, x, this.margin.top + this.chartHeight + 10);
            
            // Grid lines
            if (i > 0) {
                this.ctx.strokeStyle = '#ecf0f1';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(x, this.margin.top);
                this.ctx.lineTo(x, this.margin.top + this.chartHeight);
                this.ctx.stroke();
            }
        }
        
        // Axis labels
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Days', this.margin.left + this.chartWidth / 2, this.canvas.height - 5);
        
        this.ctx.save();
        this.ctx.translate(15, this.margin.top + this.chartHeight / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Population', 0, 0);
        this.ctx.restore();
    }
    
    drawCurves() {
        const history = this.simulator.history;
        if (history.days.length < 2) return;
        
        const curves = [
            { data: history.susceptible, color: this.colors.susceptible, label: 'Susceptible' },
            { data: history.infected, color: this.colors.infected, label: 'Infected' },
            { data: history.recovered, color: this.colors.recovered, label: 'Recovered' }
        ];
        
        curves.forEach(curve => {
            this.drawCurve(history.days, curve.data, curve.color);
        });
    }
    
    drawCurve(days, data, color) {
        if (data.length < 2) return;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        for (let i = 0; i < data.length; i++) {
            const x = this.margin.left + (days[i] / this.maxDay) * this.chartWidth;
            const y = this.margin.top + this.chartHeight - (data[i] / this.maxPopulation) * this.chartHeight;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
        
        // Draw points
        this.ctx.fillStyle = color;
        for (let i = 0; i < data.length; i++) {
            if (i % 5 === 0 || i === data.length - 1) { // Show every 5th point
                const x = this.margin.left + (days[i] / this.maxDay) * this.chartWidth;
                const y = this.margin.top + this.chartHeight - (data[i] / this.maxPopulation) * this.chartHeight;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }
    
    drawLegend() {
        const legendItems = [
            { color: this.colors.susceptible, label: 'Susceptible' },
            { color: this.colors.infected, label: 'Infected' },
            { color: this.colors.recovered, label: 'Recovered' }
        ];
        
        const legendX = this.margin.left + this.chartWidth - 150;
        const legendY = this.margin.top + 20;
        
        legendItems.forEach((item, index) => {
            const y = legendY + index * 25;
            
            // Color box
            this.ctx.fillStyle = item.color;
            this.ctx.fillRect(legendX, y, 15, 15);
            
            // Label
            this.ctx.fillStyle = '#2c3e50';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(item.label, legendX + 20, y + 7);
        });
    }
    
    drawMetrics() {
        const history = this.simulator.history;
        if (history.days.length === 0) return;
        
        // Draw current day indicator
        const currentDay = this.simulator.day;
        const x = this.margin.left + (currentDay / this.maxDay) * this.chartWidth;
        
        this.ctx.strokeStyle = '#f39c12';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(x, this.margin.top);
        this.ctx.lineTo(x, this.margin.top + this.chartHeight);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Peak infection indicator
        if (this.simulator.peakDay > 0) {
            const peakX = this.margin.left + (this.simulator.peakDay / this.maxDay) * this.chartWidth;
            const peakY = this.margin.top + this.chartHeight - (this.simulator.peakInfected / this.maxPopulation) * this.chartHeight;
            
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.beginPath();
            this.ctx.arc(peakX, peakY, 6, 0, 2 * Math.PI);
            this.ctx.fill();
            
            this.ctx.strokeStyle = '#c0392b';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }
}