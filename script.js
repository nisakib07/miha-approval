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

    const noMessages = [
        "Eita cholbe na 😌",
        "Arey seriously? 😏",
        "Yes e click kor 😈",
        "Allah dekhse 😌",
        "Last chance 😤"
    ];

    function showStep(stepKey) {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        steps[stepKey].classList.add('active');
    }

    function addInteraction(el, handler) {
        el.addEventListener('click', handler);
        el.addEventListener('touchstart', e => {
            e.preventDefault();
            handler(e);
        }, { passive: false });
    }

    addInteraction(buttons.kiKotha, () => showStep(2));
    addInteraction(buttons.bolo, () => showStep(3));
    addInteraction(buttons.readyNa, () => {
        buttons.readyNa.textContent = "Dhorlam ready 😌";
        setTimeout(() => showStep(3), 800);
    });

    function moveNoButton() {
        const zone = document.querySelector('.action-zone');
        const rect = zone.getBoundingClientRect();
        const btnRect = buttons.no.getBoundingClientRect();
        const padding = 10;

        const maxX = rect.width - btnRect.width - padding;
        const maxY = rect.height - btnRect.height - padding;

        buttons.no.style.left = Math.max(padding, Math.random() * maxX) + "px";
        buttons.no.style.top = Math.max(padding, Math.random() * maxY) + "px";
    }

    addInteraction(buttons.no, (e) => {
        e.preventDefault();
        noClickCount++;

        if (noClickCount <= 4) {
            moveNoButton();
            buttons.no.style.transform = `scale(${1 - noClickCount * 0.15}) rotate(${Math.random()*40-20}deg)`;
            noStatusMsg.textContent = noMessages[Math.min(noClickCount - 1, noMessages.length - 1)];
        } else {
            buttons.no.style.display = "none";
            noStatusMsg.textContent = "Only Yes works now 😈";
        }

        buttons.yes.style.transform = `scale(${1 + noClickCount * 0.2})`;
    });

    addInteraction(buttons.yes, () => {
        showStep('loading');

        const messages = [
            "Processing approval...",
            "Checking Miha’s mood...",
            "Consulting family committee...",
            "Running dua protocol...",
            "100% Approved 😌"
        ];

        let i = 0;
        const interval = setInterval(() => {
            loadingText.textContent = messages[i];
            i++;
            if (i >= messages.length) {
                clearInterval(interval);
                triggerSuccess();
            }
        }, 850);
    });

    function triggerSuccess() {
        showStep('final');
        initConfetti();
    }

    function initConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#ff4e88', '#ff99ac', '#6c5ce7', '#ffffff'];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.size = Math.random() * 6 + 4;
                this.speedY = Math.random() * 3 + 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.y += this.speedY;
                if (this.y > canvas.height) this.y = -10;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
        }

        for (let i = 0; i < 140; i++) particles.push(new Particle());

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

    // Resize fix for mobile rotation
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Floating hearts & rings
    setInterval(() => {
        const el = document.createElement('div');
        el.innerHTML = Math.random() > 0.5 ? "💖" : "💍";
        el.style.position = "absolute";
        el.style.left = Math.random() * 100 + "%";
        el.style.bottom = "-40px";
        el.style.fontSize = Math.random() * 18 + 18 + "px";
        el.style.animation = "floatUp 6s linear forwards";
        floatingContainer.appendChild(el);
        setTimeout(() => el.remove(), 6000);
    }, 650);

});