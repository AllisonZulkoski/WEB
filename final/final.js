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

// Audio elements
// const greenHillZoneTheme = new Audio('sounds/green_hill_zone.mp3');
const grumbleVolcanoTheme = new Audio('sounds/grumble_volcano.mp3');
const devilLaughSound = new Audio('sounds/devil_laugh.mp3');
const snoopDoggTheme = new Audio('sounds/snoop_dogg.mp3');
const policeSirenSound = new Audio('sounds/police_siren.mp3'); // Add police siren sound
const copTheme = new Audio('sounds/Cop.mp3'); // Add Cop.mp3 audio
const casinoTheme = new Audio('sounds/Casino.mp3'); // Add Casino.mp3 audio
const elevenTheme = new Audio('sounds/11.mp3'); // Add 11.mp3 audio

// Configure audio settings
// greenHillZoneTheme.loop = true;
grumbleVolcanoTheme.loop = true;
policeSirenSound.loop = true; // Loop the siren sound
copTheme.loop = true; // Loop the Cop theme
casinoTheme.loop = true; // Loop the Casino theme
elevenTheme.loop = true; // Loop the 11 theme

// Start audio playback after user interaction
let audioInitialized = false;
function initializeAudio() {
  if (!audioInitialized) {
    // greenHillZoneTheme.play().catch((err) => console.error('Audio playback failed:', err));
    audioInitialized = true;
  }
}

// Function to stop all themes
function stopAllThemes() {
  // greenHillZoneTheme.pause();
  // greenHillZoneTheme.currentTime = 0;
  snoopDoggTheme.pause();
  snoopDoggTheme.currentTime = 0;
  grumbleVolcanoTheme.pause();
  grumbleVolcanoTheme.currentTime = 0;
  devilLaughSound.pause(); // Ensure the devil laugh also stops
  devilLaughSound.currentTime = 0;
  policeSirenSound.pause(); // Ensure the police siren also stops
  policeSirenSound.currentTime = 0;
  copTheme.pause(); // Ensure the Cop theme also stops
  copTheme.currentTime = 0;
  casinoTheme.pause(); // Ensure the Casino theme also stops
  casinoTheme.currentTime = 0;
  elevenTheme.pause(); // Ensure the 11 theme also stops
  elevenTheme.currentTime = 0;
}

// Function to start "Devil's Game"
function startDevilsGame() {
  stopAllThemes(); // Stop all other themes
  document.body.classList.remove('weed-game'); // Remove weed-game theme
  document.body.classList.add('devils-game'); // Apply devils-game theme

  // Reset ball colors to match the Devil's theme
  applyDevilTheme();

  // Start Devil's Game sounds
  grumbleVolcanoTheme.play().catch((err) => console.error('Audio playback failed:', err));
  devilLaughSound.play().catch((err) => console.error('Audio playback failed:', err));
}

// Function to start "420 Theme"
function start420Theme() {
  stopAllThemes(); // Stop all other themes
  document.body.classList.remove('devils-game'); // Remove devils-game theme
  document.body.classList.add('weed-game'); // Apply weed-game theme

  // Reset ball colors to match the Weed theme
  applyWeedTheme();

  // Start 420 Theme sound
  snoopDoggTheme.play().catch((err) => console.error('Audio playback failed:', err));
}

function startPoliceTheme() {
  stopAllThemes(); // Stop all other themes
  document.body.classList.remove('devils-game', 'weed-game'); // Remove other themes
  document.body.classList.add('police-game'); // Apply police-game theme

  // Reset ball colors to match the Police theme
  applyPoliceTheme();

  // Start Police Theme sound
  copTheme.play().catch((err) => console.error('Audio playback failed:', err));
}

function startCasinoTheme() {
  stopAllThemes(); // Stop all other themes
  document.body.classList.remove('devils-game', 'weed-game', 'police-game'); // Remove other themes
  document.body.classList.add('casino-game'); // Apply casino-game theme

  // Reset ball colors to match the Casino theme
  applyCasinoTheme();

  // Start Casino Theme sound
  elevenTheme.play().catch((err) => console.error('Audio playback failed:', err));

  // Trigger jackpot animation
  triggerJackpotAnimation();
}

function triggerJackpotAnimation() {
  const sillyMessage = document.getElementById('sillyMessage');
  sillyMessage.textContent = '🎰 JACKPOT! 🎰'; // Display jackpot message
  sillyMessage.style.color = '#FFD700'; // Gold text
  sillyMessage.style.opacity = 1; // Fade in the message

  // Use the same timeout logic as other messages
  clearTimeout(messageTimeout); // Clear any existing timeout
  messageTimeout = setTimeout(() => {
    sillyMessage.style.opacity = 0; // Fade out the message after 3 seconds
  }, 3000);
}

function resetBalls() {
  balls.length = 0; // Clear existing balls
  const triangleStartX = canvas.width / 2 + 200; // Center the triangle horizontally
  const triangleStartY = canvas.height / 3 + 70; // Position the triangle vertically
  const rotationAngle = (3 * Math.PI) / 2; // Rotate 270 degrees clockwise (3π/2 radians)
  let ballIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col <= row; col++) { // Fix the loop condition
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

// Reset button logic
resetButton.addEventListener('click', () => {
  resetBalls();
  pocketedBalls.fill('-'); // Reset pocketedBalls array
  pocketedBallsDisplay.textContent = pocketedBalls.join(' '); // Update HTML

  // Restore the original theme and stop all sounds
  document.body.classList.remove('devils-game', 'weed-game', 'police-game', 'casino-game'); // Remove any applied themes
  document.body.classList.add('original-theme'); // Add the Original Theme class
  stopAllThemes(); // Stop all audio
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
  document.getElementById('casinoTheme').pause();
  document.getElementById('casinoTheme').currentTime = 0;
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

const targetSequence = [1, 2, 3]; // Define the target sequence
let inputSequence = []; // Array to track the user's input sequence

let messageTimeout; // Timeout to clear the message after a delay

function applyDevilTheme() {
  document.body.classList.add('devils-game'); // Add the class for Devil's game styling

  // Update ball colors to match the "hell" themes
  const hellColors = ['#FF4500', '#8B0000', '#FFD700', '#DC143C', '#FF6347']; // Example colors from the themes
  balls.forEach((ball, index) => {
    ball.color = hellColors[index % hellColors.length]; // Cycle through the colors
  });
  cueBall.color = '#FFFFFF'; // Keep the cue ball white
}

function applyWeedTheme() {
  document.body.classList.add('weed-game'); // Add the class for Weed's game styling

  // Update ball colors to match the "weed" themes
  const weedColors = ['#6B8E23', '#556B2F', '#8FBC8F', '#2E8B57', '#228B22']; // Example colors from the themes
  balls.forEach((ball, index) => {
    ball.color = weedColors[index % weedColors.length]; // Cycle through the colors
  });
  cueBall.color = '#FFFFFF'; // Keep the cue ball white
}

function applyPoliceTheme() {
  document.body.classList.add('police-game'); // Add the class for Police game styling

  // Update ball colors to include red and blue for the "police" theme
  const policeColors = ['#001F3F', '#0074D9', '#FF4136', '#7FDBFF', '#FF851B']; // Added red and orange
  balls.forEach((ball, index) => {
    ball.color = policeColors[index % policeColors.length]; // Cycle through the colors
  });
  cueBall.color = '#FFFFFF'; // Keep the cue ball white
}

function applyCasinoTheme() {
  document.body.classList.add('casino-game'); // Add the class for Casino game styling

  // Update ball colors to match the "casino" theme
  const casinoColors = ['#D4AF37', '#C0C0C0', '#8B0000', '#228B22', '#FFD700']; // Gold, silver, dark red, green, bright gold
  balls.forEach((ball, index) => {
    ball.color = casinoColors[index % casinoColors.length]; // Cycle through the colors
  });
  cueBall.color = '#FFFFFF'; // Keep the cue ball white
}

// Modify handleNumberInput to apply the devil theme when 666 is entered
function handleNumberInput(number) {
  inputSequence.push(number);

  // Update the pocketedBallsDisplay with the entered numbers
  const emptyIndex = pocketedBalls.indexOf('-');
  if (emptyIndex !== -1) {
    pocketedBalls[emptyIndex] = number;
    pocketedBallsDisplay.textContent = pocketedBalls.join(' '); // Update HTML
  }

  // Check for the special case of 666
  if (
    inputSequence.length >= 3 &&
    inputSequence.slice(-3).every((num) => num === 6)
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'You are now playing the Devil\'s game'; // Set the message text
    sillyMessage.style.opacity = 1; // Fade in the message
    clearTimeout(messageTimeout); // Clear any existing timeout
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0; // Fade out the message after 3 seconds
    }, 3000);

    applyDevilTheme(); // Apply the devil theme
    startDevilsGame(); // Play Devil's Game audio
  }

  // Check for the special case of 69 (not 96)
  if (
    inputSequence.length >= 2 &&
    inputSequence[inputSequence.length - 2] === 6 &&
    inputSequence[inputSequence.length - 1] === 9
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'Good Girl'; // Set the message text
    sillyMessage.style.opacity = 1; // Fade in the message
    clearTimeout(messageTimeout); // Clear any existing timeout
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0; // Fade out the message after 3 seconds
    }, 3000);
  }

  // Check for the special case of 420
  if (
    inputSequence.length >= 3 &&
    inputSequence.slice(-3).join('') === '420'
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'Little pothead, are we?'; // Set the message text
    sillyMessage.style.opacity = 1; // Fade in the message
    clearTimeout(messageTimeout); // Clear any existing timeout
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0; // Fade out the message after 3 seconds
    }, 3000);

    applyWeedTheme(); // Apply the weed theme
    start420Theme(); // Play 420 Theme audio
  }

  // Check for the special case of 911
  if (
    inputSequence.length >= 3 &&
    inputSequence.slice(-3).join('') === '911'
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'YOU CALLED THE COPS ON ME?!'; // Set the message text
    sillyMessage.style.opacity = 1; // Fade in the message
    clearTimeout(messageTimeout); // Clear any existing timeout
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0; // Fade out the message after 3 seconds
    }, 3000);

    applyPoliceTheme(); // Apply the police theme
    startPoliceTheme(); // Play Police Theme audio
  }

  // Check for the special case of 777
  if (
    inputSequence.length >= 3 &&
    inputSequence.slice(-3).join('') === '777'
  ) {
    const sillyMessage = document.getElementById('sillyMessage');
    sillyMessage.textContent = 'Jackpot! Welcome to the Casino!'; // Set the message text
    sillyMessage.style.opacity = 1; // Fade in the message
    clearTimeout(messageTimeout); // Clear any existing timeout
    messageTimeout = setTimeout(() => {
      sillyMessage.style.opacity = 0; // Fade out the message after 3 seconds
    }, 3000);

    applyCasinoTheme(); // Apply the casino theme
    startCasinoTheme(); // Play Casino Theme audio
  }

  // Check if the input sequence matches the target sequence
  if (inputSequence.length === targetSequence.length) {
    if (inputSequence.every((num, index) => num === targetSequence[index])) {
      alert('Correct sequence entered!'); // Display a message
    }
    inputSequence = []; // Reset the input sequence
  }
}

// Example usage: Call handleNumberInput when a ball is clicked
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  balls.forEach((ball) => {
    const dist = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);
    if (dist < BALL_RADIUS) {
      handleNumberInput(ball.number); // Pass the ball number to the function
    }
  });

  // Check if the cue ball is clicked
  const cueDist = Math.sqrt((mouseX - cueBall.x) ** 2 + (mouseY - cueBall.y) ** 2);
  if (cueDist < BALL_RADIUS) {
    handleNumberInput(cueBall.number); // Pass the cue ball number (if applicable)
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Remove fiery background logic

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
