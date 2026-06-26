// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const loaderText = document.querySelectorAll('.loader-text span');

    gsap.to(loaderText, {
        y: -20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.in",
        onComplete: () => {
            gsap.to(loader, {
                yPercent: -100,
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: initAnimations
            });
        }
    });
});

function initAnimations() {
    // Hero Animations
    gsap.to('.hero-title .line span', {
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2
    });

    gsap.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.6
    });

    gsap.to('.hero-cta', {
        opacity: 1,
        duration: 0.8,
        delay: 0.8
    });

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursor.style.left = mouseX - 10 + 'px';
        cursor.style.top = mouseY - 10 + 'px';
        follower.style.left = cursorX - 20 + 'px';
        follower.style.top = cursorY - 20 + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Magnetic Effect
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(mag => {
        mag.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        mag.addEventListener('mouseleave', () => cursor.classList.remove('hover'));

        mag.addEventListener('mousemove', (e) => {
            const rect = mag.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(mag, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3
            });
        });

        mag.addEventListener('mouseleave', () => {
            gsap.to(mag, {
                x: 0,
                y: 0,
                duration: 0.3
            });
        });
    });

    // About Section Animation
    gsap.from('.photo-wrapper', {
        scrollTrigger: {
            trigger: '.about',
            start: "top 70%"
        },
        scale: 0.8,
        opacity: 0,
        rotation: -10,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from('.photo-ring', {
        scrollTrigger: {
            trigger: '.about',
            start: "top 70%"
        },
        scale: 0,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out"
    });

    gsap.from('.about-content > *', {
        scrollTrigger: {
            trigger: '.about',
            start: "top 70%"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.3,
        ease: "power3.out"
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-value'));

        ScrollTrigger.create({
            trigger: stat,
            start: "top 80%",
            onEnter: () => {
                gsap.to(stat, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: "power2.out"
                });
            }
        });
    });

    // Project Cards Parallax
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1,
            delay: i * 0.1,
            ease: "power3.out"
        });
    });

    // Skills Animation
    const tags = document.querySelectorAll('.skill-tag');
    tags.forEach((tag, i) => {
        gsap.from(tag, {
            scrollTrigger: {
                trigger: tag,
                start: "top 90%"
            },
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.05,
            ease: "back.out(1.7)"
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: target,
                    ease: "power3.inOut"
                });
            }
        });
    });
}

// Back to Top
document.querySelector('.back-to-top').addEventListener('click', (e) => {
    e.preventDefault();
    gsap.to(window, {
        duration: 1.5,
        scrollTo: 0,
        ease: "power3.inOut"
    });
});
