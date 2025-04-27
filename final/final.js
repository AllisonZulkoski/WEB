const canvas = document.getElementById('billiardsCanvas');
const ctx = canvas.getContext('2d');

const BALL_RADIUS = 15;
const FRICTION = 0.98;
const POCKET_RADIUS = 25;

const pockets = [
  { x: 0, y: 0 },
  { x: canvas.width, y: 0 },
  { x: 0, y: canvas.height },
  { x: canvas.width, y: canvas.height },
  { x: canvas.width / 2, y: 0 },
  { x: canvas.width / 2, y: canvas.height }
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

const pocketedBalls = Array(10).fill('-');
const pocketedBallsDisplay = document.getElementById('pocketedBallsDisplay');
const resetButton = document.getElementById('resetButton');
const enterButton = document.getElementById('enterButton');

enterButton.addEventListener('click', () => {
  window.location.href = 'https://allisonzulkoski.github.io/WEB/final/num/num.html';
});

const grumbleVolcanoTheme = new Audio('sounds/grumble_volcano.mp3');
const devilLaughSound = new Audio('sounds/devil_laugh.mp3');
const snoopDoggTheme = new Audio('sounds/snoop_dogg.mp3');
const policeSirenSound = new Audio('sounds/police_siren.mp3');
const copTheme = new Audio('sounds/Cop.mp3');
const casinoTheme = new Audio('sounds/Casino.mp3');
const elevenTheme = new Audio('sounds/11.mp3');
const mortTheme = new Audio('sounds/Mort.mp3');

grumbleVolcanoTheme.loop = true;
policeSirenSound.loop = true;
copTheme.loop = true;
casinoTheme.loop = true;
elevenTheme.loop = true;

let audioInitialized = false;
function initializeAudio() {
  if (!audioInitialized) {
    audioInitialized = true;
  }
}

function stopAllThemes() {
  snoopDoggTheme.pause();
  snoopDoggTheme.currentTime = 0;
  grumbleVolcanoTheme.pause();
  grumbleVolcanoTheme.currentTime = 0;
  devilLaughSound.pause();
  devilLaughSound.currentTime = 0;
  policeSirenSound.pause();
  policeSirenSound.currentTime = 0;
  copTheme.pause();
  copTheme.currentTime = 0;
  casinoTheme.pause();
  casinoTheme.currentTime = 0;
  elevenTheme.pause();
  elevenTheme.currentTime = 0;
  mortTheme.pause();
  mortTheme.currentTime = 0;
}

function startDevilsGame() {
  stopAllThemes();
  document.body.classList.remove('weed-game', 'original-theme', 'police-game', 'casino-game');
  document.body.classList.add('devils-game');
  applyDevilTheme();
  grumbleVolcanoTheme.play().catch((err) => console.error('Audio playback failed:', err));
  devilLaughSound.play().catch((err) => console.error('Audio playback failed:', err));
}

function start420Theme() {
  stopAllThemes();
  document.body.classList.remove('devils-game', 'original-theme', 'police-game', 'casino-game');
  document.body.classList.add('weed-game');
  applyWeedTheme();
  snoopDoggTheme.play().catch((err) => console.error('Audio playback failed:', err));
}

function startPoliceTheme() {
  stopAllThemes();
  document.body.classList.remove('devils-game', 'weed-game', 'original-theme', 'casino-game');
  document.body.classList.add('police-game');
  applyPoliceTheme();
  copTheme.play().catch((err) => console.error('Audio playback failed:', err));
}

function startCasinoTheme() {
  stopAllThemes();
  document.body.classList.remove('devils-game', 'weed-game', 'police-game', 'original-theme');
  document.body.classList.add('casino-game');
  applyCasinoTheme();
  elevenTheme.play().catch((err) => console.error('Audio playback failed:', err));
  triggerJackpotAnimation();
}

function triggerJackpotAnimation() {
  const sillyMessage = document.getElementById('sillyMessage');
  sillyMessage.textContent = '🎰 JACKPOT! 🎰';
  sillyMessage.style.color = '#FFD700';
  sillyMessage.style.opacity = 1;
  clearTimeout(messageTimeout);
  messageTimeout = setTimeout(() => {
    sillyMessage.style.opacity = 0;
  }, 3000);
}

function resetBalls() {
  balls.length = 0;
  const triangleStartX = canvas.width / 2 + 200;
  const triangleStartY = canvas.height / 3 + 70;
  const rotationAngle = (3 * Math.PI) / 2;
  let ballIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col <= row; col++) {
      const xOffset = (row * BALL_RADIUS) - (col * 2 * BALL_RADIUS);
      const yOffset = row * 2 * BALL_RADIUS;
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

  cueBall.x = 100;
  cueBall.y = canvas.height / 2;
  cueBall.vx = 0;
  cueBall.vy = 0;
}

resetButton.addEventListener('click', () => {
  resetBalls();
  pocketedBalls.fill('-');
  pocketedBallsDisplay.textContent = pocketedBalls.join(' ');
  document.body.classList.remove('devils-game', 'weed-game', 'police-game', 'casino-game');
  document.body.classList.add('original-theme');
  document.getElementById('gv').pause();
  document.getElementById('gv').currentTime = 0;
  document.getElementById('laugh').pause();
  document.getElementById('laugh').currentTime = 0;
  document.getElementById('sd').pause();
  document.getElementById('sd').currentTime = 0;
  document.getElementById('cop').pause();
  document.getElementById('cop').currentTime = 0;
  document.getElementById('elevenTheme').pause();
  document.getElementById('elevenTheme').currentTime = 0;
  document.getElementById('mortTheme').play();
  document.getElementById('mortTheme').currentTime = 0;
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
    const powerMultiplier = 1 + cuePower / 50;
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

    ctx.strokeStyle = '#deb887';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
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

        const velocityScale = 1;
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

function checkPockets() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    for (let j = 0; j < pockets.length; j++) {
      const pocket = pockets[j];
      const dist = Math.sqrt((ball.x - pocket.x) ** 2 + (ball.y - pocket.y) ** 2);
      if (dist < POCKET_RADIUS + BALL_RADIUS) {
        const emptyIndex = pocketedBalls.indexOf('-');
        if (emptyIndex !== -1) {
          pocketedBalls[emptyIndex] = ball.number;
          pocketedBallsDisplay.textContent = pocketedBalls.join(' ');
        }

        ball.x = Math.random() * (canvas.width - 2 * BALL_RADIUS) + BALL_RADIUS;
        ball.y = Math.random() * (canvas.height - 2 * BALL_RADIUS) + BALL_RADIUS;
        ball.vx = 0;
        ball.vy = 0;
        break;
      }
    }
  }

  for (let j = 0; j < pockets.length; j++) {
    const pocket = pockets[j];
    const dist = Math.sqrt((cueBall.x - pocket.x) ** 2 + (cueBall.y - pocket.y) ** 2);
    if (dist < POCKET_RADIUS + BALL_RADIUS) {
      resetBalls();
      pocketedBalls.fill('-');
      pocketedBallsDisplay.textContent = pocketedBalls.join(' ');
      break;
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') cueAngle -= 0.1;
  if (e.code === 'ArrowRight') cueAngle += 0.1;
  if (e.code === 'Space' && Math.hypot(cueBall.vx, cueBall.vy) < 0.1) {
    const powerMultiplier = 1 + cuePower / 50;
    cueBall.vx = Math.cos(cueAngle) * cuePower * powerMultiplier;
    cueBall.vy = Math.sin(cueAngle) * cuePower * powerMultiplier;
  }
});

const targetSequence = [1, 2, 3];
let inputSequence = [];
let messageTimeout;

function applyDevilTheme() {
  document.body.classList.add('devils-game');
  const hellColors = ['#FF4500', '#8B0000', '#FFD700', '#DC143C', '#FF6347'];
  balls.forEach((ball, index) => {
    ball.color = hellColors[index % hellColors.length];
  });
  cueBall.color = '#FFFFFF';
}

function applyWeedTheme() {
  document.body.classList.add('weed-game');
  const weedColors = ['#6B8E23', '#556B2F', '#8FBC8F', '#2E8B57', '#228B22'];
  balls.forEach((ball, index) => {
    ball.color = weedColors[index % weedColors.length];
  });
  cueBall.color = '#FFFFFF';
}

function applyPoliceTheme() {
  document.body.classList.add('police-game');
  const policeColors = ['#001F3F', '#0074D9', '#FF4136', '#7FDBFF', '#FF851B'];
  balls.forEach((ball, index) => {
    ball.color = policeColors[index % policeColors.length];
  });
  cueBall.color = '#FFFFFF';
}

function applyCasinoTheme() {
  document.body.classList.add('casino-game');
  const casinoColors = ['#D4AF37', '#C0C0C0', '#8B0000', '#228B22', '#FFD700'];
  balls.forEach((ball, index) => {
    ball.color = casinoColors[index % casinoColors.length];
  });
  cueBall.color = '#FFFFFF';
}

function handleNumberInput(number) {
  inputSequence.push(number);
  const emptyIndex = pocketedBalls.indexOf('-');
  if (emptyIndex !== -1) {
    pocketedBalls[emptyIndex] = number;
    pocketedBallsDisplay.textContent = pocketedBalls.join(' ');
  }

  if (
    inputSequence.length >= 3 &&
    inputSequence.slice(-3).every((num) => num === 6)
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'You are now playing the Devil\'s game';
    sillyMessage.style.opacity = 1;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0;
    }, 3000);

    applyDevilTheme();
    startDevilsGame();
  }

  if (
    inputSequence.length >= 2 &&
    inputSequence[inputSequence.length - 2] === 6 &&
    inputSequence[inputSequence.length - 1] === 9
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'Good Girl';
    sillyMessage.style.opacity = 1;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0;
    }, 3000);
  }

  if (
    inputSequence.length >= 3 &&
    inputSequence.slice(-3).join('') === '420'
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'Little pothead, are we?';
    sillyMessage.style.opacity = 1;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0;
    }, 3000);

    applyWeedTheme();
    start420Theme();
  }

  if (
    inputSequence.length >= 3 &&
    inputSequence.slice(-3).join('') === '911'
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'YOU CALLED THE COPS ON ME?!';
    sillyMessage.style.opacity = 1;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0;
    }, 3000);

    applyPoliceTheme();
    startPoliceTheme();
  }

  if (
    inputSequence.length >= 3 &&
    inputSequence.slice(-3).join('') === '777'
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'Jackpot! Welcome to the Casino!';
    sillyMessage.style.opacity = 1;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0;
    }, 3000);

    applyCasinoTheme();
    startCasinoTheme();
  }

  if (inputSequence.length === targetSequence.length) {
    if (inputSequence.every((num, index) => num === targetSequence[index])) {
      alert('Correct sequence entered!');
    }
    inputSequence = [];
  }
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  balls.forEach((ball) => {
    const dist = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);
    if (dist < BALL_RADIUS) {
      handleNumberInput(ball.number);
    }
  });

  const cueDist = Math.sqrt((mouseX - cueBall.x) ** 2 + (mouseY - cueBall.y) ** 2);
  if (cueDist < BALL_RADIUS) {
    handleNumberInput(cueBall.number);
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

resetBalls();

draw();
