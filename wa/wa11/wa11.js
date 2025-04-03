const imageFiles = ['jdv1.jpg', 'jdv2.jpg', 'jdv3.jpg', 'jdv4.jpg', 'jdv5.jpg'];
const altText = {
  'jdv1.jpg': 'JD Vance as Pepto Bismol',
  'jdv2.jpg': 'JD Vance as a Bug',
  'jdv3.jpg': 'JD Vance as a thirst trap',
  'jdv4.jpg': 'JD Vance as Little Debbie',
  'jdv5.jpg': 'Just Dance Vance'
};

const thumbBar = document.querySelector('.thumb-bar');
const displayedImg = document.querySelector('.displayed-img');
const overlay = document.querySelector('.overlay');
const btn = document.querySelector('button');

// Loop through images and add thumbnails
imageFiles.forEach((file) => {
  const newImage = document.createElement('img');
  newImage.setAttribute('src', `images/${file}`);
  newImage.setAttribute('alt', altText[file]);
  thumbBar.appendChild(newImage);

  newImage.addEventListener('click', () => {
    displayedImg.setAttribute('src', `images/${file}`);
    displayedImg.setAttribute('alt', altText[file]);
  });
});

// Darken/Lighten button functionality
btn.addEventListener('click', () => {
  if (btn.classList.contains('dark')) {
    btn.classList.remove('dark');
    btn.classList.add('light');
    btn.textContent = 'Lighten';
    overlay.style.backgroundColor = 'rgb(0 0 0 / 50%)';
  } else {
    btn.classList.remove('light');
    btn.classList.add('dark');
    btn.textContent = 'Darken';
    overlay.style.backgroundColor = 'rgb(0 0 0 / 0%)';
  }
});
