document.addEventListener("DOMContentLoaded", () => {
    const startText = document.querySelector('.text');
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    const flames = [];

    const settings = {
        size: 6,
        fireWidth: 15,
        lifeTime: 3000,
        innerFlameStartColor: { r: 250, g: 140, b: 0 },
        innerFlameEndColor: { r: 50, g: 0, b: 0 },
        outerFlameStartColor: { r: 200, g: 60, b: 0 },
        outerFlameEndColor: { r: 80, g: 10, b: 0 },
    };

    canvas.width = width;
    canvas.height = height;

    function initFlames() {
        flames.length = 0;
        for (let i = 0; i < 400; i++) {
            flames.push(createFlame());
        }
    }

    function createFlame(reset = false) {
        const dimH = Math.ceil(height / settings.size);
        const dimW = Math.ceil(width / settings.size);
        const y = reset ? dimH : Math.ceil(Math.random() * dimH);
        const x = Math.ceil(((dimW / 2) - settings.fireWidth / 2 + Math.random() * settings.fireWidth) * 2) / 2;
        const isOuterFlame = x <= (dimW / 2) - (settings.fireWidth / 6) || x >= (dimW / 2) + (settings.fireWidth / 6);

        return {
            x, y,
            colorStart: isOuterFlame ? settings.outerFlameStartColor : settings.innerFlameStartColor,
            colorStop: isOuterFlame ? settings.outerFlameEndColor : settings.innerFlameEndColor,
            sinX: Math.round(Math.random() * 1),
            speedX: Math.ceil(Math.random() * 5),
            speedY: 0.5,
            top: Math.round(Math.random() * dimH / 2),
            startTime: Date.now(),
            lifeTime: Math.random() * settings.lifeTime
        };
    }

    function drawFlames() {
        ctx.fillStyle = "rgba(26,0,1,0.2)";
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "lighter";

        for (let i = 0; i < flames.length; i++) {
            const flame = flames[i];
            const curStep = (flame.startTime + flame.lifeTime) - Date.now();
            flame.y -= flame.speedY;
            flame.x += Math.round(Math.sin(flame.sinX += flame.speedX));

            if (flame.y <= flame.top || curStep <= 0) {
                flames[i] = createFlame(true);
            }

            const color = blendColor(flame.colorStart, flame.colorStop, height, flame.y);
            ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${Math.min(1, Math.max(0, curStep / flame.lifeTime))})`;
            drawTriangle(flame.x, Math.floor(flame.y));
        }

        ctx.globalCompositeOperation = "source-over";
        requestAnimationFrame(drawFlames);
    }

    function drawTriangle(x, y) {
        const size = settings.size;
        ctx.beginPath();
        if (parseInt(x) === x) {
            ctx.moveTo(x * size, y * size);
            ctx.lineTo(x * size + size / 2, y * size + size);
            ctx.lineTo(x * size - size / 2, y * size + size);
        } else {
            ctx.moveTo(x * size - size / 2, y * size);
            ctx.lineTo(x * size + size / 2, y * size);
            ctx.lineTo(x * size, y * size + size);
        }
        ctx.fill();
    }

    function blendColor(startColor, endColor, totalSteps, step) {
        const scale = step / totalSteps;
        return {
            r: Math.floor(Math.min(255, Math.max(0, endColor.r + scale * (startColor.r - endColor.r)))),
            g: Math.floor(Math.min(255, Math.max(0, endColor.g + scale * (startColor.g - endColor.g)))),
            b: Math.floor(Math.min(255, Math.max(0, endColor.b + scale * (startColor.b - endColor.b))))
        };
    }

    function startGame() {
        document.body.classList.add('fade-out'); // Apply fade-out effect
        
        setTimeout(() => {
            window.location.href = "https://allisonzulkoski.github.io/WEB/MIT/bubbles/bubbles.html";
        }, 1000); // Wait 1 second for fade-out before redirecting
    }

    // Start the flame animation immediately
    initializeFlameAnimation();

    startText.addEventListener('click', () => {
        startText.textContent = "";
        startText.classList.add('hidden');
        startGame();
    });

    function initializeFlameAnimation() {
        initFlames();
        drawFlames();
    }

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initFlames();
    });
});
