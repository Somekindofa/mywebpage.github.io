// Main Script for Tech Explorer Website

document.addEventListener('DOMContentLoaded', () => {
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Tab navigation system
    const tabs = document.querySelectorAll('#nav-tabs li');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabLinks = document.querySelectorAll('[data-tab-link]');
    
    // Function to switch tabs
    function switchTab(tabId) {
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
});