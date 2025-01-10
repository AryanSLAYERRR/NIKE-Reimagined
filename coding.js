let currentSection = 0;
const sections = document.querySelectorAll('section');
let isScrolling = false;
let scrollTimeout;
const dots = document.querySelectorAll('.scroll-dot');
let typingTimeout = null;

const airModels = [
    {
        model: "Jordan",
        tagline: "Take Flight",
        description: "A legacy of greatness, born on the court, raised in the culture.",
        image: "./assets/Shoes/AIRJordans/Redjordans3.png"
    },
    {
        model: "Max",
        tagline: "Revolutionary Air",
        description: "Visible innovation that you can feel.",
        image: "./assets/Shoes/AIRMax/AirMax3.png",
        scale: 1
    },
    {
        model: "Force",
        tagline: "Force of Nature",
        description: "A street legend, reimagined for the future.",
        image: "./assets/Shoes/AIRForce/AirForce1.png",
        scale: 0.8
    },
    {
        model: "Zoom",
        tagline: "Speed Meets Comfort",
        description: "Responsive cushioning for explosive movement.",
        image: "./assets/Shoes/AIRZoom/AirZoom2.png",
        scale: 0.7
    }
];

const apparelModels = [
    {
        title: "NIKE TECH FLEECE",
        tagline: "ENGINEERED WARMTH",
        description: "Premium comfort meets innovative design with the Nike Tech Fleece collection.",
        image: "path/to/tech-fleece.png"
    },
    {
        title: "NIKE DRI-FIT",
        tagline: "STAY COOL UNDER PRESSURE",
        description: "Advanced moisture-wicking technology keeps you dry and comfortable during intense workouts.",
        image: "path/to/dri-fit.png"
    },
    //more apparel items need to add
];

let currentModel = 0;


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
    e.preventDefault();
    
    if (isScrolling) return;
    
    clearTimeout(scrollTimeout);
    isScrolling = true;

    if (e.deltaY > 0 && currentSection < sections.length - 1) {
        currentSection++;
    } else if (e.deltaY < 0 && currentSection > 0) {
        currentSection--;
    }
    
    // Update sections and dots
    sections.forEach((section, index) => {
        if (index === currentSection) {
            section.classList.add('active-section');
        } else {
            section.classList.remove('active-section');
        }
    });
    
    const dots = document.querySelectorAll('.scroll-dot');
    dots.forEach((dot, index) => {
        if (index === currentSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    sections[currentSection].scrollIntoView({ behavior: 'smooth' });
    
    // Reset scroll flag after animation completes
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 800); // timing of the scroll
}, { passive: false });

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

// visibility handler
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Clear typing animation when tab is not visible
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
        }
    }
});

//rotation function to handle rapid clicks
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
    
    // Reset any existing transforms before starting animation
    elements.image.style.transform = 'translateY(-50%) scale(1)';
    
    elements.image.classList.add('fade-out');
    elements.tagline.classList.add('fade-out');
    elements.description.classList.add('fade-out');
    
    setTimeout(() => {
        currentModel = (currentModel + 1) % airModels.length;
        const model = airModels[currentModel];
        
        typeText(elements.text, model.model);
        elements.tagline.textContent = model.tagline;
        elements.description.textContent = model.description;

        const scale = model.scale || 1;
        elements.image.style.transform = `translateY(-50%) scale(${scale})`;
        
        elements.image.src = model.image;
        
        elements.image.onload = () => {
            requestAnimationFrame(() => {
                elements.image.classList.remove('fade-out');
                elements.tagline.classList.remove('fade-out');
                elements.description.classList.remove('fade-out');
                
                setTimeout(() => {
                    isRotating = false;
                }, 600);
            });
        };
    }, 600);
}

// dont know how to implement this without creating 2 functions for the same thing
document.querySelector('.prev-model').addEventListener('click', () => {
    if (isRotating) return;
    isRotating = true;
    
    const elements = {
        text: document.querySelector('.changing-text'),
        tagline: document.querySelector('.model-tagline'),
        description: document.querySelector('.model-description'),
        image: document.querySelector('.shoe-image')
    };
    
    // Reset any existing transforms
    elements.image.style.transform = 'translateY(-50%) scale(1)';
    
    elements.image.classList.add('fade-out');
    elements.tagline.classList.add('fade-out');
    elements.description.classList.add('fade-out');
    
    setTimeout(() => {
        currentModel = (currentModel - 1 + airModels.length) % airModels.length;
        const model = airModels[currentModel];
        
        typeText(elements.text, model.model);
        elements.tagline.textContent = model.tagline;
        elements.description.textContent = model.description;
        
        // Applying scale only if specified
        const scale = model.scale || 1;
        elements.image.style.transform = `translateY(-50%) scale(${scale})`;
        
        elements.image.src = model.image;
        
        elements.image.onload = () => {
            requestAnimationFrame(() => {
                elements.image.classList.remove('fade-out');
                elements.tagline.classList.remove('fade-out');
                elements.description.classList.remove('fade-out');
                
                setTimeout(() => {
                    isRotating = false;
                }, 600);
            });
        };
    }, 600);
});

document.querySelector('.next-model').addEventListener('click', rotateModels);

// Start the rotation
setInterval(rotateModels, 5000);

// DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        document.querySelector('.next-model').click();
    } else if (e.key === 'ArrowLeft') {
        document.querySelector('.prev-model').click();
    }
});

//touch swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        document.querySelector('.next-model').click();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        document.querySelector('.prev-model').click();
    }
}

// Update the sections and dots count
const updateSectionsAndDots = () => {
    // Get all sections including the new apparel section
    const sections = document.querySelectorAll('section');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Clear existing dots
    scrollIndicator.innerHTML = '';
    
    // Create new dots for all sections
    sections.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'scroll-dot';
        if (index === currentSection) {
            dot.classList.add('active');
        }
        
        dot.addEventListener('click', () => {
            currentSection = index;
            sections[currentSection].scrollIntoView({ behavior: 'smooth' });
            
            // Update active states
            document.querySelectorAll('.scroll-dot').forEach(d => d.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));
            
            dot.classList.add('active');
            sections[currentSection].classList.add('active-section');
        });
        
        scrollIndicator.appendChild(dot);
    });
};


document.addEventListener('DOMContentLoaded', () => {
    updateSectionsAndDots();
});

window.addEventListener('scroll', debounce(() => {
    const scrollPosition = window.scrollY;
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop - sectionHeight/3) {
            currentSection = index;
            const dots = document.querySelectorAll('.scroll-dot');
            dots.forEach((dot, i) => {
                if (i === currentSection) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    });
}, 50));


function updateParticlesInteraction() {
    const particlesContainer = document.getElementById('particles-js');
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        
        if (heroBottom <= 0) {
            // When scrolled past hero section
            particlesContainer.style.pointerEvents = 'none';
        } else {
            // When in hero section
            particlesContainer.style.pointerEvents = 'auto';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateParticlesInteraction();
  
});

// Add touch handling for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', e => {
    if (isScrolling) return;
    
    touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    
    if (Math.abs(deltaY) > 50) { // Threshold for swipe
        if (deltaY > 0 && currentSection < sections.length - 1) {
            currentSection++;
        } else if (deltaY < 0 && currentSection > 0) {
            currentSection--;
        }
        
        isScrolling = true;
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        
        // Update active states
        updateActiveStates();
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
});

// Helper function to update active states
function updateActiveStates() {
    sections.forEach((section, index) => {
        if (index === currentSection) {
            section.classList.add('active-section');
        } else {
            section.classList.remove('active-section');
        }
    });
    
    const dots = document.querySelectorAll('.scroll-dot');
    dots.forEach((dot, index) => {
        if (index === currentSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}



