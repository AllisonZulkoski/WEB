const colorInput = document.getElementById('colorInput');
const topRectangle = document.getElementById('top-rectangle');
const matchRectangle = document.getElementById('match-rectangle');

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g).map(Number);
  return "#" + componentToHex(result[0]) + componentToHex(result[1]) + componentToHex(result[2]);
}

// Set a random color for the top rectangle
const randomColor = getRandomColor();
topRectangle.style.backgroundColor = randomColor;

// Optional: also change the input value to match the default bottom (white)
colorInput.value = "#ffffff";

colorInput.addEventListener('input', (e) => {
  matchRectangle.style.backgroundColor = e.target.value;
});

function calculateMatchPercentage(color1, color2) {
  const rgb1 = color1.match(/\d+/g).map(Number);
  const rgb2 = color2.match(/\d+/g).map(Number);

  const diff = rgb1.reduce((acc, val, i) => acc + Math.abs(val - rgb2[i]), 0);
  const maxDiff = 255 * 3; 
  return Math.round(((maxDiff - diff) / maxDiff) * 100);
}

const submitButton = document.getElementById('submitButton');
const resultDisplay = document.getElementById('result');

submitButton.addEventListener('click', () => {
  const topColor = getComputedStyle(topRectangle).backgroundColor;
  const matchColor = getComputedStyle(matchRectangle).backgroundColor;

  const matchPercentage = calculateMatchPercentage(topColor, matchColor);
  resultDisplay.textContent = `Your Volume Is: ${matchPercentage}%`;
});
