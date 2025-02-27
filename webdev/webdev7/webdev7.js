"use strict";
/*
Inspired by Sophia (fractal kitty)](https://codepen.io/fractalkitty)'s pen Spark Studio Coding night(https://codepen.io/fractalkitty/pen/ZYEWNmL)
*/
const LWIDTH = 2; // better if integer
const FRQ = 3;

let canv, ctx; // canvas and context
let maxx, maxy; // canvas dimensions

// for animation

let columns;

// shortcuts for Math.
const mrandom = Math.random;
const mfloor = Math.floor;
const mround = Math.round;
const mceil = Math.ceil;
const mabs = Math.abs;
const mmin = Math.min;
const mmax = Math.max;

const mPI = Math.PI;
const mPIS2 = Math.PI / 2;
const mPIS3 = Math.PI / 3;
const m2PI = Math.PI * 2;
const m2PIS3 = (Math.PI * 2) / 3;
const msin = Math.sin;
const mcos = Math.cos;
const matan2 = Math.atan2;

const mhypot = Math.hypot;
const msqrt = Math.sqrt;

const rac3 = msqrt(3);
const rac3s2 = rac3 / 2;

//------------------------------------------------------------------------

function alea(mini, maxi) {
  // random number in given range

  if (typeof maxi == "undefined") return mini * mrandom(); // range 0..mini

  return mini + mrandom() * (maxi - mini); // range mini..maxi
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function intAlea(mini, maxi) {
  // random integer in given range (mini..maxi - 1 or 0..mini - 1)
  //
  if (typeof maxi == "undefined") return mfloor(mini * mrandom()); // range 0..mini - 1
  return mini + mfloor(mrandom() * (maxi - mini)); // range mini .. maxi - 1
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function Noise1DOneShot(period, min = 0, max = 1, random) {
  /* returns a 1D single-shot noise generator.
               the (optional) random function must return a value between 0 and 1
              the returned function has no parameter, and will return a new number every time it is called.
              If the random function provides reproductible values (and is not used elsewhere), this
              one will return reproducible values too.
              period should be > 1. The bigger period is, the smoother output noise is
            */
  random = random || Math.random;
  let currx = random(); // start with random offset
  let y0 = min + (max - min) * random(); // 'previous' value
  let y1 = min + (max - min) * random(); // 'next' value
  let dx = 1 / period;
  const dx0 = 0.667 * dx;
  const dx1 = 1.333 * dx;
  dx = dx0 + (dx1 - dx0) * random();
  return function () {
    currx += dx;
    if (currx > 1) {
      currx -= 1;
      y0 = y1;
      y1 = min + (max - min) * random();
      dx = dx0 + (dx1 - dx0) * random(); // change "period" every ... period
    }
    let z = (3 - 2 * currx) * currx * currx;
    return z * y1 + (1 - z) * y0;
  };
} // Noise1DOneShot

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function Noise1DOneShotHarm(period, min = 0, max = 1, ampl, random) {
  /* returns the sum of 2 Noise1D, one of given period and the other of period half
               The harmonic has an amplitude ampl (< 1) times the main signal
               the sum is scaled to fit between min and max
            */

  random = random || Math.random;
  let ampx = 1 / (1 + ampl);
  let rnd1 = Noise1DOneShot(period, ampx * min, ampx * max, random);
  ampx = ampl / (1 + ampl);
  let rnd2 = Noise1DOneShot(period / 2, ampx * min, ampx * max, random);
  return function () {
    return rnd1() + rnd2();
  };
} // Noise1DOneShotHarm

//------------------------------------------------------------------------

class Column {
  constructor(x0, width, period, color) {
    this.x0 = x0; // axis;
    this.color = color;
    this.f0 = Noise1DOneShotHarm(
      period,
      x0 - 0.65 * width,
      x0 + 0.35 * width,
      0.25
    );
    this.f1 = Noise1DOneShotHarm(
      period,
      x0 - 0.35 * width,
      x0 + 0.65 * width,
      0.25
    );
    this.segments = [];
    for (let k = 0; k < mceil(maxy / LWIDTH / 3); ++k) {
      this.segments.push({ x0: this.f0(), x1: this.f1() });
    }
  } // constructor

  draw(offs) {
    offs *= LWIDTH;
    ctx.lineWidth = LWIDTH;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    this.segments.forEach((seg, ky) => {
      ctx.moveTo(seg.x0, offs);
      ctx.lineTo(seg.x1, offs);
      offs += 3 * LWIDTH;
    });
    ctx.stroke();
  } // draw
} // class Column
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function startOver() {
  // canvas dimensions

  maxx = window.innerWidth;
  maxy = window.innerHeight;

  canv.width = maxx;
  canv.height = maxy;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  let delta = alea(0.01, 0.1);
  let bg = intAlea(2);
  ctx.fillStyle = getRandomColor();
  ctx.fillRect(0, 0, maxx, maxy);
  let width = mmin(maxx, maxy);
  let colors = [getRandomColor(), getRandomColor(), getRandomColor()];

  columns = [
    new Column(
      maxx / 2 - delta * width,
      0.5 * width,
      maxy / FRQ / LWIDTH / 3,
      colors.splice(intAlea(colors.length), 1)[0]
    ),
    new Column(
      maxx / 2,
      0.5 * width,
      maxy / FRQ / LWIDTH / 3,
      colors.splice(intAlea(colors.length), 1)[0]
    ),
    new Column(
      maxx / 2 + delta * width,
      0.5 * width,
      maxy / FRQ / LWIDTH / 3,
      colors[0]
    )
  ];

  columns.forEach((col, k) => col.draw(k));

  return true;
} // startOver

//------------------------------------------------------------------------
//------------------------------------------------------------------------
// beginning of execution

{
  canv = document.createElement("canvas");
  canv.style.position = "absolute";
  document.body.appendChild(canv);
  ctx = canv.getContext("2d");
  /*    canv.setAttribute ('title','click me'); */
} // CANVAS creation
canv.addEventListener("click", startOver);
startOver();
