// Select elements
const thumbBar = document.querySelector('.thumb-bar');
const displayedImg = document.querySelector('.displayed-img');
const overlay = document.querySelector('.overlay');
const darkenButton = document.querySelector('.dark');

// Array of image filenames
const images = [
  'jdv1.jpg',
  'jdv2.jpg',
  'jdv3.jpg',
  'jdv4.jpg',
  'jdv5.jpg'
];

// Add thumbnails to the thumb-bar
images.forEach((imageSrc, index) => {
  const newImage = document.createElement('img');
  newImage.setAttribute('src', imageSrc);
  newImage.setAttribute('alt', `Thumbnail ${index + 1}`);
  thumbBar.appendChild(newImage);

  // Add click event to change the displayed image
  newImage.addEventListener('click', () => {
    displayedImg.setAttribute('src', imageSrc);
    displayedImg.setAttribute('alt', `Displayed image ${index + 1}`);
  });
});

// Toggle darken/lighten mode
darkenButton.addEventListener('click', () => {
  if (darkenButton.textContent === 'Darken') {
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    darkenButton.textContent = 'Lighten';
  } else {
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    darkenButton.textContent = 'Darken';
  }
});