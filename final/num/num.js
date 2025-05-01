const params = new URLSearchParams(window.location.search);
const numberString = params.get('number');

//code to get the information from the dashes on the last page
const savedPocketedBalls = localStorage.getItem('pocketedBalls');
if (savedPocketedBalls) {
  const pocketed = JSON.parse(savedPocketedBalls);
  document.getElementById('displayNumber').textContent = pocketed.join(' ');
} else {
  document.getElementById('displayNumber').textContent = '- - - - - - - - - -';
}

document.getElementById('startButton').addEventListener('click', () => {
  localStorage.removeItem('pocketedBalls');
  window.location.href = '../final.html';
});
