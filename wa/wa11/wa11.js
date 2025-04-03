const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

const pictures = [];
for (let i = 1; i < 6; i++) {
    let name = "pic" + i + ".jpg";
    pictures.push(name);
}

const altText = [
    "JD Vance as Pepto Bismol",
    "JD Vance as a bug",
    "JD Vance as a thirst trap",
    "JD Vance as Little Debbie",
    "Just Dance Vance!"
];

for (let i = 0; i < pictures.length; i++) {
    const newImage = document.createElement('img');
    newImage.setAttribute('src', pictures[i]);
    newImage.setAttribute('alt', altText[i]);
    thumbBar.appendChild(newImage);

    newImage.addEventListener('click', event => {
        displayedImage.src = event.target.src;
        displayedImage.alt = event.target.alt;

        updateOverlayDimensions();
    });
}

btn.addEventListener('click', () => {
    const brightness = btn.getAttribute('class');
    if (brightness === 'dark') {
        btn.setAttribute('class', 'light');
        btn.textContent = 'Lighten';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)'; 
    } else {
        btn.setAttribute('class', 'dark');
        btn.textContent = 'Darken';
        overlay.style.backgroundColor = 'rgba(0,0,0,0)'; 
    }

    updateOverlayDimensions();
});

function updateOverlayDimensions() {
    overlay.style.width = `${displayedImage.clientWidth}px`;
    overlay.style.height = `${displayedImage.clientHeight}px`;
    overlay.style.position = 'absolute';
}