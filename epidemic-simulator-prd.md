# Interactive Epidemic Simulator - Product Requirements Document

## Project Overview

### Vision Statement
Build an interactive web-based epidemic simulator that demonstrates disease spread dynamics using the SIR (Susceptible-Infected-Recovered) epidemiological model, designed to teach medical students core concepts in infectious disease and public health.

### Target Audience
- **Primary**: Medical students learning epidemiology and public health
- **Secondary**: Public health students, general education users interested in disease dynamics
- **Tertiary**: Instructors teaching infectious disease concepts

### Educational Objectives
- Understand the mathematical foundations of disease spread (SIR model)
- Visualize the impact of intervention strategies (vaccination, social distancing)
- Explore concepts of herd immunity, basic reproduction number (R₀), and epidemic curves
- Develop intuition for public health policy decisions

## Core Features

### 1. Mathematical Engine
- **SIR Model Implementation**
  - Susceptible (S): Individuals who can contract the disease
  - Infected (I): Currently infectious individuals
  - Recovered (R): Immune individuals (recovered or vaccinated)
- **Differential Equations**: 
  - dS/dt = -βSI/N
  - dI/dt = βSI/N - γI
  - dR/dt = γI
- **Configurable Parameters**:
  - β (transmission rate): 0.1 - 2.0
  - γ (recovery rate): 0.05 - 0.5
  - Population size: 100 - 10,000
  - Initial infected: 1 - 100

### 2. Visual Population Grid
- **Animated Grid Display**
  - Each individual represented as a colored dot/circle
  - Color coding: Blue (Susceptible), Red (Infected), Green (Recovered)
  - Smooth transitions between states
  - Grid size: 20x20 to 100x100 (configurable)
- **Infection Visualization**
  - Show transmission events in real-time
  - Proximity-based infection spreading
  - Visual feedback for new infections

### 3. Real-time Graphing
- **Epidemic Curves**
  - Line chart showing S, I, R populations over time
  - Dual y-axis: absolute numbers and percentages
  - Time scrubber to examine specific points
- **Key Metrics Display**
  - Current R₀ (basic reproduction number)
  - Peak infection time and magnitude
  - Final attack rate
  - Duration of epidemic

### 4. Interactive Controls
- **Parameter Sliders**
  - Transmission rate (β)
  - Recovery rate (γ) 
  - Vaccination rate
  - Social distancing effectiveness
- **Intervention Buttons**
  - Start vaccination campaign
  - Implement lockdown
  - Introduce variant
  - Reset simulation
- **Scenario Presets**
  - "Seasonal Flu" (moderate transmission)
  - "COVID-19" (high transmission, variable recovery)
  - "Measles" (very high transmission)
  - "Custom" (user-defined parameters)

### 5. Educational Features
- **Information Panel**
  - Real-time explanations of current epidemic phase
  - Key concept definitions (R₀, herd immunity threshold)
  - Mathematical formulas with current values
- **Guided Tour Mode**
  - Step-by-step tutorial for new users
  - Highlights key concepts as simulation progresses
  - Quiz questions at key moments

## Technical Requirements

### Frontend Technology Stack
- **HTML5** with semantic structure
- **CSS3** with Flexbox/Grid for responsive layout
- **JavaScript (ES6+)** for simulation logic
- **Canvas API** or **SVG** for population grid animation
- **Chart.js** or **D3.js** for real-time graphing
- **No external dependencies** preferred for educational transparency

### Performance Requirements
- **Frame Rate**: 30+ FPS for smooth animation
- **Simulation Speed**: Configurable from 0.1x to 10x real-time
- **Population Scale**: Support up to 10,000 individuals without performance degradation
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

### Code Quality Standards
- **Modular Architecture**: Separate classes for Simulation, Visualization, Controls
- **Clear Documentation**: Inline comments explaining mathematical concepts
- **Educational Code**: Prioritize readability over performance optimization
- **Version Control**: Git with meaningful commit messages

## User Interface Design

### Layout Structure
```
┌─────────────────┬─────────────────────────────┐
│   Control Panel │                             │
│                 │       Population Grid       │
│  - Sliders      │        (Animated)          │
│  - Buttons      │                             │
│  - Presets      │                             │
│                 ├─────────────────────────────┤
│                 │                             │
├─────────────────┤       Epidemic Curves      │
│                 │        (Real-time)         │
│  Info Panel     │                             │
│                 │                             │
│  - Metrics      │                             │
│  - Explanations │                             │
│  - Formulas     │                             │
└─────────────────┴─────────────────────────────┘
```

### Color Scheme
- **Primary Colors**: Medical/scientific theme
  - Susceptible: #3498db (blue)
  - Infected: #e74c3c (red)
  - Recovered: #2ecc71 (green)
- **UI Elements**: Clean, modern design with good contrast
- **Accessibility**: WCAG 2.1 AA compliant color choices

### Responsive Design
- **Desktop**: Full multi-panel layout
- **Tablet**: Stacked layout with collapsible panels
- **Mobile**: Single-column with tab navigation

## Implementation Timeline

### Phase 1: Core Engine (Week 1)
- [ ] Implement basic SIR mathematical model
- [ ] Create simple text-based output for testing
- [ ] Unit tests for mathematical accuracy
- [ ] Basic HTML structure

### Phase 2: Visualization (Week 2)
- [ ] Population grid with Canvas/SVG
- [ ] Basic animation system
- [ ] Color-coded individual states
- [ ] Simple epidemic curve plotting

### Phase 3: Interactivity (Week 3)
- [ ] Parameter control sliders
- [ ] Real-time graph updates
- [ ] Play/pause/reset functionality
- [ ] Basic responsive design

### Phase 4: Educational Features (Week 4)
- [ ] Information panels with explanations
- [ ] Scenario presets
- [ ] Guided tutorial mode
- [ ] Final polish and testing

## Success Metrics

### Educational Effectiveness
- **Concept Understanding**: Pre/post quiz scores on SIR model concepts
- **Engagement**: Average session duration > 10 minutes
- **Exploration**: Users try > 3 different parameter combinations
- **Retention**: Users return to simulator within 1 week

### Technical Performance
- **Load Time**: < 2 seconds initial load
- **Simulation Accuracy**: Mathematical results match theoretical expectations
- **Cross-browser Compatibility**: Works on 95%+ of target browsers
- **Error Rate**: < 1% of sessions encounter technical issues

### User Experience
- **Intuitive Controls**: Users can operate without external help
- **Visual Clarity**: Users can distinguish between population states
- **Responsive Design**: Usable on all device sizes
- **Educational Value**: Users report learning new concepts

## Future Enhancements

### Version 2.0 Features
- **SEIR Model**: Add Exposed state for more realistic modeling
- **Spatial Structure**: Geographic spread with travel patterns
- **Age Stratification**: Different age groups with varying susceptibility
- **Multiple Diseases**: Compare different pathogens side-by-side

### Advanced Features
- **Stochastic Models**: Add random variation to deterministic equations
- **Network Structures**: Model spread through social networks
- **Policy Optimization**: AI-driven intervention recommendations
- **Data Import**: Upload real-world epidemic data for comparison

### Integration Possibilities
- **LMS Integration**: SCORM-compliant for learning management systems
- **Assessment Tools**: Built-in quizzes and knowledge checks
- **Collaborative Features**: Multi-user scenarios and competitions
- **Mobile App**: Native iOS/Android versions

## Risk Assessment

### Technical Risks
- **Performance**: Large populations may cause browser slowdown
  - *Mitigation*: Implement efficient rendering algorithms, provide population limits
- **Browser Compatibility**: Canvas/SVG differences across browsers
  - *Mitigation*: Thorough cross-browser testing, fallback options

### Educational Risks
- **Oversimplification**: SIR model may not reflect real-world complexity
  - *Mitigation*: Clear disclaimers, links to advanced resources
- **Misinterpretation**: Users might overgeneralize results
  - *Mitigation*: Strong educational context, guided explanations

### Project Risks
- **Scope Creep**: Feature requests may delay core functionality
  - *Mitigation*: Clear MVP definition, phased development approach
- **Time Constraints**: Complex visualizations may take longer than expected
  - *Mitigation*: Prioritize core features, defer advanced animations

## Conclusion

This Interactive Epidemic Simulator will serve as an excellent demonstration of "vibe coding" for medical education, combining mathematical modeling, data visualization, and interactive design. The project showcases programming skills directly applicable to medical informatics, public health, and scientific computing while creating genuine educational value for medical students.

The phased approach ensures a working prototype quickly while allowing for sophisticated enhancements. The focus on educational transparency and code clarity makes this an ideal project for demonstrating programming concepts to a medical audience.