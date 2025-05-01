const params = new URLSearchParams(window.location.search);
const numberString = params.get('number');

// Retrieve pocketedBalls from localStorage
const savedPocketedBalls = localStorage.getItem('pocketedBalls');
if (savedPocketedBalls) {
  const pocketed = JSON.parse(savedPocketedBalls);
  document.getElementById('displayNumber').textContent = pocketed.join(' ');
} else {
  document.getElementById('displayNumber').textContent = '- - - - - - - - - -';
}

document.getElementById('startButton').addEventListener('click', () => {
  // Clear localStorage and redirect back to the main page
  localStorage.removeItem('pocketedBalls');
  window.location.href = '../final.html';
});
