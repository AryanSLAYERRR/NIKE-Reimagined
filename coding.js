let currentSection = 0;
const sections = document.querySelectorAll('section');
let isScrolling = false;
const dots = document.querySelectorAll('.scroll-dot');
let typingTimeout = null;

const airModels = [
    {
        model: "Jordan",
        tagline: "Take Flight",
        description: "A legacy of greatness, born on the court, raised in the culture.",
        image: "./assets/Shoes/AIRJordans/Redjordans.png"
    },
    {
        model: "Max",
        tagline: "Revolutionary Air",
        description: "Visible innovation that you can feel.",
        image: "./assets/Shoes/AIRJordans/Redjordans2.png"
    },
    {
        model: "Force",
        tagline: "Force of Nature",
        description: "A street legend, reimagined for the future.",
        image: "./assets/Shoes/AIRJordans/Greenjordans.png"
    },
    {
        model: "Zoom",
        tagline: "Speed Meets Comfort",
        description: "Responsive cushioning for explosive movement.",
        image: "./assets/Shoes/AIRJordans/Redjordans3.png"
    }
];

let currentModel = 0;

function onWindowResize() {
    camera.aspect = (window.innerWidth / 2) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Smooth scroll indicator
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const scrolled = window.scrollY > 50;
    
    if(scrolled) {
        nav.style.padding = '0.4rem 1.5rem';
        nav.style.background = 'rgba(255, 255, 255, 0.03)';
    } else {
        nav.style.padding = '0.6rem 1.5rem';
        nav.style.background = 'rgba(255, 255, 255, 0.02)';
    }
});

// Category highlight on scroll
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if(window.scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Prevent default scroll
window.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

// Handle scroll events
window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0 && currentSection < sections.length - 1) {
        currentSection++;
    } else if (e.deltaY < 0 && currentSection > 0) {
        currentSection--;
    }
    
    // Update sections
    sections.forEach((section, index) => {
        if (index === currentSection) {
            section.classList.add('active-section');
        } else {
            section.classList.remove('active-section');
        }
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === currentSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    sections[currentSection].scrollIntoView({ behavior: 'smooth' });
});

// Click on dots to navigate
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSection = index;
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        
        // Update active states
        dots.forEach(d => d.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active-section'));
        
        dot.classList.add('active');
        sections[currentSection].classList.add('active-section');
    });
});

// Initialize first section
window.addEventListener('load', () => {
    sections[0].classList.add('active-section');
    dots[0].classList.add('active');
});

// Optional: Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    
    if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        currentSection++;
        scrollToSection(currentSection);
    } else if (e.key === 'ArrowUp' && currentSection > 0) {
        currentSection--;
        scrollToSection(currentSection);
    }
});
// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function typeText(element, text) {
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }
    
    let index = 0;
    element.textContent = '';
    
    function addChar() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            typingTimeout = setTimeout(addChar, 250);
        }
    }
    
    addChar();
}

// Update visibility handler
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Clear typing animation when tab is not visible
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
        }
    }
});

// Update the rotation function to handle rapid clicks
let isRotating = false;

function rotateModels() {
    if (isRotating) return;
    isRotating = true;
    
    const elements = {
        text: document.querySelector('.changing-text'),
        tagline: document.querySelector('.model-tagline'),
        description: document.querySelector('.model-description'),
        image: document.querySelector('.shoe-image')
    };
    
    elements.image.classList.add('fade-out');
    
    setTimeout(() => {
        currentModel = (currentModel + 1) % airModels.length;
        const model = airModels[currentModel];
        
        typeText(elements.text, model.model);
        elements.tagline.textContent = model.tagline;
        elements.description.textContent = model.description;
        
        elements.image.src = model.image;
        elements.image.onload = () => {
            elements.image.classList.remove('fade-out');
            elements.image.classList.add('fade-in');
            
            setTimeout(() => {
                elements.image.classList.remove('fade-in');
                isRotating = false;
            }, 500);
        };
    }, 500);
}

// Update previous button handler
document.querySelector('.prev-model').addEventListener('click', () => {
    if (isRotating) return; // Prevent rapid clicks
    isRotating = true;
    
    const elements = {
        text: document.querySelector('.changing-text'),
        tagline: document.querySelector('.model-tagline'),
        description: document.querySelector('.model-description'),
        image: document.querySelector('.shoe-image')
    };
    
    Object.values(elements).forEach(el => el.style.opacity = 0);
    
    setTimeout(() => {
        currentModel = (currentModel - 1 + airModels.length) % airModels.length;
        const model = airModels[currentModel];
        
        typeText(elements.text, model.model);
        elements.image.src = model.image;
        elements.tagline.textContent = model.tagline;
        elements.description.textContent = model.description;
        
        Object.values(elements).forEach(el => el.style.opacity = 1);
        
        setTimeout(() => {
            isRotating = false;
        }, 500);
    }, 500);
});

document.querySelector('.next-model').addEventListener('click', rotateModels);

// Start the rotation
setInterval(rotateModels, 10000);

// Make sure this runs after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
});
