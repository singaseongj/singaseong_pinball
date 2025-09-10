const API_URL = 'https://script.google.com/macros/s/' +
  'AKfycbz5pBJY9qeYThLk1GGDAXAibEey9_hazpRi3PbaY3MuU0h2_1tr8OfSrzTa5IUJMj0/exec';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const highscoreBtn = document.getElementById('highscoreBtn');
const closeScoreBtn = document.getElementById('closeScore');
const scoreboardDiv = document.getElementById('scoreboard');
const menuDiv = document.getElementById('menu');
const gameArea = document.getElementById('gameArea');
const scoreSpan = document.getElementById('score');

let gameInterval;
let score = 0;
let ball;
const bumper = { x: canvas.width / 2, y: 200, r: 20 };
const keyState = { z: false, '/': false };

function resetBall() {
  ball = { x: canvas.width / 2, y: canvas.height - 50, vx: 0, vy: -8, r: 8 };
}

function startGame() {
  score = 0;
  scoreSpan.textContent = score;
  resetBall();
  menuDiv.classList.add('hidden');
  gameArea.classList.remove('hidden');
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(update, 16);
}

function endGame() {
  clearInterval(gameInterval);
  gameArea.classList.add('hidden');
  menuDiv.classList.remove('hidden');
  const name = prompt(`Game over! Your score: ${score}\nEnter your name:`);
  if (name) {
    saveScore(name, score);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // bumper
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(bumper.x, bumper.y, bumper.r, 0, Math.PI * 2);
  ctx.fill();
  // ball
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
  // flippers
  ctx.fillStyle = keyState['z'] ? '#f00' : '#800';
  drawFlipper(80, canvas.height - 40, true, keyState['z']);
  ctx.fillStyle = keyState['/'] ? '#0f0' : '#080';
  drawFlipper(canvas.width - 80, canvas.height - 40, false, keyState['/']);
}

function drawFlipper(x, y, left, active) {
  ctx.save();
  ctx.translate(x, y);
  const angle = active ? (left ? -0.8 : 0.8) : (left ? 0.2 : -0.2);
  ctx.rotate(angle);
  ctx.fillRect(left ? -60 : 0, -10, 60, 10);
  ctx.restore();
}

function update() {
  // physics
  ball.vy += 0.3; // gravity
  ball.x += ball.vx;
  ball.y += ball.vy;
  // wall collisions
  if (ball.x - ball.r < 0) {
    ball.x = ball.r;
    ball.vx *= -1;
  }
  if (ball.x + ball.r > canvas.width) {
    ball.x = canvas.width - ball.r;
    ball.vx *= -1;
  }
  if (ball.y - ball.r < 0) {
    ball.y = ball.r;
    ball.vy *= -1;
    score++;
    scoreSpan.textContent = score;
  }
  // bumper collision
  const dx = ball.x - bumper.x;
  const dy = ball.y - bumper.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < ball.r + bumper.r) {
    const angle = Math.atan2(dy, dx);
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    ball.vx = Math.cos(angle) * speed;
    ball.vy = Math.sin(angle) * speed;
    score += 10;
    scoreSpan.textContent = score;
  }
  // flipper interactions
  if (keyState['z'] && ball.y + ball.r > canvas.height - 60 && ball.x < canvas.width / 2) {
    ball.vy = -10;
    ball.vx -= 2;
    score++;
    scoreSpan.textContent = score;
  }
  if (keyState['/'] && ball.y + ball.r > canvas.height - 60 && ball.x > canvas.width / 2) {
    ball.vy = -10;
    ball.vx += 2;
    score++;
    scoreSpan.textContent = score;
  }
  // game over
  if (ball.y - ball.r > canvas.height) {
    endGame();
  }
  draw();
}

async function saveScore(name, score) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score })
    });
  } catch (err) {
    console.error(err);
  }
}

async function fetchHighscores() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const list = document.getElementById('scores');
    list.innerHTML = '';
    data.scores.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.name}: ${s.score}`;
      list.appendChild(li);
    });
    scoreboardDiv.classList.remove('hidden');
  } catch (err) {
    console.error(err);
  }
}

startBtn.addEventListener('click', startGame);
highscoreBtn.addEventListener('click', fetchHighscores);
closeScoreBtn.addEventListener('click', () => scoreboardDiv.classList.add('hidden'));

document.addEventListener('keydown', e => {
  if (e.key === 'z' || e.key === '/') {
    keyState[e.key] = true;
    e.preventDefault();
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'z' || e.key === '/') {
    keyState[e.key] = false;
  }
});
