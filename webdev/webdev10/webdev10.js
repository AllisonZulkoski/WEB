////////////////////////////////////////////////////////////////////////////////
console.clear();

let canvas, canvasCtx, animationFrameId, points;
let canvasSize = [0, 0], scale = 1;
let state;

requestAnimationFrame(main);

////////////////////////////////////////////////////////////////////////////////
function main(){
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    document.body.style.margin = '0';
    canvas.style.display = 'block';

    canvasCtx = canvas.getContext('2d');

    checkResizeAndInit();
    reset();
    
    canvas.addEventListener('mousemove', (e) => {
        state.pointer.pos[0] = e.offsetX;
        state.pointer.pos[1] = e.offsetY;
    });
    
    canvas.addEventListener('click', reset);
    
    window.addEventListener('resize', reset);

    animationFrameId = requestAnimationFrame(mainLoop);

    function mainLoop(){
        try{
            animationFrameId = requestAnimationFrame(mainLoop);
            tick();
        }catch(err){
                cancelAnimationFrame(animationFrameId);
                throw err;
        }
    }
}

function reset(){
    state = {
        time: 0,
        timeDelta: 1 / 60,
        pointer: {pos: [0, 0]},
    };
    
    const n = 30;
    points = [];
    for(let i = (state.time) % 0.99; i < n; ++i){
        const a = {
            rnds: [],
        };
        points.push(a);
        for(let j = 0; j < 3; ++j) a.rnds[j] = Math.random();
        //canvasCtx.lineTo(x * r, y * r);
    }
}

function tick(){
    checkResizeAndInit();
    canvasCtx.fillStyle = `rgba(0, 0, 0, ${1})`;
    canvasCtx.fillRect(0, 0, canvasSize[0], canvasSize[1]);

    canvasCtx.save();
    
    doIt();
    
    canvasCtx.restore();

    state.time += state.timeDelta;

}

function checkResizeAndInit(){
    if(
        window.innerWidth === canvasSize[0] &&
        window.innerHeight === canvasSize[1]
    ) return;
    canvasSize[0] = canvas.width = window.innerWidth;
    canvasSize[1] = canvas.height = window.innerHeight;
}

function doIt(){
    const {timeDelta} = state;
    
    const r = Math.min(canvasSize[0], canvasSize[1]) / 2 * 0.8;
    canvasCtx.translate(
        Math.floor(canvasSize[0] / 2),
        Math.floor(canvasSize[1] / 2),
    );
    const n = points.length;
    
    const offset = state.time;
    for(let i = 0; i < n; ++i){
        const p = (i + (offset % 1)) / n;
        const x = Math.cos(Math.PI * 2 * p);
        //const y = Math.sin(Math.PI * 2 * p) * Math.cos(Math.PI * 2 * p);
        const y = Math.sin(Math.PI * 2 * p) * -Math.abs(Math.cos(Math.PI * 2 * p));
        const a = points[mod(Math.floor(i - offset), n)];
        a.x = x * r;
        a.y = y * r;
        //canvasCtx.lineTo(x * r, y * r);
    }
    
    canvasCtx.beginPath();
    for(let i = 0; i < n; ++i){
        const a = points[i];
        const b = points[(i + 1) % n];
        const c = points[(i + 2) % n];
        
        const x1 = b.x - a.x;	
        const y1 = b.y - a.y;
        const d1 = Math.hypot(x1, y1);
        const x2 = c.x - b.x;	
        const y2 = c.y - b.y;
        const d2 = Math.hypot(x2, y2);
        
        const px1 = -y1;
        const py1 = x1;
        const px2 = -y2;
        const py2 = x2;
        const px = (px1 + px2) * 0.5;
        const py = (py1 + py2) * 0.5;
        const d = Math.hypot(px, py) * (0.5 + 0.5 * b.rnds[0]);
        
        canvasCtx.moveTo(a.x, a.y);
        canvasCtx.lineTo(b.x, b.y);
        
        //canvasCtx.moveTo(b.x, b.y);
        //canvasCtx.lineTo(b.x + px, b.y + py);
        
        b.px = px;
        b.py = py;
        b.d = d;
    }
    
    canvasCtx.strokeStyle = `#800080`; // Changed to purple
    canvasCtx.stroke();
    
    for(const a of points){
        drawFlower(
            a.x,
            a.y,
            Math.atan2(a.py, a.px),
            a.d,
            a.rnds[1],
            a.rnds[2],
        );
    }
    
    //cancelAnimationFrame(animationFrameId);
}

function drawFlower(x, y, angle, d, rnd1, rnd2){
    canvasCtx.save();
    canvasCtx.translate(x, y);
    canvasCtx.rotate(angle);
    
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, 0);
    canvasCtx.lineTo(d, 0);
    canvasCtx.strokeStyle = `#800080`; // Changed to purple
    canvasCtx.stroke();
    
    canvasCtx.beginPath();
    // canvasCtx.moveTo(
    // 	d * 0.75, d * 0,
    // );
    // canvasCtx.quadraticCurveTo(
    // 	d * 0.5, d * 0.125,
    // 	d * 0.9, d * 0.25,
    // );
    const d1 = d * (rnd1 - 0.5) * 0.5;
    const d2 = d * (rnd2 - 0.5) * 0.5;
    canvasCtx.ellipse(
        d1 + d * 0.75, d * 0.128,
        d * 0.125,
        d * 0.0625,
        Math.PI * 2 * 0.125,
        0, Math.PI * 2,
    );
    canvasCtx.ellipse(
        d2 + d * 0.75, -d * 0.128,
        d * 0.125,
        d * 0.0625,
        Math.PI * 2 * -0.125,
        0, Math.PI * 2,
    );
    canvasCtx.fillStyle = `#800080`; // Changed to purple
    canvasCtx.fill();
    
    canvasCtx.beginPath();
    const r = d / 8;
    canvasCtx.arc(d + r, 0, r, 0, Math.PI * 2);
    canvasCtx.strokeStyle = `#ff0000`;
    canvasCtx.stroke();
    
    canvasCtx.restore();
}

export function mod(a, b) {
  return ((a % b) + b) % b;
}


function rotateByVector(out, a, v, origin, s){
    const rx = v[0];
    const ry = v[1];
    const x = a[0] - origin[0];
    const y = a[1] - origin[1];
    out[0] = origin[0] + (x * rx - y * ry) * s;
    out[1] = origin[1] + (y * rx + x * ry) * s;
    return out;
}