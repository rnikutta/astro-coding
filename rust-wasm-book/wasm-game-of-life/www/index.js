import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const pre = document.getElementById("game-of-life-canvas");
const universe = Universe.new();
const width = universe.width();
const height = universe.height();
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

var maxFps = 20.0;
var lastTimestamp = 0.0;

const ctx = canvas.getContext('2d');

const fps = new class {
  constructor() {
    this.fps = document.getElementById("fps");
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }
  render() {
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = 1 / delta * 1000;

    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i ++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;

    this.fps.textContent = `
Frames per Second:
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}
`.trim();
  }
}

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }
  ctx.stroke();
}

const getIndex = (row, col) => {
  return row * width + col;
}

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
  ctx.beginPath();
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      ctx.fillStyle = cells[idx] == Cell.DEAD
        ? DEAD_COLOR
        : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }
  ctx.stroke();
}

let animationId = null;
const playPauseButton = document.getElementById("play-pause");
const stepButton = document.getElementById("step");
const fpsInput = document.getElementById("fps-field")
fpsInput.value = maxFps;

const isPaused = () => {
  return animationId === null;
};

const play = () => {
  playPauseButton.textContent = "Pause";
  animationId = requestAnimationFrame(renderLoop);
}

const pause = () => {
  playPauseButton.textContent = "Play";
  cancelAnimationFrame(animationId);
  animationId = null;
}

fpsInput.addEventListener('input', (e) => {
  maxFps = e.target.value;
})



playPauseButton.addEventListener("click", event => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

stepButton.addEventListener("click", event => {
  if (isPaused()) {
    step();
  }
});

canvas.addEventListener("click", event => {
  const boundingRect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;
  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;
  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);
  universe.toggle_cell(row, col);
  drawGrid();
  drawCells();
});


const step = () => {
  fps.render();
  universe.tick();
  drawGrid();
  drawCells();
  animationId = null;
}

const renderLoop = (timestamp) => {
  if ((timestamp - lastTimestamp) >= (1000.0 / maxFps)) {
    lastTimestamp = timestamp;
    fps.render();
    universe.tick();
    drawGrid();
    drawCells();
  }
  animationId = requestAnimationFrame(renderLoop);
};
play();
