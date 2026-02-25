const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let gravitySide = 1; // 1 = bottom, -1 = top
let y = canvas.height / 2;
let radius = 12;
let speed = 4;
let score = 0;
let highScore = localStorage.getItem("neonHigh") || 0;
let obstacles = [];
let gameOver = false;
let nearMiss = false;

document.addEventListener("pointerdown", () => {
  if (gameOver) resetGame();
  gravitySide *= -1;
});

function spawnObstacle() {
  let size = 40;
  obstacles.push({
    x: canvas.width,
    width: size,
    gap: 120,
    offset: Math.random() * 200
  });
}

function resetGame() {
  obstacles = [];
  score = 0;
  speed = 4;
  gameOver = false;
}

function update() {
  if (gameOver) return;

  y += gravitySide * 6;

  if (y < radius || y > canvas.height - radius) {
    endGame();
  }

  if (Math.random() < 0.02) spawnObstacle();

  obstacles.forEach(o => {
    o.x -= speed;

    if (o.x < -o.width) {
      score++;
      speed += 0.1;
    }

    // collision
    if (
      o.x < 80 &&
      o.x + o.width > 40 &&
      (y < o.offset || y > o.offset + o.gap)
    ) {
      endGame();
    }

    // near miss
    if (
      o.x < 60 &&
      o.x + o.width > 40 &&
      (y > o.offset - 10 && y < o.offset + o.gap + 10)
    ) {
      nearMiss = true;
    }
  });
}

function endGame() {
  gameOver = true;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("neonHigh", highScore);
  }
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // theme shift every 20 points
  let hue = Math.floor(score / 20) * 60;
  ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
  ctx.fillStyle = ctx.strokeStyle;

  // player
  ctx.beginPath();
  ctx.arc(60, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // obstacles
  obstacles.forEach(o => {
    ctx.fillRect(o.x, 0, o.width, o.offset);
    ctx.fillRect(o.x, o.offset + o.gap, o.width, canvas.height);
  });

  // score
  ctx.fillText("Score: " + score, 20, 40);
  ctx.fillText("High: " + highScore, 20, 70);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
