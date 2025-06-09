# Tinkerer Lair - Interactive Learning Platform

A personal GitHub Pages site showcasing interactive projects, data visualizations, and technical experiments. This site serves as a digital "Tinkerer Lair" where complex technical concepts are broken down into engaging, interactive demonstrations.

## Features

- **Modern Design**: AI-inspired design with dark blue to purple gradient background
- **Interactive Navigation**: Tab-based navigation system with browser history support
- **3D Drone Simulator**: Interactive Three.js drone simulation with physics
- **French Députés Analysis**: React-based hemicycle visualization of French National Assembly data
- **Responsive Design**: Mobile-first design that works on all devices
- **Smooth Animations**: Parallax effects, hover animations, and smooth transitions

## Projects

### 1. 3D Drone Simulator
- Interactive Three.js simulation
- Physics-based drone movement
- Real-time controls (Start/Pause/Reset)
- Dedicated project page with fixed widget

### 2. French Députés Absence Analysis
- React-based interactive hemicycle visualization
- Real-time attendance statistics
- Political group filtering
- Individual deputy profile details
- Responsive design with D3.js integration

## Structure

```
├── index.html              # Main page with tab navigation
├── css/
│   ├── style.css          # Main stylesheet
│   └── deputes.css        # Specific styles for députés project
├── js/
│   └── script.js          # Navigation logic and Three.js drone simulator
├── projects/
│   ├── drone-simulator.html    # Dedicated drone project page
│   └── french-deputes.html     # French députés visualization page
└── README.md
```

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **3D Graphics**: Three.js
- **Data Visualization**: React.js, D3.js
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Fonts**: Google Fonts (Orbitron, Space Grotesk, Roboto)
- **Icons**: Font Awesome

## Key Features Implemented

✅ Browser history navigation with back/forward support  
✅ Clickable logo for home navigation  
✅ Previous arrow button with hover effects  
✅ Interactive Three.js drone simulator  
✅ Fixed Three.js widget on project pages  
✅ React-based hemicycle visualization  
✅ Responsive design for all screen sizes  
✅ Tab navigation system with URL hash support  
✅ Smooth animations and transitions  

## Local Development

1. Clone this repository
2. Open `index.html` in your browser
3. Navigate between tabs and explore the interactive features
4. For the React-based députés project, ensure you have an internet connection for CDN resources

## Customization

To customize this site:

1. **Colors**: Update CSS custom properties in `:root` selector
2. **Content**: Replace placeholder content with your own projects
3. **Data**: Update the deputy data in `french-deputes.html` with real API data
4. **Styling**: Modify gradients, animations, and layout in CSS files
5. **Projects**: Add new project pages following the existing structure

## Browser Compatibility

- Modern browsers with ES6+ support
- Three.js compatible browsers
- React 18+ compatible environments
2. Go to repository Settings > Pages
3. Select the main branch as the source
4. Your site will be published at `https://yourusername.github.io/repository-name/`

## License

Feel free to use this template for your own personal learning journey showcase.

---

Created with ❤️ and curiosity.