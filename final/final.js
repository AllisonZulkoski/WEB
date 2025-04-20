const canvas = document.getElementById('billiardsCanvas');
const ctx = canvas.getContext('2d');

const BALL_RADIUS = 15;
const FRICTION = 0.98;
const POCKET_RADIUS = 25;  // Radius for pockets

const pockets = [
  { x: 0, y: 0 },  // Top-left corner
  { x: canvas.width, y: 0 },  // Top-right corner
  { x: 0, y: canvas.height },  // Bottom-left corner
  { x: canvas.width, y: canvas.height },  // Bottom-right corner
  { x: canvas.width / 2, y: 0 },  // Top-center
  { x: canvas.width / 2, y: canvas.height }  // Bottom-center
];

const balls = [];
const cueBall = {
  x: 100,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  number: null,
  color: '#ffffff'
};

const pocketedBalls = Array(10).fill('-'); // Array to store pocketed ball numbers
const pocketedBallsDisplay = document.getElementById('pocketedBallsDisplay');
const resetButton = document.getElementById('resetButton');

// Get the Enter button
const enterButton = document.getElementById('enterButton');

// Add functionality to redirect to num.htm
enterButton.addEventListener('click', () => {
  window.location.href = 'https://allisonzulkoski.github.io/WEB/final/num/num.html';
});

// Update the starting positions of the balls to form a properly oriented triangle
function resetBalls() {
  balls.length = 0; // Clear existing balls
  const triangleStartX = canvas.width / 2 + 200; // Center the triangle horizontally
  const triangleStartY = canvas.height / 3 + 70; // Position the triangle vertically
  const rotationAngle = (3 * Math.PI) / 2; // Rotate 270 degrees clockwise (3π/2 radians)
  let ballIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col <= row; col++) {
      const xOffset = (row * BALL_RADIUS) - (col * 2 * BALL_RADIUS);
      const yOffset = row * 2 * BALL_RADIUS;

      // Apply rotation
      const rotatedX = xOffset * Math.cos(rotationAngle) - yOffset * Math.sin(rotationAngle);
      const rotatedY = xOffset * Math.sin(rotationAngle) + yOffset * Math.cos(rotationAngle);

      balls.push({
        x: triangleStartX + rotatedX,
        y: triangleStartY + rotatedY,
        vx: 0,
        vy: 0,
        number: ballIndex,
        color: `hsl(${ballIndex * 36}, 70%, 50%)`
      });
      ballIndex++;
      if (ballIndex >= 10) break;
    }
    if (ballIndex >= 10) break;
  }

  // Reset cue ball position
  cueBall.x = 100;
  cueBall.y = canvas.height / 2;
  cueBall.vx = 0;
  cueBall.vy = 0;
}

resetButton.addEventListener('click', () => {
  resetBalls();
  pocketedBalls.fill('-'); // Reset pocketedBalls array
  pocketedBallsDisplay.textContent = pocketedBalls.join(' '); // Update HTML
});

let cueAngle = 0;
let cuePower = 10;

const powerSlider = document.getElementById('powerRange');
const powerValue = document.getElementById('powerValue');
const shootButton = document.getElementById('shootButton');

powerSlider.addEventListener('input', () => {
  cuePower = parseInt(powerSlider.value);
  powerValue.textContent = cuePower;
});

shootButton.addEventListener('click', () => {
  if (Math.hypot(cueBall.vx, cueBall.vy) < 0.1) {
    const powerMultiplier = 1 + cuePower / 50; // Scale velocity based on cue power
    cueBall.vx = Math.cos(cueAngle) * cuePower * powerMultiplier;
    cueBall.vy = Math.sin(cueAngle) * cuePower * powerMultiplier;
  }
});

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.stroke();
  ctx.closePath();

  if (ball.number !== null) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ball.number, ball.x, ball.y);
  }
}

function drawCueStick() {
  if (Math.hypot(cueBall.vx, cueBall.vy) < 0.1) {
    const length = 80;
    const x1 = cueBall.x - Math.cos(cueAngle) * 10;
    const y1 = cueBall.y - Math.sin(cueAngle) * 10;
    const x2 = cueBall.x - Math.cos(cueAngle) * (length + 10);
    const y2 = cueBall.y - Math.sin(cueAngle) * (length + 10);

    ctx.strokeStyle = '#deb887'; // Restore original cue stick color
    ctx.lineWidth = 4; // Restore original line width
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2); // Fix incorrect coordinate reference
    ctx.stroke();
  }
}

function moveBall(ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vx *= FRICTION;
  ball.vy *= FRICTION;

  if (ball.x + BALL_RADIUS > canvas.width || ball.x - BALL_RADIUS < 0) {
    ball.vx *= -1;
    ball.x = Math.max(BALL_RADIUS, Math.min(ball.x, canvas.width - BALL_RADIUS));
  }
  if (ball.y + BALL_RADIUS > canvas.height || ball.y - BALL_RADIUS < 0) {
    ball.vy *= -1;
    ball.y = Math.max(BALL_RADIUS, Math.min(ball.y, canvas.height - BALL_RADIUS));
  }
}

function handleCollisions(allBalls) {
  for (let i = 0; i < allBalls.length; i++) {
    for (let j = i + 1; j < allBalls.length; j++) {
      const a = allBalls[i];
      const b = allBalls[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < BALL_RADIUS * 2) {
        const angle = Math.atan2(dy, dx);
        const overlap = BALL_RADIUS * 2 - dist;
        const moveX = (Math.cos(angle) * overlap) / 2;
        const moveY = (Math.sin(angle) * overlap) / 2;
        a.x -= moveX;
        a.y -= moveY;
        b.x += moveX;
        b.y += moveY;

        // Scale velocity transfer to make balls move more
        const velocityScale = 1; // Increase this value to amplify the effect
        const tempVx = a.vx * velocityScale;
        const tempVy = a.vy * velocityScale;
        a.vx = b.vx * velocityScale;
        a.vy = b.vy * velocityScale;
        b.vx = tempVx;
        b.vy = tempVy;
      }
    }
  }
}

// Modify checkPockets to update the pocketedBallsDisplay
function checkPockets() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    for (let j = 0; j < pockets.length; j++) {
      const pocket = pockets[j];
      const dist = Math.sqrt((ball.x - pocket.x) ** 2 + (ball.y - pocket.y) ** 2);
      if (dist < POCKET_RADIUS + BALL_RADIUS) {
        // Update pocketedBalls with the ball number
        const emptyIndex = pocketedBalls.indexOf('-');
        if (emptyIndex !== -1) {
          pocketedBalls[emptyIndex] = ball.number;
          pocketedBallsDisplay.textContent = pocketedBalls.join(' '); // Update HTML
        }

        // Reset ball to a random position on the table
        ball.x = Math.random() * (canvas.width - 2 * BALL_RADIUS) + BALL_RADIUS;
        ball.y = Math.random() * (canvas.height - 2 * BALL_RADIUS) + BALL_RADIUS;
        ball.vx = 0;
        ball.vy = 0;
        break;
      }
    }
  }

  // If cue ball goes in pocket, reset the game
  for (let j = 0; j < pockets.length; j++) {
    const pocket = pockets[j];
    const dist = Math.sqrt((cueBall.x - pocket.x) ** 2 + (cueBall.y - pocket.y) ** 2);
    if (dist < POCKET_RADIUS + BALL_RADIUS) {
      resetBalls();
      pocketedBalls.fill('-'); // Reset pocketedBalls array
      pocketedBallsDisplay.textContent = pocketedBalls.join(' '); // Update HTML
      break;
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') cueAngle -= 0.1;
  if (e.code === 'ArrowRight') cueAngle += 0.1;
  if (e.code === 'Space' && Math.hypot(cueBall.vx, cueBall.vy) < 0.1) {
    const powerMultiplier = 1 + cuePower / 50; // Scale velocity based on cue power
    cueBall.vx = Math.cos(cueAngle) * cuePower * powerMultiplier;
    cueBall.vy = Math.sin(cueAngle) * cuePower * powerMultiplier;
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw pockets
  ctx.fillStyle = '#000';
  pockets.forEach((pocket) => {
    ctx.beginPath();
    ctx.arc(pocket.x, pocket.y, POCKET_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  });

  moveBall(cueBall);
  balls.forEach(moveBall);
  handleCollisions([cueBall, ...balls]);
  checkPockets();

  drawBall(cueBall);
  balls.forEach(drawBall);
  drawCueStick();
  requestAnimationFrame(draw);
}

// Call resetBalls at the start of the game
resetBalls();

draw();
