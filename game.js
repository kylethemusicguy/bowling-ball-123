const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const scoreText = document.getElementById('score');

let score = 0;
let isBowling = false;
let ballX = 100;
let ballY = 350;
let ballSpeedX = 0;
let ballSpeedY = 0;
let power = 5;
let angle = 0;

const pins = [];
for (let i = 0; i < 10; i++) {
  pins.push({ x: 650 + (i % 4) * 30, y: 350 - Math.floor(i / 4) * 30 });
}

const ballRadius = 10;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    angle -= 5; // aim left
  } else if (e.key === 'ArrowRight') {
    angle += 5; // aim right
  } else if (e.key === ' ' && !isBowling) {
    isBowling = true;
    ballSpeedX = Math.cos(angle * Math.PI / 180) * power;
    ballSpeedY = Math.sin(angle * Math.PI / 180) * power;
    power = 5; // reset power
  }
});

function update() {
  if (isBowling) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0 || ballX > canvas.width || ballY < 0 || ballY > canvas.height) {
      resetBall();
    }

    // Collision with pins
    pins.forEach((pin, index) => {
      const dist = Math.hypot(ballX - pin.x, ballY - pin.y);
      if (dist < ballRadius + 10) {
        pins.splice(index, 1); // pin is knocked over
        score += 10;
      }
    });

    if (pins.length === 0) {
      setTimeout(() => {
        alert('You knocked all the pins down!');
        resetBall();
      }, 500);
    }
  }

  draw();
  requestAnimationFrame(update);
}

function resetBall() {
  ballX = 100;
  ballY = 350;
  ballSpeedX = 0;
  ballSpeedY = 0;
  isBowling = false;
  power = 5;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();

  // Draw pins
  pins.forEach(pin => {
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
  });

  // Draw aiming line
  const lineLength = 100; // adjust for how far you want the line to go
  const endX = ballX + Math.cos(angle * Math.PI / 180) * lineLength;
  const endY = ballY + Math.sin(angle * Math.PI / 180) * lineLength;

  ctx.beginPath();
  ctx.moveTo(ballX, ballY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  // Update score
  scoreText.innerText = score;
}

update();
