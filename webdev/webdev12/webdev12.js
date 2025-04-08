// The original code which works great for layers at the top of the page 👌
// Source: https://alistairshepherd.uk/writing/parallax-svg-landscape-1/

// const scrollEl = document.documentElement;
// const root = document.documentElement;

// let scrollPos;

// function animation(){
//   if (scrollPos !== scrollEl.scrollTop) {
//     scrollPos = scrollEl.scrollTop;
//     root.style.setProperty('--scrollPos', scrollPos + 'px');
//   }
//   window.requestAnimationFrame(animation);
// }
// window.requestAnimationFrame(animation);

// However the effect started to break depending on where the frame/layers were positioned.
// Due to this I've attempted to re-write the function so it can work no matter its location on the page.

// Only designed to work with one frame at the moment.
const root = document.documentElement;
const frame = document.querySelector(".frame");
let scrollPos = null;

function parallaxFrame() {
  // Get position of frame
  const frameRect = frame.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Only calculate while the frame is visible
  if (frameRect.bottom <= 0 || frameRect.top >= viewportHeight) {
    window.requestAnimationFrame(parallaxFrame);
    return;
  }

  // Calculate how much of the frame is in view (0 to 1)
  let progress = (viewportHeight - frameRect.top) / (viewportHeight + frameRect.height);
  progress = Math.max(0, Math.min(1, progress)); // Keep between 0-1

  // Only update if value has changes enough, to prevent ALL the calls.
  if (Math.abs(progress - scrollPos) > 0.01) {
    // console.log(progress);
    root.style.setProperty("--scrollPos", progress);
    scrollPos = progress;
  }

  // Continue anim loop
  window.requestAnimationFrame(parallaxFrame);
}

// Initial Start
window.requestAnimationFrame(parallaxFrame);
