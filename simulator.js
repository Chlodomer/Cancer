class Individual {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.state = 'susceptible'; // 'susceptible', 'infected', 'recovered'
        this.infectionDay = 0;
        this.recoveryTime = 14; // Days to recover
    }

    update(day) {
        if (this.state === 'infected') {
            this.infectionDay++;
            if (this.infectionDay >= this.recoveryTime) {
                this.state = 'recovered';
            }
        }
    }

    infect(day) {
        if (this.state === 'susceptible') {
            this.state = 'infected';
            this.infectionDay = 0;
            return true;
        }
        return false;
    }

    isInfected() {
        return this.state === 'infected';
    }

    isSusceptible() {
        return this.state === 'susceptible';
    }

    isRecovered() {
        return this.state === 'recovered';
    }
}

class EpidemicSimulator {
    constructor(config = {}) {
        // Simulation parameters
        this.transmissionRate = config.transmissionRate || 0.3; // β
        this.recoveryRate = config.recoveryRate || 0.1; // γ
        this.populationSize = config.populationSize || 1000;
        this.initialInfected = config.initialInfected || 5;
        
        // Simulation state
        this.day = 0;
        this.isRunning = false;
        this.population = [];
        this.history = {
            days: [],
            susceptible: [],
            infected: [],
            recovered: []
        };
        
        // Grid dimensions for spatial visualization
        this.gridWidth = Math.ceil(Math.sqrt(this.populationSize * 1.5));
        this.gridHeight = Math.ceil(this.populationSize / this.gridWidth);
        
        // Metrics
        this.peakInfected = 0;
        this.peakDay = 0;
        
        this.initializePopulation();
        this.recordHistory();
    }

    initializePopulation() {
        this.population = [];
        const positions = this.generateRandomPositions();
        
        // Create susceptible population
        for (let i = 0; i < this.populationSize; i++) {
            const individual = new Individual(positions[i].x, positions[i].y, i);
            this.population.push(individual);
        }
        
        // Randomly infect initial individuals
        const infectedIndices = this.getRandomIndices(this.initialInfected, this.populationSize);
        infectedIndices.forEach(index => {
            this.population[index].infect(this.day);
        });
    }

    generateRandomPositions() {
        const positions = [];
        const spacing = 1.2; // Minimum spacing between individuals
        const maxAttempts = 100;
        
        for (let i = 0; i < this.populationSize; i++) {
            let attempts = 0;
            let validPosition = false;
            let x, y;
            
            while (!validPosition && attempts < maxAttempts) {
                x = Math.random() * (this.gridWidth - 2) + 1;
                y = Math.random() * (this.gridHeight - 2) + 1;
                
                validPosition = true;
                for (let j = 0; j < positions.length; j++) {
                    const distance = Math.sqrt(
                        Math.pow(x - positions[j].x, 2) + 
                        Math.pow(y - positions[j].y, 2)
                    );
                    if (distance < spacing) {
                        validPosition = false;
                        break;
                    }
                }
                attempts++;
            }
            
            // If we can't find a valid position, place randomly
            if (!validPosition) {
                x = Math.random() * this.gridWidth;
                y = Math.random() * this.gridHeight;
            }
            
            positions.push({ x, y });
        }
        
        return positions;
    }

    getRandomIndices(count, max) {
        const indices = [];
        while (indices.length < count) {
            const randomIndex = Math.floor(Math.random() * max);
            if (!indices.includes(randomIndex)) {
                indices.push(randomIndex);
            }
        }
        return indices;
    }

    step() {
        if (!this.isRunning) return;

        this.day++;
        
        // Get current counts before processing
        const counts = this.getCurrentCounts();
        const currentInfected = counts.infected;
        
        // Track peak infections
        if (currentInfected > this.peakInfected) {
            this.peakInfected = currentInfected;
            this.peakDay = this.day;
        }
        
        // Process infections using spatial model
        this.processInfections();
        
        // Update all individuals (recovery process)
        this.population.forEach(individual => {
            individual.update(this.day);
        });
        
        // Record current state
        this.recordHistory();
        
        // Stop simulation if no more infected individuals
        if (this.getCurrentCounts().infected === 0) {
            this.isRunning = false;
        }
    }

    processInfections() {
        const newInfections = [];
        const infected = this.population.filter(ind => ind.isInfected());
        const susceptible = this.population.filter(ind => ind.isSusceptible());
        
        // For each infected individual
        infected.forEach(infectedPerson => {
            // Find nearby susceptible individuals
            const nearbyDistance = 2.0; // Infection radius
            
            susceptible.forEach(susceptiblePerson => {
                const distance = Math.sqrt(
                    Math.pow(infectedPerson.x - susceptiblePerson.x, 2) + 
                    Math.pow(infectedPerson.y - susceptiblePerson.y, 2)
                );
                
                if (distance <= nearbyDistance) {
                    // Probability of infection based on transmission rate
                    if (Math.random() < this.transmissionRate / 10) { // Scale for daily probability
                        newInfections.push(susceptiblePerson);
                    }
                }
            });
        });
        
        // Apply new infections
        newInfections.forEach(individual => {
            individual.infect(this.day);
        });
    }

    getCurrentCounts() {
        const counts = {
            susceptible: 0,
            infected: 0,
            recovered: 0
        };
        
        this.population.forEach(individual => {
            counts[individual.state]++;
        });
        
        return counts;
    }

    recordHistory() {
        const counts = this.getCurrentCounts();
        this.history.days.push(this.day);
        this.history.susceptible.push(counts.susceptible);
        this.history.infected.push(counts.infected);
        this.history.recovered.push(counts.recovered);
    }

    // Calculate R0 (basic reproduction number)
    calculateR0() {
        // R0 = β / γ where β is transmission rate and γ is recovery rate
        return (this.transmissionRate / this.recoveryRate).toFixed(2);
    }

    // Calculate attack rate (final percentage infected)
    getAttackRate() {
        const totalRecovered = this.getCurrentCounts().recovered;
        return ((totalRecovered / this.populationSize) * 100).toFixed(1);
    }

    // Simulation control methods
    start() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.day = 0;
        this.isRunning = false;
        this.peakInfected = 0;
        this.peakDay = 0;
        this.history = {
            days: [],
            susceptible: [],
            infected: [],
            recovered: []
        };
        this.initializePopulation();
        this.recordHistory();
    }

    // Parameter updates
    updateParameters(params) {
        this.transmissionRate = params.transmissionRate || this.transmissionRate;
        this.recoveryRate = params.recoveryRate || this.recoveryRate;
        this.populationSize = params.populationSize || this.populationSize;
        this.initialInfected = params.initialInfected || this.initialInfected;
        
        // Recalculate grid dimensions if population size changed
        if (params.populationSize) {
            this.gridWidth = Math.ceil(Math.sqrt(this.populationSize * 1.5));
            this.gridHeight = Math.ceil(this.populationSize / this.gridWidth);
        }
        
        // Reset simulation with new parameters
        this.reset();
    }

    // Preset configurations
    static getPreset(presetName) {
        const presets = {
            flu: {
                transmissionRate: 0.4,
                recoveryRate: 0.14,
                name: "Seasonal Flu"
            },
            covid: {
                transmissionRate: 0.5,
                recoveryRate: 0.07,
                name: "COVID-19"
            },
            measles: {
                transmissionRate: 0.8,
                recoveryRate: 0.1,
                name: "Measles"
            }
        };
        
        return presets[presetName] || null;
    }
}