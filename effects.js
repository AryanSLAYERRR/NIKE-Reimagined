document.addEventListener("DOMContentLoaded", function() {
    // Mouse follow effect
    // document.addEventListener('mousemove', (e) => {
    //     const hero = document.querySelector('.hero');
    //     const mouseX = (window.innerWidth / 2 - e.clientX) / 50;
    //     const mouseY = (window.innerHeight / 2 - e.clientY) / 50;
    //     hero.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    // });

    // Particle.js configuration
    particlesJS('particles-js',
        {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "opacity": {
                    "value": 0.2,
                    "random": false
                },
                "size": {
                    "value": 3,
                    "random": true
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#808080",
                    "opacity": 0.1,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "resize": true
                }
            },
            "retina_detect": true
        }
    );
}); 