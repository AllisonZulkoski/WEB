document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bubbles = [];

    function createBubble() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 20 + 10,
            speed: Math.random() * 2 + 1,
            color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
        };
    }

    function initBubbles() {
        for (let i = 0; i < 100; i++) {
            bubbles.push(createBubble());
        }
    }

    function drawBubbles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const bubble of bubbles) {
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fillStyle = bubble.color;
            ctx.fill();
            bubble.y -= bubble.speed;
            if (bubble.y < -bubble.radius) {
                bubble.y = canvas.height + bubble.radius;
            }
        }
        requestAnimationFrame(drawBubbles);
    }

    initBubbles();
    drawBubbles();
});
