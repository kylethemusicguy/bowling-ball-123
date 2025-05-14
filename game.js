const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let score = 0;
let isBowling = false;
let ballX = 100;
let ballY = 100;
let ballSpeedX = 0;
let ballSpeedY = 0;
let power = 5;
let angle = 0;

const ballRadius = 10;

let pins = [
  { x: 650, y: 100 }, // row 1
  { x: 620, y: 130 }, { x: 680, y: 130 }, // row 2
  { x: 590, y: 160 }, { x: 650, y: 160 }, { x: 710, y: 160 }, // row 3
  { x: 560, y: 190 }, { x: 620, y: 190 }, { x: 680, y: 190 }, { x: 740, y: 190 } // row 4
];

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    angle -= 5;
  } else if (e.key === 'ArrowRight') {
    angle += 5;
  } else if (e.key === ' ' && !isBowling) {
    isBowling = true;
    updateBallVelocity();
  } else if (e.key === 'r') {
    resetGame();
  } else if (e.key === 'k') {
    resetBall();
  }
});

function updateBallVelocity() {
  let radians = angle * Math.PI / 180;
  ballSpeedX = Math.cos(radians) * power;
  ballSpeedY = Math.sin(radians) * power;
}

function update() {
  if (isBowling) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // bounce off left/right
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
      angle = 180 - angle;
      updateBallVelocity();
    }

    // bounce off top/bottom
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
      angle = -angle;
      updateBallVelocity();
    }

    // pin collisions
    pins.forEach((pin, index) => {
      const dist = Math.hypot(ballX - pin.x, ballY - pin.y);
      if (dist < ballRadius + 10) {
        pins.splice(index, 1);
        score += 10;
      }
    });

    if (pins.length === 0) {
      setTimeout(() => {
        alert('you knocked all the pins down!');
        resetBall();
      }, 500);
    }
  }

  draw();
  requestAnimationFrame(update);
}

function resetBall() {
  ballX = 100;
  ballY = 100;
  ballSpeedX = 0;
  ballSpeedY = 0;
  isBowling = false;
  power = 5;
}

function resetGame() {
  score = 0;
  pins = [
    { x: 650, y: 100 },
    { x: 620, y: 130 }, { x: 680, y: 130 },
    { x: 590, y: 160 }, { x: 650, y: 160 }, { x: 710, y: 160 },
    { x: 560, y: 190 }, { x: 620, y: 190 }, { x: 680, y: 190 }, { x: 740, y: 190 }
  ];
  resetBall();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();

  // pins
  pins.forEach(pin => {
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
  });

  // aim line
  const endX = ballX + Math.cos(angle * Math.PI / 180) * 100;
  const endY = ballY + Math.sin(angle * Math.PI / 180) * 100;

  ctx.beginPath();
  ctx.moveTo(ballX, ballY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  // score
  scoreDisplay.innerText = score;
}

update();
