document.addEventListener('DOMContentLoaded', () => {

    const steps = {
        1: document.getElementById('step-1'),
        2: document.getElementById('step-2'),
        3: document.getElementById('step-3'),
        loading: document.getElementById('step-loading'),
        final: document.getElementById('step-final')
    };

    const buttons = {
        kiKotha: document.getElementById('btn-ki-kotha'),
        bolo: document.getElementById('btn-bolo'),
        readyNa: document.getElementById('btn-ready-na'),
        yes: document.getElementById('btn-yes'),
        no: document.getElementById('btn-no')
    };

    const noStatusMsg = document.getElementById('no-status-message');
    const loadingText = document.getElementById('loading-text');
    const floatingContainer = document.getElementById('floating-elements-container');

    let noClickCount = 0;
    let transitioning = false;

    // ========== STEP TRANSITION ==========

    function showStep(stepKey) {
        if (transitioning) return;
        transitioning = true;

        const currentStep = document.querySelector('.step.active');
        const nextStep = steps[stepKey];

        if (currentStep === nextStep) {
            transitioning = false;
            return;
        }

        if (currentStep) {
            currentStep.classList.remove('active');
        }

        setTimeout(() => {
            nextStep.classList.add('active');
            transitioning = false;
        }, 150);
    }

    // ========== INTERACTION HELPER ==========

    function addInteraction(el, handler) {
        let lastTap = 0;
        el.addEventListener('click', (e) => {
            if (Date.now() - lastTap < 300) return;
            handler(e);
        });
        el.addEventListener('touchstart', (e) => {
            e.preventDefault();
            lastTap = Date.now();
            handler(e);
        }, { passive: false });
    }

    // ========== STEP NAVIGATION ==========

    addInteraction(buttons.kiKotha, () => showStep(2));
    addInteraction(buttons.bolo, () => showStep(3));
    addInteraction(buttons.readyNa, () => {
        buttons.readyNa.textContent = "Dhorlam ready 😌";
        buttons.readyNa.style.pointerEvents = 'none';
        setTimeout(() => showStep(3), 700);
    });

    // ========== NO BUTTON — MULTI-PHASE INTERACTION ==========

    const noPhases = [
        // Phase 1: Gentle dodge (clicks 1-2)
        {
            messages: [
                "Hehe, bhul button 😌",
                "Abar try korso? 😏"
            ],
            buttonTexts: [
                "No 😈",
                "No 😅"
            ]
        },
        // Phase 2: Getting nervous (clicks 3-4)
        {
            messages: [
                "Arey apu, Yes chap daw! 😤",
                "Allah kintu dekhtese sob 😌"
            ],
            buttonTexts: [
                "N-No? 😰",
                "Noo.. 🥺"
            ]
        },
        // Phase 3: Panicking (clicks 5-6)
        {
            messages: [
                "Button palaitese 💨",
                "Dhortei parba na 😈"
            ],
            buttonTexts: [
                "HELP 😱",
                "😵‍💫"
            ]
        },
        // Phase 4: Surrender (click 7+)
        {
            messages: [
                "No button surrender korche... 🏳️"
            ],
            buttonTexts: [
                "Yes 😌💍"
            ]
        }
    ];

    let orbitAngle = 0;
    let orbitAnimFrame = null;
    let isOrbiting = false;

    function getPhase(count) {
        if (count <= 2) return 0;
        if (count <= 4) return 1;
        if (count <= 6) return 2;
        return 3;
    }

    function moveNoButton(speed = 1) {
        const zone = document.querySelector('.action-zone');
        const rect = zone.getBoundingClientRect();
        const btnRect = buttons.no.getBoundingClientRect();
        const padding = 8;

        const maxX = rect.width - btnRect.width - padding;
        const maxY = rect.height - btnRect.height - padding;

        const newX = Math.max(padding, Math.random() * maxX);
        const newY = Math.max(padding, Math.random() * maxY);

        buttons.no.style.transition = `left ${0.3 / speed}s var(--ease-spring), top ${0.3 / speed}s var(--ease-spring)`;
        buttons.no.style.left = newX + "px";
        buttons.no.style.top = newY + "px";
    }

    function spawnEmojiTrail(x, y, emoji = '😢') {
        const zone = document.querySelector('.action-zone');
        const trail = document.createElement('div');
        trail.textContent = emoji;
        trail.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 1.2rem;
            pointer-events: none;
            z-index: 3;
            animation: trailFade 1s ease-out forwards;
        `;
        zone.appendChild(trail);
        setTimeout(() => trail.remove(), 1000);
    }

    function shakeScreen(intensity = 1) {
        const card = document.querySelector('#step-3 .glass-card');
        card.classList.add('card-shake');
        card.style.setProperty('--shake-intensity', intensity);
        setTimeout(() => card.classList.remove('card-shake'), 500);
    }

    function startOrbit() {
        if (isOrbiting) return;
        isOrbiting = true;
        const zone = document.querySelector('.action-zone');
        const rect = zone.getBoundingClientRect();
        const centerX = rect.width / 2 - 60;
        const centerY = rect.height / 2 - 20;
        const radius = Math.min(rect.width, rect.height) * 0.32;

        function orbit() {
            orbitAngle += 0.06;
            const x = centerX + Math.cos(orbitAngle) * radius;
            const y = centerY + Math.sin(orbitAngle) * radius * 0.6;
            buttons.no.style.transition = 'none';
            buttons.no.style.left = x + 'px';
            buttons.no.style.top = y + 'px';

            // Leave trail every ~60 degrees
            if (Math.floor(orbitAngle * 10) % 10 === 0) {
                spawnEmojiTrail(x + 30, y + 10, ['😢', '💨', '😵', '🏃'][Math.floor(Math.random() * 4)]);
            }

            orbitAnimFrame = requestAnimationFrame(orbit);
        }
        orbit();
    }

    function stopOrbit() {
        isOrbiting = false;
        if (orbitAnimFrame) {
            cancelAnimationFrame(orbitAnimFrame);
            orbitAnimFrame = null;
        }
    }

    function surrenderNoButton() {
        stopOrbit();

        // Dramatic pause
        buttons.no.style.transition = 'all 0.8s var(--ease-out-expo)';
        buttons.no.style.transform = 'scale(1.1) rotate(720deg)';

        setTimeout(() => {
            // Flash effect
            buttons.no.classList.remove('danger');
            buttons.no.classList.add('success', 'no-surrender');
            buttons.no.textContent = 'Yes 😌💍';
            buttons.no.style.transform = 'scale(1) rotate(0deg)';
            buttons.no.style.opacity = '1';
            buttons.no.style.minWidth = '120px';

            // Move to center-bottom nicely
            const zone = document.querySelector('.action-zone');
            const rect = zone.getBoundingClientRect();
            buttons.no.style.left = (rect.width / 2 - 60) + 'px';
            buttons.no.style.top = (rect.height * 0.4) + 'px';

            noStatusMsg.textContent = "Both buttons say Yes now 😈";
            noStatusMsg.classList.add('status-victory');

            // Now clicking No also triggers Yes
            buttons.no.onclick = null;
            buttons.no.ontouchstart = null;
            addInteraction(buttons.no, () => {
                showStep('loading');
                triggerLoadingSequence();
            });
        }, 800);
    }

    addInteraction(buttons.no, (e) => {
        e.preventDefault();
        noClickCount++;

        const phase = getPhase(noClickCount);
        const phaseData = noPhases[phase];
        const msgIndex = phase < 3
            ? (noClickCount - 1 - [0, 2, 4][phase]) % phaseData.messages.length
            : 0;

        // Update status message with animation
        noStatusMsg.style.animation = 'none';
        noStatusMsg.offsetHeight; // force reflow
        noStatusMsg.style.animation = 'textFadeIn 0.3s ease both';
        noStatusMsg.textContent = phaseData.messages[msgIndex];

        // Update button text
        const btnTextIndex = phase < 3
            ? (noClickCount - 1 - [0, 2, 4][phase]) % phaseData.buttonTexts.length
            : 0;
        buttons.no.textContent = phaseData.buttonTexts[btnTextIndex];

        // ---- Phase-specific effects ----

        if (phase === 0) {
            // Phase 1: Simple dodge + slight tremble
            moveNoButton(1);
            const shrink = 1 - noClickCount * 0.05;
            const rotate = (Math.random() * 14 - 7);
            buttons.no.style.transform = `scale(${shrink}) rotate(${rotate}deg)`;
            buttons.no.classList.add('btn-tremble');
            setTimeout(() => buttons.no.classList.remove('btn-tremble'), 500);

        } else if (phase === 1) {
            // Phase 2: Faster dodge + screen shake + shrink more
            moveNoButton(2);
            shakeScreen(phase === 1 && noClickCount === 3 ? 0.7 : 1);
            const shrink = 0.85 - (noClickCount - 2) * 0.1;
            const rotate = (Math.random() * 40 - 20);
            buttons.no.style.transform = `scale(${shrink}) rotate(${rotate}deg)`;
            buttons.no.classList.add('btn-panic');

            // Spawn scared emojis
            const btnRect = buttons.no.getBoundingClientRect();
            const zone = document.querySelector('.action-zone');
            const zoneRect = zone.getBoundingClientRect();
            spawnEmojiTrail(btnRect.left - zoneRect.left, btnRect.top - zoneRect.top, '😰');

        } else if (phase === 2) {
            // Phase 3: Orbiting in circles, leaving trail, getting tiny
            const shrink = 0.5 - (noClickCount - 4) * 0.08;
            buttons.no.style.transform = `scale(${Math.max(0.3, shrink)})`;
            buttons.no.classList.add('btn-dizzy');
            startOrbit();

        } else if (phase === 3) {
            // Phase 4: SURRENDER
            stopOrbit();
            buttons.no.classList.remove('btn-panic', 'btn-dizzy', 'btn-tremble');
            surrenderNoButton();
        }

        // ---- Grow YES button progressively ----
        const yesScale = 1 + noClickCount * 0.05;
        buttons.yes.style.transition = 'transform 0.4s var(--ease-spring)';
        buttons.yes.style.transform = `scale(${Math.min(yesScale, 1.5)})`;

        // ---- Background tint gets more intense with frustration ----
        const tintOpacity = Math.min(noClickCount * 0.03, 0.15);
        document.querySelector('.background-container').style.boxShadow =
            `inset 0 0 200px rgba(255, 78, 136, ${tintOpacity})`;
    });

    // ========== YES → LOADING → SUCCESS ==========

    function triggerLoadingSequence() {
        const messages = [
            "Processing approval...",
            "Checking Miha Apu's mood...",
            "Consulting family committee...",
            "Running dua protocol...",
            "100% Approved 😌"
        ];

        let i = 0;
        loadingText.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

        const interval = setInterval(() => {
            if (i < messages.length) {
                loadingText.style.opacity = '0';
                loadingText.style.transform = 'translateY(5px)';
                setTimeout(() => {
                    loadingText.textContent = messages[i];
                    loadingText.style.opacity = '1';
                    loadingText.style.transform = 'translateY(0)';
                    i++;
                }, 200);
            }
            if (i >= messages.length) {
                clearInterval(interval);
                setTimeout(() => triggerSuccess(), 600);
            }
        }, 900);
    }

    addInteraction(buttons.yes, () => {
        showStep('loading');
        triggerLoadingSequence();
    });

    function triggerSuccess() {
        showStep('final');
        setTimeout(() => initConfetti(), 200);
    }

    // ========== CONFETTI — PHYSICS-BASED ==========

    function initConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const colors = [
            '#ff4e88', '#ff99ac', '#ff2e63',
            '#7c5ce7', '#a78bfa',
            '#ffffff', '#ffd700', '#ffa6c9'
        ];

        const particles = [];
        const SHAPES = ['rect', 'circle', 'strip'];

        class Particle {
            constructor(burst = false) {
                this.x = burst
                    ? canvas.width / 2 + (Math.random() - 0.5) * 200
                    : Math.random() * canvas.width;
                this.y = burst
                    ? canvas.height * 0.3
                    : Math.random() * -canvas.height;

                this.size = Math.random() * 5 + 3;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];

                // Velocity
                this.vx = burst
                    ? (Math.random() - 0.5) * 8
                    : (Math.random() - 0.5) * 1.5;
                this.vy = burst
                    ? -(Math.random() * 8 + 4)
                    : Math.random() * 2 + 1;

                // Rotation
                this.angle = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.15;

                // Physics
                this.gravity = 0.12 + Math.random() * 0.06;
                this.drag = 0.98 + Math.random() * 0.015;
                this.oscillation = Math.random() * Math.PI * 2;
                this.oscillationSpeed = 0.02 + Math.random() * 0.03;
                this.oscillationAmp = 0.5 + Math.random() * 1.5;

                this.opacity = 1;
                this.life = 1;
            }

            update() {
                this.vy += this.gravity;
                this.vx *= this.drag;
                this.vy *= this.drag;

                this.oscillation += this.oscillationSpeed;
                this.x += this.vx + Math.sin(this.oscillation) * this.oscillationAmp;
                this.y += this.vy;

                this.angle += this.rotSpeed;

                // Fade near bottom
                if (this.y > canvas.height * 0.85) {
                    this.life -= 0.03;
                    this.opacity = Math.max(0, this.life);
                }

                // Reset when off-screen or dead
                if (this.y > canvas.height + 20 || this.life <= 0) {
                    this.x = Math.random() * canvas.width;
                    this.y = -10 - Math.random() * 40;
                    this.vy = Math.random() * 2 + 0.5;
                    this.vx = (Math.random() - 0.5) * 1;
                    this.life = 1;
                    this.opacity = 1;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;

                switch (this.shape) {
                    case 'rect':
                        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
                        break;
                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 'strip':
                        ctx.fillRect(-this.size * 1.2 / 2, -this.size * 0.3 / 2, this.size * 1.2, this.size * 0.3);
                        break;
                }

                ctx.restore();
            }
        }

        // Initial burst
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle(true));
        }

        // Sustained gentle fall
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle(false));
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        animate();
    }

    // ========== FLOATING EMOJI ELEMENTS ==========

    const floatingEmojis = ['💖', '💍', '✨', '💕', '🌸', '💫'];
    let floatingInterval;

    function spawnFloatingElement() {
        const el = document.createElement('div');
        el.textContent = floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)];
        el.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            bottom: -40px;
            font-size: ${Math.random() * 14 + 16}px;
            animation: floatUp ${6 + Math.random() * 4}s ease-out forwards;
            pointer-events: none;
            will-change: transform, opacity;
        `;
        floatingContainer.appendChild(el);

        // Cleanup after animation
        const duration = parseFloat(el.style.animationDuration) * 1000;
        setTimeout(() => el.remove(), duration + 100);
    }

    // Stagger initial spawn so they're not all bunched
    function startFloating() {
        // Spawn a few immediately at staggered intervals
        for (let i = 0; i < 3; i++) {
            setTimeout(spawnFloatingElement, i * 800);
        }
        floatingInterval = setInterval(spawnFloatingElement, 1200 + Math.random() * 800);
    }

    startFloating();

    // ========== RESIZE HANDLER ==========

    window.addEventListener('resize', () => {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

});