const canvas = document.getElementById('billiardsCanvas');
const ctx = canvas.getContext('2d');

//ball shit
//friciton is an interactivity between them
const BALL_RADIUS = 15;
const FRICTION = 0.99;
const POCKET_RADIUS = 25;

//pocket size
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

const savedPocketedBalls = localStorage.getItem('pocketedBalls');
if (savedPocketedBalls) {
  pocketedBalls.splice(0, pocketedBalls.length, ...JSON.parse(savedPocketedBalls));
  pocketedBallsDisplay.textContent = pocketedBalls.join(' ');
}

function updatePocketedBalls() {
  localStorage.setItem('pocketedBalls', JSON.stringify(pocketedBalls));
  pocketedBallsDisplay.textContent = pocketedBalls.join(' ');
}

enterButton.addEventListener('click', () => {
  if (pocketedBalls.every(val => val === '-')) {
    alert('No numbers have been pocketed yet.');
  } else {
    localStorage.setItem('pocketedBalls', JSON.stringify(pocketedBalls));
    window.location.href = './num/num.html';
  }
});

const grumbleVolcanoTheme = new Audio('sounds/grumble_volcano.mp3');
const devilLaughSound = new Audio('sounds/devil_laugh.mp3');
const snoopDoggTheme = new Audio('sounds/snoop_dogg.mp3');
const copTheme = new Audio('sounds/Cop.mp3');
const casinoTheme = new Audio('sounds/Casino.mp3');
const elevenTheme = new Audio('sounds/11.mp3');
const mortTheme = new Audio('sounds/Mort.mp3');
const fiveOhFiveTheme = new Audio('sounds/505.mp3');

grumbleVolcanoTheme.loop = true;
copTheme.loop = true;
casinoTheme.loop = true;
elevenTheme.loop = true;
fiveOhFiveTheme.loop = true;

let audioInitialized = false;
function initializeAudio() {
  if (!audioInitialized) {
    audioInitialized = true;
  }
}

function stopAllThemes() {
  const themes = [
    grumbleVolcanoTheme,
    devilLaughSound,
    snoopDoggTheme,
    copTheme,
    casinoTheme,
    elevenTheme,
    mortTheme,
    fiveOhFiveTheme
  ];

  themes.forEach((theme) => {
    theme.pause();
    theme.currentTime = 0;
  });
}

function stopMortTheme() {
  mortTheme.pause();
  mortTheme.currentTime = 0;
}

function stop505Theme() {
  fiveOhFiveTheme.pause();
  fiveOhFiveTheme.currentTime = 0;
}

//for when 666 is entered
function startDevilsGame() {
  stopAllThemes();
  stopMortTheme();
  fiveOhFiveTheme.pause();
  fiveOhFiveTheme.currentTime = 0;
  document.body.classList.remove('weed-game', 'original-theme', 'police-game', 'casino-game', 'five-oh-five-theme');
  document.body.classList.add('devils-game');
  applyDevilTheme();
  grumbleVolcanoTheme.play().catch((err) => console.error('Audio playback failed:', err));
  devilLaughSound.play().catch((err) => console.error('Audio playback failed:', err));
}

//for when 420 is entered
function start420Theme() {
  stopAllThemes();
  stopMortTheme();
  fiveOhFiveTheme.pause();
  fiveOhFiveTheme.currentTime = 0;
  document.body.classList.remove('devils-game', 'original-theme', 'police-game', 'casino-game', 'five-oh-five-theme');
  document.body.classList.add('weed-game');
  applyWeedTheme();
  snoopDoggTheme.play().catch((err) => console.error('Audio playback failed:', err));
}

//for when 911 is entered
function startPoliceTheme() {
  stopAllThemes();
  stopMortTheme();
  fiveOhFiveTheme.pause();
  fiveOhFiveTheme.currentTime = 0;
  document.body.classList.remove('devils-game', 'weed-game', 'original-theme', 'casino-game', 'five-oh-five-theme');
  document.body.classList.add('police-game');
  applyPoliceTheme();
  copTheme.play().catch((err) => console.error('Audio playback failed:', err));
}

//for when 777 is entered
function startCasinoTheme() {
  stopAllThemes();
  stopMortTheme();
  fiveOhFiveTheme.pause();
  fiveOhFiveTheme.currentTime = 0;
  document.body.classList.remove('devils-game', 'weed-game', 'police-game', 'original-theme', 'five-oh-five-theme');
  document.body.classList.add('casino-game');
  applyCasinoTheme();
  elevenTheme.play().catch((err) => console.error('Audio playback failed:', err));
  triggerJackpotAnimation();
}

// Fix the 505 theme to ensure it works correctly
function start505Theme() {
  stopAllThemes();
  document.body.classList.remove('devils-game', 'weed-game', 'police-game', 'casino-game', 'original-theme');
  document.body.classList.add('five-oh-five-theme');
  apply505Theme();
  fiveOhFiveTheme.currentTime = 0;
  fiveOhFiveTheme.play().catch((err) => console.error('Audio playback failed:', err));
}

function apply505Theme() {
  document.body.className = '';
  document.body.classList.add('five-oh-five-theme');
  const fiveOhFiveColors = ['#2C2C2C', '#FFFFFF', '#B0B0B0', '#FFB6C1', '#FF7F50', '#DDA0DD'];
  balls.forEach((ball, index) => {
    if (ball.number === 1 || ball.number === 7) {
      ball.color = '#F0E68C';
    } else {
      ball.color = fiveOhFiveColors[index % fiveOhFiveColors.length];
    }
  });
  cueBall.color = '#FFFFFF';
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

//orientation of the balls and shit
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

//makes it so you can only move the white ball vertically during the first shot
let firstShotTaken = false; 

//calls the balls and themes to be reset and stops the audio
resetButton.addEventListener('click', () => {
  stopAllThemes();
  fiveOhFiveTheme.pause();
  fiveOhFiveTheme.currentTime = 0;
  resetBalls();
  pocketedBalls.fill('-');
  updatePocketedBalls();
  document.body.className = 'original-theme';
  firstShotTaken = false; 
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
    firstShotTaken = true; 
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

        const tempVx = a.vx;
        const tempVy = a.vy;
        a.vx = b.vx;
        a.vy = b.vy;
        b.vx = tempVx;
        b.vy = tempVy;
      }
    }
  }
}

function checkPockets() {
  for (let i = balls.length - 1; i >= 0; i--) {
    const ball = balls[i];
    for (const pocket of pockets) {
      const dist = Math.sqrt((ball.x - pocket.x) ** 2 + (ball.y - pocket.y) ** 2);
      if (dist < POCKET_RADIUS + BALL_RADIUS) {
        const emptyIndex = pocketedBalls.indexOf('-');
        if (emptyIndex !== -1) {
          pocketedBalls[emptyIndex] = ball.number;
          updatePocketedBalls();
        }
        balls.splice(i, 1);
        break;
      }
    }
  }

  for (const pocket of pockets) {
    const dist = Math.sqrt((cueBall.x - pocket.x) ** 2 + (cueBall.y - pocket.y) ** 2);
    if (dist < POCKET_RADIUS + BALL_RADIUS) {
      resetBalls();
      pocketedBalls.fill('-');
      updatePocketedBalls();
      break;
    }
  }
}

//keyboard controls for the cue stick
document.addEventListener('keydown', (e) => {
  if (!firstShotTaken) {
    // Allow vertical movement of the cue ball during setup
    if (e.code === 'ArrowUp' && cueBall.y - BALL_RADIUS > 0) cueBall.y -= 5;
    if (e.code === 'ArrowDown' && cueBall.y + BALL_RADIUS < canvas.height) cueBall.y += 5;
  }

  if (e.code === 'ArrowLeft') cueAngle -= 0.1;
  if (e.code === 'ArrowRight') cueAngle += 0.1;

  if (e.code === 'Space' && Math.hypot(cueBall.vx, cueBall.vy) < 0.1) {
    const powerMultiplier = 1 + cuePower / 50;
    cueBall.vx = Math.cos(cueAngle) * cuePower * powerMultiplier;
    cueBall.vy = Math.sin(cueAngle) * cuePower * powerMultiplier;
    firstShotTaken = true; 
  }
});

const targetSequence = [1, 2, 3];
let inputSequence = [];
let messageTimeout;

//for when 666 is entered
function applyDevilTheme() {
  document.body.className = '';
  document.body.classList.add('devils-game');
  const hellColors = ['#FF4500', '#8B0000', '#FFD700', '#DC143C', '#FF6347'];
  balls.forEach((ball, index) => {
    ball.color = hellColors[index % hellColors.length];
  });
  cueBall.color = '#FFFFFF';
}

//for when 420 is entered
function applyWeedTheme() {
  document.body.className = '';
  document.body.classList.add('weed-game');
  const weedColors = ['#6B8E23', '#556B2F', '#8FBC8F', '#2E8B57', '#228B22'];
  balls.forEach((ball, index) => {
    ball.color = weedColors[index % weedColors.length];
  });
  cueBall.color = '#FFFFFF';
}

//for when 911 is entered
function applyPoliceTheme() {
  document.body.className = '';
  document.body.classList.add('police-game');
  const policeColors = ['#001F3F', '#0074D9', '#FF4136', '#7FDBFF', '#FF851B'];
  balls.forEach((ball, index) => {
    ball.color = policeColors[index % policeColors.length];
  });
  cueBall.color = '#FFFFFF';
}

//for when 777 is entered
function applyCasinoTheme() {
  document.body.className = '';
  document.body.classList.add('casino-game');
  const casinoColors = ['#D4AF37', '#C0C0C0', '#8B0000', '#228B22', '#FFD700'];
  balls.forEach((ball, index) => {
    ball.color = casinoColors[index % casinoColors.length];
  });
  cueBall.color = '#FFFFFF';
}

//for when 505 is entered
function apply505Theme() {
  document.body.className = '';
  document.body.classList.add('five-oh-five-theme');
  const fiveOhFiveColors = ['#2C2C2C', '#FFFFFF', '#B0B0B0', '#FFB6C1', '#FF7F50', '#DDA0DD'];
  balls.forEach((ball, index) => {
    if (ball.number === 1 || ball.number === 7) {
      ball.color = '#F0E68C';
    } else {
      ball.color = fiveOhFiveColors[index % fiveOhFiveColors.length];
    }
  });
  cueBall.color = '#FFFFFF';
}

//for when 666 is entered
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
  ) 
  //from here down, it is the message that is displayed when the ball combos are entered
  {
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
  ) 

  {
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

  if (
    inputSequence.length >= 3 &&
    inputSequence.slice(-3).join('') === '505'
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'but I crumble completely when you cry';
    sillyMessage.style.opacity = 1;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0;
    }, 3000);

    apply505Theme();
    start505Theme();
  }

  if (inputSequence.length === targetSequence.length) {
    if (inputSequence.every((num, index) => num === targetSequence[index])) {
      alert('Correct sequence entered!');
    }
    inputSequence = [];
  }
}

//for when the balls are clicked (would be commented out if I were to publish this)
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
