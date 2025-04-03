const c = document.querySelector('#c');
const ctx = c.getContext('2d');

const dpr = Math.min(2, window.devicePixelRatio);

c.width = window.innerWidth * dpr;
c.height = window.innerHeight * dpr;

c.style.imageRendering = 'pixelated';
c.style.width = '100vw';
c.style.height = '100vh';

function angle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  return Math.atan2(dy, dx); // range (-PI, PI]
}


const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

const grid = (v, a) => {
  return Math.floor((v - a / 2) / a) * a
}

const points = []

const createPoint = (x, y) => {
  return {
    x,
    y,
    px: x,
    py: y,
    magnitude: 150 + Math.random() * 150
  }
}

for (let y = 0; y < c.height; y+=50) {
  for (let x = 0; x < c.width; x+=50) {
    points.push(createPoint(x, y))
  }
}


const palettes = [
  [
    // "#444444",
    // "#f8f3f3",
    // "#943131",
    // "#f8eed3",
    // "#48BFE3",
    // "#cfc8a1",
    // "#5390D9",
    // "#5E60CE",
    // "#6930C3",
    // "#7400B8"
  ],
  [
//     "#c39595",
//     "#575374",
//     "#693b0a",
//     "#77693e",
//     "#cabfa0"
  ],
  [
    // "#f72585",
    // "#b5179e",
    // "#3f37c9",
    // "#4361ee",
    // "#4895ef",
    // "#4cc9f0"
  ],
  [
    // "#444444",
    // "#f8f3f3",
    // "#943131",
    // "#f8eed3",
    // "#48BFE3",
    // "#cfc8a1",
    // "#c39595",
    // "#575374",
    // "#693b0a",
    // "#77693e",
    // "#cabfa0"
    " #eef2f5",
    " #e4ebf1",
    " #dee8ef",
    " #d6e4ed",
    " #d0e2ed",
    " #f6f6f6",
    " #cccccc",
    " #ababab",
    " #909090",
    " #747474",
    " #d1dff6",
    " #cccccc",
    " #c2d6f6",
    " #b2cbf2",
    " #a0bff0",
    " #92b6f0",
    " #81a5ba",
    " #396b89",
    " #323456",
    " #202547",
  ],
  [
    // "#390099",
    // "#9e0059",
    // "#ff0054",
    // "#ff5400",
    // "#ffbd00"
  ]
];

let palette = palettes[3]

ctx.fillStyle = 'black'
ctx.fillRect(0, 0, c.width, c.height)

let prevTime = 0

const animate = (time) => {
  requestAnimationFrame(animate);
  
  const delta = time - prevTime
  
  ctx.globalCompositeOperation = 'source-over'
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
  ctx.fillRect(0, 0, c.width, c.height)
  
  const cell = 500 + Math.sin(time / 1000) * 300
  
  const getKey = (x, y) => `${grid(x, cell)},${grid(y, cell)}`
  
  const spatial = {}
  points.forEach((point, index) => {
    const key = getKey(point.x, point.y)
    
    if (!spatial[key]) {
      spatial[key] = [point]
    } else {
      spatial[key].push(point)
    }
  })
  
  points.forEach((point, index) => {
    ctx.strokeStyle = palette[index % palette.length]
    // ctx.fillRect(point.x, point.y, 10, 10)
    
    const key = getKey(point.x, point.y)
    let minDist = point.magnitude
    let nearest = spatial[key][0]
    
    spatial[key].forEach(a => {
      const d = distance(a.x, a.y, point.x, point.y)
      
      if (d > minDist) {
        minDist = d
        nearest = a
      }
    })
    
    const speed = (point.magnitude / 200) * delta
    
    // ctx.globalCompositeOperation = 'screen'
    
    if (nearest) {
      const radians = angle(point.x, point.y, nearest.x, nearest.y) + Math.random() * 2
      
      point.px = point.x
      point.x += Math.cos(radians) * speed
      point.py = point.y
      point.y += Math.sin(radians) * speed
      
    } else {
      const radians = index + time / 100
      
      point.px = point.x
      point.x += Math.cos(radians) * speed
      point.py = point.y
      point.y += Math.sin(radians) * speed
      
      point.magnitude = Math.min(100, point.magnitude + delta / 16)
    }
    
    if (point.x > c.width || point.x < 0) {
      point.px = point.x = c.width * Math.random()
      point.py = point.y = 0
    }
    if (point.y > c.height || point.y < 0) {
      point.px = point.x = c.width * Math.random()
      point.py = point.y = 0
    }
    
    ctx.beginPath()
    ctx.lineWidth = index % 5
    ctx.moveTo(point.px, point.py)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    
    // ctx.fillStyle = 'white'
    // ctx.fillRect(point.x, point.y, 10, 10)
  })
  
  prevTime = time
}

window.addEventListener('resize', () => {
  c.width = window.innerWidth * dpr;
  c.height = window.innerHeight * dpr;
  
  
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, c.width, c.height)
})

animate(0);