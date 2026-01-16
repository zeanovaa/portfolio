
// Main JavaScript for Portfolio

document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Auto-Scroll Carousel Logic (PT KAI Project)
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        let scrollSpeed = 0.2; // Slow comfortable spread
        let isInteracting = false;
        let animationId;

        // Auto Scroll Function
        const autoScroll = () => {
            if (!isInteracting) {
                carousel.scrollLeft += scrollSpeed;

                // Infinite Loop Logic
                if (carousel.scrollLeft >= (carousel.scrollWidth / 2)) {
                    carousel.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        };

        animationId = requestAnimationFrame(autoScroll);

        // Interaction Listeners (Pause to allow manual control)
        const startInteraction = () => isInteracting = true;
        const stopInteraction = () => isInteracting = false;

        carousel.addEventListener('mousedown', startInteraction);
        carousel.addEventListener('touchstart', startInteraction, { passive: true });
        carousel.addEventListener('wheel', startInteraction, { passive: true });

        carousel.addEventListener('mouseleave', stopInteraction);
        carousel.addEventListener('touchend', stopInteraction);
    }

    // Cursor Glow Effect Logic
    const cursor = document.querySelector('.cursor-glow');
    if (cursor) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        // Track Mouse
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth Animation Loop
        const animateCursor = () => {
            // Linear interpolation for smooth trailing (Lerp)
            // 0.1 is the speed factor (lower = smoother/slower)
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();
    }

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger, .static-image');
    // Note: static-image is a div with background-image, logic needs to differ slightly or just target imgs.
    // Let's stick to .lightbox-trigger for now which I added to the HTML images.
    // For static images (background-image), we might need to change how they are implemented if user wants to zoom them too. 
    // The user specifically asked "when the photo is clicked", so I'll target 'img' tags in project media.

    document.querySelectorAll('.project-media img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightbox.classList.add('active');
            lightboxImg.src = img.src;
        });
    });

    // Also handle background-image divs if needed, but 'static-image' are divs. 
    // User said "foto", which usually implies the `img` tags. 
    // I'll add logic for .static-image just in case they want those too.
    document.querySelectorAll('.static-image').forEach(div => {
        div.style.cursor = 'zoom-in';
        div.addEventListener('click', () => {
            const style = window.getComputedStyle(div);
            const bgImage = style.backgroundImage.slice(4, -1).replace(/"/g, "");
            lightbox.classList.add('active');
            lightboxImg.src = bgImage;
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            // Reset PDF source to stop playback/download
            const pdfFrame = document.getElementById('lightbox-pdf');
            if (pdfFrame) {
                pdfFrame.src = "";
                pdfFrame.style.display = 'none';
            }
            // Restore image display for next time
            if (lightboxImg) lightboxImg.style.display = 'block';
        });
    }

    // PDF Lightbox Logic
    const pdfTriggers = document.querySelectorAll('.pdf-lightbox-trigger');
    pdfTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfUrl = trigger.getAttribute('data-pdf');
            const pdfFrame = document.getElementById('lightbox-pdf');

            if (pdfFrame && pdfUrl) {
                lightboxImg.style.display = 'none';
                pdfFrame.style.display = 'block';
                pdfFrame.src = pdfUrl;
                lightbox.classList.add('active');
            }
        });
    });



    // Infographic Card Flip Logic
    const infographicCard = document.querySelector('.infographic-card');
    const flipTrigger = document.querySelector('.flip-trigger');

    if (infographicCard && flipTrigger) {
        // Flip on hovering the specific text
        flipTrigger.addEventListener('mouseenter', () => {
            infographicCard.classList.add('flipped');
        });

        // Reset when mouse leaves the entire card area
        infographicCard.addEventListener('mouseleave', () => {
            infographicCard.classList.remove('flipped');
        });
    }

    // Lightbox for Infographic Image (Explicit handling since it's not in .project-media)
    const infographicImg = document.querySelector('.infographic-img');
    if (infographicImg && lightbox) {
        infographicImg.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card flip issues if any
            lightbox.classList.add('active');
            lightboxImg.src = infographicImg.src;
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
});
