// Main Script for Tech Explorer Website

document.addEventListener('DOMContentLoaded', () => {
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Tab navigation system
    const tabs = document.querySelectorAll('#nav-tabs li');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabLinks = document.querySelectorAll('[data-tab-link]');
    
    // Function to switch tabs with history support
    function switchTab(tabId, pushState = true) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tabs
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show the selected tab content
        document.getElementById(tabId).classList.add('active');
        
        // Add active class to the selected tab
        const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Scroll to top when switching tabs
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Update browser history if pushState is true
        if (pushState) {
            history.pushState({ tabId: tabId }, '', `#${tabId}`);
        }
    }
    
    // Add click event to tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Add click event to tab links
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab-link');
            switchTab(tabId);
        });
    });
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.tabId) {
            switchTab(event.state.tabId, false);
        } else {
            // Default to home tab if no state is available
            switchTab('home', false);
        }
    });
    
    // Initialize the correct tab based on URL hash
    const initialTabId = window.location.hash ? window.location.hash.substring(1) : 'home';
    if (document.getElementById(initialTabId)) {
        switchTab(initialTabId, false);
    } else {
        switchTab('home', true);
    }
    
    // Add parallax effect to cards on mouse move
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            setTimeout(() => {
                card.style.transform = '';
            }, 300);
        });
    });
    
    // Intersection Observer for animation on scroll
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe content items
    document.querySelectorAll('.content-item, .project-card').forEach(item => {
        observer.observe(item);
    });
    
    // Initialize Three.js drone simulator
    initDroneSimulator();
});

// Initialize the Three.js drone simulator
function initDroneSimulator() {
    const container = document.getElementById('drone-simulator');
    
    // Only initialize if the container exists (i.e., we're on the projects page)
    if (!container) return;
    
    let scene, camera, renderer, drone, propellers = [], clock, mixer;
    let isAnimating = true; // This is now set to true by default
    let isSimulationRunning = false;
    
    // Set up the scene
    function init() {
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 1, 3);
        camera.lookAt(0, 0, 0);
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Create drone body
        createDrone();
        
        // Initialize clock for animations
        clock = new THREE.Clock();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Add mouse controls for rotation
        addMouseControls();
        
        // Initialize event listeners for buttons
        initButtons();
        
        // Start the animation loop
        animate();
    }
    
    // Create the drone model
    function createDrone() {
        // Create drone body
        const bodyGeometry = new THREE.BoxGeometry(0.5, 0.15, 0.5);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            specular: 0x555555,
            shininess: 30
        });
        drone = new THREE.Mesh(bodyGeometry, bodyMaterial);
        scene.add(drone);
        
        // Add accent line
        const accentGeometry = new THREE.BoxGeometry(0.52, 0.03, 0.52);
        const accentMaterial = new THREE.MeshPhongMaterial({ color: 0x6e44ff });
        const accent = new THREE.Mesh(accentGeometry, accentMaterial);
        accent.position.y = 0.05;
        drone.add(accent);
        
        // Add arms
        const armPositions = [
            { x: 0.3, z: 0.3 },
            { x: -0.3, z: 0.3 },
            { x: -0.3, z: -0.3 },
            { x: 0.3, z: -0.3 }
        ];
        
        armPositions.forEach((pos, index) => {
            // Create arm
            const armGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
            const armMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            
            // Position and rotate the arm
            const angle = Math.atan2(pos.z, pos.x);
            arm.position.x = pos.x / 2;
            arm.position.z = pos.z / 2;
            arm.rotation.z = Math.PI / 2;
            arm.rotation.y = angle;
            drone.add(arm);
            
            // Add propeller
            const propGeometry = new THREE.BoxGeometry(0.1, 0.01, 0.6);
            const propMaterial = new THREE.MeshPhongMaterial({ 
                color: index % 2 === 0 ? 0x00ffd5 : 0xff4444,
                transparent: true,
                opacity: 0.8
            });
            const propeller = new THREE.Mesh(propGeometry, propMaterial);
            propeller.position.set(pos.x, 0.1, pos.z);
            propellers.push(propeller);
            scene.add(propeller);
            
            // Add motor
            const motorGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.05);
            const motorMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
            const motor = new THREE.Mesh(motorGeometry, motorMaterial);
            motor.position.set(pos.x, 0.08, pos.z);
            drone.add(motor);
        });
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        
        // Animate propellers
        propellers.forEach((prop, index) => {
            prop.rotation.y += (index % 2 === 0 ? 0.3 : -0.3) * (isSimulationRunning ? 2 : 0);
            
            // Update propeller position to follow drone
            prop.position.x = drone.position.x + (index === 0 || index === 3 ? 0.3 : -0.3);
            prop.position.z = drone.position.z + (index === 0 || index === 1 ? 0.3 : -0.3);
            prop.position.y = drone.position.y + 0.1;
        });
        
        // If simulation is running, add some gentle movement
        if (isSimulationRunning) {
            const time = Date.now() * 0.001;
            drone.position.y = Math.sin(time * 1.5) * 0.05 + 0.2;
            drone.rotation.x = Math.sin(time) * 0.02;
            drone.rotation.z = Math.cos(time * 0.8) * 0.02;
        }
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    // Add mouse controls for rotation
    function addMouseControls() {
        let isDragging = false;
        let previousMousePosition = {
            x: 0,
            y: 0
        };
        
        renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
        });
        
        renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        renderer.domElement.addEventListener('mouseleave', () => {
            isDragging = false;
        });
        
        renderer.domElement.addEventListener('mousemove', (e) => {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };
            
            if (isDragging) {
                drone.rotation.y += deltaMove.x * 0.01;
                drone.rotation.x += deltaMove.y * 0.01;
            }
            
            previousMousePosition = {
                x: e.offsetX,
                y: e.offsetY
            };
        });
    }
    
    // Initialize button event listeners
    function initButtons() {
        const startButton = document.getElementById('start-simulation');
        const resetButton = document.getElementById('reset-simulation');
        
        if (startButton) {
            startButton.addEventListener('click', () => {
                isSimulationRunning = !isSimulationRunning;
                startButton.textContent = isSimulationRunning ? 'Pause Simulation' : 'Start Simulation';
                console.log('Simulation running:', isSimulationRunning); // Debug log
            });
        }
        
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                // Reset drone position and rotation
                drone.position.set(0, 0, 0);
                drone.rotation.set(0, 0, 0);
                isSimulationRunning = false;
                if (startButton) {
                    startButton.textContent = 'Start Simulation';
                }
            });
        }
    }
    
    // Start everything
    init();
    
    // Make sure the Three.js scene is properly initialized when the tab becomes visible
    document.querySelectorAll('#nav-tabs li').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            if (tabId === 'projects') {
                // Short delay to ensure the tab is visible
                setTimeout(() => {
                    onWindowResize();
                }, 100);
            }
        });
    });
    
    document.querySelectorAll('[data-tab-link="projects"]').forEach(link => {
        link.addEventListener('click', () => {
            // Short delay to ensure the tab is visible
            setTimeout(() => {
                onWindowResize();
            }, 100);
        });
    });
}