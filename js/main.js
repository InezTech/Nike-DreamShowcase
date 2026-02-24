class TigerExperience {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.tigerCanvas = document.getElementById('tiger-canvas');
        this.ambientCanvas = document.getElementById('ambient-canvas');

        if (!this.heroSection || !this.tigerCanvas || !this.ambientCanvas) return;

        this.tigerCtx = this.tigerCanvas.getContext('2d');
        this.ambientCtx = this.ambientCanvas.getContext('2d');

        this.frameCount = 242;
        this.images = [];

        this.state = {
            frame: 0
        };

        this.init();
    }

    async init() {
        this.setupLenis();
        this.resize();
        window.addEventListener('resize', this.debounce(() => this.resize(), 150));

        await this.preloadImages();

        this.setupScrollTrigger();
        this.render(); // initial render

        this.setupCarouselEvents();
    }

    setupLenis() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        this.lenis.on('scroll', (e) => {
            ScrollTrigger.update();
        });

        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    currentFrame(index) {
        const paddedIndex = (index + 1).toString().padStart(3, '0');
        // This expects files like: assets/Nike tiger image/ezgif-frame-001.jpg
        return `assets/Nike tiger image/ezgif-frame-${paddedIndex}.jpg`;
    }

    preloadImages() {
        return new Promise((resolve) => {
            let loadedCount = 0;

            for (let i = 0; i < this.frameCount; i++) {
                const img = new Image();
                img.src = this.currentFrame(i);

                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === this.frameCount) {
                        resolve();
                    }
                    if (loadedCount === 1 && i === 0) {
                        this.render();
                    }
                };

                img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === this.frameCount) {
                        resolve();
                    }
                };

                this.images.push(img);
            }
        });
    }

    setupScrollTrigger() {
        gsap.to(this.state, {
            frame: this.frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: this.heroSection,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                onUpdate: () => requestAnimationFrame(() => this.render())
            }
        });
    }

    resize() {
        this.tigerCanvas.width = window.innerWidth * window.devicePixelRatio;
        this.tigerCanvas.height = window.innerHeight * window.devicePixelRatio;

        this.ambientCanvas.width = window.innerWidth * window.devicePixelRatio;
        this.ambientCanvas.height = window.innerHeight * window.devicePixelRatio;

        this.render();
    }

    render() {
        requestAnimationFrame(() => {
            if (!this.images[this.state.frame] || !this.images[this.state.frame].complete) return;

            const img = this.images[this.state.frame];

            if (img.naturalWidth === 0) return;

            const canvasWidth = this.tigerCanvas.width;
            const canvasHeight = this.tigerCanvas.height;

            this.tigerCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            this.ambientCtx.clearRect(0, 0, canvasWidth, canvasHeight);

            const isMobile = window.innerWidth <= 768;

            // --- Foreground Tiger Canvas ---
            const hRatio = canvasWidth / img.width;
            const vRatio = canvasHeight / img.height;

            // On mobile, we want it to be slightly more "cover" than "contain" for more impact
            let ratio = Math.min(hRatio, vRatio);
            if (isMobile) {
                ratio = Math.min(hRatio, vRatio) * 1.4; // Zoom in 40% on mobile
            }

            const centerShift_x = (canvasWidth - img.width * ratio) / 2;
            const centerShift_y = (canvasHeight - img.height * ratio) / 2;

            this.tigerCtx.drawImage(
                img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
            );

            // --- Ambient Background Canvas (object-fit: cover logic) ---
            const bgRatio = Math.max(hRatio, vRatio);
            const bgCenterShift_x = (canvasWidth - img.width * bgRatio) / 2;
            const bgCenterShift_y = (canvasHeight - img.height * bgRatio) / 2;

            this.ambientCtx.drawImage(
                img, 0, 0, img.width, img.height,
                bgCenterShift_x, bgCenterShift_y, img.width * bgRatio, img.height * bgRatio
            );
        });
    }

    debounce(func, wait) {
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

    setupCarouselEvents() {
        const track = document.getElementById('carousel-track');
        const prevBtn = document.querySelector('.nav-prev');
        const nextBtn = document.querySelector('.nav-next');

        if (!track || !prevBtn || !nextBtn) return;

        const scrollAmount = 350;

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TigerExperience();
});
