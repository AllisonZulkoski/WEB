document.addEventListener('DOMContentLoaded', () => {
    function getRandomColor() {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        return randomColor;
    }

    document.body.style.backgroundColor = getRandomColor();
});

function getLyrics() {
    const artist = document.getElementById('artist').value.trim();
    const title = document.getElementById('title').value.trim();
    const lyricsEl = document.getElementById('lyrics');
    const spinner = document.getElementById('spinner');
  
    if (!artist || !title) {
      alert('Please enter both artist and song title.');
      return;
    }
  
    spinner.style.display = 'block';
    lyricsEl.textContent = '';
  
    fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Lyrics not found');
        }
        return response.json();
      })
      .then(data => {
        lyricsEl.textContent = data.lyrics;
      })
      .catch(error => {
        lyricsEl.textContent = 'Lyrics not found.';
        console.error(error);
      })
      .finally(() => {
        spinner.style.display = 'none';
      });
}
