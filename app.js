class EpidemicApp {
    constructor() {
        // Initialize simulator with default parameters
        this.simulator = new EpidemicSimulator({
            transmissionRate: 0.3,
            recoveryRate: 0.1,
            populationSize: 1000,
            initialInfected: 5
        });
        
        // Initialize visualizers
        this.populationViz = new PopulationVisualizer('population-canvas', this.simulator);
        this.chartViz = new ChartVisualizer('chart-canvas', this.simulator);
        
        // Animation properties
        this.isAnimating = false;
        this.animationSpeed = 800; // milliseconds between steps (much slower)
        this.lastStepTime = 0;
        
        this.setupEventListeners();
        this.updateUI();
        this.startRenderLoop();
    }
    
    setupEventListeners() {
        // Parameter sliders
        this.setupSlider('transmission-rate', 'transmission-value', (value) => {
            this.simulator.transmissionRate = parseFloat(value);
            this.updateMetrics();
        });
        
        this.setupSlider('recovery-rate', 'recovery-value', (value) => {
            this.simulator.recoveryRate = parseFloat(value);
            this.updateMetrics();
        });
        
        this.setupSlider('population-size', 'population-value', (value) => {
            const newSize = parseInt(value);
            this.simulator.updateParameters({ populationSize: newSize });
            this.updateUI();
        });
        
        this.setupSlider('initial-infected', 'infected-value', (value) => {
            const newInfected = parseInt(value);
            this.simulator.updateParameters({ initialInfected: newInfected });
            this.updateUI();
        });
        
        this.setupSlider('animation-speed', 'speed-value', (value) => {
            this.animationSpeed = parseInt(value);
            // Update display with descriptive text
            const speedDisplay = document.getElementById('speed-value');
            if (value <= 400) speedDisplay.textContent = 'Fast';
            else if (value <= 800) speedDisplay.textContent = 'Normal';
            else if (value <= 1200) speedDisplay.textContent = 'Slow';
            else speedDisplay.textContent = 'Very Slow';
        });
        
        // Control buttons
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startSimulation();
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.pauseSimulation();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetSimulation();
        });
        
        // Preset buttons
        document.querySelectorAll('.btn.preset').forEach(button => {
            button.addEventListener('click', (e) => {
                const presetName = e.target.getAttribute('data-preset');
                this.loadPreset(presetName);
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ': // Spacebar
                    e.preventDefault();
                    this.toggleSimulation();
                    break;
                case 'r':
                case 'R':
                    this.resetSimulation();
                    break;
            }
        });
    }
    
    setupSlider(sliderId, valueId, callback) {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(valueId);
        
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueDisplay.textContent = value;
            callback(value);
        });
        
        // Initialize display
        if (sliderId === 'animation-speed') {
            const value = parseInt(slider.value);
            if (value <= 400) valueDisplay.textContent = 'Fast';
            else if (value <= 800) valueDisplay.textContent = 'Normal';
            else if (value <= 1200) valueDisplay.textContent = 'Slow';
            else valueDisplay.textContent = 'Very Slow';
        } else {
            valueDisplay.textContent = slider.value;
        }
    }
    
    startSimulation() {
        this.simulator.start();
        this.isAnimating = true;
        this.updateControlButtons();
    }
    
    pauseSimulation() {
        this.simulator.pause();
        this.isAnimating = false;
        this.updateControlButtons();
    }
    
    resetSimulation() {
        this.simulator.reset();
        this.isAnimating = false;
        this.updateUI();
        this.updateControlButtons();
    }
    
    toggleSimulation() {
        if (this.simulator.isRunning) {
            this.pauseSimulation();
        } else {
            this.startSimulation();
        }
    }
    
    loadPreset(presetName) {
        const preset = EpidemicSimulator.getPreset(presetName);
        if (!preset) return;
        
        // Update sliders
        document.getElementById('transmission-rate').value = preset.transmissionRate;
        document.getElementById('transmission-value').textContent = preset.transmissionRate;
        
        document.getElementById('recovery-rate').value = preset.recoveryRate;
        document.getElementById('recovery-value').textContent = preset.recoveryRate;
        
        // Update simulator
        this.simulator.updateParameters({
            transmissionRate: preset.transmissionRate,
            recoveryRate: preset.recoveryRate
        });
        
        this.updateUI();
        
        // Show notification
        this.showNotification(`Loaded ${preset.name} preset`);
    }
    
    updateControlButtons() {
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        
        if (this.simulator.isRunning) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        } else {
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
        }
    }
    
    updateUI() {
        this.updateMetrics();
        this.updateControlButtons();
    }
    
    updateMetrics() {
        // Update R0 value
        document.getElementById('r0-value').textContent = this.simulator.calculateR0();
        
        // Update current day
        document.getElementById('day-value').textContent = this.simulator.day;
        
        // Update peak infections
        if (this.simulator.peakInfected > 0) {
            document.getElementById('peak-value').textContent = 
                `${this.simulator.peakInfected} (Day ${this.simulator.peakDay})`;
        } else {
            document.getElementById('peak-value').textContent = '-';
        }
        
        // Update attack rate
        document.getElementById('attack-rate').textContent = this.simulator.getAttackRate() + '%';
        
        // Update population counts in a more detailed way
        const counts = this.simulator.getCurrentCounts();
        this.updatePopulationStats(counts);
    }
    
    updatePopulationStats(counts) {
        // Create or update detailed stats if they don't exist
        let statsContainer = document.querySelector('.population-stats');
        if (!statsContainer) {
            statsContainer = document.createElement('div');
            statsContainer.className = 'population-stats';
            
            const infoPanel = document.querySelector('.info-panel');
            infoPanel.insertBefore(statsContainer, infoPanel.querySelector('.educational-content'));
            
            // Add title
            const title = document.createElement('h4');
            title.textContent = 'Current Population';
            statsContainer.appendChild(title);
        }
        
        statsContainer.innerHTML = `
            <h4>Current Population</h4>
            <div class="population-breakdown">
                <div class="pop-stat susceptible">
                    <span class="pop-label">Susceptible:</span>
                    <span class="pop-value">${counts.susceptible}</span>
                    <span class="pop-percent">(${(counts.susceptible/this.simulator.populationSize*100).toFixed(1)}%)</span>
                </div>
                <div class="pop-stat infected">
                    <span class="pop-label">Infected:</span>
                    <span class="pop-value">${counts.infected}</span>
                    <span class="pop-percent">(${(counts.infected/this.simulator.populationSize*100).toFixed(1)}%)</span>
                </div>
                <div class="pop-stat recovered">
                    <span class="pop-label">Recovered:</span>
                    <span class="pop-value">${counts.recovered}</span>
                    <span class="pop-percent">(${(counts.recovered/this.simulator.populationSize*100).toFixed(1)}%)</span>
                </div>
            </div>
        `;
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            font-weight: bold;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    startRenderLoop() {
        const render = (currentTime) => {
            // Update simulation if running
            if (this.isAnimating && this.simulator.isRunning) {
                if (currentTime - this.lastStepTime >= this.animationSpeed) {
                    this.simulator.step();
                    this.updateUI();
                    this.lastStepTime = currentTime;
                }
            }
            
            // Always render visualizations
            this.populationViz.render();
            this.chartViz.render();
            
            requestAnimationFrame(render);
        };
        
        requestAnimationFrame(render);
    }
    
    // Additional utility methods
    exportData() {
        const data = {
            parameters: {
                transmissionRate: this.simulator.transmissionRate,
                recoveryRate: this.simulator.recoveryRate,
                populationSize: this.simulator.populationSize,
                initialInfected: this.simulator.initialInfected
            },
            history: this.simulator.history,
            metrics: {
                r0: this.simulator.calculateR0(),
                peakInfected: this.simulator.peakInfected,
                peakDay: this.simulator.peakDay,
                attackRate: this.simulator.getAttackRate()
            }
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `epidemic_simulation_${new Date().toISOString().slice(0,10)}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully!');
    }
}

// Add some additional CSS for the population stats
const additionalStyles = `
    .population-stats {
        margin: 20px 0;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 6px;
        border-left: 4px solid #3498db;
    }
    
    .population-breakdown {
        margin-top: 10px;
    }
    
    .pop-stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding: 5px 0;
    }
    
    .pop-stat.susceptible .pop-value { color: #3498db; font-weight: bold; }
    .pop-stat.infected .pop-value { color: #e74c3c; font-weight: bold; }
    .pop-stat.recovered .pop-value { color: #2ecc71; font-weight: bold; }
    
    .pop-label {
        font-weight: 600;
        flex: 1;
    }
    
    .pop-value {
        font-weight: 700;
        margin-right: 10px;
        min-width: 40px;
        text-align: right;
    }
    
    .pop-percent {
        font-size: 0.9em;
        color: #7f8c8d;
        min-width: 50px;
        text-align: right;
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;

// Add the additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.epidemicApp = new EpidemicApp();
    
    // Add export button functionality (hidden feature - can be activated via console)
    window.exportSimulationData = () => {
        window.epidemicApp.exportData();
    };
    
    console.log('🦠 Epidemic Simulator loaded!');
    console.log('💡 Tips:');
    console.log('  - Use spacebar to start/pause simulation');
    console.log('  - Press R to reset');
    console.log('  - Call exportSimulationData() to export data');
    console.log('  - Try different preset scenarios');
});