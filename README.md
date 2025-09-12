# Interactive Epidemic Simulator

A web-based educational tool demonstrating disease spread dynamics using the SIR (Susceptible-Infected-Recovered) epidemiological model. Perfect for medical students learning epidemiology and public health concepts.

## Features

🦠 **Real-time Simulation**
- Interactive SIR mathematical model
- Spatial visualization of disease spread
- Animated population grid with individual tracking

📊 **Data Visualization**
- Real-time epidemic curves
- Population state tracking (S, I, R)
- Key metrics display (R₀, attack rate, peak infections)

🎛️ **Interactive Controls**
- Adjustable parameters (transmission rate, recovery rate, population size)
- Disease scenario presets (Flu, COVID-19, Measles)
- Play/pause/reset functionality

📚 **Educational Content**
- Built-in explanations of key epidemiological concepts
- Real-time metric calculations
- Mathematical formulas with current values

## Quick Start

1. **Run Locally**:
   ```bash
   python3 -m http.server 8000
   ```
   Then open http://localhost:8000 in your browser

2. **Basic Usage**:
   - Click "Start" to begin the simulation
   - Adjust sliders to modify disease parameters
   - Try preset scenarios for different diseases
   - Use spacebar to play/pause, 'R' to reset

## Understanding the Model

### SIR Model Equations
- **dS/dt = -βSI/N** (Susceptible individuals become infected)
- **dI/dt = βSI/N - γI** (Infected individuals recover)
- **dR/dt = γI** (Recovered individuals gain immunity)

### Key Parameters
- **β (Beta)**: Transmission rate - how easily the disease spreads
- **γ (Gamma)**: Recovery rate - how quickly people recover
- **R₀**: Basic reproduction number = β/γ (epidemic threshold)

### Disease Presets
- **Seasonal Flu**: Moderate transmission, faster recovery
- **COVID-19**: High transmission, slower recovery
- **Measles**: Very high transmission, moderate recovery

## Educational Objectives

Students will learn to:
- Understand mathematical modeling of infectious diseases
- Visualize the impact of public health interventions
- Explore concepts of herd immunity and epidemic curves
- Develop intuition for epidemiological decision-making

## Technical Implementation

**Frontend Stack**:
- Vanilla HTML5, CSS3, JavaScript (ES6+)
- Canvas API for visualizations
- No external dependencies for educational transparency

**Key Classes**:
- `EpidemicSimulator`: Core mathematical model and simulation logic
- `PopulationVisualizer`: Animated spatial visualization
- `ChartVisualizer`: Real-time epidemic curve plotting
- `EpidemicApp`: Main application controller and UI management

## Browser Compatibility

Works in all modern browsers:
- Chrome/Chromium 60+
- Firefox 55+
- Safari 10+
- Edge 79+

## Advanced Features

**Hidden Shortcuts**:
- Spacebar: Toggle simulation
- 'R' key: Reset simulation
- Console command: `exportSimulationData()` - Export simulation data as JSON

**Responsive Design**:
- Desktop: Full multi-panel layout
- Tablet: Stacked panels
- Mobile: Single-column with tabs

## Customization

The simulator can be easily extended:

1. **Add New Disease Presets**:
   ```javascript
   // In simulator.js, EpidemicSimulator.getPreset()
   newDisease: {
       transmissionRate: 0.6,
       recoveryRate: 0.08,
       name: "New Disease"
   }
   ```

2. **Modify Visual Styling**:
   - Edit `styles.css` for UI appearance
   - Adjust colors in `visualization.js`

3. **Extend Mathematical Model**:
   - Add SEIR model (with Exposed state)
   - Include vaccination parameters
   - Implement age-structured populations

## Educational Use Cases

**Classroom Scenarios**:
1. **Basic Epidemiology**: Start with simple flu parameters, demonstrate R₀ concept
2. **Intervention Effects**: Show how reducing transmission rate simulates social distancing
3. **Herd Immunity**: Experiment with different population sizes and recovery rates
4. **Comparative Analysis**: Use presets to compare different diseases

**Assessment Ideas**:
- Predict peak infection timing for given parameters
- Calculate herd immunity thresholds
- Explain the relationship between R₀ and epidemic growth
- Design intervention strategies to minimize total infections

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # UI styling and responsive design
├── simulator.js        # SIR mathematical model and Individual class
├── visualization.js    # Canvas-based visualization components
├── app.js             # Main application controller
├── README.md          # Documentation (this file)
└── epidemic-simulator-prd.md  # Detailed project requirements
```

## Contributing

This project demonstrates "vibe coding" for medical education - combining rigorous mathematical modeling with engaging interactive visualization. The code prioritizes:

- **Educational Clarity**: Well-commented, readable code structure
- **Mathematical Accuracy**: Proper implementation of epidemiological models
- **Visual Engagement**: Smooth animations and intuitive interactions
- **Extensibility**: Modular design for easy enhancement

## License

Educational use encouraged. Perfect for medical schools, public health programs, and STEM education.

---

*Built with ❤️ for medical education • Demonstrates programming skills applicable to medical informatics*